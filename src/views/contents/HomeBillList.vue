<script setup>
import { reactive, onMounted, provide } from 'vue'
import { list, add, del } from '@/api/bill'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useBillStore } from '@/store/bill.js'
import { useCategoryStore } from '@/store/category.js'
import HomeBillUpload from './HomeBillUpload.vue'
import dayjs from 'dayjs'

const billStore = useBillStore()
const categoryStore = useCategoryStore()

let state = reactive({
  isLoading: false,
  dialogVisible: false,
  showUpload: false,
  summary: {
    allExpenditure: 0,
    allIncome: 0,
    allBillCount: 0
  },
  optionItem: {
    id: 0,
    type: 0,
    method: '微信',
    amount: 0.00,
    date: '2023-10-22 16:00:00',
    categoryId: 1,
    description: ''
  },
  // ----------------popover---------------
  showPopover: false,
  currentPopover: {
    id: 0,
    amount: 0,
    category: {
      id: 0,
      name: '正在加载...',
      description: '正在加载...',
      createTime: '',
      updateTime: '',
      idDeleted: false
    },
    categoryId: 1,
    date: '2023-01-01 00:00:00',
    description: '正在加载...',
    method: '微信',
    orderId: '"100004990123102300069315368435599223"',
    type: 0,
    createTime: '',
    updateTime: '',
    idDeleted: false
  }
})

provide('state', state)

const shortcuts = [
  {
    text: '本月',
    value: () => {
      let now = dayjs(new Date())
      let start = now.startOf('month').format('YYYY-MM-DD HH:mm:ss')
      let end = now.endOf('month').format('YYYY-MM-DD HH:mm:ss')
      return [start, end];
    },
  },
  {
    text: '上个月',
    value: () => {
      let now = dayjs(new Date()).subtract(1, 'month')
      let start = now.startOf('month').format('YYYY-MM-DD HH:mm:ss')
      let end = now.endOf('month').format('YYYY-MM-DD HH:mm:ss')
      return [start, end];
    },
  },
  {
    text: '上上个月',
    value: () => {
      let now = dayjs(new Date()).subtract(2, 'month')
      let start = now.startOf('month').format('YYYY-MM-DD HH:mm:ss')
      let end = now.endOf('month').format('YYYY-MM-DD HH:mm:ss')
      return [start, end];
    }
  },
  {
    text: '近7天',
    value: () => {
      let now = dayjs(new Date())
      let start = now.subtract(6, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
      let end = now.endOf('day').format('YYYY-MM-DD HH:mm:ss')
      return [start, end]
    },
  },
  {
    text: '近30天',
    value: () => {
      let now = dayjs(new Date())
      let start = now.subtract(29, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
      let end = now.endOf('day').format('YYYY-MM-DD HH:mm:ss')
      return [start, end]
    },
  },
  {
    text: '近90天',
    value: () => {
      let now = dayjs(new Date())
      let start = now.subtract(89, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
      let end = now.endOf('day').format('YYYY-MM-DD HH:mm:ss')
      return [start, end]
    },
  },
]

const handleFilterList = () => {
  state.showPopover = false
  billStore.state.tableFilterData = []
  let tempTableData = []
  // 过滤
  billStore.state.rawData.forEach(i => {
    let tempItem = Object.assign({}, i)
    tempItem.detail = tempItem.detail.filter(j => {
      if (billStore.state.filterText.trim() === '支出') {
        return j.type === 0
      } else if (billStore.state.filterText.trim() === '收入') {
        return j.type === 1
      }
      return (j.method.indexOf(billStore.state.filterText) != -1 ||
        j.category.name.indexOf(billStore.state.filterText) != -1 ||
        (j.amount + '').indexOf(billStore.state.filterText) != -1 ||
        j.description.indexOf(billStore.state.filterText) != -1);
    })
    tempItem.expenditure = 0
    tempItem.income = 0
    tempItem.detail.forEach(j => {
      if (j.type === 0) {
        tempItem.expenditure += j.amount
        tempItem.expenditure.toFixed(2)
      } else {
        tempItem.income += j.amount
      }
    })
    tempTableData.push(tempItem)
  })

  // 排序
  tempTableData = tempTableData.sort((a, b) => new Date(b.date) - new Date(a.date))
  tempTableData.forEach(i => {
    i.expenditure = i.expenditure.toFixed(2)
    i.income = i.income.toFixed(2)
    i.detail = i.detail.sort((a, b) => new Date(a.date) - new Date(b.date))
  })

  // 统计
  state.summary.allExpenditure = 0
  state.summary.allIncome = 0
  state.summary.allBillCount = 0
  tempTableData.forEach(i => {
    state.summary.allExpenditure += Number(i.expenditure)
    state.summary.allIncome += Number(i.income)
    state.summary.allBillCount += Number(i.detail.length)
  })

  billStore.state.tableFilterData = tempTableData
}

const handleRefreshList = () => {
  state.isLoading = true
  let param = [
    dayjs(billStore.state.searchDate[0]).format('YYYY-MM-DD HH:mm:ss'),
    dayjs(billStore.state.searchDate[1]).format('YYYY-MM-DD HH:mm:ss')
  ]

  list(param).then(resp => {
    if (resp.code !== 200) {
      ElMessage.error(resp.msg)
    } else {
      billStore.state.rawData = []
      // 结构转换
      let tempMap = new Map();
      let result = []
      resp.data.forEach(item => {
        let key = dayjs(item.date).format('YYYY-MM-DD');
        if (!tempMap.has(key)) {
          tempMap.set(key, result.length)
          result.push({
            date: key,
            expenditure: 0,
            income: 0,
            detail: []
          })
        }
        result[tempMap.get(key)].detail.push(item)
        if (item.type === 0) {
          result[tempMap.get(key)].expenditure += item.amount
        } else {
          result[tempMap.get(key)].income += item.amount
        }
      })

      // 排序
      result = result.sort((a, b) => new Date(b.date) - new Date(a.date))
      result.forEach(i => {
        i.expenditure = i.expenditure.toFixed(2)
        i.income = i.income.toFixed(2)
        i.detail = i.detail.sort((a, b) => new Date(a.date) - new Date(b.date))
      })
      billStore.state.rawData = result
      billStore.state.tableFilterData = result

      state.isLoading = false
    }
  })
}

const handleDeleteBill = (data) => {
  ElMessageBox.confirm('确定要删除吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    del(data.id).then(resp => {
      if (resp.code === 200) {
        ElMessage.success('操作成功！')
      } else {
        ElMessage.error(resp.msg)
      }
    })
  }).catch(() => {
    // 取消
  })

}

// 添加 & 修改
const handleAddOrChange = () => {
  // 修正金额
  state.optionItem.amount = parseFloat(state.optionItem.amount).toFixed(2);
  state.optionItem.date = dayjs(state.optionItem.date).format('YYYY-MM-DD HH:mm:ss');

  if (state.optionItem.method === '') {
    ElMessage.warning('请输入支付方式！')
  } else {
    // console.log(state.optionItem);
    add(state.optionItem).then(resp => {
      if (resp.code === 200) {
        ElMessage.success('操作成功！')
      } else {
        ElMessage.error(resp.msg)
      }
      state.dialogVisible = false
      handleRefreshList()
    }).catch(err => {
      console.log(err);
      ElMessage.error(err.msg)
      state.dialogVisible = false
      handleRefreshList()
    })
  }
}

const openAddOrChangeDialog = (item) => {
  state.optionItem = item
  if (!item) {
    state.optionItem = {
      id: 0,
      type: 0,
      method: '微信',
      amount: 0.00,
      date: new Date(),
      categoryId: 1,
      description: ''
    }
  }
  state.showPopover = false
  state.dialogVisible = true
  categoryStore.getCategories()
}

// 处理 Popover 坐标
function handleDocumentClick(event) {
  let target = null;
  if ((event.target?.id + '').indexOf('tag-') != -1) {
    target = event.target;
  } else if ((event.target.parentNode?.id + '').indexOf('tag-') != -1) {
    target = event.target.parentNode;
  }
  let domCtr = document.getElementById('popover-dock')
  if (target) {
    target.appendChild(domCtr)

    domCtr.style.left = domCtr.getClientRects().clientWidth / 2 + 'px'
    state.showPopover = false
    setTimeout(() => {
      state.showPopover = true
      setTimeout(() => {
        state.showPopover = null
      }, 1)
    }, 1)
  }
}
function handlePopoverBeforeAppear() {
  // let domCtr = document.getElementById('popover-dock')
  // console.log(domCtr.parentNode);
}
function handlePopoverDisappear() {
  let domCtr = document.getElementById('popover-dock')
  document.body.appendChild(domCtr)
}
onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
  billStore.state.filterText = ''
  handleRefreshList()
})
</script>

<template>
  <div class="container">
    <div class="head">
      <p>账单列表<span>Bill List</span></p>
    </div>
    <div class="body">
      <div class="opt">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="">
            <el-button type="primary" @click="openAddOrChangeDialog(null)">
              <el-icon class="el-icon--left">
                <Plus />
              </el-icon>
              录入账单
            </el-button>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker v-model="billStore.state.searchDate" type="daterange" unlink-panels range-separator="~"
              start-placeholder="开始日期" end-placeholder="结束日期" :shortcuts="shortcuts"
              style=" width: 260px; margin-right: 4px;" />
            <el-button type="primary" @click="handleRefreshList">
              <el-icon class="el-icon--left">
                <Search />
              </el-icon>
              查询账单
            </el-button>
          </el-form-item>
          <el-form-item label="">
            <el-button type="success" @click="state.showUpload = true">
              <el-icon class="el-icon--left">
                <Expand />
              </el-icon>
              导入账单
            </el-button>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="billStore.state.filterText" @keydown.enter.native="handleFilterList"
              placeholder="支付方式/分类/描述/金额" style="width: 200px;" />
            <span style="margin-left: 4px;"></span>
            <el-button type="primary" @click="handleFilterList">
              <el-icon class="el-icon--left">
                <Filter />
              </el-icon>
              筛选账单
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="data">
        <el-table :data="billStore.state.tableFilterData" v-loading="state.isLoading" height="100%" style="width: 100%"
          stripe>
          <el-table-column prop="date" label="日期" sortable width="120" />
          <el-table-column prop="expenditure" label="支出" sortable
            :sort-method="(a, b) => Number(a.expenditure) - Number(b.expenditure)" width="80" />
          <el-table-column prop="income" label="收入" sortable :sort-method="(a, b) => Number(a.income) - Number(b.income)"
            width="80" />
          <el-table-column prop="detail" label="详细">
            <template #default="scope">
              <div v-for="item in scope.row.detail" :key="item.id"
                style="user-select: none; float: left; margin-right: 5px; cursor: pointer; position: relative;">
                <el-tag v-if="item.categoryId !== 1" :type="item.type === 0 ? 'danger' : 'success'"
                  @click=" state.currentPopover = item" :id="`tag-${item.id}`" disable-transitions>
                  ¥{{ item.amount }}
                </el-tag>
                <el-tag v-else type="info" :type="item.type === 0 ? 'danger' : 'success'"
                  @click="state.currentPopover = item" :id="`tag-${item.id}`" disable-transitions>
                  ¥{{ item.amount }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="summary" v-if="billStore.state.rawData.length > 0">
          总支出：<span style="color: #f56c6c; margin-right: 20px;">{{ billStore.allExpenditure }}</span>
          总收入：<span style="color: #67c23a; margin-right: 20px;">{{ billStore.allIncome }}</span>
          订单数量：<span style="color: #409eff;">{{ billStore.allBillCount }}</span>
        </div>
      </div>
    </div>
  </div>

  <HomeBillUpload :showUpload="state.showUpload" />

  <!-- 添加/修改对话框 -->
  <el-dialog v-model="state.dialogVisible" :title="state.optionItem.id === 0 ? '录入账单' : '更新账单'" width="500"
    style="padding: 0 20px;">
    <el-form label-position="right" label-width="auto" style="max-width: 460px;">
      <el-form-item label="账单类型：">
        <el-radio-group v-model="state.optionItem.type">
          <el-radio-button :label="0">支出</el-radio-button>
          <el-radio-button :label="1">收入</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="支付方式：">
        <el-radio-group v-model="state.optionItem.method">
          <el-radio-button label="支付宝" />
          <el-radio-button label="微信" />
          <el-radio-button label="现金" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="账单金额：">
        <el-input v-model="state.optionItem.amount" type="text" placeholder="输入账单金额"
          @input="(v) => (state.optionItem.amount = v.replace(/[^\d.]/g, ''))" />
      </el-form-item>
      <el-form-item label="账单时间：">
        <el-date-picker v-model="state.optionItem.date" type="datetime" placeholder="选择日期时间" />
      </el-form-item>
      <el-form-item label="账单分类：">
        <el-select v-model="state.optionItem.categoryId" placeholder="选择账单分类">
          <el-option v-for="item in categoryStore.state.categories" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="账单描述：">
        <el-input v-model="state.optionItem.description" type="textarea" placeholder="输入账单描述" rows="5" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="large" @click="state.dialogVisible = false">取消</el-button>
        <el-button type="primary" size="large" @click="handleAddOrChange">
          {{ state.optionItem.id === 0 ? '录入' : '更新' }}
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- Popover -->
  <el-popover placement="top" class="popover" :visible="state.showPopover" :width="340" trigger="click"
    @before-enter="handlePopoverBeforeAppear" @after-leave="handlePopoverDisappear" :hide-after="0">
    <template #reference>
      <div id="popover-dock"></div>
    </template>
    <template #default>
      <div class="bill-item">
        账单金额:
        <span v-if="state.currentPopover.type === 0" style="color: red;">支出 ¥{{ state.currentPopover.amount
        }}</span>
        <span v-else style="color: green;">收入 ¥{{ state.currentPopover.amount }}</span>
        <div class="bill-opt">
          <el-button type="primary" link @click="openAddOrChangeDialog(state.currentPopover)">编辑</el-button>
          <el-button type="danger" link @click="handleDeleteBill(state.currentPopover)">删除</el-button>
        </div>
      </div>
      <div class="bill-item">
        账单时间: <span>{{ state.currentPopover.date }}</span>
      </div>
      <div class="bill-item">
        账单分类: <span>{{ state.currentPopover.category.name }}</span>
      </div>
      <div class="bill-item">
        账单备注: <span>{{ state.currentPopover.description }}</span>
      </div>
    </template>
  </el-popover>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.head {
  width: 100%;
  user-select: none;
}

.head p {
  font-size: 42px;
  font-weight: 100;
  margin: 15px;
  margin-bottom: 30px;
}

.head p span {
  font-size: 36px;
  font-weight: 100;
  text-transform: uppercase;
  margin-left: 20px;
}

.opt {
  padding-left: 14px;
}

.upload {
  display: inline-block;
  margin-left: 6px;
  transform: translateY(2px);
}

/* table */
.data {
  width: calc(100vw - 20px - 240px - 10px - 20px);
  height: calc(100vh - 40px - 180px - 30px);
  margin-left: 10px;
}

.data .summary {
  padding-top: 10px;
  text-indent: 10px;
}

/* popover */
#popover-dock {
  position: absolute;
  top: 0;
}

.popover {
  position: relative;
}

.bill-item {
  margin: 10px;
}

.bill-opt {
  position: absolute;
  right: 20px;
  top: 20px;
}

@media screen and (max-width: 1333px) {
  .data {
    height: calc(100vh - 40px - 180px - 30px - 50px);
  }
}
</style>
