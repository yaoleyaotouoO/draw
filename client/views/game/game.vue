<template>
    <div>
        <mt-header>
            <div slot="left">我画：{{drawName}} ({{drawType}})</div>
            <div slot="right">{{ countDown}}</div>
        </mt-header>
        <draw :room-id="roomId" :can-draw="canDraw"></draw>
    </div>
</template>

<script>
import Draw from './draw.vue';

import api from '../../model/model';
import roomVue from '../room/room.vue';

export default {
    components: { Draw },
    data() {
        return {
            drawName: '摇了摇头',
            drawType: '词语',
            countDown: 90,
            roomId: null,
            canDraw: false
        }
    },
    async mounted() {
        this.roomId = this.$route.query.roomId;
        if (!this.roomId) {
            let data = await api.getRoomIdByUserId(Number(localStorage.getItem('userId')));
            this.roomId = data;
            this.$store.commit('setRoomId', this.roomId);
        }

        let users = await api.getRoomUserListByRoomId(this.roomId);
        if (users ? users[0].userId : null === Number(localStorage.getItem('userId'))
            && users ? users[0].userName : null === localStorage.getItem('userName')) {
            this.canDraw = true;
        }
    }
}
</script>

<style>
.game-spacing {
    margin-top: 4px;
    margin-bottom: 4px;
    float: left;
}
</style>