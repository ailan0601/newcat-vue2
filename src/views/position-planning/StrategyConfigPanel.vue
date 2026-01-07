<template>
  <div class="strategy-config-panel">
    <el-form :model="form" label-width="120px" size="mini">
      <el-form-item label="策略名字">
        <el-input v-model="form.strategyName" placeholder="请输入" size="mini" />
      </el-form-item>
      <el-form-item label="产品名称">
        <el-select 
          v-model="form.productCode" 
          placeholder="请选择" 
          size="mini" 
          clearable
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item in productList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
            <span style="float: left">{{ item.name }}</span>
            <span 
              v-if="item.isShow === 1" 
              style="float: right; color: #8492a6; font-size: 13px; margin-left: 15px"
            >
              {{ item.code }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预留现金(万)">
        <el-input v-model="form.reservedCash" placeholder="请输入" size="mini" />
      </el-form-item>
      <el-form-item label="隔夜比例(%)">
        <el-input v-model="form.overnightRatio" placeholder="请输入" size="mini" />
      </el-form-item>
      <el-form-item label="7D (%)">
        <el-input v-model="form.sevenDayRatio" placeholder="请输入" size="mini" />
      </el-form-item>
      <el-form-item label="14D (%)">
        <el-input v-model="form.fourteenDayRatio" placeholder="请输入" size="mini" />
      </el-form-item>
      <el-form-item label="是否默认使用">
        <el-radio-group v-model="form.isDefault" size="mini">
          <el-radio :label="false">否</el-radio>
          <el-radio :label="true">是</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
      <el-button size="mini" @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { productGroupList } from '@/service/common.js'

export default {
  name: 'StrategyConfigPanel',
  props: {
    // 策略ID，用于编辑时传入
    strategyId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 产品列表（与主界面查询条件使用相同接口）
      productList: [],
      form: {
        rid: '', // 主键ID
        strategyName: '', // 策略名称
        reservedCash: '', // 预留现金(万)
        productCode: '', // 产品代码
        overnightRatio: '', // 隔夜比例(%)
        sevenDayRatio: '', // 7D (%)
        fourteenDayRatio: '', // 14D (%)
        isDefault: false // 是否默认使用
      }
    }
  },
  mounted() {
    // 加载产品列表
    this.getProductList()
    
    // 如果有策略ID，加载策略详情
    if (this.strategyId) {
      this.loadStrategyDetail()
    }
  },
  methods: {
    /**
     * 获取产品列表（使用与主界面查询条件相同的接口）
     * 接口：/pubCombi/queryProdAndProdGroup
     */
    async getProductList() {
      try {
        // 使用与主界面查询条件相同的接口
        const res = await productGroupList({ 
          name: '', // 搜索关键字（空表示查询所有）
          type: '1' // 产品组类型：1-产品组
        })
        
        if (res && res.code == 0) {
          // 响应体字段从 body 改为 data
          const dataList = res.data || []
          // 数据格式：[{ rid: '主键', type: '1', name: '产品组名称', isShow: 0/1, detail: [...] }]
          // 将 rid 映射为 code 用于下拉框，保留 isShow 字段用于控制是否显示 rid
          this.productList = dataList.map(item => ({
            code: item.rid,
            name: item.name,
            isShow: item.isShow // 是否是产品（0-否，1-是）
          }))
        }
      } catch (error) {
        console.error('获取产品列表失败', error)
        this.productList = []
      }
    },
    /**
     * 加载策略详情
     */
    async loadStrategyDetail() {
      try {
        const url = this.API.positionApiInvestment.prodPositionStrategyGet
        const res = await this.http.post(url, { rid: this.strategyId }, 'application/json')
        if (res.code == 0 && res.body) {
          const data = res.body
          this.form = {
            rid: data.rid || '',
            strategyName: data.name || '',
            reservedCash: data.reserveCash || '',
            productCode: data.productCode || '',
            overnightRatio: data.overnightRatio || '',
            sevenDayRatio: data.everyDay7 || '',
            fourteenDayRatio: data.everyDay14 || '',
            isDefault: data.isDefault === 0 // 0：是，1：否
          }
        }
      } catch (error) {
        this.$message.error('加载策略详情失败')
      }
    },
    handleCancel() {
      this.$emit('cancel')
    },
    handleSave() {
      this.$emit('save', this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.strategy-config-panel {
  padding: 10px;
  
  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
}

.dialog-footer {
  text-align: center;
  margin-top: 10px;
  
  .el-button {
    margin: 0 5px;
  }
  
  .el-button--primary {
    margin-right: 10px;
  }
}
</style>

