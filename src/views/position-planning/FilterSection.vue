<template>
  <div class="filter-section">
    <!-- 筛选条件区域 - 栅格布局 -->
    <el-row :gutter="10">
      <el-col :span="7">
        <div class="filter-item">
          <label>产品组</label>
          <el-select
            v-model="filters.productGroup"
            placeholder="请选择"
            clearable
            filterable
            size="mini"
            multiple
            collapse-tags
            :filter-method="e => getProductGroupList(e)"
            @change="handleSetProduct"
            class="filter-select"
            popper-class="position-planning-select-dropdown"
          >
            <el-option 
              v-for="item in productGroupList" 
              :key="item.code" 
              :label="item.name" 
              :value="item.code"
            >
              <span style="float: left">{{ item.name }}</span>
              <span 
                style="float: right; color: #8492a6; font-size: 13px; margin-right: 10px;"
              >
                <template v-if="item.isGroup">
                  --
                </template>
                <template v-else-if="item.isShow === 1">
                  {{ item.code }}
                </template>
              </span>
            </el-option>
          </el-select>
          <el-button size="mini" @click="handleProductManagement('1')">管理</el-button>
        </div>
      </el-col>
      
      <el-col :span="5">
        <div class="filter-item">
          <label>投资经理</label>
          <el-select 
            v-model="filters.investmentManager" 
            placeholder="请选择" 
            size="mini" 
            clearable
            filterable
            multiple
            collapse-tags
            @change="handleInvestmentManagerChange"
            class="filter-select"
            popper-class="position-planning-select-dropdown"
          >
            <el-option
              v-for="item in investmentManagerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>
      
      <el-col :span="12">
        <div class="filter-item">
          <el-checkbox v-model="filters.intentionIssued" size="mini">意向已下达</el-checkbox>
          <el-checkbox v-model="filters.intentionNotIssued" size="mini">意向未下达</el-checkbox>
          <div class="action-buttons">
            <el-button type="primary" size="mini" :loading="queryLoading" @click="handleQuery">查询</el-button>
            <el-button size="mini" @click="handleClear">清空</el-button>
            <SaveCondition
              :code="saveConditionCode"
              :name="saveConditionName"
              :add-url="saveConditionAddUrl"
              :get-url="saveConditionGetUrl"
              :user-id="userId"
              :add-item-click="getSaveConditionData"
              @itemClick="handleConditionSelect"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 回购策略配置区域 - 栅格布局 -->
    <el-row :gutter="10" class="strategy-row">
      <el-col :span="5">
        <div class="strategy-item">
          <label>回购策略</label>
          <el-radio-group v-model="strategy.type" size="mini" style="min-width: 174px;">
            <el-radio label="GY">隔夜</el-radio>
            <el-radio label="7D">7D</el-radio>
            <el-radio label="14D">14D</el-radio>
          </el-radio-group>
        </div>
      </el-col>
      
      <el-col :span="6">
        <div class="strategy-item">
          <el-select 
            v-model="strategy.name" 
            placeholder="请选择策略" 
            size="mini" 
            clearable
            filterable
            multiple
            collapse-tags
            class="filter-select"
            popper-class="position-planning-select-dropdown"
          >
            <el-option
              v-for="item in strategyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; margin-right: 10px;">
                <i 
                  class="el-icon-edit" 
                  style="color: #409EFF; cursor: pointer; font-size: 14px; margin-right: 8px;"
                  @click.stop="handleEditStrategy(item)"
                  title="编辑"
                ></i>
                <i 
                  class="el-icon-delete" 
                  style="color: #F56C6C; cursor: pointer; font-size: 14px;"
                  @click.stop="handleDeleteStrategy(item)"
                  title="删除"
                ></i>
              </span>
            </el-option>
          </el-select>
          <el-button size="mini" @click="handleStrategyConfig">策略配置</el-button>
        </div>
      </el-col>      
      <el-col :span="6">
        <div class="strategy-item">
          <label>策略优先级</label>
          <el-radio-group v-model="strategy.priority" size="mini">
            <el-radio label="product">产品限制优先</el-radio>
            <el-radio label="day">当日策略优先</el-radio>
          </el-radio-group>
        </div>
      </el-col>
      
      <el-col :span="4" style="float: right;">
        <div class="strategy-item">
          <div class="action-buttons">
            <el-button 
              size="mini" 
              type="primary"
              :disabled="isCalculateIntentionDisabled"
              @click="handleCalculateIntention"
            >
              试算意向
            </el-button>
            <!-- 下达意向按钮  先注释-->
            <!-- <el-button 
              size="mini" 
              type="success"
              :disabled="isIssueIntentionDisabled"
              @click="handleIssueIntention"
            >
              下达意向
            </el-button> -->
            <!-- 风控试算按钮 - 后台功能未完成，暂时注释 -->
            <!-- <el-button 
              size="mini" 
              type="warning"
              @click="handleRiskControl"
            >
              风控试算
            </el-button> -->
          </div>
        </div>
      </el-col>
    </el-row>
    
    <!-- 产品/管理组管理弹窗 -->
    <ProductManagement ref="productManagementRef" @getData="handleManagementDataLoaded" />
  </div>
</template>

<script>
import ProductManagement from './ProductManagement.vue'
import { productGroupList } from '@/service/common.js'

/**
 * 筛选区域组件
 * 功能：提供产品组、投资经理等筛选条件，以及回购策略配置和核心操作按钮
 */
import SaveCondition from '@/components/save-condition/save-condition.vue'

export default {
  name: 'FilterSection',
  components: {
    ProductManagement,
    SaveCondition
  },
  props: {
    // 表格中选中的基金数据
    selectedFunds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 筛选条件对象
      filters: {
        productGroup: [], // 产品组（多选，默认空数组）
        investmentManager: [], // 投资经理（多选，默认空数组）
        intentionIssued: false, // 意向已下达
        intentionNotIssued: false // 意向未下达
      },
      // 回购策略配置
      strategy: {
        type: 'GY', // 策略类型：GY-隔夜、7D、14D
        name: [], // 策略名称（多选，默认空数组）
        priority: 'product' // 策略优先级：产品限制优先 或 当日策略优先
      },
      // 产品组下拉选项
      productGroupOptions: [],
      // 产品组列表（用于下拉选择，包含完整数据）
      productGroupList: [],
      // 产品组完整数据映射（key: rid, value: 完整数据对象）
      productGroupDataMap: {},
      // 投资经理下拉选项
      investmentManagerOptions: [],
      // 策略列表下拉选项
      strategyOptions: [],
      // 查询按钮 loading 状态
      queryLoading: false
    }
  },
  computed: {
    /**
     * 试算意向按钮是否禁用
     * 规则：勾选数据只能一条，大于1条或没有选择时按钮禁用
     */
    isCalculateIntentionDisabled() {
      return this.selectedFunds.length !== 1
    },
    /**
     * 下达意向按钮是否禁用
     * 规则：
     * 1. 勾选数据只能一条，大于1条时按钮禁用
     * 2. 当勾选的数据是已下达的时候，按钮禁用
     */
    isIssueIntentionDisabled() {
      if (this.selectedFunds.length !== 1) {
        return true
      }
      // 检查是否已下达（isIssued: 0未下达，1已下达）
      const selectedFund = this.selectedFunds[0]
      return selectedFund.isIssued === '1' || selectedFund.isIssued === 1
    },
    /**
     * 保存查询条件组件配置
     */
    saveConditionCode() {
      return 'ATSTC_TCGL_PLANNING' // 模块code（路由name）
    },
    saveConditionName() {
      return '头寸规划' // 模块名称
    },
    saveConditionAddUrl() {
      return this.API.common.conditionSaveOrUpdate // 保存接口
    },
    saveConditionGetUrl() {
      return this.API.common.conditionGet // 查询接口
    },
    userId() {
      return window.sessionStorage.getItem('unionId') || '' // 用户ID
    }
  },
  mounted() {
    this.loadOptions()
  },
  methods: {
    /**
     * 加载所有下拉选项数据（产品组、投资经理、策略列表）
     */
    async loadOptions() {
      try {
          // 加载产品组列表
        this.getProductGroupList('')
        // 加载投资经理列表
        this.getInvestmentManagerList()
        // 加载策略列表
        await this.loadStrategyList()
        
      } catch (error) {
        this.$message.error('加载选项数据失败')
      }
    },
    /**
     * 加载策略列表（单独抽取，供外部调用刷新）
     */
    async loadStrategyList() {
      try {
        const strategyUrl = this.API.positionApiInvestment.prodPositionStrategyList
        const strategyRes = await this.http.post(strategyUrl, { name: '' }, 'application/json')
        
        if (strategyRes.code == 0) {
          // 将策略列表转换为下拉选项格式
          this.strategyOptions = (strategyRes.body || []).map(item => ({
            label: item.name,
            value: item.rid
          }))
        }
      } catch (error) {
        console.error('加载策略列表失败', error)
      }
    },
    /**
     * 获取产品组列表（主界面查询条件下拉框使用）
     * 接口：/pubCombi/queryProdAndProdGroup
     * @param {String} query - 查询关键词
     */
    async getProductGroupList(query = '') {
      try {
        // 使用正确的接口：productGroupList -> queryProdAndProdGroup
        // 根据接口文档：{ name: '搜索关键字', type: '1' }
        const res = await productGroupList({ 
          name: query || '', // 搜索关键字（支持模糊搜索）
          type: '1' // 产品组类型：1-产品组
        })
        
        if (res && res.code == 0) {
          // 响应体字段从 body 改为 data
          const dataList = res.data || []
          // 数据格式：[{ rid: '主键', type: '1', name: '产品组名称', isShow: 0/1, detail: [...] }]
          // 将 rid 映射为 code 用于下拉框，保留 isShow 字段和 detail 信息用于控制显示
          this.productGroupList = dataList.map(item => ({
            code: item.rid,
            name: item.name,
            isShow: item.isShow, // 是否是产品（0-否，1-是）
            isGroup: item.detail && Array.isArray(item.detail) && item.detail.length > 0 // 是否是产品组（有detail数组且长度>0）
          }))
          // 保存产品组完整数据到映射中（用于查询时提取产品代码）
          dataList.forEach(item => {
            this.productGroupDataMap[item.rid] = item
          })
        }
      } catch (error) {
        console.error('获取产品组列表失败', error)
        this.productGroupList = []
      }
    },
    /**
     * 获取投资经理列表
     * 接口：/positionVerification/getInvestmentManagerList
     */
    async getInvestmentManagerList() {
      try {
        const url = this.API.positionApiInvestment.getInvestmentManagerList
        const res = await this.http.post(url, {})
        
        if (res && res.code == 0) {
          const rows = res.body && res.body.rows ? res.body.rows : []
          // 数据格式：rows: ["全部", "无", "孙悦", "马超"]
          // 过滤掉"无"选项，转换为下拉选项格式
          this.investmentManagerOptions = rows
            .filter(name => name !== '无') // 过滤掉"无"选项
            .map(name => ({
              label: name,
              value: name
            }))
        }
      } catch (error) {
        console.error('获取投资经理列表失败', error)
        this.investmentManagerOptions = []
      }
    },
    /**
     * 处理产品组选择变化（不自动查询，等用户点击查询按钮）
     * @param {String|Array} value - 选中的产品组ID或ID数组
     */
    handleSetProduct(value) {
      // 确保 value 是数组格式（多选模式下）
      if (Array.isArray(value)) {
        this.filters.productGroup = value
      } else if (value === null || value === undefined) {
        this.filters.productGroup = []
      } else {
        this.filters.productGroup = [value]
      }
      // 不自动触发查询,等用户点击查询按钮
    },

    /**
     * 处理投资经理选择变化
     * 规则：如果选中了"全部"，要取消其他选中项；如果选了其他项，要取消选中"全部"
     */
    handleInvestmentManagerChange(value) {
      if (!value || value.length === 0) {
        return
      }
      
      // 使用 $nextTick 确保在 v-model 更新后执行
      this.$nextTick(() => {
        const currentValue = this.filters.investmentManager
        
        // 如果同时选中了"全部"和其他项
        if (currentValue.includes('全部') && currentValue.length > 1) {
          // 找出最后选中的项（新增的项）
          const lastSelected = value[value.length - 1]
          
          if (lastSelected === '全部') {
            // 如果最后选中的是"全部"，只保留"全部"
            this.filters.investmentManager = ['全部']
          } else {
            // 如果最后选中的是其他项，移除"全部"
            this.filters.investmentManager = currentValue.filter(item => item !== '全部')
          }
        }
      })
    },
    /**
     * 处理清空按钮点击，重置所有筛选条件（不自动查询）
     */
    handleClear() {
      // 清空查询条件
      this.filters = {
        productGroup: [], // 产品组清空为空数组
        investmentManager: [], // 投资经理清空为空数组
        intentionIssued: false,
        intentionNotIssued: false
      }
      
      // 清空策略条件
      this.strategy.type = '' // 回购策略
      this.strategy.name = [] // 策略下拉框
      this.strategy.priority = '' // 策略优先级
      
      // 重置表格显示选项（隐藏T+1头寸、隐藏无业务类别）
      this.$emit('reset-display-options')
      
      // 不自动触发查询，等用户点击查询按钮
    },
    /**
     * 获取当前查询条件数据（供SaveCondition组件调用）
     * @returns {Object} 当前的查询条件对象
     */
    getSaveConditionData() {
      return {
        filters: this.filters,
        strategy: this.strategy
      }
    },
    /**
     * 处理选择已保存的查询条件（SaveCondition组件回调）
     * @param {Object} conditionData - 保存的查询条件数据
     */
    handleConditionSelect(conditionData) {
      if (conditionData) {
        // 回填筛选条件
        if (conditionData.filters) {
          this.filters = {
            ...this.filters,
            ...conditionData.filters
          }
        }
        // 回填策略配置
        if (conditionData.strategy) {
          this.strategy = {
            ...this.strategy,
            ...conditionData.strategy
          }
        }
        this.$message.success('查询条件已加载')
      }
    },
    /**
     * 打开策略配置弹窗（新增策略）
     */
    handleStrategyConfig() {
      this.$emit('strategy-config')
    },
    /**
     * 编辑策略
     * @param {Object} item - 策略选项对象 { label, value }
     */
    handleEditStrategy(item) {
      // 触发编辑策略事件，传递策略ID
      this.$emit('strategy-config', item.value)
    },
    /**
     * 删除策略
     * @param {Object} item - 策略选项对象 { label, value }
     */
    async handleDeleteStrategy(item) {
      try {
        // 确认删除
        await this.$confirm(`确定要删除策略"${item.label}"吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // 调用删除接口
        const url = this.API.positionApiInvestment.prodPositionStrategyRemove
        const params = {
          rid: item.value // 策略ID
        }
        const res = await this.http.post(url, params, 'application/json')
        
        if (res.code == 0) {
          this.$message.success('删除成功')
          // 如果当前选中的策略包含被删除的策略，从选中列表中移除
          if (this.strategy.name && this.strategy.name.includes(item.value)) {
            this.strategy.name = this.strategy.name.filter(id => id !== item.value)
          }
          // 刷新策略列表
          await this.loadStrategyList()
        } else {
          this.$message.error(res.message || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除策略失败', error)
          this.$message.error('删除失败')
        }
      }
    },
    /**
     * 试算意向：触发试算意向事件
     */
    handleCalculateIntention() {
      this.$emit('calculate-intention', {
        selectedFunds: this.selectedFunds,
        strategy: this.strategy
      })
    },
    /**
     * 下达意向：触发下达意向事件
     */
    handleIssueIntention() {
      this.$emit('issue-intention', {
        selectedFunds: this.selectedFunds,
        strategy: this.strategy
      })
    },
    /**
     * 风控试算：触发风控试算事件
     */
    handleRiskControl() {
      this.$emit('risk-control', {
        selectedFunds: this.selectedFunds,
        strategy: this.strategy
      })
    },
    /**
     * 打开产品/管理组管理弹窗
     * @param {String} type - 类型：'1' 产品管理，'2' 管理组
     */
    handleProductManagement(type) {
      this.$refs.productManagementRef.open(type)
    },
    /**
     * 处理管理弹窗数据加载完成
     */
    handleManagementDataLoaded() {
      // 重新加载产品组选项
      this.getProductGroupList('')
    },
    /**
     * 处理查询按钮点击
     */
    async handleQuery() {
      // 产品组必选验证
      if (!this.filters.productGroup || !Array.isArray(this.filters.productGroup) || this.filters.productGroup.length === 0) {
        this.$message.warning('请先选择产品组')
        return
      }
      
      // 点击查询按钮时，重置以下筛选条件
      this.strategy.type = '' // 回购策略
      this.strategy.name = [] // 策略下拉框
      this.strategy.priority = '' // 策略优先级也一并重置
      
      // 开启 loading
      this.queryLoading = true
      
      try {
        // 处理产品组传参：根据下拉选择的数据情况来提取产品代码
        const processedFilters = { ...this.filters }
        let productCodes = []
        
        if (processedFilters.productGroup && Array.isArray(processedFilters.productGroup) && processedFilters.productGroup.length > 0) {
          // 遍历选中的产品组ID
          processedFilters.productGroup.forEach(rid => {
            const productGroupData = this.productGroupDataMap[rid]
            if (productGroupData) {
              // 如果选择的是组（detail数组长度大于0），要取detail数组里面的ocode
              if (productGroupData.detail && Array.isArray(productGroupData.detail) && productGroupData.detail.length > 0) {
                // 提取detail数组中的ocode
                productGroupData.detail.forEach(detailItem => {
                  if (detailItem.ocode) {
                    productCodes.push(detailItem.ocode)
                  }
                })
              } else {
                // 如果detail数组为空，可以直接取rid
                productCodes.push(rid)
              }
            } else {
              // 如果找不到对应的数据，直接使用rid
              productCodes.push(rid)
            }
          })
        }
        
        // 将处理后的产品代码数组添加到filters中
        processedFilters.productCodes = productCodes
        
        // 触发查询事件，传递处理后的筛选条件
        // 注意：$emit 是同步的，不会返回 Promise，所以需要父组件通过回调或其他方式通知完成
        this.$emit('query', processedFilters)
        
        // 重置表格显示选项（隐藏T+1头寸、隐藏无业务类别）
        this.$emit('reset-display-options')
      } catch (error) {
        console.error('查询失败', error)
        this.$message.error('查询失败，请重试')
        this.queryLoading = false
      }
    }
  }
}
</script>
<style lang="scss">
  /* 头寸规划页面下拉框选项样式（通过自定义类名限定作用域） */
  .position-planning-select-dropdown {
    .el-select-dropdown__item {
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
  
    /* 勾选标记（√）的位置 */
    .el-select-dropdown__item.selected::after {
      right: 5px !important;
    }
  
    /* 多选下拉框选项右内边距 */
    &.is-multiple .el-select-dropdown__item {
      padding-right: 10px !important;
    }
  }
</style>
<style lang="scss" scoped>
.filter-section {
  background-color: #fff;
  padding: 10px;
  padding-bottom: 10px;
  border-radius: 4px 4px 0 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-item {
  display: flex;
  align-items: center;
  min-height: 32px;

  label {
    font-family: 'Microsoft YaHei', Arial, sans-serif;
    font-size: 12px;
    font-weight: normal;
    color: #333;
    white-space: nowrap;
    margin-right: 8px;
    flex-shrink: 0;
  }

  .filter-select {
    flex: 1;
    min-width: 0;
    margin-right: 8px;
  }

  // 防止多选标签换行
  /deep/ .el-select__tags {
    flex-wrap: nowrap !important;
    overflow: hidden;
  }
  
  // 确保标签删除按钮可见和可点击
  /deep/ .el-tag {
    .el-icon-close {
      cursor: pointer;
      opacity: 1;
    }
  }

  /deep/ .el-checkbox {
    margin-right: 15px;
  }
  
  /deep/ .el-button {
    flex-shrink: 0;
  }
  
  // 操作按钮组靠右对齐
  .action-buttons {
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: 10px;
  
    
    // 调整保存查询条件组件与清空按钮之间的间距为10px
    /deep/ #save-condition {
      margin-left: 10px;
      
      // 去掉保存查询条件组件中下拉按钮和主按钮之间的间距
      .el-dropdown {
        .el-button-group {
          // 去掉分隔线
          &::after {
            display: none !important;
          }
          
          .el-button:first-child {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            border-right: none !important;
          }
          .el-button:last-child {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            margin-left: 0 !important;
            padding-left: 5px;
            padding-right: 5px;
          }
        }
      }
    }
  }
}


.strategy-row {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e4e7ed;
}

.strategy-item {
  display: flex;
  align-items: center;
  min-height: 32px;

  label {
    font-family: 'Microsoft YaHei', Arial, sans-serif;
    font-size: 12px;
    font-weight: normal;
    color: #333;
    white-space: nowrap;
    margin-right: 8px;
    flex-shrink: 0;
  }

  .filter-select {
    flex: 1;
    min-width: 0;
    margin-right: 8px;
  }

  /deep/ .el-button {
    margin-left: 5px;
    flex-shrink: 0;
  }
  
  // 操作按钮组靠右对齐
  .action-buttons {
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: 10px;
    
    /deep/ .el-button {
      margin-left: 5px;
    }
  }
}

</style>



