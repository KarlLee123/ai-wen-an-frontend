<template>
<<<<<<< HEAD
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
=======
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
        <el-button type="text" @click="copyText(item)" style="margin-top: 8px;">
          <el-icon><CopyDocument /></el-icon> 一键复制
        </el-button>
      </div>
>>>>>>> cb38d372b71530beaab1fb4fd1ab990c93a9120a
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
<<<<<<< HEAD

const theme = ref('')
const selectedStyle = ref('自然亲切')
const result = ref('')
const loading = ref(false)
const errorMsg = ref('')
const remaining = ref(3)  // 初始值，实际可从后端获取

const generateWenAn = async () => {
  if (!theme.value.trim()) {
    errorMsg.value = '请输入主题内容！'
=======
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
>>>>>>> cb38d372b71530beaab1fb4fd1ab990c93a9120a
    return
  }

  loading.value = true
<<<<<<< HEAD
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
=======
  wenAnList.value = []

  try {
    const res = await axios.post('http://175.24.207.152:8080/chat', {
      message: theme.value,
      mode: 'wenan',
      style: style.value
    }, {
      timeout: 60000  // 超时60秒，防唤醒慢
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
      errorMsg = '网络连接失败，请检查网络或后端服务是否在线';
    } else {
      errorMsg = err.message || '请求发送失败';
    }
    ElMessage.error(errorMsg)
>>>>>>> cb38d372b71530beaab1fb4fd1ab990c93a9120a
  } finally {
    loading.value = false
  }
}
<<<<<<< HEAD
</script>

<style scoped>
.container { max-width: 800px; margin: 40px auto; padding: 20px; }
.input-area { margin-bottom: 30px; }
.style-select { margin: 20px 0; display: flex; align-items: center; gap: 10px; }
.remaining { margin-top: 10px; color: #666; font-size: 14px; }
.result { margin-top: 30px; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #f9f9f9; }
.error { color: red; margin: 15px 0; font-weight: bold; }
pre { white-space: pre-wrap; word-break: break-all; background: #f8f8f8; padding: 15px; border-radius: 4px; }
=======

const copyText = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

const toPay = () => {
  ElMessage.info('支付功能开发中... 实际接入微信支付，金额 9.9 元/月')
}
</script>

<style scoped>
.wenan-page {
  max-width: 900px;
  margin: 60px auto;
  padding: 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
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
>>>>>>> cb38d372b71530beaab1fb4fd1ab990c93a9120a
</style>
