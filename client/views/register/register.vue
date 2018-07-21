<template>
    <el-form ref="form" label-width="80px" style="width:460px">
        <el-form-item label="用户名">
            <el-input v-model="userName"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input type="password" v-model="passWord"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
            <el-input type="password" v-model="confirmPassWord"></el-input>
        </el-form-item>
        <el-form-item v-show="errorMessage">
            <label style="color: red;">{{ errorMessage }}</label>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="primary" @click="back">返回</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import api from '../../model/model';
export default {
    data() {
        return {
            userName: '',
            passWord: '',
            confirmPassWord: '',
            errorMessage: ''
        }
    },
    async mounted() {
    },
    methods: {
        async save(e) {
            e.preventDefault();
            if (this.passWord !== this.confirmPassWord) {
                this.errorMessage = '两次输入的密码不同，请重新输入!';
                return;
            }

            let loadingInstance = this.$loading();
            let data = await api.register({
                userName: this.userName,
                passWord: this.passWord
            });
            loadingInstance.close();
            if (!data) {
                this.errorMessage = '账号已存在，请换个账号!';
                return;
            }

            this.$router.push('/login');
        },
        back() {
            this.$router.push('/login');
        }
    }
}
</script>

<style>
.register-button {
  margin-top: 10px;
  background-color: #409EFF;
}

.register-label {
  color: #fff;
}
</style>


