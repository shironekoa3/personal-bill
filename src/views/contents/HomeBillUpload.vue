<script setup>
import { ref, reactive, inject } from 'vue'
import { getUploadURL, importByKey, cancelImportByKey } from '@/api/bill'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

let parentState = inject('state')

let state = reactive({
  isLoading: false,
  fileList: []
})
const uploadRef = ref(null)



const handleClose = (done) => {
  ElMessageBox.confirm(
    '确定取消上传吗？',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    done()
  }).catch(() => {

  })
}

const submitUpload = () => {
  if (state.fileList.length !== 1) {
    ElMessageBox.alert('请先选择文件！', '提示：', {
      type: 'info',
      confirmButtonText: '好的',
    })
  } else {
    uploadRef.value.submit()
  }
}

const uploadSuccess = (resp) => {
  if (resp.code !== 200) {
    ElMessageBox.alert(resp.msg, '错误！', {
      type: 'error',
      confirmButtonText: '我知道了',
      callback: () => {
        state.fileList = []
      }
    })
  } else {
    ElMessageBox.confirm(`成功解析 ${resp.data.length} 条账单<br/>是否导入？（取消会丢弃数据）`, '解析完成',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定导入',
        cancelButtonText: '取消导入',
        type: 'info',
      }
    ).then(() => {
      let param = `key=${resp.data.key}`
      importByKey(param).then(resp2 => {
        if (resp2.code === 200) {
          ElMessageBox.alert(resp2.msg, '成功！', {
            type: 'success',
            confirmButtonText: '好的',
            callback: () => { parentState.showUpload = false; }
          })
        }
        state.fileList = []
      })
    }).catch(() => {
      let param = `key=${resp.data.key}`
      cancelImportByKey(param).then(resp2 => {
        if (resp2.code !== 200) {
          ElMessage.error(resp2.msg)
        }
      })
      state.fileList = []
    })
  }
}

const uploadFaild = () => {
  ElMessageBox.alert('上传失败！', '错误！', {
    type: 'error',
    confirmButtonText: '我知道了',
  })
}
</script>

<template>
  <el-dialog v-model="parentState.showUpload" title="上传账单" width="550px" :before-close="handleClose">
    <el-upload class="upload-demo" v-model:file-list="state.fileList" drag :action="getUploadURL()"
      :on-success="uploadSuccess" :on-error="uploadFaild" accept=".xlsx, .xls, .csv" :limit="1" :auto-upload="false"
      ref="uploadRef">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖入文件或 <em>选择文件</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          只能上传 10MB 内的 xls/xlsx/csv 文件！
        </div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="parentState.showUpload = false">取消</el-button>
        <el-button type="primary" @click="submitUpload">
          解析
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
