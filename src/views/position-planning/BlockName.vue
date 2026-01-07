<template>
  <el-dialog
    :title="row.rid ? '修改' : '新增'"
    :close-on-click-modal="false"
    width="520px"
    :visible.sync="dialog"
    :append-to-body="true"
    :before-close="closeDialog"
    :destroy-on-close="true"
    custom-class="block-name-dialog"
  >
    <el-form ref="formRef" label-width="60px" @submit.native.prevent>
      <el-form-item label="名称" prop="newObjName">
        <el-input type="text" v-model="newObjName" placeholder="请输入" maxlength="15" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="submitLoading" @click="submit" size="mini">确 认</el-button>
      <el-button @click="closeDialog" size="mini">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { pubCombiSave } from '@/service/common.js'

/**
 * 产品/管理组名称编辑组件
 */
export default {
  name: 'BlockName',
  props: {
    // 管理类型：'1' 产品管理，其他为管理组
    blockManageType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      dialog: false,
      newObjName: '',
      row: {},
      submitLoading: false
    }
  },
  methods: {
    /**
     * 打开弹窗
     * @param {Object} item - 要编辑的项目，新增时为空对象
     */
    open(item = {}) {
      this.dialog = true
      this.newObjName = item.name || ''
      this.row = item
    },
    /**
     * 提交表单
     */
    submit() {
      if (!this.newObjName) {
        this.$message.error('名称不能为空！')
        return
      }
      this.submitLoading = true
      const param = {
        type: this.blockManageType,
        detail: [],
        ocode: '',
        name: this.newObjName
      }
      if (this.row.rid) {
        param.rid = this.row.rid
      }
      pubCombiSave(param)
        .then((res) => {
          this.submitLoading = false
          if (res.code == 0) {
            this.$message.success('操作成功')
            this.closeDialog()
            this.$emit('loadData')
          } else {
            this.$message.error(res.message || '操作失败')
          }
        })
        .catch(() => {
          this.$message.error('操作失败，请重试！')
          this.submitLoading = false
        })
    },
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.submitLoading = false
      this.dialog = false
      this.newObjName = ''
      this.row = {}
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog.block-name-dialog {
  margin-top: calc(50vh - 80px) !important;

  .el-dialog__header {
    background-color: #f2f2f2;
    padding: 15px 20px;
  }

  .el-dialog__title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    font-family: 'Microsoft YaHei', Arial, sans-serif;
  }

  .el-dialog__body {
    padding: 10px !important;
  }

  .el-dialog__footer {
    padding: 10px 20px;
  }
}

.is-out {
  line-height: 39px;
}

.dialog-footer {
  text-align: center;  // 按钮居中
}

.dialog-footer .el-button {
  margin-left: 10px;  // 按钮间隔10px
}

.dialog-footer .el-button:first-child {
  margin-left: 0;  // 第一个按钮不需要左边距
}
</style>

