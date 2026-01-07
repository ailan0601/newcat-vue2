<template>
  <div class="position-intention-table">
    <div class="table-header">
      <h4>头寸意向</h4>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="overnight" label="隔夜(亿)" width="100" align="right">
        <template slot-scope="scope">
          <span class="clickable" @click="handleDetailClick('overnight', scope.row)">
            {{ scope.row.overnight }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="sevenDay" label="7D(亿)" width="100" align="right">
        <template slot-scope="scope">
          <span class="clickable" @click="handleDetailClick('sevenDay', scope.row)">
            {{ scope.row.sevenDay }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="fourteenDay" label="14D(亿)" width="100" align="right">
        <template slot-scope="scope">
          <span class="clickable" @click="handleDetailClick('fourteenDay', scope.row)">
            {{ scope.row.fourteenDay }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="unsettledIntention" label="未成交意向" width="150" align="center" />
      <el-table-column prop="inquiryProgress" label="询价进度" width="150" align="center" />
      <el-table-column prop="frontendProgress" label="前台进度" width="150" align="center" />
      <el-table-column prop="backendProgress" label="后台进度" width="150" align="center" />
      <el-table-column prop="reverseRepo" label="正回购" width="100" align="right">
        <template slot-scope="scope">
          {{ scope.row.reverseRepo }}
        </template>
      </el-table-column>
      <el-table-column prop="repo" label="逆回购" width="100" align="right">
        <template slot-scope="scope">
          {{ scope.row.repo }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 明细弹窗 -->
    <el-dialog
      :title="detailDialogTitle"
      :visible.sync="detailDialogVisible"
      width="800px"
      custom-class="common-dialog-padding"
      :append-to-body="true"
    >
      <el-table :data="detailData">
        <el-table-column prop="amount" label="金额" width="200" align="right">
          <template slot-scope="scope">
            {{ formatNumber(scope.row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="count" label="笔数" width="150" align="center" />
        <el-table-column prop="date" label="日期" width="200" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PositionIntentionTable',
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      detailDialogVisible: false,
      detailDialogTitle: '',
      detailData: [],
      currentDetailType: ''
    }
  },
  methods: {
    /**
     * 处理明细点击事件
     * @param {String} type - 类型：overnight、sevenDay、fourteenDay
     * @param {Object} row - 行数据
     */
    async handleDetailClick(type, row) {
      this.currentDetailType = type
      const typeMap = {
        overnight: '隔夜',
        sevenDay: '7D',
        fourteenDay: '14D'
      }
      this.detailDialogTitle = `${typeMap[type]}明细`
      
      try {
        // 根据类型获取对应的明细数据
        // 这里需要根据实际业务逻辑调用相应的接口
        // 暂时使用模拟数据，实际应该调用相应的明细接口
        const amount = row[type] || 0
        this.detailData = [
          {
            amount: amount * 100000000, // 转换为元
            count: 1,
            date: new Date().toISOString().split('T')[0]
          }
        ]
        this.detailDialogVisible = true
      } catch (error) {
        this.$message.error('获取明细数据失败')
      }
    },
    formatNumber(num) {
      if (num === null || num === undefined) return ''
      return num.toLocaleString('zh-CN')
    }
  }
}
</script>

<style lang="scss" scoped>
.position-intention-table {
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;

  h4 {
    font-size: 16px;
    font-weight: normal;
    color: #303133;
  }
}

.clickable {
  color: #409eff;
  cursor: pointer;

  &:hover {
    color: #66b1ff;
  }
}

/deep/ .el-table {
  font-size: 12px;
  
  .el-table__header {
    th {
      background-color: #f5f7fa;
      color: #606266;
      font-weight: 500;
    }
  }
}
</style>

