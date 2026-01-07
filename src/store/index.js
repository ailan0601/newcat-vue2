// 注意：Vuex 已在 index.html 中通过 CDN 全局引入
// 全局变量 window.Vuex 已可用，且已自动调用 Vue.use(Vuex)
// 因此这里不需要 import Vuex，直接使用全局的 Vuex

export default new window.Vuex.Store({
  state: {
    // 左侧菜单伸缩状态：false展开，true收起
    slideFold: false,
    // 当前激活的tab页
    activeTab: 'position-planning',
    // 打开的tab列表
    openedTabs: [
      { name: 'position-planning', label: '头寸规划', path: '/position-planning' }
    ]
  },
  mutations: {
    /**
     * 切换左侧菜单伸缩状态
     */
    TOGGLE_SLIDE_FOLD(state) {
      state.slideFold = !state.slideFold
    },
    /**
     * 设置左侧菜单伸缩状态
     * @param {Boolean} status - true收起，false展开
     */
    SET_SLIDE_FOLD(state, status) {
      state.slideFold = status
    },
    /**
     * 设置当前激活的tab
     * @param {String} tabName - tab名称
     */
    SET_ACTIVE_TAB(state, tabName) {
      state.activeTab = tabName
    },
    /**
     * 添加tab页
     * @param {Object} tab - tab对象 { name, label, path }
     */
    ADD_TAB(state, tab) {
      const exists = state.openedTabs.some(t => t.name === tab.name)
      if (!exists) {
        state.openedTabs.push(tab)
      }
      state.activeTab = tab.name
    },
    /**
     * 关闭tab页
     * @param {String} tabName - tab名称
     */
    CLOSE_TAB(state, tabName) {
      const index = state.openedTabs.findIndex(t => t.name === tabName)
      if (index !== -1) {
        state.openedTabs.splice(index, 1)
        // 如果关闭的是当前激活的tab，激活最后一个tab
        if (state.activeTab === tabName && state.openedTabs.length > 0) {
          state.activeTab = state.openedTabs[state.openedTabs.length - 1].name
        }
      }
    }
  },
  actions: {
    /**
     * 切换菜单伸缩
     */
    toggleSlideFold({ commit }) {
      commit('TOGGLE_SLIDE_FOLD')
    },
    /**
     * 打开tab页
     * @param {Object} tab - tab对象
     */
    openTab({ commit }, tab) {
      commit('ADD_TAB', tab)
    },
    /**
     * 关闭tab页
     * @param {String} tabName - tab名称
     */
    closeTab({ commit }, tabName) {
      commit('CLOSE_TAB', tabName)
    },
    /**
     * 切换tab
     * @param {String} tabName - tab名称
     */
    switchTab({ commit }, tabName) {
      commit('SET_ACTIVE_TAB', tabName)
    }
  },
  getters: {
    slideFold: state => state.slideFold,
    activeTab: state => state.activeTab,
    openedTabs: state => state.openedTabs
  }
})

