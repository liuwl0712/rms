<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-05-26 16:09:24
 * @LastEditTime: 2021-07-06 16:02:37
-->
<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="header-header animate__animated animate__fadeInDown">
          <el-image
            class="header-header-image"
            :src="require('@/assets/img/system.png')"
            fit="cover"
          ></el-image>
          <span class="header-title">酬金管理系统</span>
        </div>
        <header-menu></header-menu>
        <div class="header-user">
          <div class="header-user-avatar">
            <el-dropdown
              class="header-user-avatar"
              placement="bottom-start"
            >
              <el-avatar :src="require('@/assets/img/user.png')"></el-avatar>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  icon="el-icon-key"
                  @click.native="dialogVisible = true;resetForm('ruleForm')"
                >修改密码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            </el-dropdown>
          </div>
          <span class="header-user-name">{{userName}}</span>
          <el-divider direction="vertical"></el-divider>
          <el-tooltip
            content="刷新页面"
            placement="bottom"
            effect="light"
          >
            <i
              class="el-icon-refresh"
              @click="refresh"
            ></i>
          </el-tooltip>
          <el-tooltip
            content="退出"
            placement="bottom"
            effect="light"
          >
            <el-image
              class="header-user-back"
              :src="require('@/assets/img/backTo.png')"
              fit="cover"
              @click="backTo"
            ></el-image>
          </el-tooltip>
        </div>
      </el-header>
      <el-container>
        <el-aside>
          <nav-menu class="nav-menu"></nav-menu>
        </el-aside>
        <el-main>
          <template>
            <el-backtop
              target=".el-main"
              :visibility-height="100"
              style="right: 90px;bottom: 40px;"
            ></el-backtop>
          </template>
          <div class="home-tags">
            <my-tags></my-tags>
          </div>
          <router-view
            v-if="isRouterAlive"
            class="main animate__animated animate__fadeIn"
          ></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="2.5rem"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="0.52rem"
        class="demo-ruleForm"
      >
        <el-form-item
          label="密码"
          prop="pass"
        >
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="checkPass"
        >
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import navMenu from "@/components/page/navMenu";
import headerMenu from "@/components/page/headerNav";
import Tags from "@/components/page/tags";
export default {
  name: "home",
  components: {
    //左侧菜单列表组件
    "nav-menu": navMenu,
    //顶部菜单列表组件
    "header-menu": headerMenu,
    //标签
    "my-tags": Tags,
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      //用户名
      userName: "",
      //页面刷新
      isRouterAlive: true,
      //模态框状态
      dialogVisible: false,
      //密码输入框
      ruleForm: {
        pass: "",
        checkPass: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "change" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }],
      },
    };
  },
  /**
   * 浏览器刷新，重定向到首页
   */
  created() {
    sessionStorage.setItem("routerName", []);
    this.userName = JSON.parse(sessionStorage.getItem("userInfo")).uname;
    this.findRoleAuthority(
      JSON.parse(sessionStorage.getItem("userInfo")).roleIds
    );
    if (this.$route.path !== "/homePage") {
      this.$router.replace({
        path: "/homePage",
      });
    }
  },
  methods: {
    /**
     * 修改密码
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const userId = JSON.parse(sessionStorage.getItem("userInfo")).userId;
          let arr = [];
          arr.push({ userId: userId, password: this.ruleForm.pass });
          this.$contract.resetPassword(arr).then((res) => {
            if (res.returnCode === "0") {
              this.dialogVisible = false;
              this.$messageCom("success", "密码修改成功", "1000");
            } else {
              this.$messageCom(
                "error",
                "密码修改失败，失败原因：" + res.returnMessage,
                "1500"
              );
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      try {
        this.$refs[formName].resetFields();
      } catch (error) {}
    },
    /**
     * 退出按钮
     */
    backTo() {
      this.$router.replace("/login");
    },
    /**
     * 刷新操作，指刷新当前页面，而不是整个浏览器刷新
     */
    refresh() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
    /**
     * 菜单激活回调
     * key: 选中菜单项的 index, keyPath: 选中菜单项的 index path
     * 路由跳转
     */
    handleSelect(key, keyPath) {
      this.$router.push("/" + key);
    },
    /**
     * 查找角色权限
     * 角色ID
     */
    findRoleAuthority(roleId) {
      this.$contract.findRoleAuthority(roleId).then((res) => {
        if (res.returnCode === "0") {
          let perms = res.object.authority.split(",");
          sessionStorage.setItem("routerName", perms);
          this.$store.dispatch("BTN_PERMISSION", perms);
        } else {
          this.$messageCom(
            "error",
            "获取权限数据失败，失败原因：" + res.returnMessage,
            "1000"
          );
        }
      });
    },
  },
};
</script>