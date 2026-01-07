<template>
  <div class="interbank-table">
    <!-- 表格上方操作按钮 -->
    <div class="table-toolbar">
      <div class="toolbar-left">
        <el-checkbox 
          :value="hideT1Position"
          @change="handleDisplayOptionChange('hideT1Position', $event)"
          size="mini"
        >
          隐藏T+1头寸
        </el-checkbox>
        <el-checkbox 
          :value="hideNoBusinessCategory"
          @change="handleDisplayOptionChange('hideNoBusinessCategory', $event)"
          size="mini"
        >
          隐藏无业务类别
        </el-checkbox>
      </div>
    </div>
    <el-table
      ref="interbankTable"
      :key="tableKey"
      :data="tableData"
      v-loading="tableLoading"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      border
      style="width: 100%"
      height="100%"
      @selection-change="handleSelectionChange"
      :row-key="row => row.fundCode"
      :header-cell-style="{ height: '40px' }"
      :row-style="{ height: '32px' }"
    >
      <el-table-column type="selection" width="60" align="center" fixed="left" />
      <el-table-column prop="fundCode" label="基金代码" width="100" align="left" fixed="left" />
      <el-table-column prop="fundName" label="基金简称" width="180" align="left" show-overflow-tooltip fixed="left" />
      <el-table-column 
        v-if="shouldShowColumn('reverseRepoDue')"
        prop="reverseRepoDue" 
        label="正回购到期" 
        width="150" 
        align="right"
      >
        <template slot-scope="scope">
          <span class="clickable" @click="handleDetailClick(scope.row, 'reverseRepoDue', '正回购到期')">
            {{ formatNumber(scope.row.reverseRepoDue) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="银行间当日交收" align="center">
        <el-table-column 
          v-if="shouldShowColumn('currentDayReverseRepoDue')"
          prop="currentDayReverseRepoDue" 
          label="当日逆回购到期" 
          width="150" 
          align="right"
        >
          <template slot-scope="scope">
            <span class="clickable" @click="handleDetailClick(scope.row, 'currentDayReverseRepoDue', '当日逆回购到期')">
              {{ formatNumber(scope.row.currentDayReverseRepoDue) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column 
          v-if="shouldShowColumn('currentDayT0Trade')"
          prop="currentDayT0Trade" 
          label="当日T0买卖" 
          width="150" 
          align="right"
        >
          <template slot-scope="scope">
            <span class="clickable" @click="handleDetailClick(scope.row, 'currentDayT0Trade', '当日T0买卖')">
              {{ formatNumber(scope.row.currentDayT0Trade) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column 
          v-if="shouldShowColumn('yesterdayPlus1SellBonds')"
          prop="yesterdayPlus1SellBonds" 
          label="昨日+1卖券/回购首期" 
          width="240" 
          align="right"
        >
          <template slot-scope="scope">
            <span 
              class="clickable" 
              @click="handleDetailClick(scope.row, 'lastT1Mq', '昨日+1卖券')"
            >
              {{ formatNumber(scope.row.yesterdayPlus1SellBonds.lastT1Mq) }}
            </span>
            <span class="separator"> / </span>
            <span 
              class="clickable" 
              @click="handleDetailClick(scope.row, 'zhgFirst', '回购首期')"
            >
              {{ formatNumber(scope.row.yesterdayPlus1SellBonds.zhgFirst) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column 
          v-if="shouldShowColumn('currentDayBondInterest')"
          prop="currentDayBondInterest" 
          label="当日债券兑息兑付" 
          width="150" 
          align="right"
        >
          <template slot-scope="scope">
            <span class="clickable" @click="handleDetailClick(scope.row, 'currentDayBondInterest', '当日债券兑息兑付')">
              {{ formatNumber(scope.row.currentDayBondInterest) }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column 
        v-if="shouldShowColumn('primaryPayment')"
        prop="primaryPayment" 
        label="一级缴款" 
        width="120" 
        align="right"
      >
        <template slot-scope="scope">
          <span class="clickable" @click="handleDetailClick(scope.row, 'primaryPayment', '一级缴款')">
            {{ formatNumber(scope.row.primaryPayment) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column 
        v-if="shouldShowColumn('secondaryTrade')"
        prop="secondaryTrade" 
        label="当日场内担保买卖" 
        width="120" 
        align="right"
      >
        <template slot-scope="scope">
          <span class="clickable" @click="handleSecondaryTradeClick(scope.row)">
            {{ formatNumber(scope.row.secondaryTrade) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column 
        v-if="shouldShowColumn('fundSubscription')"
        prop="fundSubscription" 
        label="基金申赎" 
        width="120" 
        align="right"
      >
        <template slot-scope="scope">
          <span class="clickable" @click="handleDetailClick(scope.row, 'fundSubscription', '基金申赎')">
            {{ formatNumber(scope.row.fundSubscription) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column 
        v-if="shouldShowColumn('netSubscription')"
        prop="netSubscription" 
        label="净申赎" 
        width="120" 
        align="right"
      >
        <template slot-scope="scope">
          <span class="clickable" @click="handleDetailClick(scope.row, 'netSubscription', '净申赎')">
            {{ formatNumber(scope.row.netSubscription) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column 
        v-if="shouldShowColumn('fixedDepositDue')"
        prop="fixedDepositDue" 
        label="定存到期" 
        width="120" 
        align="right"
      >
        <template slot-scope="scope">
          <span class="clickable" @click="handleDetailClick(scope.row, 'fixedDepositDue', '定存到期')">
            {{ formatNumber(scope.row.fixedDepositDue) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column 
        v-if="shouldShowColumn('riskProvision')"
        prop="riskProvision" 
        label="风险备付金" 
        width="120" 
        align="right"
      >
        <template slot-scope="scope">
          <span class="clickable" @click="handleDetailClick(scope.row, 'riskProvision', '风险备付金')">
            {{ formatNumber(scope.row.riskProvision) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column 
        v-if="shouldShowColumn('other')"
        prop="other" 
        label="其它" 
        width="120" 
        align="right"
      >
        <template slot-scope="scope">
          <span class="clickable" @click="handleDetailClick(scope.row, 'other', '其它')">
            {{ formatNumber(scope.row.other) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="T+0头寸" align="center">
        <el-table-column prop="t0Position.beginning" label="日初" width="140" align="right">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.t0Position.beginning) }}
          </template>
        </el-table-column>
        <el-table-column prop="t0Position.calculation" label="测算" width="140" align="right">
          <template slot-scope="scope">
            <span class="clickable" @click="handleDetailClick(scope.row, 't0PositionCalc', 'T+0头寸测算')">
              {{ formatNumber(scope.row.t0Position.calculation) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="t0Position.checkTable" label="头寸核查表" width="140" align="right">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.t0Position.checkTable) }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="T+1头寸" align="center" v-if="!hideT1Position">
        <el-table-column prop="t1Position.beginning" label="日初" width="140" align="right">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.t1Position.beginning) }}
          </template>
        </el-table-column>
        <el-table-column prop="t1Position.calculation" label="测算" width="140" align="right">
          <template slot-scope="scope">
            <span class="clickable" @click="handleDetailClick(scope.row, 't1PositionCalc', 'T+1头寸测算')">
              {{ formatNumber(scope.row.t1Position.calculation) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="t1Position.checkTable" label="头寸核查表" width="140" align="right">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.t1Position.checkTable) }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="repurchaseRestriction" label="回购限制" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.repurchaseRestriction" style="text-align: left;">
            <span 
              class="clickable" 
              @click="handleRepurchaseRestrictionClick(scope.row)"
            >
              {{ scope.row.repurchaseRestriction }}
            </span>
          </div>
          <div v-else style="text-align: right;">
            <i 
              class="el-icon-edit edit-icon" 
              @click="handleRepurchaseRestrictionClick(scope.row)"
              title="编辑回购限制"
            ></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="头寸意向" align="center">
        <template slot="header">
          <span>头寸意向</span>
          <i 
            v-if="customColumns.length < 5 && tableData.length > 0"
            class="el-icon-circle-plus-outline add-column-icon"
            :class="{ 'disabled': tableData.length === 0 }"
            @click="handleAddCustomColumn"
            :title="tableData.length === 0 ? '请先查询出数据后再新增列' : '新增列'"
          ></i>
        </template>
        <el-table-column prop="positionIntention.combiName" label="组合名称" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.positionIntention && scope.row.positionIntention.combiName" style="text-align: left;">
              <span 
                class="clickable" 
                @click="handleCombiNameClick(scope.row)"
                :title="scope.row.positionIntention.combiName"
              >
                {{ scope.row.positionIntention.combiName }}
              </span>
            </div>
            <div v-else style="text-align: right;">
              <i 
                class="el-icon-edit edit-icon" 
                @click="handleCombiNameClick(scope.row)"
                title="编辑组合名称"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="positionIntention.overnight" label="隔夜(亿)" width="100" align="right">
          <template slot-scope="scope">
            <el-input
              :value="scope.row.positionIntention && scope.row.positionIntention.overnight"
              size="mini"
              :class="getIntentionCellClass(scope.row, 'overnightState')"
              @input="handleIntentionInput(scope.row, 'overnight', $event)"
              @change="handleIntentionChange(scope.row, 'overnight', 'overOpinions')"
            />
          </template>
        </el-table-column>
        <el-table-column prop="positionIntention.sevenDay" label="7D(亿)" width="100" align="right">
          <template slot-scope="scope">
            <el-input
              :value="scope.row.positionIntention && scope.row.positionIntention.sevenDay"
              size="mini"
              :class="getIntentionCellClass(scope.row, 'sevenDayState')"
              @input="handleIntentionInput(scope.row, 'sevenDay', $event)"
              @change="handleIntentionChange(scope.row, 'sevenDay', 'opinions7d')"
            />
          </template>
        </el-table-column>
        <el-table-column prop="positionIntention.fourteenDay" label="14D(亿)" width="100" align="right">
          <template slot-scope="scope">
            <el-input
              :value="scope.row.positionIntention && scope.row.positionIntention.fourteenDay"
              size="mini"
              :class="getIntentionCellClass(scope.row, 'fourteenDayState')"
              @input="handleIntentionInput(scope.row, 'fourteenDay', $event)"
              @change="handleIntentionChange(scope.row, 'fourteenDay', 'opinions14d')"
            />
          </template>
        </el-table-column>
        <!-- 自定义列 -->
        <el-table-column
          v-for="(col, index) in allCustomColumns"
          :key="col.id"
          :prop="`positionIntention.custom${col.id}`"
          width="120"
          align="right"
        >
          <template slot="header">
            <input
              v-if="!col.isSaved"
              type="text"
              :value="col.title"
               @input="handleCustomColumnTitleInput(col, $event)"
              @blur="handleCustomColumnTitleBlur(col)"
              @keypress.enter="handleCustomColumnTitleBlur(col)"
              placeholder="请输入表头"
              class="custom-column-header-input-native"
            />
            <span v-else class="custom-column-header-text">{{ col.title }}</span>
          </template>
          <template slot-scope="scope">
            <el-input
              :value="scope.row.positionIntention[`custom${col.id}`]"
              size="mini"
              :class="getIntentionCellClass(scope.row, `custom${col.id}State`)"
              @input="handleCustomColumnInput(scope.row, col.id, $event)"
              @blur="handleCustomColumnBlur(scope.row, col.id, col.fieldCode)"
              @keyup.enter.native="handleCustomColumnBlur(scope.row, col.id, col.fieldCode)"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="进度查询" align="center">
        <el-table-column prop="unsettledIntention" label="未成交意向" width="150" align="center">
          <template slot-scope="scope">
            <span class="clickable" @click="handleUnsettledIntentionClick(scope.row)">
              {{ formatProgressAmount(scope.row.unsettledIntention) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="weightedCost.inquiryProgress" label="询价进度" width="150" align="center">
          <template slot-scope="scope">
            <span class="clickable" @click="handleProgressClick(scope.row, 'inquiry')">
              {{ formatProgressAmount(scope.row.weightedCost && scope.row.weightedCost.inquiryProgress) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="weightedCost.frontendProgress" label="前台进度" width="150" align="center">
          <template slot-scope="scope">
            <span class="clickable" @click="handleProgressClick(scope.row, 'frontend')">
              {{ formatProgressAmount(scope.row.weightedCost && scope.row.weightedCost.frontendProgress) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="weightedCost.backendProgress" label="后台进度" width="150" align="center">
          <template slot-scope="scope">
            <span class="clickable" @click="handleProgressClick(scope.row, 'backend')">
              {{ formatProgressAmount(scope.row.weightedCost && scope.row.weightedCost.backendProgress) }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="加权成本" align="center">
        <el-table-column prop="reverseRepo" label="正回购" width="150" align="right">
          <template slot-scope="scope">
            {{ scope.row.reverseRepo || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="repo" label="逆回购" width="150" align="right">
          <template slot-scope="scope">
            {{ scope.row.repo || 0 }}
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
/**
 * 银行间入款未交收表格组件
 * 功能：展示银行间入款数据，支持列宽拖动、列显示/隐藏、数据导出等
 */
export default {
  name: 'InterbankTable',
  props: {
    // 表格数据源
    tableData: {
      type: Array,
      default: () => []
    },
    // 表格 loading 状态（从父组件传入）
    tableLoading: {
      type: Boolean,
      default: false
    },
    // 是否隐藏T+1头寸列
    hideT1Position: {
      type: Boolean,
      default: false
    },
    // 是否隐藏无业务类别列
    hideNoBusinessCategory: {
      type: Boolean,
      default: false
    },
    // 自定义列配置（从父组件传入，用于显示已保存的自定义列）
    customColumns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableKey: 0, // 用于强制表格重新渲染
      // 防抖定时器存储对象，key 为 row.fundCode + field
      intentionDebounceTimers: {}
    }
  },
  computed: {
    // 使用父组件传入的自定义列
    allCustomColumns() {
      return this.customColumns
    }
  },
  methods: {
    /**
     * 判断是否显示该列（隐藏无业务类别功能）
     * @param {String} prop - 列的属性名
     * @returns {Boolean} 是否显示该列
     */
    shouldShowColumn(prop) {
      // 如果未勾选"隐藏无业务类别"，显示所有列
      if (!this.hideNoBusinessCategory) {
        return true
      }
      
      // 如果没有数据，显示所有列
      if (!this.tableData || this.tableData.length === 0) {
        return true
      }
      
      // 特殊处理：昨日+1卖券/正回购首期（包含两个字段）
      if (prop === 'yesterdayPlus1SellBonds') {
        return this.tableData.some((item) => {
          const lastT1Mq = item.yesterdayPlus1SellBonds && item.yesterdayPlus1SellBonds.lastT1Mq
          const zhgFirst = item.yesterdayPlus1SellBonds && item.yesterdayPlus1SellBonds.zhgFirst
          const numValue1 = Number(lastT1Mq)
          const numValue2 = Number(zhgFirst)
          return (!isNaN(numValue1) && numValue1 !== 0) || (!isNaN(numValue2) && numValue2 !== 0)
        })
      }
      
      // 检查该列是否有非0的值
      // 使用 some 方法，只要有一个值不为0，就返回 true（显示该列）
      return this.tableData.some((item) => {
        const value = item[prop]
        // 直接用原始数据判断是否不等于0
        const numValue = Number(value)
        return !isNaN(numValue) && numValue !== 0
      })
    },
    /**
     * 处理自定义列输入事件，使用 $set 确保响应性
     * @param {Object} row - 当前行数据
     * @param {String} columnId - 列ID
     * @param {String} value - 输入值
     */
    handleCustomColumnInput(row, columnId, value) {
      // 使用 Vue.set 确保响应性
      this.$set(row.positionIntention, `custom${columnId}`, value)
    },
    /**
     * 处理新增自定义列（直接新增，不需要弹窗）
     */
    handleAddCustomColumn() {
      // 检查表格是否有数据
      if (!this.tableData || this.tableData.length === 0) {
        this.$message.warning('请先查询出数据后再新增自定义列')
        return
      }
      
      // 计算下一个可用的列索引（从1到5）
      let columnIndex = 1
      const usedIndexes = this.customColumns.map(col => {
        const match = col.id.match(/cd(\d+)/)
        return match ? parseInt(match[1]) : 0
      }).filter(idx => idx > 0)
      
      // 找到第一个未使用的索引
      while (usedIndexes.includes(columnIndex) && columnIndex <= 5) {
        columnIndex++
      }
      
      if (columnIndex > 5) {
        this.$message.warning('最多只能新增5列')
        return
      }
      
      // 直接新增列，不使用默认表头名称
      const newColumn = {
        id: `cd${columnIndex}`,
        title: '', // 不设置默认表头名称，由用户填写
        fieldCode: `opinionsCd${columnIndex}Value`, // 对应接口字段
        titleFieldCode: `opinionsCd${columnIndex}Title`, // 表头字段代码
        isSaved: false // 标记为未保存，允许编辑表头
      }
      
      // 直接通知父组件新增了列（由父组件统一管理）
      this.$emit('custom-column-added', newColumn)
    },
     /**
     * 处理自定义列表头输入事件
     * @param {Object} col - 列配置对象
     * @param {Event} event - 输入事件
     */
     handleCustomColumnTitleInput(col, event) {
      // 使用 $set 确保响应性，直接更新列对象的 title 属性
      console.log(event.target.value)
      this.$set(col, 'title', event.target.value)
        // 强制更新视图（Element UI 表格 header slot 的响应式更新问题）
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    /**
     * 处理自定义列表头编辑失焦事件
     * @param {Object} col - 列配置对象
     */
    handleCustomColumnTitleBlur(col) {
      // 失焦时不需要做任何操作，v-model 已经自动更新了 col.title
      // 这里保留方法是为了未来可能需要的验证或其他逻辑
    },
    /**
     * 处理自定义列单元格失焦事件，保存数据
     * @param {Object} row - 当前行数据
     * @param {String} columnId - 列ID
     * @param {String} fieldCode - 字段代码
     */
    handleCustomColumnBlur(row, columnId, fieldCode) {
      const value = row.positionIntention[`custom${columnId}`]
      const trimmedValue = value !== null && value !== undefined ? String(value).trim() : ''
      
      // 获取当前列的表头信息
      const currentColumn = this.customColumns.find(col => col.id === columnId)
      const columnTitle = currentColumn ? currentColumn.title : ''
      const titleFieldCode = currentColumn ? currentColumn.titleFieldCode : ''
      
      // 失焦时直接保存当前行的数据（无论值是否为空）
      this.$emit('custom-column-save', {
        row,
        columnId,
        fieldCode,
        value: trimmedValue,
        title: columnTitle, // 一起传递表头
        titleFieldCode: titleFieldCode,
        markAsSaved: trimmedValue !== '' // 只有值不为空时才标记为已保存（表头不允许再修改）
      })
    },
    /**
     * 处理表格行选择变化
     * @param {Array} selection - 选中的行数据数组
     */
    handleSelectionChange(selection) {
      this.$emit('selection-change', selection)
    },
    /**
     * 处理二级买卖列点击事件
     * @param {Object} row - 当前行数据
     */
    handleSecondaryTradeClick(row) {
      this.$emit('secondary-trade-click', row)
    },
    /**
     * 处理表格数据明细点击事件
     * @param {Object} row - 当前行数据
     * @param {String} fieldCode - 字段代码
     * @param {String} fieldName - 字段名称
     */
    handleDetailClick(row, fieldCode, fieldName) {
      // 触发明细查询事件，传递行数据、字段代码和字段名称
      this.$emit('detail-click', { row, fieldCode, fieldName })
    },
    /**
     * 处理回购限制列点击事件
     * @param {Object} row - 当前行数据
     */
    handleRepurchaseRestrictionClick(row) {
      this.$emit('repurchase-restriction-click', row)
    },
    /**
     * 处理未成交意向列点击事件
     * @param {Object} row - 当前行数据
     */
    handleUnsettledIntentionClick(row) {
      this.$emit('unsettled-intention-click', row)
    },
    /**
     * 处理进度查询列点击事件
     * @param {Object} row - 当前行数据
     * @param {String} type - 进度类型：inquiry、frontend、backend
     */
    handleProgressClick(row, type) {
      this.$emit('progress-click', { row, type })
    },
    /**
     * 处理组合名称点击事件
     * @param {Object} row - 当前行数据
     */
    handleCombiNameClick(row) {
      this.$emit('combi-name-click', row)
    },
    /**
     * 获取头寸意向单元格背景色类名
     * @param {Object} row - 当前行数据
     * @param {String} stateField - 状态字段名（overnightState、sevenDayState、fourteenDayState、customcd1State等）
     * @returns {String} 类名
     */
    getIntentionCellClass(row, stateField) {
      if (!row || !row.positionIntention) {
        return ''
      }
      const state = row.positionIntention[stateField]
      // 状态码0（无）：不需要标记颜色
      if (state == 0) {
        return ''
      }
      // 状态码1（已下达意向）：标记单元格背景色为绿色
      if (state == 1) {
        return 'intention-cell-state-issued'
      }
      // 状态码2（下达意向后被修改）：标记单元格背景色为红色
      if (state == 2) {
        return 'intention-cell-state-modified'
      }
      return ''
    },
    /**
     * 处理头寸意向输入事件
     * @param {Object} row - 当前行数据
     * @param {String} field - 字段名（overnight、sevenDay、fourteenDay）
     * @param {String} value - 输入值
     */
    handleIntentionInput(row, field, value) {
      // 使用 $set 确保响应式更新
      this.$set(row.positionIntention, field, value)
      // 标记该字段已被修改
      if (!row._intentionModified) {
        this.$set(row, '_intentionModified', {})
      }
      this.$set(row._intentionModified, field, true)
    },
    /**
     * 处理头寸意向 change 事件（保存数据，带防抖）
     * @param {Object} row - 当前行数据
     * @param {String} field - 字段名（overnight、sevenDay、fourteenDay）
     * @param {String} fieldCode - 后端字段代码（overOpinions、opinions7d、opinions14d）
     */
    handleIntentionChange(row, field, fieldCode) {
      if (!row || !row.fundCode) {
        return
      }
      
      // 生成防抖定时器的唯一 key
      const timerKey = `${row.fundCode}_${field}`
      
      // 清除之前的定时器
      if (this.intentionDebounceTimers[timerKey]) {
        clearTimeout(this.intentionDebounceTimers[timerKey])
        delete this.intentionDebounceTimers[timerKey]
      }
      
      // 设置新的防抖定时器，等用户停止输入 800ms 后再保存
      this.intentionDebounceTimers[timerKey] = setTimeout(() => {
        this.saveIntentionData(row, field, fieldCode)
        // 清除定时器引用
        delete this.intentionDebounceTimers[timerKey]
      }, 800)
    },
    /**
     * 保存头寸意向数据
     * @param {Object} row - 当前行数据
     * @param {String} field - 字段名（overnight、sevenDay、fourteenDay）
     * @param {String} fieldCode - 后端字段代码（overOpinions、opinions7d、opinions14d）
     */
    async saveIntentionData(row, field, fieldCode) {
      try {
        if (!row || !row.fundCode) {
          return
        }
        
        // 检查用户是否真的修改了该字段
        const isModified = row._intentionModified && row._intentionModified[field]
        if (!isModified) {
          // 用户没有修改内容，不调用保存接口
          return
        }
        
        const fieldValue = row.positionIntention && row.positionIntention[field]
        // 获取原始值（从 _rawData 中获取）
        const originalValue = row._rawData && row._rawData[fieldCode]
        
        // 标准化值用于比较（将 null、undefined、空字符串统一处理）
        const normalizeValue = (val) => {
          if (val === null || val === undefined || val === '') {
            return ''
          }
          // 转换为字符串并去除首尾空格，用于比较
          return String(val).trim()
        }
        
        const currentValue = normalizeValue(fieldValue)
        const originalValueNormalized = normalizeValue(originalValue)
        
        // 只有当值真正改变时才保存
        if (currentValue === originalValueNormalized) {
          // 值没有改变（用户修改后又改回原值），不调用保存接口
          // 清除修改标记
          if (row._intentionModified) {
            this.$set(row._intentionModified, field, false)
          }
          return
        }
        
        // 调用保存接口
        const url = this.API.positionApiInvestment.prodPositionUpdateFieldValue
        const params = {
          fundCode: row.fundCode,
          fieldCode: fieldCode,
          fieldValue: fieldValue !== null && fieldValue !== undefined ? fieldValue : ''
        }
        
        const res = await this.http.post(url, params, 'application/json')
        
        if (res.code == 0) {
          // 保存成功，清除修改标记
          if (row._intentionModified) {
            this.$set(row._intentionModified, field, false)
          }
          // 更新原始值，以便下次比较
          if (row._rawData) {
            this.$set(row._rawData, fieldCode, fieldValue !== null && fieldValue !== undefined ? fieldValue : '')
          }
          // 保存成功，通知父组件刷新表格数据
          this.$message.success('保存成功')
          this.$emit('intention-saved')
        } else {
          this.$message.error(res.message || '保存失败')
        }
      } catch (error) {
        console.error('保存头寸意向失败：', error)
        this.$message.error('保存失败')
      }
    },
    /**
     * 处理显示选项变化
     * @param {String} key - 选项键名（hideT1Position 或 hideNoBusinessCategory）
     * @param {Boolean} value - 选项值
     */
    handleDisplayOptionChange(key, value) {
      // 先更新 tableKey 强制表格重新渲染，避免列错位闪现
      this.tableKey++
      this.$emit('display-options-change', { [key]: value })
    },
    /**
     * 重置显示选项（查询按钮点击时调用）
     */
    resetDisplayOptions() {
      // 重置隐藏T+1头寸和隐藏无业务类别
      this.tableKey++
      this.$emit('display-options-change', { 
        hideT1Position: false,
        hideNoBusinessCategory: false
      })
    },
    /**
     * 格式化数字，添加千分符
     * @param {Number|String} num - 需要格式化的数字
     * @returns {String} 格式化后的字符串
     */
    formatNumber(num) {
      if (num === null || num === undefined || num === '') return ''
      return num.toLocaleString('zh-CN')
    },
    /**
     * 格式化进度查询金额（格式：金额/笔数，对金额部分进行千分符格式化）
     * @param {String} value - 进度查询值，格式为 "金额/笔数"
     * @returns {String} 格式化后的字符串
     */
    formatProgressAmount(value) {
      if (!value || value === '-') {
        return '-'
      }
      // 如果包含斜杠，说明是 "金额/笔数" 格式
      if (value.includes('/')) {
        const parts = value.split('/')
        if (parts.length === 2) {
          const amount = parseFloat(parts[0])
          const count = parts[1]
          if (!isNaN(amount)) {
            // 对金额部分进行千分符格式化
            return `${amount.toLocaleString('zh-CN')}/${count}`
          }
        }
      }
      // 如果不包含斜杠，尝试直接格式化数字
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        return numValue.toLocaleString('zh-CN')
      }
      return value
    }
  }
}
</script>

<style lang="scss" scoped>
.interbank-table {
  background-color: #fff;
  padding: 10px;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  /deep/ .el-table {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  /deep/ .el-table__header-wrapper {
    flex-shrink: 0;
  }
  
  /deep/ .el-table__body-wrapper {
    flex: 1;
    overflow-y: auto;
  }
}

.table-toolbar {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

}

.clickable {
  color: #409eff;
  cursor: pointer;

  &:hover {
    color: #66b1ff;
  }
}

.separator {
  color: #409eff;
  margin: 0 2px;
}

.add-column-icon {
  color: #409eff;
  cursor: pointer;
  margin-left: 5px;
  font-size: 16px;
  transition: all 0.3s;

  &:hover {
    color: #66b1ff;
  }

  &.disabled {
    color: #c0c4cc;
    cursor: not-allowed;

    &:hover {
      color: #c0c4cc;
    }
  }
}

.edit-icon {
  color: #409EFF;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;

  &:hover {
    color: #ebb563;
  }
}

/deep/ .el-table {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  font-size: 12px;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  
      // 移除表格边框，使用Element UI默认样式
      &::before {
        display: none;
      }
      
      // 确保列宽拖动功能可用（Element UI默认支持，这里确保拖动区域可见）
      .el-table__header-wrapper {
        .el-table__header {
          th {
           
            // Element UI默认会在表头单元格右侧显示拖动指示器
            // 确保拖动区域可交互
            .cell {
              position: relative;
            }
          }
        }
      }
  
  .el-table__header-wrapper {
    flex-shrink: 0;
  }
  
  .el-table__header {
    th {
      background-color: #f5f7fa;
      color: #333;
      font-weight: normal;
      font-size: 12px;
      height: 40px !important;
      padding: 0 !important;

      
      .cell {
        font-family: 'Microsoft YaHei', Arial, sans-serif;
        font-size: 12px;
        color: #333;
        padding: 0 10px;
        line-height: 40px;
      }
    }
  }
  
  .el-table__body {
    tr {
      height: 32px !important;
      
      td {
        padding: 0 !important;
        height: 32px !important;
        border-right: none !important;
        border-left: none !important;
        // 保留横线（border-bottom由Element UI默认提供）
        
        .cell {
          font-family: 'Microsoft YaHei', Arial, sans-serif;
          font-size: 12px;
          color: #333;
          line-height: 32px;
          padding: 0 10px;
        }
      }
    }
    
    // 表格行子项行高28px
    .el-table__expand-icon {
      height: 28px;
      line-height: 28px;
    }
    
    .el-table__expanded-cell {
      padding: 0;
      
      .el-table {
        tr {
          height: 28px !important;
          
          td {
            height: 28px !important;
            border-right: none;
            border-left: none;
            // 保留横线（border-bottom由Element UI默认提供）
            
            .cell {
              line-height: 28px;
              padding: 0 10px;
            }
          }
        }
      }
    }
  }
  
  .el-table__body-wrapper {
    flex: 1 !important;
    overflow-y: auto !important;
  }
  
  // 移除表格外边框（但保留列之间的竖线以支持列宽拖动）
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: transparent;
  }
  
  // 隐藏表格体单元格的左右边框（保留表头边框以支持列宽拖动）
  .el-table__body td.el-table__cell {
    border-right: none !important;
  }
  
 
  
  // 最后一列不显示右边框
  .el-table__header th.el-table__cell:last-child {
    border-right: none !important;
  }
}

// 自定义列表头输入框样式（原生input，不使用/deep/）
.custom-column-header-input-native {
  width: 100%;
  text-align: center;
  padding: 0 5px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  font-size: 12px;
  color: #606266;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  
  &:focus {
    border-color: #409eff;
  }
  
  &::placeholder {
    color: #c0c4cc;
  }
}

// 自定义列表头文本样式（已保存状态）
.custom-column-header-text {
  display: inline-block;
  width: 100%;
  text-align: center;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  font-size: 12px;
  color: #333;
  line-height: 28px;
}

// 头寸意向单元格背景色样式
/deep/ .intention-cell-state-issued {
  .el-input__inner {
    background-color: #81DA54 !important;
  }
}

/deep/ .intention-cell-state-modified {
  .el-input__inner {
    background-color: #FF7C80 !important;
  }
}
</style>

