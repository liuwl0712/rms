<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-05-27 10:31:37
 * @LastEditTime: 2021-07-05 16:18:02
-->
<template>
  <div class="login">
    <div class="login-left">
      <div class="login-background">
        <div class="login-title animate__animated animate__fadeInLeft">
          <el-image
            class="login-title-logo"
            :src="require('@/assets/img/logo.png')"
            fit="cover"
          ></el-image>
          <span class="login-title-cont">酬金管理系统 RMS</span>
        </div>
        <el-image
          class="login-background-image"
          :src="require('@/assets/img/login.png')"
          fit="cover"
        ></el-image>
      </div>
    </div>
    <div class="login-right">
      <el-card
        shadow="hover"
        class="login-card animate__animated animate__fadeInRight"
      >
        <div class="login-card-title">
          <div class="login-card-title-cont">登录</div>
        </div>
        <div class="login-cont">
          <el-form
            ref="logFrom"
            :model="logFrom"
            :rules="ruleInline"
          >
            <el-form-item
              prop="userName"
              class="login-from-cont"
            >
              <div class="login-cont-div">
                <span class="login-cont-user">账 号</span>
                <el-input
                  class="login-cont-input"
                  placeholder="请输入账号"
                  clearable
                  v-model="logFrom.userName"
                  :disabled="logInLoading"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item
              prop="password"
              class="login-from-cont"
            >
              <div class="login-cont-div">
                <span class="login-cont-password">密 码</span>
                <el-input
                  class="login-cont-input"
                  placeholder="请输入密码"
                  show-password
                  clearable
                  v-model="logFrom.password"
                  :disabled="logInLoading"
                ></el-input>
              </div>
            </el-form-item>
          </el-form>
          <el-button
            type="primary"
            class="login-cont-btn1"
            @click="logIn('logFrom')"
            :loading="logInLoading"
          >登 录</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //登录表单
      logFrom: {
        userName: "",
        password: "",
      },
      //登录表单验证
      ruleInline: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "change" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
        ],
      },
      //登录按钮，表单状态的加载、禁用
      logInLoading: false,
    };
  },
  created() {
    sessionStorage.clear();
  },
  methods: {
    /**
     * 登录校验，封装的isUser接口。
     * 返回登录信息，储存用户信息到sessionStorage缓存
     * 返回菜单权限信息，保存在sessionStorage缓存
     */
    logIn(val) {
      this.logInLoading = true;
      this.$refs[val].validate((valid) => {
        if (valid) {
          const params = {
            userCode: this.logFrom.userName,
            password: this.logFrom.password,
          };
          this.$contract.isUser(params).then((res) => {
            this.logInLoading = false;
            if (res.returnCode === "0") {
              sessionStorage.setItem("userInfo", JSON.stringify(res.object));
              this.$message.success({
                message: "登录成功，欢迎：" + res.object.uname + "！",
                center: true,
                duration: 1500,
              });
              this.$router.push("/home");
            } else {
              this.$message({
                showClose: true,
                message: res.returnMessage,
                type: "warning",
                duration: 1500,
              });
            }
          });
        } else {
          this.logInLoading = false;
          return false;
        }
      });
    },
  },
};
</script>