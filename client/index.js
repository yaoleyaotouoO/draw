import Vue from 'vue';
import App from './app.vue';
import Mint from 'mint-ui';
import VueX from 'vuex';
import VueRouter from 'vue-router';
import createRouter from './router/router';
import createStore from './store/store';

import 'mint-ui/lib/style.css';

Vue.use(VueRouter);
Vue.use(VueX);
Vue.use(Mint);

const router = createRouter();
const store = createStore();

router.beforeEach((to, from, next) => {
    if (!Vue.prototype.$webSocket) {
        const webSocket = new WebSocket('ws://192.168.0.103:3333/ws/');
        webSocket.onmessage = (event) => {
            console.log("webSocket onmessage: ", event.data);
            var data = JSON.parse(event.data);
            switch (data.type) {
                case 'addRoom':
                    store.commit('addRoomList', data.data);
                    break;
                case 'addRoomUser':
                    if (data.data.roomId === store.state.roomId) {
                        store.commit('addRoomUser', {
                            userId: data.data.userId,
                            userName: data.data.userName
                        });
                    }
                    break;
                case 'startGame':
                    if (data.data.roomId === store.state.roomId) {
                        next({ path: '/game', query: { roomId: data.data.roomId } })
                        //    router.replace({ name: 'game', params: { roomId: data.data.roomId } })
                    }

                    break;
                case 'drawPicture':
                    if (data.data.roomId === store.state.roomId) {
                        console.log('data: ', data.data);
                        store.commit('drawPicture', data.data);
                    }

                    break;
                default:
                    console.log("datatype: ", data.type);
                    console.warn('webSocket onmessage not type!');
            }
        }

        Vue.prototype.$webSocket = webSocket;
    }

    if ((!localStorage.getItem('userName') || !localStorage.getItem('userId')) && to.fullPath !== '/login') {
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

document.addEventListener('touchmove', e => {
    e.preventDefault()
}, false);