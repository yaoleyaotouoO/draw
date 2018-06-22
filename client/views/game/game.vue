<template>
    <div>
        <mt-header>
            <div slot="left">我画：{{drawName}} ({{drawType}})</div>
            <div slot="right">{{ countDown}}</div>
        </mt-header>
        <draw :room-id="roomId" :can-draw="canDraw"></draw>
        <div v-if="!canDraw" class="game-features">
            <input placeholder="输入答案" class="game-input" v-model="drawAnswer"></input>
            <mt-button class="game-button" size="normal" type="primary" @click="submitAnswer">提交</mt-button>
        </div>
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
            canDraw: false,
            drawAnswer: ''
        }
    },
    async mounted() {
        this.roomId = this.$route.params.roomId;

        let users = await api.getRoomUserListByRoomId(this.roomId);
        if ((users ? users[0].userId : null) === Number(localStorage.getItem('userId'))
            && (users ? users[0].userName : null) === localStorage.getItem('userName')) {
            this.canDraw = true;
        }
    },
    methods: {
        submitAnswer() {
            console.log("drawAnswer: ", this.drawAnswer);
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

.game-features {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.game-input {
    margin: 5px;
    text-align: left;
    border: 1px solid #26a2ff;
    background-color: transparent;
    color: #000;
    display: block;
    width: 100%;
    font-size: 18px;
    height: 41px;
    outline: 0;
    position: relative;
}

.game-button {
    margin: 5px;
    width: 100px;
}
</style>