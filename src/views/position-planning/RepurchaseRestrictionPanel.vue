<template>
  <div class="repurchase-restriction-panel">
    <el-form :model="form" label-width="130px" size="mini">
      <el-form-item label="期限限制">
        <el-select v-model="form.termRestriction" size="mini" placeholder="请选择" style="width: 100%" clearable>
          <el-option
            v-for="item in termRestrictionOptions"
            :key="item.itemId"
            :label="item.itemName"
            :value="item.itemId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="正回购不可押">
        <el-select 
          v-model="form.pledgeRepoLimit" 
          size="mini" 
          placeholder="请选择" 
          style="width: 100%" 
          clearable
          filterable
        >
          <el-option
            v-for="item in pledgeRepoOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="正回购自定义不可押">
        <el-input
          v-model="form.pledgeRepoBondLimit"
          size="mini"
          placeholder="请输入"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="逆回购可押">
        <el-select 
          v-model="form.reverseRepoLimit" 
          size="mini" 
          placeholder="请选择" 
          style="width: 100%" 
          clearable
          filterable
        >
          <el-option
            v-for="item in reverseRepoOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'RepurchaseRestrictionPanel',
  props: {
    rowData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 回购期限类型字典数据
      termRestrictionOptions: [
        { itemId: 'GY', itemName: '只能隔夜' },
        { itemId: '7D', itemName: '只能7天' },
        { itemId: '14D', itemName: '只能14天' }
      ],
      // 正回购不可押下拉选项（从字典接口获取）
      pledgeRepoOptions: [],
      // 逆回购可押下拉选项（从字典接口获取）
      reverseRepoOptions: [],
      form: {
        termRestriction: '',
        pledgeRepoLimit: '', // 正回购不可押
        pledgeRepoBondLimit: '', // 正回购自定义不可押
        reverseRepoLimit: '' // 逆回购可押
      }
    }
  },
  mounted() {
    // 一次性加载正回购不可押和逆回购可押字典数据
    this.loadPledgeRepoOptions()
  },
  watch: {
    rowData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          // 从 _rawData 中获取所有字段值进行回显
          const rawData = newVal._rawData || {}
          
          // 设置期限限制（从 _rawData 中获取）
          if (rawData.repurchaseRestrictionType) {
            this.form.termRestriction = rawData.repurchaseRestrictionType
          } else {
            this.form.termRestriction = ''
          }
          
          // 设置正回购不可押（从 _rawData 中获取）
          if (rawData.pledgeRepoLimit) {
            this.form.pledgeRepoLimit = rawData.pledgeRepoLimit
          } else {
            this.form.pledgeRepoLimit = ''
          }
          
          // 设置正回购自定义不可押（从 _rawData 中获取）
          if (rawData.pledgeRepoBondLimit) {
            this.form.pledgeRepoBondLimit = rawData.pledgeRepoBondLimit
          } else {
            this.form.pledgeRepoBondLimit = ''
          }
          
          // 设置逆回购可押（从 _rawData 中获取）
          if (rawData.reverseRepoLimit) {
            this.form.reverseRepoLimit = rawData.reverseRepoLimit
          } else {
            this.form.reverseRepoLimit = ''
          }
        } else {
          // 重置表单
          this.form.termRestriction = ''
          this.form.pledgeRepoLimit = ''
          this.form.pledgeRepoBondLimit = ''
          this.form.reverseRepoLimit = ''
        }
      }
    }
  },
  methods: {
    /**
     * 一次性加载正回购不可押和逆回购可押字典数据
     * 字典ID: POSITION_BOND_TYPE（正回购不可押）, HG_DOWN_PLEDGE_BOND_TYPE（逆回购可押）
     */
    async loadPledgeRepoOptions() {
      try {
        const url = this.API.common.findByDictIds
        const params = {
          dictIds: 'POSITION_BOND_TYPE,HG_DOWN_PLEDGE_BOND_TYPE'
        }
        const res = await this.http.get(url, params)
        
        if (res.code == 0) {
          const body = res.body || {}
          // 分别提取两个字典的数据
          this.pledgeRepoOptions = body.POSITION_BOND_TYPE || []
          this.reverseRepoOptions = body.HG_DOWN_PLEDGE_BOND_TYPE || []
        } else {
          this.$message.error(res.message || '加载回购限制字典数据失败')
        }
      } catch (error) {
        console.error('加载回购限制字典数据失败', error)
        this.$message.error('加载回购限制字典数据失败')
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
.repurchase-restriction-panel {
  // 移除面板边框样式，使用 dialog 默认样式
  // el-dialog__body 已经设置了 padding: 10px，这里不需要额外边距
  
  // 设置文本域字体为微软雅黑
  /deep/ .el-textarea__inner {
    font-family: 'Microsoft YaHei', Arial, sans-serif;
  }
}
</style>

