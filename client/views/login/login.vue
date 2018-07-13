<template>
    <form @submit="login">
        <mt-field label="用户名" placeholder="请输入用户名" v-model="userName"></mt-field>
        <mt-field type="password" label="密码" placeholder="请输入密码" v-model="passWord"></mt-field>
        <label v-show="errorMessage" style="color: red;">{{ errorMessage }}</label>
        <button type="submit" class="login-button mint-button mint-button--submit mint-button--large">
            <label class="login-label mint-button-text">登陆</label>
        </button>
        <button type="button" class="login-button mint-button mint-button--submit mint-button--large" @click="register">
            <label class="login-label mint-button-text">注册</label>
        </button>
    </form>
</template>

<script>
import api from '../../model/model';
import { Indicator } from 'mint-ui';

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
            Indicator.open('加载中...');
            let data = await api.login({
                userName: this.userName,
                passWord: this.passWord
            });
            Indicator.close();

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
    background-color: #26a2ff;
}

.login-label {
    color: #fff;
}
</style>


