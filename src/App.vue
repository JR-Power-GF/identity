<script setup lang="ts">
/**
 * 根组件
 * 包含全局布局：顶部导航 + 主内容区
 */
import { RouterView, RouterLink } from 'vue-router'

/** 应用标题，来自环境变量 */
const appTitle = import.meta.env.VITE_APP_TITLE || 'AI Identify Tool'
</script>

<template>
  <div class="app-wrapper">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <nav class="nav-inner page-container flex-between">
        <h1 class="app-title">{{ appTitle }}</h1>
        <div class="nav-links">
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/about">关于</RouterLink>
        </div>
      </nav>
    </header>

    <!-- 主内容区 -->
    <main class="app-main page-container">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  height: var(--header-height);
  background-color: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
}

.nav-links {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-links a {
  color: var(--color-text-regular);
  font-size: var(--font-size-base);
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--color-primary);
}

.app-main {
  flex: 1;
  padding-top: var(--spacing-lg);
}
</style>
