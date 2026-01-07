<template>
  <div class="layout-container">
    <!-- 左侧导航栏 -->
    <Sidebar :class="{ 'is-collapse': slideFold }" />

    <!-- 主内容区域 -->
    <div class="main-content" :class="{ 'sidebar-collapse': slideFold }">
      <!-- 顶部导航栏 -->
      <TopHeader />

      <!-- Tab标签页 -->
      <div class="tabs-container">
        <el-tabs
          v-model="activeTabName"
          type="card"
          closable
          @tab-click="handleTabClick"
          @tab-remove="handleTabRemove"
        >
          <el-tab-pane
            v-for="tab in openedTabs"
            :key="tab.name"
            :label="tab.label"
            :name="tab.name"
          />
        </el-tabs>
      </div>

      <!-- 内容 -->
      <div class="content-wrapper">
        <!-- 路由内容 -->
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Sidebar from '@/views/layout/Sidebar.vue'
import TopHeader from '@/views/layout/TopHeader.vue'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    TopHeader
  },
  computed: {
    ...mapGetters(['slideFold', 'activeTab', 'openedTabs']),
    activeTabName: {
      get() {
        return this.activeTab
      },
      set(val) {
        this.switchTab(val)
      }
    }
  },
  watch: {
    activeTab(newTab) {
      // 当激活的tab改变时，跳转到对应路由
      const tab = this.openedTabs.find(t => t.name === newTab)
      if (tab && this.$route.path !== tab.path) {
        this.$router.push(tab.path)
      }
    }
  },
  methods: {
    ...mapActions(['switchTab', 'closeTab']),
    /**
     * 处理tab点击
     */
    handleTabClick(tab) {
      const targetTab = this.openedTabs.find(t => t.name === tab.name)
      if (targetTab) {
        this.$router.push(targetTab.path)
      }
    },
    /**
     * 处理tab关闭
     */
    handleTabRemove(tabName) {
      // 不允许关闭最后一个tab
      if (this.openedTabs.length <= 1) {
        this.$message.warning('至少保留一个标签页')
        return
      }
      this.closeTab(tabName)
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
  background-color: #f0f2f5;
  overflow: hidden;
  margin-left: 200px; // 默认左侧菜单宽度
  transition: margin-left 0.3s ease;

  &.sidebar-collapse {
    margin-left: 64px; // 收起后的宽度
  }
}

.tabs-container {
  background-color: #fff;
  padding: 0 10px;
  border-bottom: 1px solid #e8eaec;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  /deep/ .el-tabs {
    .el-tabs__header {
      margin: 0;
      border-bottom: none;

      .el-tabs__nav {
        border: none;
      }

      .el-tabs__item {
        height: 36px;
        line-height: 36px;
        font-size: 13px;
        font-family: 'Microsoft YaHei', Arial, sans-serif;
        border: none;
        border-bottom: 2px solid transparent;
        border-radius: 0;
        margin-right: 2px;
        padding: 0 16px;
        background-color: transparent;
        transition: all 0.3s;
        color: #666;
        position: relative;

        &.is-active {
          color: #409EFF;
          background-color: transparent;
          font-weight: 500;
          border-bottom-color: #409EFF;
        }

        &:hover {
          color: #409EFF;
          background-color: rgba(64, 158, 255, 0.05);
        }

        // 关闭按钮样式
        .el-icon-close {
          width: 14px;
          height: 14px;
          font-size: 12px;
          border-radius: 50%;
          transition: all 0.3s;
          margin-left: 8px;

          &:hover {
            background-color: rgba(237, 64, 20, 0.1);
            color: #ed4014;
          }
        }
      }
    }

    .el-tabs__content {
      display: none;
    }
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

