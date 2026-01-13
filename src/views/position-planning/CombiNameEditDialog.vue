<template>
  <el-dialog
    title="编辑组合名称"
    :visible.sync="dialogVisible"
    width="500px"
    custom-class="common-dialog-padding"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form :model="form" label-width="100px" size="mini">
      <el-form-item label="产品名称">
        <el-input v-model="form.productName" size="mini" disabled />
      </el-form-item>
      <el-form-item label="组合名称">
        <el-select
          v-model="form.combiId"
          placeholder="请选择组合"
          size="mini"
          filterable
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in combiOptions"
            :key="item.combiId"
            :label="item.combiName"
            :value="item.combiId"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
      <el-button size="mini" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CombiNameEditDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        productName: '',
        productCode: '',
        productId: '', // 产品ID（用于查询组合）
        combiId: ''
      },
      combiOptions: []
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.dialogVisible = val
        if (val && this.rowData) {
          this.initFormData()
          this.loadCombiOptions()
        }
      }
    }
  },
  methods: {
    /**
     * 初始化表单数据
     */
    initFormData() {
      if (this.rowData) {
        this.form.productName = this.rowData.fundName || ''
        this.form.productCode = this.rowData.fundCode || ''
        this.form.productId = this.rowData.fundId || '' // 保存产品ID
        // 如果有组合ID，设置为当前选中值（统一转换为字符串类型，兼容数字类型）
        if (this.rowData.positionIntention && this.rowData.positionIntention.combiId != null) {
          // 将combiId转换为字符串，确保与下拉框的value类型一致
          this.form.combiId = String(this.rowData.positionIntention.combiId)
        } else {
          this.form.combiId = ''
        }
      }
    },
    /**
     * 加载组合下拉框数据
     */
    async loadCombiOptions() {
      try {
        if (!this.form.productId) {
          console.warn('产品ID为空，无法加载组合列表')
          return
        }
        
        const url = '/tradecommon-api/v1/convertBond/bond/combiQry'
        const params = {
          page: 1,
          rows: 999,
          productId: this.form.productId // 使用 fundId 作为 productId
        }
        
        console.log('加载组合列表，参数：', params)
        const res = await this.http.get(url, params)
        console.log('组合列表响应：', res)
        
        // 接口返回结果直接就是一个数组
        if (res && Array.isArray(res)) {
          this.combiOptions = res.map(item => ({
            combiId: String(item.combiId || ''), // 统一转换为字符串类型
            combiName: item.combiName || '',
            combiCode: item.combiCode || ''
          }))
          console.log('组合下拉框数据：', this.combiOptions)
          
          // 下拉框数据加载完成后，重新设置回显值（确保类型匹配）
          if (this.form.combiId) {
            this.$nextTick(() => {
              // 如果form.combiId是数字类型，转换为字符串
              this.form.combiId = String(this.form.combiId)
            })
          }
        } else {
          this.combiOptions = []
        }
      } catch (error) {
        console.error('加载组合列表失败：', error)
        this.$message.error('加载组合列表失败')
        this.combiOptions = []
      }
    },
    /**
     * 保存组合名称
     */
    async handleSave() {
      try {
        if (!this.form.combiId) {
          this.$message.warning('请选择组合名称')
          return
        }
        
        const url = this.API.positionApiInvestment.prodPositionUpdateFieldValue
        const params = {
          fundCode: this.form.productCode,
          fieldCode: 'combiId',
          fieldValue: this.form.combiId
        }
        
        const res = await this.http.post(url, params, 'application/json')
        
        if (res.code == 0) {
          this.$message.success('保存成功')
          this.$emit('save-success')
          this.handleClose()
        } else {
          this.$message.error(res.message || '保存失败')
        }
      } catch (error) {
        console.error('保存组合名称失败：', error)
        this.$message.error('保存失败')
      }
    },
    /**
     * 关闭弹框
     */
    handleClose() {
      this.dialogVisible = false
      this.$emit('update:visible', false)
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
  
  .el-button {
    margin: 0 5px;
  }
}
</style>

