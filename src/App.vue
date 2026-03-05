<template>
  <div class="home-page">
    <h1>AI 文案小助手</h1>
    <p>输入主题，一键生成文案。免费试用 3 次</p>

    <el-input
      v-model="theme"
      placeholder="输入主题或关键词（例如：卖咖啡、東京旅行）"
      style="margin-bottom: 16px; width: 100%; max-width: 600px"
    />

    <el-select
      v-model="style"
      placeholder="选择风格"
      style="width: 100%; max-width: 600px; margin-bottom: 16px"
    >
      <el-option label="默认（自然亲切）" value="自然亲切" />
      <el-option label="温柔治愈风" value="温柔治愈" />
      <el-option label="毒舌搞笑风" value="毒舌搞笑" />
      <el-option label="专业干货风" value="专业干货" />
    </el-select>

    <el-button
      type="primary"
      :loading="loading"
      :disabled="remaining <= 0"
      @click="generate"
      style="width: 100%; max-width: 600px; height: 52px; font-size: 18px"
    >
      {{ loading ? '正在生成...' : '一键生成文案' }}
    </el-button>

    <div style="margin-top: 20px; text-align: center">
      <p v-if="remaining > 0" style="color: #67c23a">剩余免费次数：{{ remaining }} 次</p>
      <p v-else style="color: #f56c6c">免费次数已用完！后续可付费无限生成</p>
    </div>

    <div v-if="loading" style="text-align: center; margin: 30px 0">
      <el-spinner />
      <p>请稍等 5–10 秒...</p>
    </div>

    <div
      v-if="wenAnList.length > 0"
      style="margin-top: 40px; max-width: 800px; margin-left: auto; margin-right: auto"
    >
      <h3>生成的文案</h3>
      <div
        v-for="(item, index) in wenAnList"
        :key="index"
        style="background: #f5f7fa; padding: 20px; margin-bottom: 20px; border-radius: 12px"
      >
        <pre style="white-space: pre-wrap; margin: 0">{{ item }}</pre>
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

const generate = async () => {
  if (remaining.value <= 0) {
    ElMessage.info('免费次数用完，后续可付费哦～')
    return
  }
  if (!theme.value.trim()) {
    ElMessage.warning('请输入主题或关键词')
    return
  }

  loading.value = true
  wenAnList.value = []

  try {
    const res = await axios.post('/chat', {
      message: theme.value,
      mode: 'wenan',
      style: style.value,
    })

    const reply = res.data.reply || ''
    wenAnList.value = reply.split('\n\n').filter(Boolean)
    remaining.value = res.data.remaining ?? remaining.value - 1
  } catch (err) {
    ElMessage.error('生成失败：' + (err.response?.data?.error || err.message || '网络问题'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.home-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
}

h1 {
  color: #409eff;
  margin-bottom: 16px;
}

.tip {
  color: #606266;
  margin-bottom: 32px;
}
</style>
