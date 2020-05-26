import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import VueX from 'vuex';
import VueRouter from 'vue-router';
import createRouter from './router/router';
import createStore from './store/store';
import createWebSocket from './websocket';

import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/iconfont/iconfont.js';
import './assets/styles/global.css';

Vue.use(VueRouter);
Vue.use(VueX);
Vue.use(ElementUI);

const router = createRouter();
const store = createStore();

router.beforeEach((to, from, next) => {
    if (!Vue.prototype.$webSocket) {
        Vue.prototype.$webSocket = createWebSocket(router, store);
    }

    if ((!localStorage.getItem('userName') || !localStorage.getItem('userId')) && to.fullPath !== '/login' && to.fullPath !== '/register') {
        next({ path: '/login' })
    } else if (to.fullPath === '/') {
        next({ path: '/home' })
    } else {
        next();
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

// 阻止拖动屏幕
document.addEventListener('touchmove', e => {
    e.preventDefault()
}, false);