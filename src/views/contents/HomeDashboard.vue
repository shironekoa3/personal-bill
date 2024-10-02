<script setup>
import { reactive, onMounted } from 'vue'
import ChartBillCategoryPie from '@/views/contents/charts/ChartBillCategoryPie.vue'
import ChartBillDependitureLine from '@/views/contents/charts/ChartBillDependitureLine.vue';
import dayjs from 'dayjs'
import { list as listCategory } from '@/api/category'
import { list as listBill } from '@/api/bill'
import { useCategoryStore } from '@/store/category.js'
import { useDashboardStore } from '@/store/dashboard.js'


const categoryStore = useCategoryStore()
const dashboardStore = useDashboardStore()


async function updateChartPie() {
  let categoryMap = new Map()

  let categories = await categoryStore.getCategories()
  categories.forEach(i => {
    categoryMap.set(i.id, i.name)
  })

  let pieMap = new Map()
  dashboardStore.state.rawBillList.forEach(i => {
    if (i.type === 0) {
      let categoryName = categoryMap.get(i.categoryId)
      if (!pieMap.has(categoryName)) {
        pieMap.set(categoryName, 0)
      }
      pieMap.set(categoryName, (Number(pieMap.get(categoryName)) + i.amount).toFixed(2))
    }
  })

  let keys = Array.from(pieMap.keys())
  let values = Array.from(pieMap.values())
  let objs = []
  for (let i = 0; i < keys.length; i++) {
    objs.push({ name: keys[i], value: values[i] })
  }
  let allAmount = 0
  values.forEach(i => { allAmount = parseFloat(allAmount) + parseFloat(i) })
  dashboardStore.state.pieData = [
    dayjs(dashboardStore.state.rangeStart).format('YYYY年MM月'), allAmount.toFixed(2)
    , keys, objs]
}
function updateChartLine() {
  dashboardStore.state.lineData = [
    dashboardStore.state.billList.map(i => i.date).reverse(),
    dashboardStore.state.billList.map(i => i.expenditure).reverse()
  ]
}
function formatBill(data) {
  let tempMap = new Map();
  let result = []
  data.forEach(item => {
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
  return result
}
async function changeDate() {
  let dateRange = [
    dayjs(dashboardStore.state.rangeStart).format('YYYY-MM-DD HH:mm:ss'),
    dayjs(dashboardStore.state.rangeStart).add(1, 'month').add(-1, 'second').format('YYYY-MM-DD HH:mm:ss')
  ]
  await listBill(dateRange).then(resp => {
    if (resp.code !== 200) {
      ElMessage.error(resp.msg)
    } else {
      // 结构转换
      let result = formatBill(resp.data)
      dashboardStore.state.rawBillList = resp.data
      dashboardStore.state.billList = result
    }
  })
  updateChartPie()
  updateChartLine()
}

function getRecent12Months() {
  const today = new Date();
  const recent12Months = [];

  for (let i = 0; i < 12; i++) {
    let year = today.getFullYear();
    let month = today.getMonth() - i;

    if (month < 0) {
      year--;
      month += 12;
    }

    let firstDayOfMonth = new Date(year, month, 1);
    recent12Months.push(dayjs(firstDayOfMonth).format('YYYY-MM'));
  }
  return recent12Months;
}

if (dashboardStore.state.recent12Months.length === 0) {
  dashboardStore.state.recent12Months = getRecent12Months();
  dashboardStore.state.rangeStart = dashboardStore.state.recent12Months[0]
}

onMounted(() => {
  if (dashboardStore.state.firstLoad) {
    changeDate()
    dashboardStore.state.firstLoad = false;
  }
})
</script>

<template>
  <div class="container">
    <div class="head">
      <p>首页<span>HomePage</span></p>
    </div>
    <div class="body">
      <div class="opt">
        选择月份:
        <el-select v-model="dashboardStore.state.rangeStart" placeholder="选择月份" @change="changeDate">
          <el-option v-for="item in getRecent12Months()" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <div v-if="dashboardStore.state.rawBillList.length === 0" class="empty"><el-empty description="这个月没有账单" /></div>
      <div v-else class="charts">
        <div class="chart chart-1">
          <ChartBillDependitureLine :data="dashboardStore.state.lineData" />
        </div>
        <div class="chart chart-2">
          <ChartBillCategoryPie :data="dashboardStore.state.pieData" />
        </div>
      </div>
    </div>
  </div>
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

.body {
  width: calc(100vw - 20px - 240px - 10px - 20px);
  margin-left: 10px;
  height: calc(100% - 200px - 80px);
  /* background-color: #f00; */
  /* display: flex; */
  /* flex-direction: column; */
}

.opt {
  height: 80px;
  margin-left: 10px;
}

.charts {
  display: flex;
  flex: 1;
  height: 500px;
}

.chart {
  width: 50%;
  height: 100%;
}
</style>
