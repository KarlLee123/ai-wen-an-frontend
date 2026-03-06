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
          <el-option label="默认（自然亲切）" value="默认（自然亲切）" />
          <el-option label="温柔治愈风" value="温柔治愈风" />
          <el-option label="毒舌搞笑风" value="毒舌搞笑风" />
          <el-option label="专业干货风" value="专业干货风" />
          <el-option label="日式冷幽默风" value="日式冷幽默风" />
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
const selectedStyle = ref('默认（自然亲切）')
const result = ref('')
const loading = ref(false)
const errorMsg = ref('')
const remaining = ref(3)  // 假设从后端取，这里先硬编码

const generateWenAn = async () => {
  if (!theme.value.trim()) {
    errorMsg.value = '请输入主题内容！'
    return
  }

  loading.value = true
  errorMsg.value = ''
  result.value = ''

  try {
    console.log('[DEBUG] 按钮点击 → 开始请求腾讯云后端')
    console.log('[DEBUG] 当前主题:', theme.value)
    console.log('[DEBUG] 选择的风格:', selectedStyle.value)

    // 本地开发：用 /api/chat 走 vite proxy → 转发到腾讯云
    const response = await axios.post('http://175.24.207.152:8080/chat', {
  message: theme.value.trim(),
  style: selectedStyle.value,
  mode: 'wenan'
});
      // 如果后端实际字段是 message / content / mode，改成：
      // message: theme.value.trim(),
      // mode: selectedStyle.value
    })

    console.log('[DEBUG] 后端返回完整数据:', response.data)

    // 解析返回（按你后端实际字段改）
    result.value = response.data.content ||
                   response.data.text ||
                   response.data.reply ||
                   response.data.message ||
                   JSON.stringify(response.data, null, 2)

  } catch (error) {
    console.error('[ERROR] 请求失败详情:', error)
    let msg = '生成失败：'
    if (error.message) msg += error.message
    if (error.code) msg += ` (code: ${error.code})`
    if (error.response) msg += ` (状态码: ${error.response.status})`
    errorMsg.value = msg
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container { max-width: 800px; margin: 40px auto; padding: 20px; font-family: Arial, sans-serif; }
.input-area { margin-bottom: 30px; }
.style-select { margin: 20px 0; display: flex; align-items: center; gap: 10px; }
.remaining { margin-top: 10px; color: #666; font-size: 14px; }
.result { margin-top: 30px; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #f9f9f9; }
.error { color: red; margin: 15px 0; }
pre { white-space: pre-wrap; word-break: break-all; }
</style>
