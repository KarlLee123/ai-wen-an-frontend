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
const remaining = ref(3)  // 初始值，实际可从后端获取

const generateWenAn = async () => {
  if (!theme.value.trim()) {
    errorMsg.value = '请输入主题内容！'
    return
  }

  loading.value = true
  errorMsg.value = ''
  result.value = ''

  try {
    console.log('[第三步直连测试] 开始发送请求到后端')
    console.log('[请求地址]：http://175.24.207.152:8080/chat')
    console.log('[请求参数]：', {
      message: theme.value.trim(),
      style: selectedStyle.value,
      mode: 'wenan'
    })

    const response = await axios.post('http://175.24.207.152:8080/chat', {
      message: theme.value.trim(),
      style: selectedStyle.value,
      mode: 'wenan'  // 固定用 wenan 模式生成小红书式文案
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('[直连成功] 后端返回完整数据：', response.data)

    if (response.data.error) {
      errorMsg.value = response.data.error
      remaining.value = response.data.remaining || 0
    } else {
      result.value = response.data.reply || '生成成功，但无回复内容'
      remaining.value = response.data.remaining || 3
    }

  } catch (error) {
    console.error('[直连失败] 详细错误：', error)

    let msg = '生成失败：'
    if (error.response) {
      const status = error.response.status
      msg += `状态码 ${status}`
      if (error.response.data && error.response.data.error) {
        msg += ` - ${error.response.data.error}`
      }
      if (status === 405) msg += ' (方法不允许，可能 OPTIONS 预检失败)'
      if (status === 404) msg += ' (路径不存在)'
      if (status === 403) msg += ' (权限或防火墙拒绝)'
      console.log('[后端响应体]：', error.response.data)
    } else {
      msg += error.message || '网络错误/超时/CORS 问题'
      if (error.message.includes('CORS')) msg += ' (跨域被浏览器拒绝)'
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
.remaining { margin-top: 10px; color: #666; font-size: 14px; }
.result { margin-top: 30px; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #f9f9f9; }
.error { color: red; margin: 15px 0; font-weight: bold; }
pre { white-space: pre-wrap; word-break: break-all; background: #f8f8f8; padding: 15px; border-radius: 4px; }
</style>
