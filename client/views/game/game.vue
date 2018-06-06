<template>
    <div>
        <div>
            <p class="game-spacing">我画: {{drawName}} ({{drawType}})</p>
            <p style="float:right;" class="game-spacing">{{countDown}}</p>
        </div>
        <draw :room-id="roomId" :can-draw="canDraw"></draw>
    </div>
</template>

<script>
import Draw from './draw.vue';

import api from '../../model/model';

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
        console.log("this.$route: ", this.$route);
        console.log("roomId: ", this.roomId);
        let users = await api.getRoomUserList(this.roomId);
        if (users[0].userId === Number(localStorage.getItem('userId')) 
            && users[0].userName === localStorage.getItem('userName')) {
            this.canDraw = true;
        }
        console.log("users: ", users);
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