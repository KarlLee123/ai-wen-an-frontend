<template>
  <div class="wenan-page">
    <h1>AI 文案小助手</h1>
    <p class="tip">输入主题，一键生成适合小红书、朋友圈、抖音的爆款文案～ 免费试用 3 次</p>

    <el-input
      v-model="theme"
      placeholder="请输入主题或关键词（例如：卖咖啡、東京旅行、失恋安慰）"
    />

    <el-select v-model="style" placeholder="选择风格">
      <el-option label="默认（自然亲切）" value="自然亲切" />
      <el-option label="温柔治愈风" value="温柔治愈" />
      <el-option label="毒舌搞笑风" value="毒舌搞笑" />
      <el-option label="专业干货风" value="专业干货" />
      <el-option label="日式冷幽默风" value="日式冷幽默" />
    </el-select>

    <el-button
      type="primary"
      :loading="loading"
      :disabled="remaining <= 0"
      @click="generateWenAn"
    >
      {{ loading ? '正在生成文案...' : '一键生成' }}
    </el-button>

    <div class="status">
      <p v-if="remaining > 0" class="remaining">剩余免费次数：{{ remaining }} 次</p>
      <p v-else class="warning">
        免费次数已用完！付费解锁无限生成（9.9 元/月）
        <el-button type="danger" size="small" @click="toPay">立即付费</el-button>
      </p>
    </div>

    <div v-if="loading" class="loading">
      <el-spinner />
      <p>AI 正在创作，请稍等 5–10 秒...</p>
    </div>

    <div v-if="wenAnList.length > 0" class="result">
      <h3>生成的文案</h3>
      <div v-for="(item, index) in wenAnList" :key="index" class="card">
        <pre class="content">{{ item }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const theme = ref('')
const style = ref('自然亲切')
const wenAnList = ref([])
const loading = ref(false)
const remaining = ref(3)

const generateWenAn = async () => {
  if (remaining.value <= 0) {
    toPay()
    return
  }
  if (!theme.value.trim()) {
    ElMessage.warning('请输入主题或关键词哦～')
    return
  }

  loading.value = true
  wenAnList.value = []

  try {
    const res = await axios.post('https://qianwen-ai-production.up.railway.app/chat', {
      message: theme.value,
      mode: 'wenan',
      style: style.value
    })

    const reply = res.data.reply || ''
    wenAnList.value = reply.split('\n\n').filter(Boolean)
    remaining.value = res.data.remaining !== undefined ? res.data.remaining : remaining.value - 1
  } catch (err) {
    console.error('生成错误：', err)
    ElMessage.error('生成失败：' + (err.response?.data?.message || err.message || '网络异常'))
  } finally {
    loading.value = false
  }
}

const toPay = () => {
  ElMessage.info('支付功能开发中... 实际接入微信支付，金额 9.9 元/月')
}
</script>

<style scoped>
.wenan-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}

h1 {
  text-align: center;
  color: #303133;
}

.tip {
  text-align: center;
  color: #909399;
  margin-bottom: 32px;
}

.status {
  text-align: center;
  margin: 24px 0;
}

.remaining {
  color: #67c23a;
  font-weight: bold;
}

.warning {
  color: #f56c6c;
}

.loading {
  text-align: center;
  margin: 40px 0;
  color: #409eff;
}

.result {
  margin-top: 40px;
}

.card {
  background: #f5f7fa;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 12px;
  border-left: 5px solid #409eff;
}

.content {
  white-space: pre-wrap;
  margin: 0;
  line-height: 1.8;
}
</style>
