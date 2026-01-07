
<template>
    <div id="save-condition">
      <el-dropdown size="mini" split-button @click="open" @command="clickItem">
        <i class="el-icon-circle-plus-outline"></i> 保存查询条件
        <el-dropdown-menu slot="dropdown" class="dropdownMenu">
          <el-dropdown-item v-for="(item) in predictionList" id="dropdownItem" :key="item.name" :command="item.name">
            <span class="text" :title="item.name" style="width:75px;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.name}}</span>
            <el-button type="danger" size="mini" @click.stop="delItem(item.name,item)" icon="el-icon-delete" style="
                        padding: 3px 3px 3px 8px;
                        margin-left: 10px;
                        height: 20px;
                      "></el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </template>
  
  <script>
  import { getSStore } from "@/common/utils/utils";
  export default {
    name: "save-condition",
    props: {
      // 父级保存查询条件
      addItemClick: { type: Function },
      // 菜单code
      code: {
        type: String,
        default: ""
      },
      // 菜单名字
      name: {
        type: String,
        default: ""
      },
      //  新增接口
      addUrl: {
        type: String,
        default: ""
      },
      //  查询接口
      getUrl: {
        type: String,
        default: ""
      },
      userId: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        predictionList: [], // 条件下拉数组
        name: "" // 新增名字
      };
    },
    watch: {},
    methods: {
    // 选中一条,回填父组件的查询条件
    clickItem(command) {
      let predictionObj = this.predictionList.find((ref) => {
        return ref.name == command;
      });
      this.$emit("itemClick", predictionObj.json);
    },
    // 新增
    open() {
      this.$prompt("请输入搜索条件名", "保存搜索条件名", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(?!.{11}|^\s*$)/g,
        inputErrorMessage: "搜索条件名长度1-10位噢！"
      })
        .then(({ value }) => {
          console.log(this.API.common.conditionPageQuery);
          let obj = this.jsonQueryFunction(this.predictionList);
          let queryObj = this.addItemClick();
          // 判断是否有相同名字
          if (obj.nameArray.indexOf(value) != -1) {
            this.$message.error("名字不能重复");
            return;
          }
          let predictionList = this.utils.clone(obj.array);
          // 获取新增的条件数据插入数组内
          predictionList.push({
            name: value,
            json: queryObj
          });
          this.sbFunction("add", predictionList).then((res) => {
            if (res) {
              // 操作后进行查询
              this.sbFunction("get");
              this.$message({
                type: "success",
                message: "保存成功"
              });
            }
          });
        })
        .catch((err) => {
          console.log(err || "取消输入");
        });
    },
    // 删除
    delItem(val) {
      let predictionList = this.predictionList.filter(
        (item) => item.name != val
      );
      this.sbFunction("add", predictionList).then((res) => {
        if (res) {
          // 操作后进行查询
          this.sbFunction("get");
          this.$message({
            type: "success",
            message: "删除成功"
          });
        }
      });
    },
    // 获取解析后的JSON数组格式化
    jsonQueryFunction(array) {
      let returnArray = this.utils.clone(array);
      // 给json字段转格式
      returnArray.forEach((e) => {
        if (e["json"] && e["json"] instanceof String) {
          e["json"] = JSON.parse(e["json"]);
        }
      });
      // 过滤出来名字字段
      let returnName = returnArray.map((e) => {
        return e.name;
      });
      return { nameArray: returnName || "", array: returnArray || [] };
    },
    // 公共方法
    async sbFunction(index, array) {
      let urlString = "";
      let paramsString = {};
      switch (index) {
        case "add":
          // 删除和新增接口
          urlString = this.addUrl;
          paramsString = {
            businessType: "100", // 模块（根据接口文档应为"100"）
            code: this.code + this.userId || "",
            name: this.name || "",
            json: JSON.stringify(array),
            type: "os" // 根据接口文档需要添加 type 参数
          };
          break;
        case "get":
          // 查询
          urlString = this.getUrl;
          paramsString = {
            code: this.code + this.userId || "",
            type: "os" // 根据接口文档需要添加 type 参数
          };
          break;
        default:
          break;
      }
      let url = urlString;
      let params = paramsString;
      let sysToken = getSStore("token");
      // 后端接口要求 sysToken 作为 URL 参数，不能放在 body 的 params 中
      // 由于 http.js 会自动添加 sysToken 到 params，这里需要删除避免重复
      const res = await this.http.post(
        `${url}?sysToken=${sysToken}`,
        params,
        "application/json"
      );
      // 删除 http.js 自动添加的 sysToken（如果有）
      if (res && params.sysToken) {
        delete params.sysToken;
      }
      if (res && res.body) {
        if (res.code == 0) {
          if (index == "get") {
            // 只有查询接口才会返回数组进行赋值
            if (res.body && res.body.json) {
              this.predictionList = [];
              this.$nextTick(() => {
                this.predictionList = JSON.parse(res.body.json);
              });
            }
          }
          return true;
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
          return false;
        }
      }
    }
  },
  mounted() {},
  created() {
    this.sbFunction("get");
  },
  activated() {}
};
</script>
<style lang="scss" >
    #save-condition {
      display: inline-block;
      position: relative;
    }
    #dropdownItem {
      display: flex;
      justify-content: space-between;
    }
</style>
    