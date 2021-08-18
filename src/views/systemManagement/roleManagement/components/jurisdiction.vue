<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-07-01 18:27:48
 * @LastEditTime: 2021-07-08 15:40:39
-->

<template>
  <div v-loading="formLoading">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="never">
          <div>
            <h2>权限配置</h2>
          </div>
          <el-tree
            :expand-on-click-node="false"
            :check-on-click-node="true"
            @check="getData"
            show-checkbox
            node-key="id"
            :data="data"
            :check-strictly="true"
            default-expand-all
            ref="tree"
            class="jurisdiction_tree"
          ></el-tree>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <div>
            <h2>已赋予权限（{{keyarr.length}}）</h2>
          </div>
          <div class="el-tree-node__label jurisdiction_tree">
            <ul>
              <li
                v-for="(item,index) in nodeArr"
                :key="index"
              >
                <div>
                  <i
                    class="el-icon-unlock"
                    style="margin-right:0.05rem"
                  ></i>
                  <span>{{item.label}}</span>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="demo-ruleForm-btn">
      <el-button
        type="primary"
        @click="save"
      >保存权限</el-button>
    </div>
  </div>
</template>
<script>
import jurisdiction from "@/assets/json/jurisdiction.json";
export default {
  props: ["passItem"],
  data() {
    return {
      // 已赋予权限数组
      keyarr: [],
      // 已赋予权限列表
      nodeArr: [],
      // 权限数据结构
      data: jurisdiction,
      //模态框loading状态
      formLoading: false,
    };
  },
  watch: {},
  mounted() {
    this.formLoading = true;
    this.findRoleAuthority(this.passItem.roleId);
  },
  methods: {
    /**
     * 保存角色权限
     * keyarr：权限数组
     */
    save() {
      let params = {
        list: this.keyarr,
        roleId: this.passItem.roleId,
      };
      this.$contract.addAuthority(params).then((res) => {
        if (res.returnCode === "0") {
          this.$messageCom("success", "权限更改成功", "1000");
          if (
            JSON.parse(sessionStorage.getItem("userInfo")).roleIds ===
            this.passItem.roleId
          ) {
            sessionStorage.setItem("routerName", this.keyarr);
            this.$store.dispatch("BTN_PERMISSION", this.keyarr);
          }
          this.$emit("submitForm");
        } else {
          this.$messageCom(
            "error",
            "权限更改失败，失败原因：" + res.returnMessage,
            "1000"
          );
        }
      });
    },
    /**
     * 查找角色权限
     * 角色ID
     */
    findRoleAuthority(roleId) {
      this.$contract.findRoleAuthority(roleId).then((res) => {
        if (res.returnCode === "0") {
          this.keyarr = res.object.authority.split(",");
          this.setCheckedKeys(this.keyarr);
        } else {
          this.$messageCom(
            "error",
            "获取权限数据失败，失败原因：" + res.returnMessage,
            "1000"
          );
        }
        this.formLoading = false;
      });
    },
    /**
     * 当复选框被点击的时候触发
     * 传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象。
     */
    getData(data) {
      const node = this.$refs.tree.getNode(data.id);
      this.setNode(node);
      this.keyarr = [];
      let checkList = this.$refs.tree.getCheckedKeys();
      if (checkList.length != 0) {
        for (var i = 0; i < checkList.length; i++) {
          this.keyarr.push(checkList[i]);
        }
      } else {
        this.keyarr = [];
      }
      this.setCheckedKeys(this.keyarr);
    },
    /**
     * 通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性
     */
    setCheckedKeys(arr) {
      this.$refs.tree.setCheckedKeys(arr);
      this.nodeArr = [];
      arr.forEach((item) => {
        if (this.$refs.tree.getNode(item) != null) {
          this.nodeArr.push(this.$refs.tree.getNode(item).data);
        }
      });
    },
    //递归设置子节点和父节点
    setNode(node) {
      if (node.checked) {
        //如果当前是选中checkbox,则递归设置父节点和父父节点++选中
        this.setParentNode(node);
      } else {
        //如果当前是取消选中checkbox,则递归设置子节点全部取消选中
        this.setChildNode(node);
      }
    },
    //递归设置父节点全部选中
    setParentNode(node) {
      if (node.parent) {
        for (const key in node) {
          if (key === "parent") {
            node[key].checked = true;
            this.setParentNode(node[key]);
          }
        }
      }
    },
    //递归设置子节点全部取消选中
    setChildNode(node) {
      if (node.childNodes && node.childNodes.length) {
        node.childNodes.forEach((item) => {
          item.checked = false;
          this.setChildNode(item);
        });
      }
    },
  },
};
</script>