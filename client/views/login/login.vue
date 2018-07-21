<template>
    <el-form ref="form" label-width="80px" style="width:460px">
        <el-form-item label="用户名">
            <el-input v-model="userName"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input type="password" v-model="passWord"></el-input>
        </el-form-item>
        <el-form-item v-show="errorMessage">
            <label style="color: red;">{{ errorMessage }}</label>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="login">登陆</el-button>
            <el-button type="primary" @click="register">注册</el-button>
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
            errorMessage: ''
        }
    },
    async mounted() {
        // let data = await api.getUserInfo();
    },
    methods: {
        async login(e) {
            e.preventDefault();
            let loadingInstance = this.$loading();
            let data = await api.login({
                userName: this.userName,
                passWord: this.passWord
            });
            loadingInstance.close();

            if (data.length > 0) {
                let rawData = data[0];
                this.errorMessage = '';
                localStorage.setItem('userName', rawData.userName);
                localStorage.setItem('userId', rawData.id);
                // this.$webSocket.send(JSON.stringify({
                //     data: {
                //         userId: Number(localStorage.getItem('userId'))
                //     },
                //     type: 'setWebSocketUserId'
                // }))

                this.$router.push('/home');
            } else {
                this.errorMessage = '用户名或者密码错误，请重试!';
            }
        },
        register() {
            this.$router.push('/register');
        }
    }
}
</script>

<style>
.login-button {
  margin-top: 10px;
  background-color: #409EFF;
}

.login-label {
  color: #fff;
}
</style>


