<template>
  <div class="sidebar" :class="{ 'is-collapse': slideFold }">
    <div class="sidebar-header">
      <div class="logo-content">
        <div class="logo-icon">
          <i class="el-icon-s-grid"></i>
        </div>
        <div class="logo-text">
          <div class="logo-title">创金机器猫</div>
        </div>
      </div>
    </div>

    <!-- 搜索框和伸缩按钮 -->
    <div class="search-bar" v-if="!slideFold">
      <el-input
        v-model="searchKeyword"
        placeholder="输入关键字查找菜单..."
        class="search-input"
        prefix-icon="el-icon-search"
        size="small"
        clearable
      />
      <div class="collapse-btn-inline" @click="toggleCollapse">
        <i class="el-icon-s-fold"></i>
      </div>
    </div>
    
    <!-- 收起状态下的伸缩按钮 -->
    <div class="collapse-btn-compact" v-if="slideFold" @click="toggleCollapse">
      <i class="el-icon-s-unfold"></i>
    </div>
    
    <el-menu
      :default-active="activeMenu"
      :collapse="slideFold"
      :unique-opened="true"
      background-color="#3c4a5e"
      text-color="#d3dce6"
      active-text-color="#ffd04b"
      class="sidebar-menu"
    >
      <el-menu-item
        v-for="item in menuList"
        :key="item.path"
        :index="item.path"
        @click="handleMenuClick(item)"
      >
        <i :class="item.icon"></i>
        <span slot="title">{{ item.label }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Sidebar',
  data() {
    return {
      searchKeyword: '',
      menuList: [
        { 
          key: 'position-planning', 
          label: '头寸规划', 
          path: '/position-planning',
          icon: 'el-icon-s-data'
        }
        // 可以继续添加其他菜单项
        // { 
        //   key: 'other-page', 
        //   label: '其他页面', 
        //   path: '/other-page',
        //   icon: 'el-icon-menu'
        // }
      ]
    }
  },
  computed: {
    ...mapGetters(['slideFold']),
    activeMenu() {
      return this.$route.path
    }
  },
  methods: {
    ...mapActions(['toggleSlideFold', 'openTab']),
    /**
     * 处理菜单点击
     * @param {Object} item - 菜单项
     */
    handleMenuClick(item) {
      // 打开tab
      this.openTab({
        name: item.key,
        label: item.label,
        path: item.path
      })
      // 跳转路由
      if (this.$route.path !== item.path) {
        this.$router.push(item.path)
      }
    },
    /**
     * 切换菜单伸缩
     */
    toggleCollapse() {
      this.toggleSlideFold()
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 200px;
  background-color: #3c4a5e;
  color: #fff;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  transition: width 0.3s ease;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.15);

  &.is-collapse {
    width: 64px;

    .sidebar-header {
      padding: 15px 5px;
      
      .logo-content {
        flex-direction: column;
        gap: 5px;
        
        .logo-icon {
          width: 32px;
          height: 32px;
          font-size: 18px;
        }
        
        .logo-text {
          display: none;
        }
      }
    }

    .search-bar {
      display: none;
    }
  }
}

.sidebar-header {
  padding: 15px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #34404f;
  flex-shrink: 0;

  .logo-content {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    
    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      i {
        font-size: 24px;
        color: #fff;
      }
    }
    
    .logo-text {
      flex: 1;
      text-align: left;
      
      .logo-title {
        font-family: 'Microsoft YaHei', Arial, sans-serif;
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: 0.5px;
      }
    }
  }
}

.search-bar {
  padding: 10px 15px;
  background-color: #34404f;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  .search-input {
    flex: 1;

    /deep/ .el-input__inner {
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background-color: rgba(255, 255, 255, 0.1);
      color: #fff;
      transition: all 0.3s;
      height: 32px;
      line-height: 32px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      &:hover {
        border-color: rgba(255, 255, 255, 0.3);
        background-color: rgba(255, 255, 255, 0.15);
      }

      &:focus {
        border-color: #409EFF;
        background-color: rgba(255, 255, 255, 0.15);
      }
    }

    /deep/ .el-input__prefix {
      color: rgba(255, 255, 255, 0.7);
    }

    /deep/ .el-input__icon {
      color: rgba(255, 255, 255, 0.7);
      line-height: 32px;
    }
  }

  .collapse-btn-inline {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.3s;
    flex-shrink: 0;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);

      i {
        color: #409EFF;
      }
    }

    i {
      font-size: 18px;
      color: #d3dce6;
      transition: all 0.3s;
    }
  }
}

.collapse-btn-compact {
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
  background-color: #34404f;
  flex-shrink: 0;

  &:hover {
    background-color: #48566a;

    i {
      color: #ffd04b;
      transform: scale(1.1);
    }
  }

  i {
    font-size: 18px;
    color: #d3dce6;
    transition: all 0.3s;
  }
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  border-right: none;
  padding: 10px 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 2px;

    &:hover {
      background-color: rgba(255, 255, 255, 0.25);
    }
  }

  /deep/ .el-menu {
    border-right: none;
    background-color: transparent;
  }

  /deep/ .el-menu-item {
    font-family: 'Microsoft YaHei', Arial, sans-serif;
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    margin: 4px 0;
    padding-left: 20px !important;
    border-radius: 0;
    position: relative;
    overflow: hidden;
    border-left: 3px solid transparent;
    transition: all 0.3s ease;

    &:hover {
      background-color: #48566a !important;
      border-left-color: #ffd04b;
      
      i {
        color: #ffd04b;
      }
    }

    &.is-active {
      background-color: #48566a !important;
      color: #ffd04b !important;
      border-left-color: #ffd04b;
      font-weight: normal;

      i {
        color: #ffd04b;
      }
    }

    i {
      color: #ffd04b;
      margin-right: 10px;
      font-size: 18px;
      transition: color 0.3s ease;
    }
  }
}

</style>

