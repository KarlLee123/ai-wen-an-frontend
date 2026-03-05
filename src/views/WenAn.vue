<template>
  <div class="wenan-page">
    <div class="header">
      <h1>AI 文案小助手</h1>
      <p>一键生成小红书、朋友圈、抖音爆款文案 · 免费试用 3 次</p>
    </div>

    <div class="form-glass">
      <el-input
        v-model="theme"
        placeholder="输入主题或关键词（例如：卖咖啡、東京旅行、失恋安慰）"
        class="input-main"
      />

      <el-select v-model="style" placeholder="选择文案风格" class="input-style">
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
        class="btn-generate"
      >
        <el-icon v-if="!loading" class="btn-icon"><Edit /></el-icon>
        {{ loading ? '生成中...' : '一键生成文案' }}
      </el-button>

      <div class="status">
        <span v-if="remaining > 0" class="remaining">
          <el-icon><Clock /></el-icon> 剩余免费次数：{{ remaining }} 次
        </span>
        <span v-else class="no-remaining">
          <el-icon><Warning /></el-icon> 免费次数已用完！
          <el-button type="danger" size="small" @click="toPay" class="pay-btn">
            立即付费解锁无限
          </el-button>
        </span>
      </div>
    </div>

    <div v-if="loading" class="loading-area">
      <el-progress type="circle" :percentage="loadingProgress" :width="120" status="success" />
      <p>AI 正在创作文案，请稍等...</p>
    </div>

    <div v-if="wenAnList.length > 0" class="result-area">
      <h3>生成的文案</h3>
      <div v-for="(item, index) in wenAnList" :key="index" class="wenan-card">
        <div class="card-header">
          <span class="card-title">文案 {{ index + 1 }}</span>
          <el-button type="text" @click="copyText(item)" class="copy-btn">
            <el-icon><CopyDocument /></el-icon> 复制
          </el-button>
        </div>
        <pre class="wenan-content">{{ item }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { Edit, Clock, Warning, CopyDocument } from '@element-plus/icons-vue'

const theme = ref('')
const style = ref('自然亲切')
const wenAnList = ref([])
const loading = ref(false)
const remaining = ref(3)
const loadingProgress = ref(0)

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
  loadingProgress.value = 0

  const interval = setInterval(() => {
    loadingProgress.value += 10
    if (loadingProgress.value >= 90) clearInterval(interval)
  }, 500)

  try {
    const res = await axios.post('/chat', {
      message: theme.value,
      mode: 'wenan',
      style: style.value,
    })

    const reply = res.data.reply || ''
    wenAnList.value = reply.split('\n\n').filter(Boolean)
    remaining.value = res.data.remaining !== undefined ? res.data.remaining : remaining.value - 1
  } catch (err) {
    ElMessage.error('生成失败：' + (err.response?.data?.error || err.message || '网络异常'))
  } finally {
    loading.value = false
    loadingProgress.value = 100
    setTimeout(() => (loadingProgress.value = 0), 500)
    clearInterval(interval)
  }
}

const copyText = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      ElMessage.success('已复制到剪贴板')
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制')
    })
}

const toPay = () => {
  ElMessage.info('支付功能开发中... 实际接入微信支付，金额 9.9 元/月')
}
</script>

<style scoped>
.wenan-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  background-attachment: fixed;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.wenan-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.header {
  text-align: center;
  margin-bottom: 48px;
}

h1 {
  font-size: 3rem;
  color: #1e40af;
  margin-bottom: 12px;
  font-weight: 800;
  letter-spacing: 1px;
}

.tip {
  color: #64748b;
  font-size: 1.18rem;
  max-width: 600px;
  margin: 0 auto;
}

.form-glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 720px;
  margin: 0 auto;
}

.input-main,
.input-style {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper) {
  border-radius: 14px;
  height: 56px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.3);
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover),
:deep(.el-select .el-input__wrapper:hover) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.btn-generate {
  height: 60px;
  font-size: 1.25rem;
  border-radius: 14px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border: none;
  transition: all 0.3s;
  animation: breathe 2s infinite;
}

.btn-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.3);
}

@keyframes breathe {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(59, 130, 246, 0);
  }
}

.status {
  text-align: center;
  margin: 30px 0;
  font-size: 1.1rem;
}

.remaining {
  color: #16a34a;
  font-weight: 600;
}

.no-remaining {
  color: #dc2626;
  font-weight: 600;
}

.pay-btn {
  margin-left: 12px;
}

.loading-area {
  text-align: center;
  margin: 80px 0;
  color: #3b82f6;
}

.result-area {
  margin-top: 60px;
}

.wenan-card {
  background: white;
  padding: 28px;
  margin-bottom: 28px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  border-left: 8px solid #3b82f6;
  transition: all 0.3s;
  position: relative;
}

.wenan-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  font-size: 1.2rem;
  color: #1e293b;
  font-weight: 600;
}

.copy-btn {
  color: #3b82f6;
}

.wenan-content {
  white-space: pre-wrap;
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.9;
  color: #1e293b;
}

/* 手机端适配 */
@media (max-width: 768px) {
  .wenan-page {
    padding: 20px 16px;
  }
  .form-glass {
    padding: 32px 24px;
  }
  h1 {
    font-size: 2.2rem;
  }
}
</style>
