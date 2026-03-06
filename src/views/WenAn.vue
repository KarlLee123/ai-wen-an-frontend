<template>
  <div class="container">
    <h1>AI 文案小助手</h1>

    <div class="input-area">
      <el-input
        v-model="theme"
        placeholder="请输入文案主题，例如：夏季防晒霜"
        type="textarea"
        :rows="4"
      />
      <div class="style-select">
        <span>风格：</span>
        <el-select v-model="selectedStyle" placeholder="选择风格">
          <el-option label="默认（自然亲切）" value="自然亲切" />
          <el-option label="温柔治愈" value="温柔治愈" />
          <el-option label="毒舌吐槽" value="毒舌吐槽" />
          <el-option label="专业干货" value="专业干货" />
          <el-option label="日式冷幽默" value="日式冷幽默" />
        </el-select>
      </div>
      <el-button
        type="primary"
        @click="generateWenAn"
        :loading="loading"
        :disabled="loading"
      >
        {{ loading ? '生成中...' : '一键生成' }}
      </el-button>
      <div class="remaining">剩余免费次数：{{ remaining }} 次</div>
    </div>

    <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
    <div v-if="result" class="result">
      <h3>生成结果：</h3>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const theme = ref('')
const selectedStyle = ref('自然亲切')
const result = ref('')
const loading = ref(false)
const errorMsg = ref('')
const remaining = ref(3)

// 生产环境使用 VITE_API_BASE_URL，本地开发使用 proxy
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

const generateWenAn = async () => {
  if (!theme.value.trim()) {
    errorMsg.value = '请输入主题内容！'
    return
  }

  loading.value = true
  errorMsg.value = ''
  result.value = ''

  try {
    const url = apiBaseUrl ? `${apiBaseUrl}/chat` : '/chat'
    console.log('请求地址：', url)

    const response = await axios.post(url, {
      message: theme.value.trim(),
      style: selectedStyle.value,
      mode: 'wenan'
    })

    console.log('后端返回：', response.data)

    if (response.data.error) {
      errorMsg.value = response.data.error
      remaining.value = response.data.remaining || 0
    } else {
      result.value = response.data.reply || '生成成功'
      remaining.value = response.data.remaining || 3
    }
  } catch (error) {
    console.error('请求失败：', error)
    let msg = '生成失败：'
    if (error.response) {
      msg += `状态 ${error.response.status}`
      if (error.response.data?.error) msg += ` - ${error.response.data.error}`
    } else {
      msg += error.message || '网络错误'
    }
    errorMsg.value = msg
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container { max-width: 800px; margin: 40px auto; padding: 20px; }
.input-area { margin-bottom: 30px; }
.style-select { margin: 20px 0; display: flex; align-items: center; gap: 10px; }
.remaining { margin-top: 10px; color: #666; }
.result { margin-top: 30px; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #f9f9f9; }
.error { color: red; margin: 15px 0; font-weight: bold; }
pre { white-space: pre-wrap; word-break: break-all; }
</style>
