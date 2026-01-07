<template>
  <div class="secondary-trade-panel">
    <el-form :model="form" label-width="0" size="mini">
      <el-form-item v-if="!readonly" class="summary-form-item">
        <label class="summary-label">汇总</label>
        <el-input 
          v-model="form.summary" 
          size="mini" 
          placeholder="请输入" 
          :disabled="hasNewRows"
          @blur="handleSummaryBlur" 
        />
      </el-form-item>
      <el-form-item class="table-form-item">
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
        >
          <el-table-column prop="securityCode" label="证券代码" width="140">
            <template slot-scope="scope">
              <el-input 
                v-if="scope.row.isNew"
                v-model="scope.row.securityCode" 
                size="mini" 
                :disabled="true"
                placeholder="选择证券名称后自动填充"
              />
              <span v-else>{{ formatEmptyValue(scope.row.securityCode) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="securityName" label="证券名称" min-width="150">
            <template slot-scope="scope">
              <el-select
                v-if="scope.row.isNew"
                v-model="scope.row.securityName"
                filterable
                remote
                reserve-keyword
                placeholder="请输入证券名称/代码"
                :remote-method="handleSearchStock"
                :loading="stockSearchLoading"
                size="mini"
                @change="handleStockChange(scope.$index, scope.row)"
                style="width: 100%"
              >
                <el-option
                  v-for="item in stockOptions"
                  :key="item.securityCode"
                  :label="item.securityName"
                  :value="item.securityName"
                >
                  <span>{{ item.securityName }}</span>
                  <span style="color: #8492a6; font-size: 13px; margin-left: 10px;">{{ item.securityCode }}</span>
                </el-option>
              </el-select>
              <span v-else>{{ formatEmptyValue(scope.row.securityName) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="businessCategory" label="业务类别" width="140">
            <template slot-scope="scope">
              <el-select
                v-if="scope.row.isNew"
                v-model="scope.row.businessCategory"
                size="mini"
                placeholder="请选择业务类别"
                filterable
                clearable
                :loading="businTypeLoading"
                style="width: 100%"
                @change="handleBusinTypeChange(scope.$index, scope.row)"
              >
                <el-option
                  v-for="item in businTypeOptions"
                  :key="item.businType"
                  :label="item.businTypeName"
                  :value="item.businType"
                >
                  <span>{{ item.businTypeName }}</span>
                  <span style="color: #8492a6; font-size: 13px; margin-left: 10px;">{{ item.businType }}</span>
                </el-option>
              </el-select>
              <span v-else>{{ formatEmptyValue(scope.row.businessCategory) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" min-width="120" align="right">
            <template slot-scope="scope">
              <el-input 
                v-if="scope.row.isNew"
                v-model="scope.row.price" 
                size="mini" 
                placeholder="请输入价格"
                @input="handlePriceInput(scope.$index, $event)"
                @blur="handlePriceBlur(scope.$index)"
              />
              <span v-else>{{ formatEmptyValue(scope.row.price) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="transactionAmount" label="交易金额(元)" min-width="120" align="right">
            <template slot-scope="scope">
              <el-input 
                v-if="scope.row.isNew"
                v-model="scope.row.transactionAmount" 
                size="mini" 
                placeholder="请输入交易金额"
                @input="handleAmountInput(scope.$index, $event)"
                @blur="handleAmountBlur(scope.$index)"
              />
              <span v-else>{{ formatNumber(scope.row.transactionAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isSettled" label="是否交收" width="120" align="center">
            <template slot-scope="scope">
              <el-select
                v-if="scope.row.isNew"
                v-model="scope.row.insStatus"
                size="mini"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option label="否" :value="1"></el-option>
                <el-option label="是" :value="2"></el-option>
              </el-select>
              <span v-else>{{ scope.row.insStatus == 2 ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center" v-if="!readonly">
            <template slot-scope="scope">
              <!-- 新增的行数据只显示删除按钮 -->
              <el-button
                v-if="scope.row.isNew"
                type="text"
                size="mini"
                style="color: #F56C6C;"
                @click="handleDeleteRow(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="!readonly" style="margin-top: 10px; text-align: center;">
          <el-button size="mini" type="text" @click="handleAddRow">
            <i class="el-icon-plus"></i> 新增
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SecondaryTradePanel',
  props: {
    rowData: {
      type: Object,
      default: null
    },
    // 字段代码，用于区分不同的明细类型
    fieldCode: {
      type: String,
      default: 'secondaryTrading'
    },
    // 字段名称，用于显示（可选，用于日志或其他用途）
    fieldName: {
      type: String,
      default: ''
    },
    // 初始汇总值（点击的表格数值）
    initialSummaryValue: {
      type: [Number, String],
      default: 0
    },
    // 是否只读模式（不显示汇总输入框和保存按钮）
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        summary: '' // 汇总金额（字符串，支持用户编辑）
      },
      detailData: [],
      detailLoading: false, // 明细表格 loading 状态
      originalSummary: 0, // 原始汇总金额（用于对比）
      stockOptions: [], // 证券搜索选项
      stockSearchLoading: false, // 证券搜索 loading 状态
      businTypeOptions: [], // 业务类别选项
      businTypeLoading: false, // 业务类别加载状态
      currentBusinTypeFieldCode: '' // 当前加载业务类别时使用的字段代码
    }
  },
  computed: {
    /**
     * 是否有新增的行数据
     */
    hasNewRows() {
      return this.detailData.some(item => item.isNew)
    }
  },
  methods: {
    /**
     * 更新汇总值（供父组件调用）
     * @param {Number|String} value - 汇总值
     */
    updateSummaryValue(value) {
      // 允许值为 0，只要不是 null、undefined 或空字符串
      if (value != null && value !== '') {
        const summaryValue = parseFloat(value)
        // 如果 parseFloat 返回 NaN，则使用 0
        const finalValue = isNaN(summaryValue) ? 0 : summaryValue
        this.originalSummary = finalValue
        this.form.summary = this.formatNumber(finalValue)
      } else {
        // 如果值为空，显示 "--"
        this.originalSummary = 0
        this.form.summary = '--'
      }
    },
    /**
     * 加载数据明细（通用）
     */
    async loadDetailData() {
      // 先根据 props 的 initialSummaryValue 直接设置汇总值（不使用 watch）
      this.setSummaryFromProps()
      
      // 开启明细表格 loading
      this.detailLoading = true
      
      // 当字段代码变化时，清空业务类别选项，确保下次新增行时会重新加载
      if (this.currentBusinTypeFieldCode !== this.fieldCode) {
        this.businTypeOptions = []
        this.currentBusinTypeFieldCode = ''
      }
      
      try {
        if (!this.rowData || !this.rowData.fundCode) {
          return
        }
        
        // 根据接口文档，需要传入 positionCode 和 fundCode
        const url = this.API.positionApiInvestment.prodPositionDetailsQuery
        const params = {
          positionCode: this.fieldCode, // 头寸代码（动态）
          fundCode: this.rowData.fundCode // 产品代码
        }
        const res = await this.http.post(url, params, 'application/json')
        
        if (res.code == 0) {
          // 将接口返回的字段映射到表格使用的字段
          this.detailData = (res.body || []).map(item => ({
            securityCode: item.securityCode || '', // 证券代码
            securityName: item.securityName || '', // 证券名称
            businessCategory: item.businTypeName || item.businType || '', // 业务类别
            transactionAmount: item.occurBal || 0, // 交易金额（元）
            price: item.price || '', // 价格
            insStatus: item.insStatus || 1, // 是否交收 (1-未交收，2-已交收)
            isSettled: item.insStatus == 2, // 是否交收（布尔值，用于显示）
            isNew: false, // 是否为新添加的行
            isFromServer: true // 标记为后端查询的数据，不能编辑
          }))
          
          // 加载完明细数据后，再次根据 props 更新汇总值，确保显示正确
          this.setSummaryFromProps()
        } else {
          this.$message.error(res.message || '加载明细数据失败')
        }
      } catch (error) {
        this.$message.error('加载明细数据失败')
      } finally {
        // 关闭明细表格 loading
        this.detailLoading = false
      }
    },
    /**
     * 根据 props 的 initialSummaryValue 设置汇总值（不使用 watch）
     */
    setSummaryFromProps() {
      if (this.initialSummaryValue != null && this.initialSummaryValue !== '') {
        const summaryValue = parseFloat(this.initialSummaryValue)
        // 如果 parseFloat 返回 NaN，则使用 0
        const finalValue = isNaN(summaryValue) ? 0 : summaryValue
        this.originalSummary = finalValue
        this.form.summary = this.formatNumber(finalValue)
      } else {
        // 如果值为空，显示 "--"
        this.originalSummary = 0
        this.form.summary = '--'
      }
    },
    /**
     * 搜索证券信息（远程搜索）
     * @param {String} query - 搜索关键词
     */
    async handleSearchStock(query) {
      if (!query || query.trim() === '') {
        this.stockOptions = []
        return
      }
      
      this.stockSearchLoading = true
      try {
        const url = this.API.positionApiInvestment.searchStock
        const params = {
          securityName: query.trim()
        }
        const res = await this.http.post(url, params, 'application/json')
        
        if (res.code == 0) {
          // 处理返回数据：body可能是数组或单个对象
          let dataList = []
          if (Array.isArray(res.body)) {
            dataList = res.body
          } else if (res.body && typeof res.body === 'object') {
            dataList = [res.body]
          }
          this.stockOptions = dataList.map(item => ({
            securityCode: item.securityCode || '',
            securityName: item.securityName || '',
            marketNo: item.marketNo || ''
          }))
        } else {
          this.stockOptions = []
        }
      } catch (error) {
        console.error('搜索证券信息失败', error)
        this.stockOptions = []
      } finally {
        this.stockSearchLoading = false
      }
    },
    /**
     * 证券名称选择变化，自动填充证券代码
     * @param {Number} index - 行索引
     * @param {Object} row - 行数据
     */
    handleStockChange(index, row) {
      const selectedStock = this.stockOptions.find(item => item.securityName === row.securityName)
      if (selectedStock) {
        this.$set(this.detailData[index], 'securityCode', selectedStock.securityCode)
      }
    },
    /**
     * 业务类别选择变化，保存 businType 和 businTypeName
     * @param {Number} index - 行索引
     * @param {Object} row - 行数据
     */
    handleBusinTypeChange(index, row) {
      const selectedBusinType = this.businTypeOptions.find(item => item.businType === row.businessCategory)
      if (selectedBusinType) {
        this.$set(this.detailData[index], 'businType', selectedBusinType.businType)
        this.$set(this.detailData[index], 'businTypeName', selectedBusinType.businTypeName)
      } else {
        this.$set(this.detailData[index], 'businType', '')
        this.$set(this.detailData[index], 'businTypeName', '')
      }
    },
    /**
     * 新增行数据
     */
    async handleAddRow() {
      // 每次点击新增行时，都根据当前字段名重新请求业务类别接口
      // 如果字段代码发生变化，或者业务类别选项为空，都需要重新加载
      if (this.currentBusinTypeFieldCode !== this.fieldCode || this.businTypeOptions.length === 0) {
        await this.loadBusinTypeOptions()
      }
      
      this.detailData.push({
        securityCode: '',
        securityName: '',
        businessCategory: '',
        businType: '', // 业务类别代码
        businTypeName: '', // 业务类别名称
        transactionAmount: '',
        price: '',
        insStatus: 1, // 默认未交收
        isSettled: false,
        isNew: true, // 标记为新添加的行
        isFromServer: false // 标记为新增的数据，可以编辑
      })
    },
    /**
     * 加载业务类别选项
     */
    async loadBusinTypeOptions() {
      if (!this.fieldCode) {
        return
      }
      
      this.businTypeLoading = true
      try {
        const url = this.API.positionApiInvestment.queryBusinType
        const params = {
          positionCode: this.fieldCode // 头寸代码（点击的字段名）
        }
        const res = await this.http.get(url, params)
        
        if (res.code == 0) {
          // 处理返回数据：body可能是数组或单个对象
          let dataList = []
          if (Array.isArray(res.body)) {
            dataList = res.body
          } else if (res.body && typeof res.body === 'object') {
            // 如果返回的是单个对象，检查是否有 businType 字段
            if (res.body.businType) {
              dataList = [res.body]
            } else {
              // 如果 body 是对象但没有 businType，可能是对象数组在 body 的某个属性中
              dataList = []
            }
          }
          this.businTypeOptions = dataList.map(item => ({
            businType: item.businType || '',
            businTypeName: item.businTypeName || ''
          }))
          // 保存当前加载业务类别时使用的字段代码
          this.currentBusinTypeFieldCode = this.fieldCode
        } else {
          this.businTypeOptions = []
          this.$message.warning(res.message || '加载业务类别失败')
        }
      } catch (error) {
        console.error('加载业务类别失败', error)
        this.businTypeOptions = []
        this.$message.error('加载业务类别失败')
      } finally {
        this.businTypeLoading = false
      }
    },
    /**
     * 删除行数据（只允许删除新增的行）
     * @param {Number} index - 行索引
     */
    handleDeleteRow(index) {
      this.detailData.splice(index, 1)
    },
    /**
     * 价格输入框输入时限制只能输入数字
     * @param {Number} index - 行索引
     * @param {String} value - 输入值
     */
    handlePriceInput(index, value) {
      // 只允许输入数字和小数点
      const filteredValue = value.replace(/[^\d.]/g, '')
      // 确保只有一个小数点
      const parts = filteredValue.split('.')
      if (parts.length > 2) {
        this.$set(this.detailData[index], 'price', parts[0] + '.' + parts.slice(1).join(''))
      } else {
        this.$set(this.detailData[index], 'price', filteredValue)
      }
    },
    /**
     * 价格输入框失焦时格式化
     * @param {Number} index - 行索引
     */
    handlePriceBlur(index) {
      const value = this.detailData[index].price
      if (value && !isNaN(parseFloat(value))) {
        this.$set(this.detailData[index], 'price', parseFloat(value).toString())
      } else if (value === '' || value === '.') {
        this.$set(this.detailData[index], 'price', '')
      }
    },
    /**
     * 交易金额输入框输入时限制只能输入数字（支持负数）
     * @param {Number} index - 行索引
     * @param {String} value - 输入值
     */
    handleAmountInput(index, value) {
      // 允许输入数字、小数点和负号
      let filteredValue = value.replace(/[^\d.\-]/g, '')
      
      // 确保负号只能在开头，且只有一个
      if (filteredValue.includes('-')) {
        const negativeIndex = filteredValue.indexOf('-')
        if (negativeIndex !== 0) {
          // 如果负号不在开头，移除所有负号
          filteredValue = filteredValue.replace(/-/g, '')
        } else {
          // 如果负号在开头，确保只有一个负号
          filteredValue = '-' + filteredValue.substring(1).replace(/-/g, '')
        }
      }
      
      // 确保只有一个小数点
      const parts = filteredValue.split('.')
      if (parts.length > 2) {
        this.$set(this.detailData[index], 'transactionAmount', parts[0] + '.' + parts.slice(1).join(''))
      } else {
        this.$set(this.detailData[index], 'transactionAmount', filteredValue)
      }
    },
    /**
     * 交易金额输入框失焦时格式化（支持负数）
     * @param {Number} index - 行索引
     */
    handleAmountBlur(index) {
      const value = this.detailData[index].transactionAmount
      if (value && !isNaN(parseFloat(value))) {
        // 保留负号，parseFloat 会自动处理负数
        this.$set(this.detailData[index], 'transactionAmount', parseFloat(value).toString())
      } else if (value === '' || value === '.' || value === '-') {
        this.$set(this.detailData[index], 'transactionAmount', '')
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
     * 格式化数字，添加千分符
     * @param {Number|String} num - 需要格式化的数字
     * @returns {String} 格式化后的字符串
     */
    formatNumber(num) {
      if (num == null || num == undefined || num == '') return '--'
      const numValue = Number(num)
      if (isNaN(numValue)) return '--'
      return numValue.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    /**
     * 汇总输入框失焦时格式化显示
     */
    handleSummaryBlur() {
      const numValue = parseFloat(this.form.summary.toString().replace(/,/g, ''))
      if (!isNaN(numValue)) {
        this.form.summary = this.formatNumber(numValue)
      }
    },
    handleCancel() {
      // 清空数据后再触发取消事件
      this.resetData()
      this.$emit('cancel')
    },
    /**
     * 重置数据，清空所有明细数据和状态
     */
    resetData() {
      this.detailData = []
      this.form.summary = ''
      this.originalSummary = 0
      this.stockOptions = []
      this.businTypeOptions = []
      this.currentBusinTypeFieldCode = ''
    },
    /**
     * 保存数据
     * 调用接口 prodPosition/updateFieldValue
     * 如果有新增或修改行数据，传参 details；否则传参 fieldValue
     */
    async handleSave() {
      try {
        // 检查是否有新增的行数据（后端查询的数据不能编辑）
        const hasNewOrEditedRows = this.detailData.some(item => item.isNew)
        
        if (hasNewOrEditedRows) {
          // 验证新增的行数据必填字段（后端查询的数据不能编辑，只验证新增的）
          for (let i = 0; i < this.detailData.length; i++) {
            const row = this.detailData[i]
            if (row.isNew) {
              if (!row.securityName || !row.securityName.trim()) {
                this.$message.warning(`第${i + 1}行：请选择证券名称`)
                return
              }
              if (!row.transactionAmount || parseFloat(row.transactionAmount) <= 0) {
                this.$message.warning(`第${i + 1}行：请输入有效的交易金额`)
                return
              }
            }
          }
        }
        
        const url = this.API.positionApiInvestment.prodPositionUpdateFieldValue
        let params = {
          fundCode: this.rowData.fundCode,
          fieldCode: this.fieldCode // 点击的表头字段名
        }
        
        if (hasNewOrEditedRows) {
          // 如果有新增行数据，传参 details
          // 只保存新增的行数据，不包含后端查询出来的数据
          params.details = this.detailData
            .filter(item => item.isNew) // 只取新增的行数据
            .map(item => ({
              positionCode: this.fieldCode, // 头寸代码
              securityCode: item.securityCode || '', // 证券代码
              securityName: item.securityName || '', // 证券名称
              businType: item.businType || item.businessCategory || '', // 业务类别（优先使用 businType）
              businTypeName: item.businTypeName || item.businessCategory || '', // 业务类别名称（优先使用 businTypeName）
              occurBal: item.transactionAmount ? parseFloat(item.transactionAmount).toString() : '', // 交易金额（元）
              price: item.price ? item.price.toString() : '', // 价格
              insStatus: item.insStatus || 1 // 是否交收 (1-未交收，2-已交收)
            }))
        } else {
          // 如果只修改了汇总值，传参 fieldValue
          const summaryValue = parseFloat(this.form.summary.toString().replace(/,/g, ''))
          
          if (isNaN(summaryValue)) {
            this.$message.warning('请输入有效的汇总金额')
            return
          }
          
          params.fieldValue = summaryValue.toString()
        }
        
        const res = await this.http.post(url, params, 'application/json')
        
        if (res.code == 0) {
          this.$message.success('保存成功')
          // 保存成功后，清除新增标记，重新加载数据
          this.detailData.forEach(item => {
            if (item.isNew) {
              item.isNew = false
              item.isFromServer = true
            }
          })
          // 重新加载数据
          await this.loadDetailData()
          this.$emit('save-success')
        } else {
          this.$message.error(res.message || '保存失败')
        }
      } catch (error) {
        console.error('保存数据失败', error)
        this.$message.error('保存失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.secondary-trade-panel {
  // 移除面板边框样式，使用 dialog 默认样式
  // el-dialog__body 已经设置了 padding: 10px，这里不需要额外边距
  
  // 汇总表单项样式
  /deep/ .summary-form-item {
    margin-bottom: 10px;
    
    .el-form-item__content {
      display: flex;
      align-items: center;
      margin-left: 0 !important;
    }
    
    .summary-label {
      margin-left: 10px;
      margin-right: 8px;
      font-size: 12px;
      color: #333;
      font-family: 'Microsoft YaHei', Arial, sans-serif;
      white-space: nowrap;
      flex-shrink: 0;
    }
  }
  
  // 表格表单项样式，确保与汇总标签对齐
  /deep/ .table-form-item {
    margin-bottom: 0;
    
    .el-form-item__content {
      margin-left: 0 !important;
      padding-left: 0;
    }
  }
}

// 明细表格样式
/deep/ .detail-table {
  // 去掉表格外边框
  border: none;
  
  // 表头样式：显示网格线（横线和竖线）
  .el-table__header-wrapper {
    .el-table__header {
      th {
        background-color: #f5f7fa;
        height: 40px;
        color: #333;
        font-weight: bold;
        font-size: 12px;
        font-family: 'Microsoft YaHei', Arial, sans-serif;
        // 表头显示竖线和横线（网格线）
        border-right: 1px solid #EBEEF5 !important;
        border-bottom: 1px solid #EBEEF5 !important;
      }
      
      // 最后一列不需要右边框
      th:last-child {
        border-right: none !important;
      }
      
      // 保留列宽调整手柄的可见性
      th .cell {
        position: relative;
      }
    }
  }

  // 表格行高和横线：隐藏竖线
  .el-table__body-wrapper {
    .el-table__body {
      tr {
        height: 32px;
        border-bottom: 1px solid #EBEEF5;
        
        td {
          height: 32px;
          // 隐藏竖线
          border-right: none !important;
        }
      }
      
      // 最后一行不需要底部边框
      tr:last-child {
        border-bottom: none;
      }
    }
  }
  
  // 去掉表格外边框
  &::before {
    display: none;
  }
}
</style>
