<template>
    <form @submit="save">
        <mt-field label="用户名" placeholder="请输入用户名" v-model="userName"></mt-field>
        <mt-field type="password" label="密码" placeholder="请输入密码" v-model="passWord"></mt-field>
        <mt-field type="password" label="密码" placeholder="请再次确定密码" v-model="confirmPassWord"></mt-field>
        <label v-show="errorMessage" style="color: red;">{{ errorMessage }}</label>
        <button type="submit" class="register-button mint-button mint-button--submit mint-button--large">
            <label class="register-label mint-button-text">保存</label>
        </button>
        <button type="button" class="register-button mint-button mint-button--submit mint-button--large" @click="back">
            <label class="register-label mint-button-text">返回</label>
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

            Indicator.open('加载中...');
            let data = await api.register({
                userName: this.userName,
                passWord: this.passWord
            });
            Indicator.close();
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
    background-color: #26a2ff;
}

.register-label {
    color: #fff;
}
</style>


