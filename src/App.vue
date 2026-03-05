<template>
  <div class="wenan-container">
    <h1>AI 文案小助手</h1>
    <p class="tip">输入主题，一键生成适合小红书、朋友圈、抖音的爆款文案～ 免费试用 3 次</p>

    <el-input
      v-model="theme"
      placeholder="请输入主题或关键词（例如：卖咖啡、東京旅行、失恋安慰）"
    />

    <el-select v-model="style" placeholder="选择文案风格">
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
    }, {
      timeout: 90000  // 超时90秒，防唤醒慢
    })

    const reply = res.data.reply || ''
    wenAnList.value = reply.split('\n\n').filter(Boolean)
    remaining.value = res.data.remaining !== undefined ? res.data.remaining : remaining.value - 1
  } catch (err) {
    console.error('生成错误详情：', err)
    let errorMsg = '生成失败，请稍后再试';
    if (err.code === 'ECONNABORTED') {
      errorMsg = '请求超时，后端可能刚启动，请再试一次（唤醒需30–60秒）';
    } else if (err.response) {
      errorMsg = err.response.data?.message || err.response.statusText || '后端返回错误 ' + err.response.status;
    } else if (err.request) {
      errorMsg = '网络连接失败，后端服务可能休眠或网络问题，请再试一次';
    } else {
      errorMsg = err.message || '请求发送失败';
    }
    ElMessage.error(errorMsg)
  } finally {
    loading.value = false
  }
}

const toPay = () => {
  ElMessage.info('支付功能开发中... 实际接入微信支付，金额 9.9 元/月')
}
</script>

<style scoped>
.wenan-container {
  max-width: 900px;
  margin: 60px auto;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

h1 {
  text-align: center;
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 16px;
  font-weight: bold;
}

.tip {
  text-align: center;
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-bottom: 40px;
}

.status {
  text-align: center;
  margin: 30px 0;
  font-size: 1.1rem;
}

.remaining {
  color: #67c23a;
  font-weight: bold;
}

.warning {
  color: #e74c3c;
  font-weight: bold;
}

.loading {
  text-align: center;
  margin: 50px 0;
  color: #409eff;
  font-size: 1.1rem;
}

.result {
  margin-top: 50px;
}

.card {
  background: white;
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.05);
  border-left: 6px solid #409eff;
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-4px);
}

.content {
  white-space: pre-wrap;
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.9;
  color: #2c3e50;
}
</style>
