<template>
  <div class="repurchase-restriction-panel">
    <el-form :model="form" label-width="120px" size="mini">
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
      <el-form-item label="正回购质押券限制">
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
      <el-form-item label="逆回购质押券限制">
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
      // 正回购质押券限制下拉选项（从字典接口获取）
      pledgeRepoOptions: [],
      // 逆回购质押券限制下拉选项（从字典接口获取）
      reverseRepoOptions: [],
      form: {
        termRestriction: '',
        pledgeRepoLimit: '', // 正回购质押券限制
        reverseRepoLimit: '' // 逆回购质押券限制
      }
    }
  },
  mounted() {
    // 一次性加载正回购和逆回购质押券限制字典数据
    this.loadPledgeRepoOptions()
  },
  watch: {
    rowData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          // 优先使用 repurchaseRestrictionType（如果接口返回了）
          if (newVal.repurchaseRestrictionType) {
            this.form.termRestriction = newVal.repurchaseRestrictionType
          } else if (newVal.repurchaseRestriction) {
            // 否则从显示内容中解析
            const restriction = newVal.repurchaseRestriction
            if (restriction.includes('只能隔夜')) {
              this.form.termRestriction = 'GY'
            } else if (restriction.includes('只能7天') || restriction.includes('只能7D')) {
              this.form.termRestriction = '7D'
            } else if (restriction.includes('只能14天') || restriction.includes('只能14D')) {
              this.form.termRestriction = '14D'
            } else {
              this.form.termRestriction = ''
            }
          } else {
            this.form.termRestriction = ''
          }
          
          // 设置正回购质押券限制（从 _rawData 中获取）
          if (newVal._rawData && newVal._rawData.pledgeRepoLimit) {
            this.form.pledgeRepoLimit = newVal._rawData.pledgeRepoLimit
          } else {
            this.form.pledgeRepoLimit = ''
          }
          
          // 设置逆回购质押券限制（从 _rawData 中获取）
          if (newVal._rawData && newVal._rawData.reverseRepoLimit) {
            this.form.reverseRepoLimit = newVal._rawData.reverseRepoLimit
          } else {
            this.form.reverseRepoLimit = ''
          }
        } else {
          // 重置表单
          this.form.termRestriction = ''
          this.form.pledgeRepoLimit = ''
          this.form.reverseRepoLimit = ''
        }
      }
    }
  },
  methods: {
    /**
     * 一次性加载正回购和逆回购质押券限制字典数据
     * 字典ID: HG_SECURITY_TYPE_CONFIG, HG_DOWN_PLEDGE_BOND_TYPE
     */
    async loadPledgeRepoOptions() {
      try {
        const url = this.API.common.findByDictIds
        const params = {
          dictIds: 'HG_SECURITY_TYPE_CONFIG,HG_DOWN_PLEDGE_BOND_TYPE'
        }
        const res = await this.http.get(url, params)
        
        if (res.code == 0) {
          const body = res.body || {}
          // 分别提取两个字典的数据
          this.pledgeRepoOptions = body.HG_SECURITY_TYPE_CONFIG || []
          this.reverseRepoOptions = body.HG_DOWN_PLEDGE_BOND_TYPE || []
        } else {
          this.$message.error(res.message || '加载质押券限制字典数据失败')
        }
      } catch (error) {
        console.error('加载质押券限制字典数据失败', error)
        this.$message.error('加载质押券限制字典数据失败')
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

