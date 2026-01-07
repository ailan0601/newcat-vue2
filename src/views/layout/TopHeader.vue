<template>
  <div class="top-header">
    <div class="header-left">
      <!-- 左侧留空或放置其他内容 -->
    </div>
    <div class="header-right">
      <i class="el-icon-house header-icon" title="首页"></i>
      <span class="header-item">magekai pro</span>
      <el-dropdown trigger="click" class="lang-dropdown">
        <span class="lang-option">
          <i class="el-icon-s-grid"></i> 551M
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>简体中文</el-dropdown-item>
          <el-dropdown-item>English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="notification-icon">
        <i class="el-icon-bell header-icon"></i>
        <span class="badge">1</span>
      </div>
      <el-dropdown trigger="click" class="user-dropdown" @command="handleCommand">
        <span class="user-info">
          信息
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="profile">个人中心</el-dropdown-item>
          <el-dropdown-item command="settings">系统设置</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TopHeader',
  data() {
    return {
      refreshInterval: 5, // 刷新间隔（秒）
      refreshTimer: null
    }
  },
  computed: {
    ...mapGetters(['slideFold']),
    refreshText() {
      return this.refreshInterval > 0 ? `每${this.refreshInterval}秒刷新` : '关闭自动刷新'
    }
  },
  beforeDestroy() {
    // 清除定时器
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
  },
  methods: {
    /**
     * 设置刷新间隔
     * @param {Number} seconds - 刷新间隔秒数，0表示关闭
     */
    setRefreshInterval(seconds) {
      this.refreshInterval = seconds
      
      // 清除旧定时器
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer)
        this.refreshTimer = null
      }
      
      // 设置新定时器
      if (seconds > 0) {
        this.refreshTimer = setInterval(() => {
          // 触发刷新事件
          this.$emit('refresh')
        }, seconds * 1000)
        this.$message.success(`已设置每${seconds}秒自动刷新`)
      } else {
        this.$message.info('已关闭自动刷新')
      }
    },
    /**
     * 处理用户菜单命令
     */
    handleCommand(command) {
      if (command === 'logout') {
        this.$message.success('退出登录')
        // 这里可以添加退出登录逻辑
      } else if (command === 'profile') {
        this.$message.info('个人中心')
      } else if (command === 'settings') {
        this.$message.info('系统设置')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.top-header {
  height: 60px;
  background-color: #3c4a5e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  position: relative;
  z-index: 999;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;

  .header-item {
    font-family: 'Microsoft YaHei', Arial, sans-serif;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
    cursor: pointer;
    transition: all 0.3s;
    padding: 6px 12px;
    border-radius: 4px;

    &:hover {
      color: #409EFF;
      background-color: rgba(64, 158, 255, 0.1);
    }
  }

  .lang-dropdown,
  .user-dropdown {
    cursor: pointer;
  }

  .lang-option {
    font-family: 'Microsoft YaHei', Arial, sans-serif;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
    cursor: pointer;
    transition: all 0.3s;
    padding: 6px 12px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 5px;

    &:hover {
      color: #409EFF;
      background-color: rgba(64, 158, 255, 0.1);
    }

    i {
      font-size: 14px;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    font-family: 'Microsoft YaHei', Arial, sans-serif;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
    cursor: pointer;
    transition: all 0.3s;
    padding: 6px 12px;
    border-radius: 4px;

    &:hover {
      color: #409EFF;
      background-color: rgba(64, 158, 255, 0.1);
    }

    i {
      margin-left: 5px;
      font-size: 12px;
    }
  }

  .notification-icon {
    position: relative;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      background-color: rgba(64, 158, 255, 0.1);

      .header-icon {
        color: #409EFF;
      }
    }

    .badge {
      position: absolute;
      top: 4px;
      right: 4px;
      background-color: #f5222d;
      color: #fff;
      font-size: 12px;
      font-weight: bold;
      padding: 0 5px;
      border-radius: 10px;
      min-width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
    }
  }

  .header-icon {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.85);
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      color: #409EFF;
    }
  }
}
</style>
