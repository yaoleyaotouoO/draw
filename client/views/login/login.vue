<template>
    <form @submit="login">
        <mt-field label="用户名" placeholder="请输入用户名" v-model="userName"></mt-field>
        <mt-field type="password" label="密码" placeholder="请输入密码" v-model="passWord"></mt-field>
        <label v-show="errorMessage" style="color: red;">{{ errorMessage }}</label>
        <button type="submit" class="login-button mint-button mint-button--submit mint-button--large">
            <label class="login-label mint-button-text">登陆</label>
        </button>
    </form>
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
            let data = await api.login({
                userName: this.userName,
                passWord: this.passWord
            });

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
                this.errorMessage = 'userName or password error!';
            }
        }
    }
}
</script>

<style>
.login-button {
    background-color: #26a2ff;
}

.login-label {
    color: #fff;
}
</style>


