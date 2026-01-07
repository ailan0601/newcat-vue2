<template>
  <div class="progress-detail-panel">
    <!-- 汇总金额 -->
    <div class="summary-section">
      <span class="summary-label">汇总金额：</span>
      <span class="summary-value">{{ formatNumber(totalAmount) }} 元</span>
    </div>

    <!-- 明细表格 -->
    <el-table
      :data="detailData"
      v-loading="detailLoading"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      style="width: 100%"
      size="mini"
      class="detail-table"
      max-height="480"
      border
      :header-cell-style="{ height: '40px' }"
      :row-style="{ height: '32px' }"
    >
      <!-- 产品代码列：点击未成交意向、询价进度、前台进度、后台进度时不显示 -->
      <el-table-column 
        v-if="showFundCodeColumn"
        prop="fundCode" 
        label="产品代码" 
        width="120" 
        align="left"
      >
        <template slot-scope="scope">
          {{ formatEmptyValue(scope.row.fundCode) }}
        </template>
      </el-table-column>
      <!-- 头寸代码列：点击未成交意向、询价进度、前台进度、后台进度时不显示 -->
      <el-table-column 
        v-if="showPositionCodeColumn"
        prop="positionCode" 
        label="头寸代码" 
        width="120" 
        align="left"
      >
        <template slot-scope="scope">
          {{ formatEmptyValue(scope.row.positionCode) }}
        </template>
      </el-table-column>
      <el-table-column prop="securityCode" label="证券代码" width="120" align="left">
        <template slot-scope="scope">
          {{ formatEmptyValue(scope.row.securityCode) }}
        </template>
      </el-table-column>
      <el-table-column prop="securityName" label="证券名称" min-width="180" align="left" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ formatEmptyValue(scope.row.securityName) }}
        </template>
      </el-table-column>
      <el-table-column prop="businTypeName" label="业务类别" width="120" align="left">
        <template slot-scope="scope">
          {{ formatEmptyValue(scope.row.businTypeName) }}
        </template>
      </el-table-column>
      <el-table-column prop="occurBal" label="交易金额(元)" width="150" align="right">
        <template slot-scope="scope">
          {{ formatNumber(scope.row.occurBal) }}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="100" align="right">
        <template slot-scope="scope">
          {{ formatEmptyValue(scope.row.price) }}
        </template>
      </el-table-column>
      <el-table-column 
        v-if="showSettlementColumn" 
        prop="insStatus" 
        label="是否交收" 
        width="100" 
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.insStatus == 1 ? '未交收' : scope.row.insStatus == 2 ? '已交收' : '--' }}
        </template>
      </el-table-column>
      <el-table-column 
        v-if="showDealStateColumn" 
        :label="dealStateColumnLabel" 
        prop="dealstateText" 
        min-width="180" 
        align="left"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ formatEmptyValue(scope.row.dealstateText) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ProgressDetailPanel',
  props: {
    rowData: {
      type: Object,
      default: null
    },
    fieldCode: {
      type: String,
      default: ''
    },
    fieldName: {
      type: String,
      default: ''
    },
    // 初始汇总值（点击的单元格金额）
    initialSummaryValue: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      detailData: [],
      detailLoading: false
    }
  },
  computed: {
    /**
     * 计算汇总金额（直接使用父组件传递的点击单元格数据）
     */
    totalAmount() {
      // 直接使用父组件传递的 initialSummaryValue（点击的单元格数据）
      if (this.initialSummaryValue != null && this.initialSummaryValue !== '') {
        const summaryValue = parseFloat(this.initialSummaryValue)
        return isNaN(summaryValue) ? 0 : summaryValue
      }
      return 0
    },
    /**
     * 是否显示"产品代码"列
     * 点击"未成交意向、询价进度、前台进度、后台进度"时不显示
     */
    showFundCodeColumn() {
      const hideColumns = [
        'untradedIntentAmount',
        'inquiryProgress',
        'frontProgress',
        'backProgress'
      ]
      return !hideColumns.includes(this.fieldCode)
    },
    /**
     * 是否显示"头寸代码"列
     * 点击"未成交意向、询价进度、前台进度、后台进度"时不显示
     */
    showPositionCodeColumn() {
      const hideColumns = [
        'untradedIntentAmount',
        'inquiryProgress',
        'frontProgress',
        'backProgress'
      ]
      return !hideColumns.includes(this.fieldCode)
    },
    /**
     * 是否显示"是否交收"列
     * 点击"未成交意向、询价进度、前台进度、后台进度、正回购到期、当日逆回购到期、昨日+1卖券、正回购首期、当日债券兑息兑付、
     * 一级缴款、二级买卖、基金申赎、净申赎、定存到期、风险备付金、其它"时不显示
     */
    showSettlementColumn() {
      const hideColumns = [
        'untradedIntentAmount',
        'inquiryProgress',
        'frontProgress',
        'backProgress',
        'zhgExpire',
        'nhgExpire',
        'lastT1Mq',
        'zhgFirst',
        'bondDxDf',
        'firstContribution',
        'secondaryTrading',
        'fundApplyRedeem',
        'netSubscription',
        'dcdq',
        'fxbfj',
        'other'
      ]
      return !hideColumns.includes(this.fieldCode)
    },
    /**
     * 是否显示"成交状态详情"列
     * 只有询价进度、前台进度、后台进度显示
     */
    showDealStateColumn() {
      const showColumns = ['inquiryProgress', 'frontProgress', 'backProgress']
      return showColumns.includes(this.fieldCode)
    },
    /**
     * 成交状态详情列的动态标题
     */
    dealStateColumnLabel() {
      const labelMap = {
        'inquiryProgress': '询价成交状态详情',
        'frontProgress': '前台成交状态详情',
        'backProgress': '后台成交状态详情'
      }
      return labelMap[this.fieldCode] || '成交状态详情'
    }
  },
  methods: {
    /**
     * 加载明细数据
     */
    async loadDetailData() {
      if (!this.rowData || !this.fieldCode) {
        return
      }
      this.detailLoading = true
      try {
        const url = this.API.positionApiInvestment.prodPositionDetailsQuery
        const params = {
          positionCode: this.fieldCode,
          fundCode: this.rowData.fundCode
        }
        
        const res = await this.http.post(url, params, 'application/json')
        
        if (res.code == 0) {
          this.detailData = res.body || []
        } else {
          this.$message.error(res.message || '查询明细数据失败')
          this.detailData = []
        }
      } catch (error) {
        console.error('查询明细数据失败', error)
        this.$message.error('查询明细数据失败')
        this.detailData = []
      } finally {
        this.detailLoading = false
      }
    },
    /**
     * 格式化空值，将 null 或空字符串显示为 "--"
     * @param {*} value - 需要格式化的值
     * @returns {String} 格式化后的字符串
     */
    formatEmptyValue(value) {
      if (value == null || value == undefined || value === '') {
        return '--'
      }
      return value
    },
    /**
     * 格式化数字（千分符）
     */
    formatNumber(num) {
      if (num == null || num == undefined || num == '') return '--'
      const numValue = Number(num)
      if (isNaN(numValue)) return '--'
      return numValue.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-detail-panel {
  .summary-section {
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 14px;

    .summary-label {
      font-weight: bold;
      color: #333;
    }

    .summary-value {
      color: #409EFF;
      font-weight: bold;
      font-size: 16px;
      margin-left: 10px;
    }
  }

  .detail-table {
    // 去掉表格外边框，但保留 border 属性以支持列宽调整
   /deep/ .el-table {
      border: none;
    }
    
    // 表头样式：显示网格线（横线和竖线）
   /deep/ .el-table__header th {
      background-color: #f5f7fa;
      color: #333;
      font-weight: bold;
      font-size: 12px;
      font-family: 'Microsoft YaHei', Arial, sans-serif;
      height: 40px;
      // 表头显示竖线和横线（网格线）
      border-right: 1px solid #EBEEF5 !important;
      border-bottom: 1px solid #EBEEF5 !important;
    }
    
    // 最后一列不需要右边框
   /deep/ .el-table__header th:last-child {
      border-right: none !important;
    }
    
    // 表格行高和横线：隐藏竖线
   /deep/ .el-table__body tr {
      height: 32px;
      border-bottom: 1px solid #EBEEF5;
    }
    
   /deep/ .el-table__body tr:last-child {
      border-bottom: none;
    }
    
   /deep/ .el-table__body td {
      height: 32px;
      // 隐藏竖线
      border-right: none !important;
    }
    
    // 去掉表格外边框
   /deep/ .el-table::before {
      display: none;
    }
  }
}
</style>

