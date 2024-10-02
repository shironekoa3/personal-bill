<script setup>

const srcList = [
  '/imgs/tutorial-wechat.png',
  '/imgs/tutorial-alipay.png'
]
</script>

<template>
  <div class="container">
    <div class="head">
      <p>账单导出教程<span>Export Tutorial</span></p>
    </div>
    <div class="body">
      <h2>微信</h2>
      <div>
        <p>1. 点击钱包</p>
        <p>2. 点击账单</p>
        <p>3. 等账单加载完毕，会出现 "常见问题" 按钮</p>
        <p>4. 点击下载账单</p>
        <p>5. 选择时间即可提交申请，账单发送到邮箱，<span style="color: red;">解压密码会通过微信消息接收</span>。</p>
        <el-image style="width: 60%; margin-left: 10px;" alt="微信导出教程" title="微信导出教程" src="/imgs/tutorial-wechat.png"
          :zoom-rate="1.2" :max-scale="4" :min-scale="0.2" :preview-src-list="srcList" :initial-index="0" fit="cover"
          hide-on-click-modal />
      </div>
      <h2>支付宝</h2>
      <div>
        <p>1. 点击账单</p>
        <p>2. 点击右上角三个点，选择下方 "开具交易流水证明"</p>
        <p>3. 用于个人对账</p>
        <p>4. <span style="color: red;">解压密码为身份证后六位</span>。</p>
        <el-image style="width: 60%; margin-left: 10px;" alt="支付宝导出教程" title="支付宝导出教程" src="/imgs/tutorial-alipay.png"
          :zoom-rate="1.2" :max-scale="4" :min-scale="0.2" :preview-src-list="srcList" :initial-index="1" fit="cover"
          hide-on-click-modal />
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
  margin-bottom: 0px;
}

.head p span {
  font-size: 36px;
  font-weight: 100;
  text-transform: uppercase;
  margin-left: 20px;
}

.body {
  width: calc(100vw - 20px - 240px - 10px - 20px);
  height: calc(100vh - 40px - 105px);
  margin-left: 10px;
  overflow-x: hidden;
}

.body h2 {
  font-weight: 400;
  margin-left: 10px;
}

.body p {
  font-weight: 400;
  margin-left: 10px;
  line-height: 1;
}
</style>