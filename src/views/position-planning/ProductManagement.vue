<template>
  <el-dialog 
    :title="blockManageType == '1' ? '产品管理' : '管理组'" 
    :visible.sync="visible" 
    :append-to-body="true" 
    :before-close="closeDialog"
    width="980px"
    custom-class="product-management-dialog"
  >
    <div class="block-box">
      <div class="left">
        <div class="flex-top jc mb5">
          <div>{{ blockManageType == '1' ? '产品管理' : '管理组' }}列表</div>
          <el-button type="text" icon="el-icon-plus" class="mr10" @click="handleBlockNameOpen">新增</el-button>
        </div>
        <div class="left-box">
          <div 
            :class="['left-item', { 'left-select': leftSelect === item.rid }]" 
            v-for="item in leftList" 
            :key="item.rid" 
            @click="handleLeftItemClick(item)"
          >
            {{ item.name }}
            <div class="left-edit">
              <i class="el-icon-edit mr10" @click.stop="handleBlockNameOpen(item)"></i>
              <i class="el-icon-delete" @click.stop="removeItem(item)"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="flex-top pl10 pr10 pb5 cj-mini">
          <span>{{ blockManageType == '1' ? '产品' : '管理组' }}</span>
          <el-select
            class="w400 ml10"
            placeholder="请选择"
            v-model="addList"
            clearable
            filterable
            @change="changeAddList"
            :filter-method="filterOptionsFn"
            multiple
            collapse-tags
            @visible-change="handleVisibleChange"
            size="mini"
          >
            <el-option 
              v-for="item in realPositionGroup" 
              :key="item.code" 
              :label="item.value" 
              :value="item.code" 
              :disabled="tableData.some(i => i.code === item.code)"
            >
              <span style="float: left" class="w300">{{ item.value }}</span>
              <span style="float: left; margin: 0 5px">{{ item.code }}</span>
            </el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus" size="mini" class="ml10" @click="handleList">添加</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="!multipleSelection.length" @click="removeSelectList">删除</el-button>
        </div>
        <div class="pl10 h">
          <div class="bb">
            <div class="checkbox-btn">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <el-button type="text" @click="handleCheckAllChange1" style="margin-left: 10px">反选</el-button>
            </div>
            <div class="fr c-6">
              {{ blockManageType == '1' ? '产品' : '管理组' }}总数 :
              <span class="c-red">{{ tableData.length }}</span>
            </div>
          </div>

          <div class="main-check" v-loading="mainLoading">
            <el-checkbox-group v-model="multipleSelection" @change="handleCheckedCitiesChange" class="checkbox">
              <el-checkbox v-for="item in tableData" :label="item.code" :key="item.code" class="check-item">
                <el-tooltip class="item" effect="dark" :content="item.code + ' ' + item.value" placement="right">
                  <span>{{ item.code + ' ' + item.value }}</span>
                </el-tooltip>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <div class="dialog-footer bg-white">
        <el-button @click="closeDialog" size="mini">关 闭</el-button>
      </div>
    </template>
    <BlockName ref="blockNameRef" :blockManageType="blockManageType" @loadData="handleLoadData" />
  </el-dialog>
</template>

<script>
import BlockName from './BlockName.vue'
import { pubCombiSave, pubCombiFindList, pubCombiGet, pubCombiRemove, genesisCommonFindUserAuth } from '@/service/common.js'

/**
 * 产品/管理组管理组件
 */
export default {
  name: 'ProductManagement',
  components: {
    BlockName
  },
  data() {
    return {
      blockManageType: '1',
      visible: false,
      addValue: '',
      addList: [],
      addListHasName: [],
      checkAll: false,
      isIndeterminate: false,
      leftList: [],
      leftSelect: '',
      leftSelectName: '',
      multipleSelection: [],
      tableData: [],
      mainLoading: false,
      realPositionGroupAll: [],
      realPositionGroup: []
    }
  },
  methods: {
    /**
     * 打开弹窗
     * @param {String} type - 类型：'1' 产品管理，其他为管理组
     */
    open(type) {
      this.blockManageType = type
      this.visible = true
      this.getData(true)
      this.getComOptions(type == '1' ? 'prod' : 'group')
    },
    /**
     * 删除选中的列表项
     */
    removeSelectList() {
      this.mainLoading = true
      let tableDataCopy = JSON.parse(JSON.stringify(this.tableData))
      tableDataCopy = tableDataCopy.filter((i) => !this.multipleSelection.includes(i.code))
      const param = {
        type: this.blockManageType,
        detail: tableDataCopy.map((item) => ({ ocode: item.code })),
        rid: this.leftSelect,
        name: this.leftSelectName
      }
      pubCombiSave(param)
        .then((res) => {
          if (res.code == 0) {
            this.tableData = tableDataCopy
            this.multipleSelection = []
            this.isIndeterminate = false
            this.checkAll = false
          } else {
            this.$message.error(res.message || '操作失败')
          }
        })
        .finally(() => {
          this.mainLoading = false
        })
    },
    /**
     * 过滤选项
     * @param {String} query - 查询字符串
     */
    filterOptionsFn(query) {
      this.realPositionGroup = this.realPositionGroupAll.filter((option) => 
        option.value.toLowerCase().includes(query.toLowerCase()) || 
        option.code.toString().includes(query)
      )
    },
    /**
     * 处理下拉框可见性变化
     * @param {Boolean} visible - 是否可见
     */
    handleVisibleChange(visible) {
      if (visible) {
        this.filterOptionsFn('')
      }
    },
    /**
     * 处理添加列表变化
     * @param {Array} e - 选中的值数组
     */
    changeAddList(e) {
      this.addListHasName = e.map((item) => 
        this.realPositionGroupAll.find((i) => i.code === item)
      )
    },
    /**
     * 处理添加列表
     */
    handleList() {
      if (!this.addListHasName.length || !this.leftSelect) {
        return this.$message.error('请选择')
      }

      this.mainLoading = true
      const tableDataCopy = JSON.parse(JSON.stringify(this.tableData))
      tableDataCopy.push(...this.addListHasName)
      const param = {
        type: this.blockManageType,
        detail: tableDataCopy.map((item) => ({ ocode: item.code })),
        rid: this.leftSelect,
        name: this.leftSelectName
      }
      pubCombiSave(param)
        .then((res) => {
          if (res.code == 0) {
            this.tableData = tableDataCopy
            this.addListHasName = []
            this.addList = []
          } else {
            this.$message.error(res.message || '操作失败')
          }
        })
        .finally(() => {
          this.mainLoading = false
        })
    },
    /**
     * 删除列表项
     * @param {Object} item - 要删除的项
     */
    removeItem(item) {
      this.$confirm('是否确定删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          rid: item.rid
        }
        pubCombiRemove(params).then((res) => {
          if (res.code == 0) {
            this.$message.success('操作成功')
            this.getData(item.rid === this.leftSelect)
          } else {
            this.$message.error(res.message || '操作失败')
          }
        })
      })
    },
    /**
     * 获取选项数据
     * @param {String} val - 类型：'prod' 或 'group'
     */
    async getComOptions(val) {
      const params = {
        isAuth: 1,
        type: val
      }
      const res = await genesisCommonFindUserAuth(params)
      if (res && res.code == 0) {
        const body = res.body || res.data || {}
        this.realPositionGroup = body[val] || []
        this.realPositionGroupAll = body[val] || []
      }
    },
    /**
     * 处理全选变化
     * @param {Boolean} val - 是否全选
     */
    handleCheckAllChange(val) {
      this.multipleSelection = val ? this.tableData.map((item) => item.code) : []
      this.isIndeterminate = false
    },
    /**
     * 处理复选框变化
     * @param {Array} value - 选中的值数组
     */
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.tableData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length
    },
    /**
     * 处理反选
     */
    handleCheckAllChange1() {
      this.multipleSelection = this.tableData
        .filter((i) => !this.multipleSelection.includes(i.code))
        .map((item) => item.code)
      this.checkAll = this.multipleSelection.length === this.tableData.length
    },
    /**
     * 获取数据
     * @param {Boolean} flag - 是否初始化选中项
     */
    getData(flag) {
      pubCombiFindList({ type: this.blockManageType }).then((res) => {
        if (res && res.code == 0) {
          const dataList = res.body || res.data || []
          this.leftList = dataList
          if (flag && dataList.length > 0) {
            this.leftSelect = dataList[0].rid || ''
            this.leftSelectName = dataList[0].name || ''
            if (dataList[0].rid) {
              this.investMgrPlateQueryPlateDtlList(dataList[0].rid)
            }
          }
        }
      })
    },
    /**
     * 查询详情列表
     * @param {String} parentId - 父级ID
     */
    investMgrPlateQueryPlateDtlList(parentId) {
      this.mainLoading = true
      const params = {
        rid: parentId
      }
      pubCombiGet(params)
        .then((res) => {
          if (res && res.code == 0) {
            const detail = (res.body && res.body.detail) || (res.data && res.data.detail) || []
            this.tableData = detail.map((item) => ({
              value: item.oname || item.name || '',
              code: item.ocode || item.code || ''
            }))
          }
        })
        .finally(() => {
          this.mainLoading = false
        })
    },
    /**
     * 处理左侧项点击
     * @param {Object} item - 点击的项
     */
    handleLeftItemClick(item) {
      this.investMgrPlateQueryPlateDtlList(item.rid)
      this.leftSelect = item.rid
      this.leftSelectName = item.name
      this.multipleSelection = []
      this.addList = []
      this.checkAll = false
      this.isIndeterminate = false
    },
    /**
     * 打开名称编辑弹窗
     * @param {Object} item - 要编辑的项，新增时为空
     */
    handleBlockNameOpen(item) {
      this.$refs.blockNameRef.open(item)
    },
    /**
     * 处理数据加载
     */
    handleLoadData() {
      this.getData(false)
    },
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.visible = false
      this.addValue = ''
      this.addList = []
      this.checkAll = false
      this.isIndeterminate = false
      this.leftList = []
      this.leftSelectName = ''
      this.leftSelect = ''
      this.multipleSelection = []
      this.tableData = []
      this.$emit('getData')
    }
  }
}
</script>

<style lang="scss">
.product-management-dialog {
  height: 560px;
  margin-top: calc(50vh - 280px) !important;

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

  .el-dialog__footer {
    background-color: #fff;
    padding: 10px 20px;
  }

  .el-dialog__body {
    padding: 10px !important;
  }

  .jc {
    justify-content: space-between;
  }

  .block-box {
    display: flex;
    height: 448px;

    .flex-top {
      display: flex;
    
      span {
        white-space: nowrap;
      }
    }

    .left {
      width: 200px;
      height: 100%;

      .left-box {
        border: 1px solid #eee;
        height: calc(100% - 25px);
        overflow-y: auto;

        .left-item {
          padding: 5px 10px;
          box-sizing: border-box;
          cursor: pointer;
          border-left: 3px solid #fff;
          position: relative;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
          white-space: nowrap;

          .left-edit {
            display: none;
            position: absolute;
            right: 0px;
            top: 0px;
            z-index: 99999;
            background: #fff;
            width: 50px;
            line-height: 32px;
            padding-left: 10px;
          }
        }

        .left-item:hover {
          .left-edit {
            display: block;
          }
        }

        .left-select {
          border-left-color: #60a0ff;
          background: rgb(247, 247, 252);
          color: #60a0ff;
          font-weight: 700;

          .left-edit {
            background: rgb(247, 247, 252);
          }
        }
      }
    }
    
    .main {
      flex: 1;
      position: relative;

      .options-right {
        position: absolute;
        right: 10px;
        top: 55px;
        display: flex;
        flex-direction: column;

        .i {
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          border: 1px solid #ddd;
          cursor: pointer;
          font-size: 16px;
          margin-bottom: 10px;
          color: #9b9b9b;
        }

        .img {
          width: 14px;
          height: 14px;
          padding: 3px;
        }
      }

      .main-check {
        height: calc(100% - 50px);
      }

      .add-input {
        position: absolute;
        bottom: 0;
        width: 93%;
        margin-left: 10px;

        /deep/ .el-input__prefix {
          left: 10px;
          top: 5px;
        }
      }

      .checkbox {
        height: calc(100% - 14px);
        overflow-y: auto;
      }
    }

    .right {
      width: 200px;
    }
  }
}

.bb {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 8px 0;
  
  .checkbox-btn {
    display: flex;
    align-items: center;
  }
}

.check-item {
  margin-bottom: 5px;
  width: 217px;
  margin-right: 10px;

  .el-checkbox__label {
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    white-space: nowrap;
    display: inline-block;
    
    span {
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: middle;
    }
  }
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

.mb5 {
  margin-bottom: 5px;
}

.mr10 {
  margin-right: 10px;
}

.ml10 {
  margin-left: 10px;
}

.pl10 {
  padding-left: 10px;
}

.pr10 {
  padding-right: 10px;
}

.pb5 {
  padding-bottom: 5px;
}

.mt10 {
  margin-top: 10px;
}

.w400 {
  width: 400px;
}

.w300 {
  width: 300px;
}

.cj-mini {
  font-size: 12px;
}

.c-6 {
  color: #666;
}

.c-red {
  color: #f56c6c;
}

.fr {
  float: right;
}

.h {
  height: calc(100% - 30px);
}

.bg-white {
  background-color: #fff;
}
</style>

