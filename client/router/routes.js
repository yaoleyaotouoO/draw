// import App from '../App.vue';
// import Login from '../views/login/login.vue';
// import Home from '../views/home/home.vue';
// import Room from '../views/room/room.vue';
// import Game from '../views/game/game.vue';

export default [
    {
        path: '/',
        component: () => import('../App.vue')
    },
    {
        path: '/login',
        component: () => import('../views/login/login.vue')
    },
    {
        path: '/register',
        component: () => import('../views/register/register.vue')
    },
    {
        path: '/home',
        component: () => import('../views/home/home.vue')
    },
    {
        name: 'room',
        path: '/room/:roomId',
        component: () => import('../views/room/room.vue')
    },
    {
        name: 'game',
        path: '/game/:roomId',
        component: () => import('../views/game/game.vue')
    }
]