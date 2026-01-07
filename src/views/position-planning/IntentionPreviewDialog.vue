<template>
  <el-dialog
    title="意向预览"
    :visible.sync="visible"
    width="900px"
    custom-class="common-dialog-padding"
    :append-to-body="true"
    @close="handleClose"
  >
    <div class="preview-content">
      <!-- 冲突提示 -->
      <el-alert
        v-if="conflicts && conflicts.length > 0"
        :title="`检测到 ${conflicts.length} 个冲突`"
        type="warning"
        :closable="false"
        style="margin-bottom: 20px"
      >
        <div v-for="(conflict, index) in conflicts" :key="index" style="margin-top: 10px">
          <p><strong>{{ conflict.fundCode }} {{ conflict.fundName }}</strong></p>
          <p>限制条件：{{ conflict.restriction }}</p>
          <p>冲突原因：{{ conflict.conflict }}</p>
        </div>
      </el-alert>

      <!-- 意向数据展示 -->
      <el-table :data="previewData">
        <el-table-column prop="type" label="类型" width="150" />
        <el-table-column prop="amount" label="金额(亿)" width="150" align="right">
          <template slot-scope="scope">
            {{ scope.row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" />
      </el-table>
    </div>
    
    <!-- 操作按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click="handleIssue">下达意向</el-button>
      <el-button size="mini" @click="handleRiskControl">风控试算</el-button>
      <el-button size="mini" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'IntentionPreviewDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    intentionData: {
      type: Object,
      default: () => ({})
    },
    conflicts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    previewData() {
      const data = []
      if (this.intentionData.overnight) {
        data.push({
          type: '隔夜',
          amount: this.intentionData.overnight,
          description: '隔夜回购意向'
        })
      }
      if (this.intentionData.sevenDay) {
        data.push({
          type: '7D',
          amount: this.intentionData.sevenDay,
          description: '7天回购意向'
        })
      }
      if (this.intentionData.fourteenDay) {
        data.push({
          type: '14D',
          amount: this.intentionData.fourteenDay,
          description: '14天回购意向'
        })
      }
      return data
    }
  },
  watch: {
    dialogVisible(newVal) {
      this.visible = newVal
    },
    visible(newVal) {
      if (!newVal) {
        this.$emit('update:dialogVisible', false)
      }
    }
  },
  methods: {
    handleClose() {
      this.visible = false
      this.$emit('close')
    },
    handleRiskControl() {
      this.$emit('risk-control')
    },
    handleIssue() {
      this.$emit('issue')
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-content {
  padding: 0;
}

.dialog-footer {
  text-align: center;
  
  .el-button--primary {
    margin-right: 10px;
  }
}
</style>

