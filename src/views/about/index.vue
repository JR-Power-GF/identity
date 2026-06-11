<script setup lang="ts">
/**
 * 关于页面
 */
</script>

<template>
  <div class="about-page">
    <h2>关于项目</h2>
    <p class="desc">基于 Vue3 + Vite + TypeScript 搭建的前端工具项目框架。</p>
    <ul class="tech-list">
      <li>Vue 3 — 组合式 API + &lt;script setup&gt;</li>
      <li>Vite — 极速开发与构建</li>
      <li>TypeScript — 类型安全</li>
      <li>Vue Router — 路由管理</li>
      <li>Pinia — 状态管理</li>
      <li>Axios — HTTP 请求封装</li>
    </ul>
  </div>
</template>

<style scoped>
.about-page {
  padding: var(--spacing-xl) 0;
}

.about-page h2 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
}

.desc {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.tech-list {
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
  line-height: 2;
  color: var(--color-text-regular);
}
</style>
