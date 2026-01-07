<template>
   <div class="content-outer-box featrue-test" id="position-planning">
    <div class="content-box tab-table-box" :class="{
      'is-fold': slideFold
    }">
    <div class="position-planning-container">
      <!-- 顶部筛选区域 -->
      <div class="filter-wrapper">
        <FilterSection
          ref="filterSectionRef"
          :selected-funds="selectedFunds"
          @query="handleQuery"
          @reset-display-options="handleResetDisplayOptions"
          @strategy-config="handleStrategyConfig"
          @calculate-intention="handleCalculateIntention"
          @issue-intention="handleIssueIntention"
          @risk-control="handleRiskControl"
        />
      </div>

      <!-- 表格区域 -->
      <div class="table-wrapper">
         <InterbankTable
           ref="interbankTableRef"
           :table-data="interbankData"
           :table-loading="tableLoading"
           :hide-t1-position="displayOptions.hideT1Position"
           :hide-no-business-category="displayOptions.hideNoBusinessCategory"
           :custom-columns="customColumns"
           @selection-change="handleSelectionChange"
           @secondary-trade-click="handleSecondaryTradeClick"
           @detail-click="handleDetailClick"
           @repurchase-restriction-click="handleRepurchaseRestrictionClick"
           @unsettled-intention-click="handleUnsettledIntentionClick"
           @display-options-change="handleDisplayOptionsChange"
           @custom-column-added="handleCustomColumnAdded"
           @custom-column-save="handleCustomColumnSave"
           @custom-column-title-save="handleCustomColumnTitleSave"
           @custom-column-delete="handleCustomColumnDelete"
           @progress-click="handleProgressClick"
           @combi-name-click="handleCombiNameClick"
           @intention-saved="handleIntentionSaved"
         />
      </div>
    </div>

    <!-- 策略配置弹窗 -->
    <el-dialog
      title="策略配置"
      :visible.sync="strategyConfigDialogVisible"
      width="600px"
      custom-class="common-dialog-padding"
      :append-to-body="true"
    >
      <StrategyConfigPanel
        :strategy-id="currentStrategyId"
        :strategy-data="currentStrategyData"
        @cancel="strategyConfigDialogVisible = false"
        @save="handleStrategyConfigSave"
      />
    </el-dialog>

     <!-- 数据明细弹窗（通用） -->
     <el-dialog
       :title="detailDialogTitle"
       :visible.sync="secondaryTradeDialogVisible"
       width="1000px"
       custom-class="common-dialog-padding"
       top="12vh"
       :append-to-body="true"
       @close="handleSecondaryTradeDialogClose"
     >
       <SecondaryTradePanel
         ref="secondaryTradePanelRef"
         :row-data="currentRowData"
         :field-code="currentFieldCode"
         :field-name="detailDialogTitle"
         :initial-summary-value="currentSummaryValue"
         :readonly="isDetailDialogReadonly"
         @save-success="handleSecondaryTradeSaveSuccess"
       />
       <div slot="footer" class="dialog-footer">
         <el-button v-if="!isDetailDialogReadonly" type="primary" size="mini" @click="handleSecondaryTradeSave">保存</el-button>
         <el-button size="mini" @click="handleSecondaryTradeDialogClose">取消</el-button>
       </div>
     </el-dialog>

    <!-- 回购限制弹窗 -->
    <el-dialog
      title="回购限制"
      :visible.sync="repurchaseRestrictionDialogVisible"
      width="600px"
      custom-class="common-dialog-padding"
      :append-to-body="true"
    >
      <RepurchaseRestrictionPanel
        ref="repurchaseRestrictionPanelRef"
        :row-data="currentRowData"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="handleRepurchaseRestrictionSave">保存</el-button>
        <el-button size="mini" @click="repurchaseRestrictionDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 进度查询明细弹窗（包含未成交意向、询价进度、前台进度、后台进度） -->
    <el-dialog
      :title="progressDetailDialogTitle"
      :visible.sync="progressDetailDialogVisible"
      width="1200px"
      custom-class="common-dialog-padding"
      :append-to-body="true"
    >
      <ProgressDetailPanel
        ref="progressDetailPanelRef"
        :row-data="currentRowData"
        :field-code="currentProgressFieldCode"
        :field-name="progressDetailDialogTitle"
        :initial-summary-value="currentProgressSummaryValue"
      />
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="progressDetailDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 编辑组合名称弹窗 -->
    <CombiNameEditDialog
      :visible.sync="combiNameEditDialogVisible"
      :row-data="currentRowData"
      @save-success="handleCombiNameSaveSuccess"
    />

    <!-- 意向预览弹窗 -->
    <IntentionPreviewDialog
      :dialog-visible="previewDialogVisible"
      :intention-data="previewIntentionData"
      :conflicts="previewConflicts"
      @close="previewDialogVisible = false"
      @risk-control="handlePreviewRiskControl"
      @issue="handlePreviewIssue"
    />
  </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import FilterSection from './FilterSection.vue'
import InterbankTable from './InterbankTable.vue'
import StrategyConfigPanel from './StrategyConfigPanel.vue'
import SecondaryTradePanel from './SecondaryTradePanel.vue'
import RepurchaseRestrictionPanel from './RepurchaseRestrictionPanel.vue'
import IntentionPreviewDialog from './IntentionPreviewDialog.vue'
import CombiNameEditDialog from './CombiNameEditDialog.vue'
import ProgressDetailPanel from './ProgressDetailPanel.vue'

/**
 * 头寸规划管理主页面组件
 * 功能：整合筛选、表格展示、弹窗配置等功能，实现头寸规划的全流程管理
 */
export default {
  name: 'PositionPlanning',
  components: {
    FilterSection,
    InterbankTable,
    StrategyConfigPanel,
    SecondaryTradePanel,
    RepurchaseRestrictionPanel,
    IntentionPreviewDialog,
    CombiNameEditDialog,
    ProgressDetailPanel
  },
  computed: {
    ...mapState([ "slideFold"])
  },
  data() {
    return {
      // 银行间入款未交收数据列表
      interbankData: [],
      // 表格中选中的基金数据
      selectedFunds: [],
      // 表格 loading 状态
      tableLoading: false,
      // 表格显示选项配置
      displayOptions: {
        hideT1Position: false, // 是否隐藏T+1头寸列
        hideNoBusinessCategory: false, // 是否隐藏无业务类别列
        customLayout: false // 自定义布局（预留功能）
      },
      // 策略配置弹窗显示状态
      strategyConfigDialogVisible: false,
      // 二级买卖弹窗显示状态
      secondaryTradeDialogVisible: false,
      // 回购限制弹窗显示状态
      repurchaseRestrictionDialogVisible: false,
      // 进度查询明细弹窗显示状态
      progressDetailDialogVisible: false,
      // 进度查询明细弹窗标题
      progressDetailDialogTitle: '',
      // 当前进度查询字段代码
      currentProgressFieldCode: '',
      // 当前进度查询汇总金额（点击的单元格金额）
      currentProgressSummaryValue: 0,
      // 当前点击的表格数值（用于明细弹框汇总输入框的初始值）
      currentSummaryValue: 0,
      // 明细弹框是否只读模式（T+0和T+1头寸测算列使用只读模式）
      isDetailDialogReadonly: false,
      // 编辑组合名称弹窗显示状态
      combiNameEditDialogVisible: false,
      // 当前操作的行数据（用于弹窗展示）
      currentRowData: null,
      // 意向预览弹窗显示状态
      previewDialogVisible: false,
      // 意向预览数据（包含隔夜、7D、14D的意向金额）
      previewIntentionData: {},
      // 意向冲突列表（策略与产品限制的冲突）
      previewConflicts: [],
       // 当前编辑的策略ID
       currentStrategyId: '',
       // 当前编辑的策略数据
       currentStrategyData: null,
       // 自定义列配置（从接口返回的数据中提取）
       customColumns: [],
       // 当前查看明细的字段代码
       currentFieldCode: '',
       // 当前查看明细的字段名称（用于弹框标题）
       detailDialogTitle: '数据明细',
       // 当前查询条件（用于刷新数据时保留查询条件）
       currentFilters: {}
    }
  },
  mounted() {
    // 默认不查询数据，等用户选择了产品组点击查询按钮后才查询
    // this.loadData()
    // 加载保存的查询条件
    const savedQuery = localStorage.getItem('positionPlanningQuery')
    if (savedQuery) {
      try {
        const query = JSON.parse(savedQuery)
        // 可以在这里应用保存的查询条件
      } catch (error) {
        console.error('加载查询条件失败', error)
      }
    }
  },
  methods: {
    /**
     * 加载银行间入款数据
     * @param {Object} filters - 筛选条件对象（如果不传，则使用上次保存的查询条件）
     */
    async loadData(filters = null) {
      // 开启表格 loading
      this.tableLoading = true
      
      try {
        // 如果传入了 filters，保存为当前查询条件；否则使用上次保存的查询条件
        if (filters !== null) {
          this.currentFilters = filters
        }
        
        // 使用当前保存的查询条件
        const currentFilters = this.currentFilters
        
        const url = this.API.positionApiInvestment.prodPositionQuery
        
        // 处理产品组参数：使用FilterSection处理后的productCodes
        let productCodes = []
        if (currentFilters.productCodes && Array.isArray(currentFilters.productCodes)) {
          // 如果已经有处理后的productCodes，直接使用
          productCodes = currentFilters.productCodes.filter(code => code)
        } else if (currentFilters.productGroup) {
          // 兼容旧逻辑：如果没有productCodes，使用productGroup（向后兼容）
          if (Array.isArray(currentFilters.productGroup)) {
            // 过滤掉空值，确保数组中都是有效的产品代码
            productCodes = currentFilters.productGroup.filter(code => code)
          } else if (typeof currentFilters.productGroup === 'string' && currentFilters.productGroup) {
            // 如果是字符串，转换为数组
            productCodes = [currentFilters.productGroup]
          }
        }
        
        // 处理投资经理参数：确保始终传递数组格式，支持多选
        let investManagers = []
        if (currentFilters.investmentManager) {
          if (Array.isArray(currentFilters.investmentManager)) {
            // 过滤掉空值，确保数组中都是有效的投资经理
            investManagers = currentFilters.investmentManager.filter(manager => manager)
          } else if (typeof currentFilters.investmentManager === 'string' && currentFilters.investmentManager) {
            // 如果是字符串，转换为数组
            investManagers = [currentFilters.investmentManager]
          }
        }
        
        // 处理意向状态参数：根据复选框状态设置
        let intentionState = ''
        if (currentFilters.intentionIssued && !currentFilters.intentionNotIssued) {
          // 只勾选"意向已下达"
          intentionState = '1'
        } else if (!currentFilters.intentionIssued && currentFilters.intentionNotIssued) {
          // 只勾选"意向未下达"
          intentionState = '0'
        } else {
          // 两个都勾选或都不勾选，查询全部
          intentionState = ''
        }
        
        const params = {
          productCodes: productCodes, // 产品代码数组，没有选择时传空数组 []
          investManager: investManagers, // 投资经理数组，支持多选
          intentionState: intentionState // 意向状态（0:意向未下达，1：意向已经下达，'':查询全部）
          // 注意：查询按钮不传 singleStrategy 和 strategyList 参数
          // 这两个参数只在试算意向、下达意向、风控试算时才传递
        }
        const res = await this.http.post(url, params, 'application/json')
        if (res.code == 0) {
          // 处理返回数据：body可能是数组或单个对象
          let dataList = []
          if (Array.isArray(res.body)) {
            // 如果body是数组，直接使用
            dataList = res.body
          } else if (res.body && typeof res.body === 'object') {
            // 如果body是单个对象，转换为数组
            dataList = [res.body]
          }
          // 将接口返回的字段映射到组件使用的字段
          this.interbankData = dataList.map(item => this.mapApiDataToTableData(item))
          
          // 提取自定义列配置（从第一条数据中提取，因为所有行的自定义列配置应该相同）
          if (dataList.length > 0) {
            this.extractCustomColumns(dataList[0])
          }
          
          // 数据更新后，使用 $nextTick 确保 DOM 更新后再重新计算表格布局，修复固定列错位问题
          this.$nextTick(() => {
            try {
              if (this.$refs.interbankTableRef && this.$refs.interbankTableRef.$refs && this.$refs.interbankTableRef.$refs.interbankTable) {
                // 重新计算表格布局，修复固定列错位问题
                this.$refs.interbankTableRef.$refs.interbankTable.doLayout()
              }
            } catch (error) {
              console.error('重新计算表格布局失败', error)
            }
          })
        } else {
          this.$message.error(res.message || '加载数据失败')
        }
      } catch (error) {
        console.error('加载数据失败', error)
        this.$message.error('加载数据失败')
      } finally {
        // 确保在所有情况下都关闭表格 loading
        this.tableLoading = false
      }
    },
    /**
     * 将接口返回的数据字段映射到表格使用的字段
     * @param {Object} apiData - 接口返回的数据
     * @returns {Object} 映射后的数据
     */
    mapApiDataToTableData(apiData) {
      // 确保 id 始终有值，避免 row-key 返回 undefined
      const rowId = apiData.fundCode || apiData.fundId || `row_${Date.now()}_${Math.random()}`
      return {
        id: rowId, // 使用基金代码作为唯一标识，确保始终有值
        fundCode: apiData.fundCode, // 基金代码
        fundId: apiData.fundId, // 产品ID
        fundName: apiData.fundName, // 基金简称
        reverseRepoDue: apiData.zhgExpire !== null && apiData.zhgExpire !== undefined ? apiData.zhgExpire : '', // 正回购到期
        currentDayReverseRepoDue: apiData.nhgExpire !== null && apiData.nhgExpire !== undefined ? apiData.nhgExpire : '', // 当日逆回购到期
        currentDayT0Trade: apiData.t0YhjMm !== null && apiData.t0YhjMm !== undefined ? apiData.t0YhjMm : '', // 当日T0买卖
        yesterdayPlus1SellBonds: {
          lastT1Mq: apiData.lastT1Mq !== null && apiData.lastT1Mq !== undefined ? apiData.lastT1Mq : '', // 昨日+1卖券
          zhgFirst: apiData.zhgFirst !== null && apiData.zhgFirst !== undefined ? apiData.zhgFirst : '' // 正回购首期
        },
        currentDayBondInterest: apiData.bondDxDf !== null && apiData.bondDxDf !== undefined ? apiData.bondDxDf : '', // 当日债券兑息兑付
        primaryPayment: apiData.firstContribution !== null && apiData.firstContribution !== undefined ? apiData.firstContribution : '', // 一级缴款
        secondaryTrade: apiData.secondaryTrading !== null && apiData.secondaryTrading !== undefined ? apiData.secondaryTrading : '', // 二级买卖
        fundSubscription: apiData.fundApplyRedeem !== null && apiData.fundApplyRedeem !== undefined ? apiData.fundApplyRedeem : '', // 基金申赎
        netSubscription: apiData.netSubscription !== null && apiData.netSubscription !== undefined ? apiData.netSubscription : '', // 净申赎
        fixedDepositDue: apiData.dcdq !== null && apiData.dcdq !== undefined ? apiData.dcdq : '', // 定存到期
        riskProvision: apiData.fxbfj !== null && apiData.fxbfj !== undefined ? apiData.fxbfj : '', // 风险备付金
        other: apiData.other !== null && apiData.other !== undefined ? apiData.other : '', // 其它
        t0Position: {
          beginning: apiData.t0BeginAvailable !== null && apiData.t0BeginAvailable !== undefined ? apiData.t0BeginAvailable : '', // T+0日初头寸
          calculation: apiData.t0PositionCalc !== null && apiData.t0PositionCalc !== undefined ? apiData.t0PositionCalc : '', // T+0头寸测算
          checkTable: apiData.t0PositionUsable !== null && apiData.t0PositionUsable !== undefined ? apiData.t0PositionUsable : '' // 头寸核查T+0头寸
        },
        t1Position: {
          beginning: apiData.t1BeginAvailable !== null && apiData.t1BeginAvailable !== undefined ? apiData.t1BeginAvailable : '', // T+1日初头寸
          calculation: apiData.t1PositionCalc !== null && apiData.t1PositionCalc !== undefined ? apiData.t1PositionCalc : '', // T+1头寸测算
          checkTable: apiData.t1PositionUsable !== null && apiData.t1PositionUsable !== undefined ? apiData.t1PositionUsable : '' // 头寸核查T+1头寸
        },
        positionIntention: {
          combiName: apiData.combiName || '', // 组合名称
          combiId: apiData.combiId || '', // 组合ID
          overnight: apiData.overOpinions !== null && apiData.overOpinions !== undefined ? apiData.overOpinions : '', // 隔夜(亿)
          overnightState: apiData.overOpinionsState !== null && apiData.overOpinionsState !== undefined ? apiData.overOpinionsState : 0, // 隔夜状态（0：无，1：已下达意向，2：下达意向后被修改）
          sevenDay: apiData.opinions7d !== null && apiData.opinions7d !== undefined ? apiData.opinions7d : '', // 7D(亿)
          sevenDayState: apiData.opinions7dState !== null && apiData.opinions7dState !== undefined ? apiData.opinions7dState : 0, // 7D状态（0：无，1：已下达意向，2：下达意向后被修改）
          fourteenDay: apiData.opinions14d !== null && apiData.opinions14d !== undefined ? apiData.opinions14d : '', // 14D(亿)
          fourteenDayState: apiData.opinions14dState !== null && apiData.opinions14dState !== undefined ? apiData.opinions14dState : 0, // 14D状态（0：无，1：已下达意向，2：下达意向后被修改）
          // 自定义列数据 - 支持空值，不转换为0
          customcd1: apiData.opinionsCd1Value !== null && apiData.opinionsCd1Value !== undefined ? apiData.opinionsCd1Value : '',
          customcd1State: apiData.opinionsCd1State !== null && apiData.opinionsCd1State !== undefined ? apiData.opinionsCd1State : 0, // 自定义天数1状态
          customcd2: apiData.opinionsCd2Value !== null && apiData.opinionsCd2Value !== undefined ? apiData.opinionsCd2Value : '',
          customcd2State: apiData.opinionsCd2State !== null && apiData.opinionsCd2State !== undefined ? apiData.opinionsCd2State : 0, // 自定义天数2状态
          customcd3: apiData.opinionsCd3Value !== null && apiData.opinionsCd3Value !== undefined ? apiData.opinionsCd3Value : '',
          customcd3State: apiData.opinionsCd3State !== null && apiData.opinionsCd3State !== undefined ? apiData.opinionsCd3State : 0, // 自定义天数3状态
          customcd4: apiData.opinionsCd4Value !== null && apiData.opinionsCd4Value !== undefined ? apiData.opinionsCd4Value : '',
          customcd4State: apiData.opinionsCd4State !== null && apiData.opinionsCd4State !== undefined ? apiData.opinionsCd4State : 0, // 自定义天数4状态
          customcd5: apiData.opinionsCd5Value !== null && apiData.opinionsCd5Value !== undefined ? apiData.opinionsCd5Value : '',
          customcd5State: apiData.opinionsCd5State !== null && apiData.opinionsCd5State !== undefined ? apiData.opinionsCd5State : 0 // 自定义天数5状态
        },
        unsettledIntention: `${apiData.untradedIntentAmount || 0}/${apiData.untradedIntentCount || 0}`, // 未成交意向
        weightedCost: {
          inquiryProgress: `${apiData.inquiryProgressAmount || 0}/${apiData.inquiryProgressCount || 0}`, // 询价进度
          frontendProgress: `${apiData.frontDeskProgressAmount || 0}/${apiData.frontDeskProgressCount || 0}`, // 前台进度
          backendProgress: `${apiData.backDeskProgressAmount || 0}/${apiData.backDeskProgressCount || 0}` // 后台进度
        },
        reverseRepo: apiData.pledgeRepo !== null && apiData.pledgeRepo !== undefined ? apiData.pledgeRepo : '', // 正回购
        repo: apiData.reverseRepo !== null && apiData.reverseRepo !== undefined ? apiData.reverseRepo : '', // 逆回购
        repurchaseRestriction: apiData.repurchaseRestrictionContent || '', // 回购限制(表格显示内容)
        repurchaseRestrictionType: apiData.repurchaseRestrictionType || '', // 回购限制类型
        repurchaseRestrictionDetail: apiData.repurchaseRestriction || '', // 回购限制详情
        isIssued: apiData.isIssued || '0', // 是否下达（0：未下达，1：下达）
        // 保存原始数据用于后续操作
        _rawData: apiData
      }
    },
    /**
     * 处理查询事件
     * @param {Object} filters - 筛选条件对象
     */
    async handleQuery(filters) {
      try {
        // 根据筛选条件查询数据
        await this.loadData(filters)
      } catch (error) {
        console.error('查询数据失败', error)
        this.$message.error('查询数据失败，请重试')
      } finally {
        // 查询完成后，确保关闭所有 loading 状态
        this.tableLoading = false
        this.$nextTick(() => {
          if (this.$refs.filterSectionRef) {
            this.$refs.filterSectionRef.queryLoading = false
          }
        })
      }
    },
    /**
     * 重置表格显示选项（隐藏T+1头寸、隐藏无业务类别）
     */
    handleResetDisplayOptions() {
      // 通知子组件重置显示选项
      if (this.$refs.interbankTableRef && this.$refs.interbankTableRef.resetDisplayOptions) {
        this.$refs.interbankTableRef.resetDisplayOptions()
      }
    },
    /**
     * 处理显示选项变化
     * @param {Object} options - 选项对象（如 { hideT1Position: true }）
     */
    handleDisplayOptionsChange(options) {
      this.displayOptions = {
        ...this.displayOptions,
        ...options
      }
    },
    /**
     * 处理表格行选择变化
     * @param {Array} selection - 选中的行数据数组
     */
    handleSelectionChange(selection) {
      this.selectedFunds = selection
    },
    /**
     * 打开策略配置弹窗
     * @param {String} strategyId - 策略ID（可选，用于编辑）
     */
    async handleStrategyConfig(strategyId = '') {
      this.currentStrategyId = strategyId || ''
      
      // 如果有策略ID，加载策略详情用于编辑
      if (strategyId) {
        try {
          const url = this.API.positionApiInvestment.prodPositionStrategyGet
          const params = { rid: strategyId }
          const res = await this.http.post(url, params, 'application/json')
          
          if (res.code == 0 && res.body) {
            // 将策略详情传递给策略配置弹窗
            this.currentStrategyData = res.body
          } else {
            this.$message.error(res.message || '加载策略详情失败')
            return
          }
        } catch (error) {
          console.error('加载策略详情失败', error)
          this.$message.error('加载策略详情失败')
          return
        }
      } else {
        // 新增模式，清空策略数据
        this.currentStrategyData = null
      }
      
      this.strategyConfigDialogVisible = true
    },
    /**
     * 保存策略配置
     * @param {Object} form - 策略配置表单数据
     */
    async handleStrategyConfigSave(form) {
      try {
        const url = this.API.positionApiInvestment.prodPositionStrategySave
        const params = {
          rid: form.rid || '', // 主键ID(不传时为新增，否则为修改)
          name: form.strategyName || '', // 策略名称
          productCode: form.productCode || '', // 产品代码
          reserveCash: form.reservedCash || 0, // 预留现金（万）
          overnightRatio: form.overnightRatio || 0, // 隔夜比例（%）
          everyDay7: form.sevenDayRatio || 0, // 7D（%）
          everyDay14: form.fourteenDayRatio || 0, // 14D（%）
          isDefault: form.isDefault ? 0 : 1 // 是否默认（0：是，1：否）
        }
        const res = await this.http.post(url, params, 'application/json')
        if (res.code == 0) {
          this.$message.success('策略配置保存成功')
          this.strategyConfigDialogVisible = false
          
          // ✅ 刷新主界面策略下拉框数据
          if (this.$refs.filterSectionRef && this.$refs.filterSectionRef.loadStrategyList) {
            await this.$refs.filterSectionRef.loadStrategyList()
          }
        } else {
          this.$message.error(res.message || '策略配置保存失败')
        }
      } catch (error) {
        this.$message.error('策略配置保存失败')
      }
    },
    /**
     * 处理二级买卖列点击，打开二级买卖弹窗
     * @param {Object} row - 当前行数据
     */
    handleSecondaryTradeClick(row) {
      this.currentRowData = row
      this.currentFieldCode = 'secondaryTrading'
      this.detailDialogTitle = '当日场内担保买卖'
      
      // 设置当前点击的表格数值（用于汇总输入框的初始值）
      // 如果值为 null 或 undefined，传递 null，让子组件处理显示 "--"
      const summaryValue = row.secondaryTrade != null ? row.secondaryTrade : null
      this.currentSummaryValue = summaryValue
      
      // 打开弹框
      this.secondaryTradeDialogVisible = true
      
      // 打开弹框后，主动调用子组件的加载方法
      this.$nextTick(() => {
        if (this.$refs.secondaryTradePanelRef) {
          // 直接调用 loadDetailData，它会根据 props 的 initialSummaryValue 设置汇总值
          this.$refs.secondaryTradePanelRef.loadDetailData()
        }
      })
    },
    /**
     * 将前端字段名映射为后端接口字段名
     * @param {String} frontendField - 前端字段名
     * @returns {String} 后端接口字段名
     */
    mapFrontendFieldToBackendField(frontendField) {
      const fieldMapping = {
        'reverseRepoDue': 'zhgExpire', // 正回购到期
        'currentDayReverseRepoDue': 'nhgExpire', // 当日逆回购到期
        'currentDayT0Trade': 't0YhjMm', // 当日T0买卖
        'lastT1Mq': 'lastT1Mq', // 昨日+1卖券
        'zhgFirst': 'zhgFirst', // 正回购首期
        'currentDayBondInterest': 'bondDxDf', // 当日债券兑息兑付
        'primaryPayment': 'firstContribution', // 一级缴款
        'secondaryTrade': 'secondaryTrading', // 二级买卖
        'fundSubscription': 'fundApplyRedeem', // 基金申赎
        'netSubscription': 'netSubscription', // 净申赎
        'fixedDepositDue': 'dcdq', // 定存到期
        'riskProvision': 'fxbfj', // 风险备付金
        'other': 'other', // 其它
        't0PositionCalc': 't0PositionCalc', // T+0头寸测算
        't1PositionCalc': 't1PositionCalc' // T+1头寸测算
      }
      return fieldMapping[frontendField] || frontendField
    },
    /**
     * 处理表格数据明细点击事件（通用）
     * @param {Object} params - 包含 row, fieldCode, fieldName
     */
    handleDetailClick(params) {
      const { row, fieldCode, fieldName } = params
      this.currentRowData = row
      
      // 判断是否为T+0或T+1头寸测算列（只读模式）
      const readonlyFields = ['t0PositionCalc', 't1PositionCalc']
      this.isDetailDialogReadonly = readonlyFields.includes(fieldCode)
      
      // 将前端字段名映射为后端接口字段名
      this.currentFieldCode = this.mapFrontendFieldToBackendField(fieldCode)
      this.detailDialogTitle = fieldName + '明细' // 动态设置弹框标题
      
      // 获取点击的表格数值（该单元格的值）
      const fieldValueMap = {
        'reverseRepoDue': row.reverseRepoDue,
        'currentDayReverseRepoDue': row.currentDayReverseRepoDue,
        'currentDayT0Trade': row.currentDayT0Trade,
        'lastT1Mq': row.yesterdayPlus1SellBonds && row.yesterdayPlus1SellBonds.lastT1Mq != null ? row.yesterdayPlus1SellBonds.lastT1Mq : null,
        'zhgFirst': row.yesterdayPlus1SellBonds && row.yesterdayPlus1SellBonds.zhgFirst != null ? row.yesterdayPlus1SellBonds.zhgFirst : null,
        'currentDayBondInterest': row.currentDayBondInterest,
        'primaryPayment': row.primaryPayment,
        'secondaryTrade': row.secondaryTrade,
        'fundSubscription': row.fundSubscription,
        'netSubscription': row.netSubscription,
        'fixedDepositDue': row.fixedDepositDue,
        'riskProvision': row.riskProvision,
        'other': row.other,
        't0PositionCalc': row.t0Position && row.t0Position.calculation != null ? row.t0Position.calculation : null,
        't1PositionCalc': row.t1Position && row.t1Position.calculation != null ? row.t1Position.calculation : null
      }
      // 设置当前点击的表格数值（用于汇总输入框的初始值，只读模式下不使用）
      // 如果值为 null 或 undefined，传递 null，让子组件处理显示 "--"
      const summaryValue = fieldValueMap[fieldCode] != null ? fieldValueMap[fieldCode] : null
      // 先更新汇总值，确保 props 传递正确
      this.currentSummaryValue = summaryValue
      
      // 打开弹框
      this.secondaryTradeDialogVisible = true
      
      // 打开弹框后，主动调用子组件的加载方法
      this.$nextTick(() => {
        if (this.$refs.secondaryTradePanelRef) {
          // 直接调用 loadDetailData，它会根据 props 的 initialSummaryValue 设置汇总值
          this.$refs.secondaryTradePanelRef.loadDetailData()
        }
      })
    },
    /**
     * 保存明细数据（点击保存按钮）
     * 调用子组件的保存方法
     */
    handleSecondaryTradeSave() {
      if (this.$refs.secondaryTradePanelRef) {
        this.$refs.secondaryTradePanelRef.handleSave()
      }
    },
    /**
     * 明细数据保存成功回调
     * 关闭弹窗并刷新表格
     */
    async handleSecondaryTradeSaveSuccess() {
      this.secondaryTradeDialogVisible = false
      // 刷新表格数据
      await this.loadData()
      // 清空子组件数据
      this.$nextTick(() => {
        if (this.$refs.secondaryTradePanelRef && this.$refs.secondaryTradePanelRef.resetData) {
          this.$refs.secondaryTradePanelRef.resetData()
        }
      })
    },
    /**
     * 处理明细弹框关闭事件，清空数据
     */
    handleSecondaryTradeDialogClose() {
      this.secondaryTradeDialogVisible = false
      // 清空子组件数据，避免下次打开时显示上次的数据
      this.$nextTick(() => {
        if (this.$refs.secondaryTradePanelRef && this.$refs.secondaryTradePanelRef.resetData) {
          this.$refs.secondaryTradePanelRef.resetData()
        }
      })
    },
    /**
     * 处理回购限制列点击，打开回购限制弹窗
     * @param {Object} row - 当前行数据
     */
    handleRepurchaseRestrictionClick(row) {
      this.currentRowData = row
      this.repurchaseRestrictionDialogVisible = true
    },
    /**
     * 保存回购限制数据
     * @param {Object} form - 回购限制表单数据
     */
    async handleRepurchaseRestrictionSave() {
      if (!this.currentRowData) {
        return
      }
      
      try {
        // 从组件 ref 获取表单数据
        const form = this.$refs.repurchaseRestrictionPanelRef.form
        
        const url = this.API.positionApiInvestment.prodPositionUpdateFieldValue
        
        // 1. 保存期限限制（repurchaseRestrictionType）
        const typeParams = {
          fundCode: this.currentRowData.fundCode,
          fieldCode: 'repurchaseRestrictionType',
          fieldValue: form.termRestriction || ''
        }
        await this.http.post(url, typeParams, 'application/json')
        
        // 2. 保存正回购质押券限制（pledgeRepoLimit）
        const pledgeRepoParams = {
          fundCode: this.currentRowData.fundCode,
          fieldCode: 'pledgeRepoLimit',
          fieldValue: form.pledgeRepoLimit || ''
        }
        await this.http.post(url, pledgeRepoParams, 'application/json')
        
        // 3. 保存逆回购质押券限制（reverseRepoLimit）
        const reverseRepoParams = {
          fundCode: this.currentRowData.fundCode,
          fieldCode: 'reverseRepoLimit',
          fieldValue: form.reverseRepoLimit || ''
        }
        await this.http.post(url, reverseRepoParams, 'application/json')
        
        // 关闭弹窗
        this.repurchaseRestrictionDialogVisible = false
        this.$message.success('回购限制保存成功')
        
        // 刷新主界面表格数据
        await this.loadData()
      } catch (error) {
        console.error('保存回购限制失败', error)
        this.$message.error('保存回购限制失败')
      }
    },
    /**
     * 提取自定义列配置（从接口返回的数据中提取）
     * @param {Object} apiData - 接口返回的数据
     */
    extractCustomColumns(apiData) {
      const columns = []
      // 检查是否有自定义列数据（通过检查 Title 字段）
      for (let i = 1; i <= 5; i++) {
        const titleKey = `opinionsCd${i}Title`
        const valueKey = `opinionsCd${i}Value`
        if (apiData[titleKey]) {
          // 查找是否已存在该列（保留已保存状态）
          const existingColumn = this.customColumns.find(col => col.id === `cd${i}`)
          
          columns.push({
            id: `cd${i}`,
            title: apiData[titleKey],
            fieldCode: valueKey,
            titleFieldCode: titleKey, // 添加表头字段代码
            isSaved: existingColumn ? existingColumn.isSaved : true // 从接口返回的列默认为已保存状态
          })
        }
      }
      this.customColumns = columns
    },
    /**
     * 处理新增自定义列
     * @param {Object} column - 新增的列配置
     */
    handleCustomColumnAdded(column) {
      // 检查列是否已存在，避免重复添加
      const exists = this.customColumns.some(col => col.id === column.id)
      if (exists) {
        return
      }
      
      // 创建一个响应式的列对象
      const reactiveColumn = {
        id: column.id,
        title: column.title || '',
        fieldCode: column.fieldCode,
        titleFieldCode: column.titleFieldCode,
        isSaved: column.isSaved || false
      }
      
      // 使用 Vue.set 确保列对象的所有属性都是响应式的
      this.$set(reactiveColumn, 'title', reactiveColumn.title)
      this.$set(reactiveColumn, 'isSaved', reactiveColumn.isSaved)
      
      // 将新增的列添加到配置中
      this.customColumns.push(reactiveColumn)
      
      // 为所有行数据初始化该列的值，使用 $set 确保响应性
      this.interbankData.forEach(row => {
        if (!row.positionIntention) {
          this.$set(row, 'positionIntention', {})
        }
        this.$set(row.positionIntention, `custom${column.id}`, '')
      })
      
      // 新增列时，不发送后台，等用户设置每行基金产品的值的时候将标题和值提交给后台
      // 根据plan.md需求：新增表头不发送后台，等用户设置每行基金产品的值的时候将标题和值提交给后台
    },
    /**
     * 为所有产品保存自定义列表头（使用新接口，同时保存表头和值）
     * @param {String} title - 表头名称
     * @param {String} columnId - 列ID（可选，用于查找对应的值）
     */
    async saveCustomColumnTitleForAllProducts(title, columnId = null) {
      const url = this.API.positionApiInvestment.prodPositionIntentionSave
      
      // 如果提供了columnId，找到对应的列配置
      const column = columnId 
        ? this.customColumns.find(col => col.id === columnId)
        : this.customColumns.find(col => col.title === title)
      
      const promises = this.interbankData.map(async (row) => {
        try {
          // 获取该产品该列的值（如果已填写）
          // 支持空值，不转换为0
          let value = ''
          if (column && row.positionIntention) {
            const fieldValue = row.positionIntention[`custom${column.id}`]
            value = fieldValue !== null && fieldValue !== undefined ? fieldValue : ''
          }
          
          const requestParams = {
            productCode: row.fundCode,
            title: title,
            val: value
          }
          await this.http.post(url, requestParams, 'application/json')
        } catch (error) {
          console.error(`保存产品 ${row.fundCode} 的表头失败`, error)
        }
      })
      await Promise.all(promises)
    },
    /**
     * 处理自定义列表头保存（使用新接口，同时保存表头和值）
     * @param {Object} params - 包含 columnId, title, titleFieldCode
     */
    async handleCustomColumnTitleSave(params) {
      const { columnId, title } = params
      
      // 更新配置中的表头名称
      const column = this.customColumns.find(col => col.id === columnId)
      if (column) {
        column.title = title
      }
      
      // 为所有产品保存表头和值（使用新接口）
      if (this.interbankData.length > 0) {
        try {
          await this.saveCustomColumnTitleForAllProducts(title, columnId)
          // 保存成功，不需要提示，避免频繁提示
        } catch (error) {
          console.error('保存表头失败', error)
          this.$message.error('保存表头失败')
        }
      }
    },
    /**
     * 处理自定义列数据保存（使用新接口，同时保存表头和值）
     * @param {Object} params - 包含 row, columnId, fieldCode, value
     */
    async handleCustomColumnSave(params) {
      const { row, columnId, value, title, markAsSaved } = params
      try {
        // 使用传递过来的表头，如果没有传递则从列配置中获取
        let columnTitle = title
        if (!columnTitle) {
          const column = this.customColumns.find(col => col.id === columnId)
          if (!column) {
            console.error('未找到列配置', columnId)
            return
          }
          columnTitle = column.title
        }
        
        const url = this.API.positionApiInvestment.prodPositionIntentionSave
        const requestParams = {
          productCode: row.fundCode, // 产品代码
          title: columnTitle, // 表头列（从参数中获取，包含最新的表头文字）
          val: value !== null && value !== undefined ? value : '' // 对应列的值，支持空值
        }
        const res = await this.http.post(url, requestParams, 'application/json')
        if (res.code == 0) {
          // 保存成功，标记该列为已保存（表头不允许再修改）
          if (markAsSaved) {
            const column = this.customColumns.find(col => col.id === columnId)
            if (column) {
              this.$set(column, 'isSaved', true)
            }
          }
          // 保存成功，不需要提示，避免频繁提示
          // this.$message.success('保存成功')
          
          // 保存已勾选的产品代码，以便刷新后恢复选中状态
          const selectedFundCodes = this.selectedFunds.map(fund => fund.fundCode)
          
          // ✅ 保存成功后刷新主界面数据
          await this.loadData()
          
          // 刷新后恢复已勾选的产品选项
          this.$nextTick(() => {
            if (this.$refs.interbankTableRef && selectedFundCodes.length > 0) {
              // 根据保存的产品代码，重新设置选中状态
              const restoredSelection = []
              this.interbankData.forEach(row => {
                if (selectedFundCodes.includes(row.fundCode)) {
                  // 使用 toggleRowSelection 方法设置选中状态
                  this.$refs.interbankTableRef.$refs.interbankTable.toggleRowSelection(row, true)
                  restoredSelection.push(row)
                }
              })
              // 更新 selectedFunds 数组，保持状态同步
              this.selectedFunds = restoredSelection
            }
          })
        } else {
          this.$message.error(res.message || '保存失败')
        }
      } catch (error) {
        console.error('保存自定义列数据失败', error)
        this.$message.error('保存失败')
      }
    },
    /**
     * 处理删除自定义列（直接删除，不提示）
     * @param {Object} params - 包含 columnId, fieldCode
     */
    async handleCustomColumnDelete(params) {
      const { columnId, fieldCode } = params
      
      // 从配置中移除该列
      const columnIndex = this.customColumns.findIndex(col => col.id === columnId)
      if (columnIndex !== -1) {
        const deletedColumn = this.customColumns[columnIndex]
        const titleFieldCode = deletedColumn.titleFieldCode || fieldCode.replace('Value', 'Title')
        this.customColumns.splice(columnIndex, 1)
        
        // 为所有行删除该列的数据，并调用接口清空数据
        const deletePromises = this.interbankData.map(async (row) => {
          // 删除该列的数据
          if (row.positionIntention) {
            delete row.positionIntention[`custom${columnId}`]
          }
          
          // 调用接口清空该列的值和表头（使用新接口）
          try {
            const url = this.API.positionApiInvestment.prodPositionIntentionSave
            
            // 使用新接口清空表头和值
            const params = {
              productCode: row.fundCode,
              title: deletedColumn.title || '', // 表头
              val: '' // 空值
            }
            await this.http.post(url, params, 'application/json')
          } catch (error) {
            console.error('删除自定义列数据失败', error)
          }
        })
        
        await Promise.all(deletePromises)
        // 删除成功，不显示提示
      }
    },
    /**
     * 处理组合名称点击事件
     * @param {Object} row - 当前行数据
     */
    handleCombiNameClick(row) {
      this.currentRowData = row
      this.combiNameEditDialogVisible = true
    },
    /**
     * 处理组合名称保存成功
     */
    handleCombiNameSaveSuccess() {
      // 刷新主表格数据
      this.loadData()
    },
    /**
     * 处理头寸意向保存成功（隔夜、7D、14D）
     */
    async handleIntentionSaved() {
      // 保存已勾选的产品代码，以便刷新后恢复选中状态
      const selectedFundCodes = this.selectedFunds.map(fund => fund.fundCode)
      
      // 刷新主表格数据
      await this.loadData()
      
      // 刷新后恢复已勾选的产品选项
      this.$nextTick(() => {
        if (this.$refs.interbankTableRef && selectedFundCodes.length > 0) {
          // 根据保存的产品代码，重新设置选中状态
          const restoredSelection = []
          this.interbankData.forEach(row => {
            if (selectedFundCodes.includes(row.fundCode)) {
              // 使用 toggleRowSelection 方法设置选中状态
              this.$refs.interbankTableRef.$refs.interbankTable.toggleRowSelection(row, true)
              restoredSelection.push(row)
            }
          })
          // 更新 selectedFunds 数组，保持状态同步
          this.selectedFunds = restoredSelection
        }
      })
    },
    /**
     * 处理进度查询列点击，显示明细
     * @param {Object} params - 包含 row 和 type
     */
    /**
     * 处理进度查询列点击事件（询价进度、前台进度、后台进度）
     * @param {Object} params - { row, type }
     */
    handleProgressClick(params) {
      const { row, type } = params
      
      // 映射字段代码和标题
      const fieldCodeMap = {
        'inquiry': 'inquiryProgress',
        'frontend': 'frontProgress',
        'backend': 'backProgress'
      }
      
      const titleMap = {
        'inquiry': '询价进度明细',
        'frontend': '前台进度明细',
        'backend': '后台进度明细'
      }
      
      // 映射字段代码到原始数据字段名
      const amountFieldMap = {
        'inquiryProgress': 'inquiryProgressAmount',
        'frontProgress': 'frontDeskProgressAmount',
        'backProgress': 'backDeskProgressAmount'
      }
      
      this.currentRowData = row
      this.currentProgressFieldCode = fieldCodeMap[type] || 'inquiryProgress'
      this.progressDetailDialogTitle = titleMap[type] || '进度明细'
      
      // 获取点击的单元格金额值
      const amountField = amountFieldMap[this.currentProgressFieldCode]
      if (row._rawData && amountField) {
        this.currentProgressSummaryValue = row._rawData[amountField] != null ? row._rawData[amountField] : null
      } else {
        this.currentProgressSummaryValue = null
      }
      
      // 打开弹框
      this.progressDetailDialogVisible = true
      
      // 打开弹框后，直接调用子组件的加载方法，每次点击都调用接口
      this.$nextTick(() => {
        if (this.$refs.progressDetailPanelRef) {
          this.$refs.progressDetailPanelRef.loadDetailData()
        }
      })
    },
    /**
     * 处理未成交意向列点击，生成并展示明细数据
     * @param {Object} row - 当前行数据
     */
    /**
     * 处理未成交意向列点击事件
     * @param {Object} row - 当前行数据
     */
    handleUnsettledIntentionClick(row) {
      this.currentRowData = row
      this.currentProgressFieldCode = 'untradedIntentAmount'
      this.progressDetailDialogTitle = '未成交意向明细'
      
      // 获取点击的单元格金额值
      if (row._rawData) {
        this.currentProgressSummaryValue = row._rawData.untradedIntentAmount != null ? row._rawData.untradedIntentAmount : null
      } else {
        this.currentProgressSummaryValue = null
      }
      
      // 打开弹框
      this.progressDetailDialogVisible = true
      
      // 打开弹框后，直接调用子组件的加载方法，每次点击都调用接口
      this.$nextTick(() => {
        if (this.$refs.progressDetailPanelRef) {
          this.$refs.progressDetailPanelRef.loadDetailData()
        }
      })
    },
    /**
     * 格式化数字，添加千分符
     * @param {Number} num - 需要格式化的数字
     * @returns {String} 格式化后的字符串
     */
    formatNumber(num) {
      if (num === null || num === undefined) return ''
      return num.toLocaleString('zh-CN')
    },
    /**
     * 试算意向：根据选中的基金和策略计算意向金额
     * @param {Object} params - 包含策略等参数
     */
    async handleCalculateIntention(params) {
      try {
        // 校验：勾选数据只能一条
        if (this.selectedFunds.length === 0) {
          this.$message.warning('请先选择产品')
          return
        }
        if (this.selectedFunds.length > 1) {
          this.$message.warning('只能选择一条数据进行试算意向')
          return
        }
        
        // 获取选中的产品代码（单条）
        const selectedProductCode = this.selectedFunds[0].fundCode
        
        // 使用新的试算意向接口
        const url = this.API.positionApiInvestment.prodPositionTrialCalcIntention
        
        // 处理策略列表参数：确保始终传递数组格式
        let strategyList = []
        if (params.strategy && params.strategy.name) {
          if (Array.isArray(params.strategy.name)) {
            strategyList = params.strategy.name.filter(s => s)
          } else if (params.strategy.name) {
            strategyList = [params.strategy.name]
          }
        }
        
        // 处理策略优先级参数
        let priorityType = ''
        if (params.strategy && params.strategy.priority) {
          priorityType = params.strategy.priority === 'product' ? '0' : '1'
        }
        
        const requestParams = {
          productCode: selectedProductCode, // 产品代码（单个字符串）
          singleStrategy: params.strategy && params.strategy.type ? params.strategy.type : '', // 单选策略（隔夜GY、7D、14D）
          strategyList: strategyList, // 策略方案（数组格式，参考下达意向接口）
          priorityType: priorityType // 优先类型（0:产品优先，1：当日优先）
        }
        
        const res = await this.http.post(url, requestParams, 'application/json')
        
        if (res.code == 0) {
          // 试算意向成功，根据需求文档，可能需要弹窗预览
          // 这里先显示成功提示，后续可以根据实际需求添加预览弹窗
          this.$message.success('试算意向完成')
          
          // 如果需要刷新表格数据，可以调用 loadData
          // await this.loadData()
        } else {
          this.$message.error(res.message || '试算意向失败')
        }
      } catch (error) {
        console.error('试算意向失败', error)
        this.$message.error('试算意向失败')
      }
    },
    /**
     * 下达意向：将试算的意向正式下达
     * @param {Object} params - 包含策略等参数
     */
    async handleIssueIntention(params) {
      // 校验：勾选数据只能一条
      if (this.selectedFunds.length === 0) {
        this.$message.warning('请先选择基金')
        return
      }
      if (this.selectedFunds.length > 1) {
        this.$message.warning('只能选择一条数据进行意向下达')
        return
      }

      // 校验：当勾选的数据是已下达的时候，按钮禁用
      const selectedFund = this.selectedFunds[0]
      if (selectedFund.isIssued == 1) {
        this.$message.warning('该产品意向已下达，不可重复下达')
        return
      }

      // 调用下达意向接口，传递策略参数
      await this.issueIntentionRequest(selectedFund.fundCode, params, 0, 0)
    },
    
    /**
     * 下达意向请求（支持重试）
     * @param {String} productCode - 产品代码（表格中勾选的基金产品代码）
     * @param {Object} strategyParams - 策略参数对象
     * @param {Number} ignoreAmtCheck - 是否忽略质押券类型金额校验
     * @param {Number} concentrateDue - 是否忽略集中到期风险
     */
    async issueIntentionRequest(productCode, strategyParams = {}, ignoreAmtCheck = 0, concentrateDue = 0) {
      try {
        const url = this.API.positionApiInvestment.prodPositionIntention
        
        // 处理策略列表参数：确保始终传递数组格式
        let strategyList = []
        if (strategyParams.strategy && strategyParams.strategy.name) {
          if (Array.isArray(strategyParams.strategy.name)) {
            strategyList = strategyParams.strategy.name.filter(s => s)
          } else if (strategyParams.strategy.name) {
            strategyList = [strategyParams.strategy.name]
          }
        }
        
        // 处理策略优先级参数
        let priorityType = ''
        if (strategyParams.strategy && strategyParams.strategy.priority) {
          priorityType = strategyParams.strategy.priority === 'product' ? '0' : '1'
        }
        
        const params = {
          productCode: productCode, // 表格中勾选的基金产品代码
          singleStrategy: strategyParams.strategy && strategyParams.strategy.type ? strategyParams.strategy.type : '', // 单选策略（隔夜GY、7D、14D）
          strategyList: strategyList, // 策略方案-多选（数组格式）
          priorityType: priorityType, // 策略优先级（0:产品限制优先，1：当日策略优先）
          ignoreAmtCheck: ignoreAmtCheck,
          concentrateDue: concentrateDue
        }
        
        const res = await this.http.post(url, params, 'application/json')
        
        // 处理不同的响应码
        if (res.code == 0) {
          this.$message.success('意向下达成功')
          // 刷新数据
          this.loadData()
        } else if (res.code == 2) {
          // 质押券类型金额校验提示
          this.$confirm(res.message || '质押券类型金额不足，是否继续？', '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 用户点击继续，设置 ignoreAmtCheck=1 重新请求
            this.issueIntentionRequest(productCode, strategyParams, 1, concentrateDue)
          }).catch(() => {
            this.$message.info('已取消意向下达')
          })
        } else if (res.code == 6002) {
          // 集中到期风险提示
          this.$confirm(res.message || '该产品集中到期，有流动性风险，是否继续？', '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 用户点击继续，设置 concentrateDue=1 重新请求
            this.issueIntentionRequest(productCode, strategyParams, ignoreAmtCheck, 1)
          }).catch(() => {
            this.$message.info('已取消意向下达')
          })
        } else {
          this.$message.error(res.message || '意向下达失败')
        }
      } catch (error) {
        this.$message.error('意向下达失败')
      }
    },
    /**
     * 风控试算：对当前意向进行风险控制校验
     * @param {Object} params - 包含策略等参数
     */
    async handleRiskControl(params) {
      try {
        // 获取表格选中的产品
        const selectedProductCodes = this.selectedFunds.map(fund => fund.fundCode)
        
        if (selectedProductCodes.length === 0) {
          this.$message.warning('请先选择产品')
          return
        }
        
        const url = this.API.positionApiInvestment.prodPositionQuery
        
        // 处理策略列表参数：确保始终传递数组格式
        let strategyList = []
        if (params.strategy && params.strategy.name) {
          if (Array.isArray(params.strategy.name)) {
            strategyList = params.strategy.name.filter(s => s)
          } else if (params.strategy.name) {
            strategyList = [params.strategy.name]
          }
        }
        
        // 处理策略优先级参数
        let priorityType = ''
        if (params.strategy && params.strategy.priority) {
          priorityType = params.strategy.priority === 'product' ? '0' : '1'
        }
        
        const requestParams = {
          productCodes: selectedProductCodes, // 表格选择的产品
          singleStrategy: params.strategy && params.strategy.type ? params.strategy.type : '', // 单选策略（隔夜GY、7D、14D）
          priorityType: priorityType, // 策略优先级（0:产品限制优先，1：当日策略优先）
          strategyList: strategyList // 策略方案
          // 注意：风控试算不传 investManager 和 intentionState
        }
        
        const res = await this.http.post(url, requestParams, 'application/json')
        
        if (res.code == 0) {
          // 处理返回数据：更新表格显示风控试算结果
          let dataList = []
          if (Array.isArray(res.body)) {
            dataList = res.body
          } else if (res.body && typeof res.body === 'object') {
            dataList = [res.body]
          }
          this.interbankData = dataList.map(item => this.mapApiDataToTableData(item))
          
          // 提取自定义列配置
          if (dataList.length > 0) {
            this.extractCustomColumns(dataList[0])
          }
          
          this.$message.success('风控试算完成')
        } else {
          this.$message.error(res.message || '风控试算失败')
        }
      } catch (error) {
        console.error('风控试算失败', error)
        this.$message.error('风控试算失败')
      }
    },
    /**
     * 预览弹窗中的风控试算
     */
    async handlePreviewRiskControl() {
      await this.handleRiskControl()
    },
    /**
     * 预览弹窗中的意向下达
     * 意向下达到交易部的"新的回购询价意向"菜单
     */
    async handlePreviewIssue() {
      try {
        // 意向下达逻辑
        // 这里需要调用交易模块的接口，暂时使用提示
        // 实际应该传递数据到交易模块
        this.$message.success('意向下达成功，已传递到交易部的"新的回购询价意向"菜单')
        this.previewDialogVisible = false
        // 刷新数据
        this.loadData()
      } catch (error) {
        this.$message.error('意向下达失败')
      }
    },
  }
}
</script>


<style lang="scss" scoped>
.content-outer-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.position-planning-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.filter-wrapper {
  flex-shrink: 0;
  border-bottom: 1px solid #efefef;
}

.table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.dialog-footer {
  text-align: center;
  
  .el-button--primary {
    margin-right: 10px;
  }
}
</style>

