<template>
  <div class="layout-container">
    <!-- 左侧导航栏 -->
    <Sidebar @menu-change="handleMenuChange" />

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <TopHeader />

      <!-- 页面标题 -->
      <div class="page-header">
        <h3>组合持仓明细</h3>
      </div>

      <!-- 内容插槽 -->
      <div class="content-wrapper">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/views/layout/Sidebar.vue'
import TopHeader from '@/views/layout/TopHeader.vue'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    TopHeader
  },
  methods: {
    handleMenuChange(item) {
      this.$emit('menu-change', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  overflow: hidden;
}

.page-header {
  padding: 10px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;

  h3 {
    font-family: 'Microsoft YaHei', Arial, sans-serif;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 0;
  }
}

.content-wrapper {
  flex: 1;
  padding: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
</style>

