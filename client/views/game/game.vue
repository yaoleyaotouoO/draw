<template>
    <div>
        <mt-header>
            <div slot="left">{{canDraw ? '我画：': '提示：'}}{{drawName}}</div>
            <div slot="right">{{ gameTime}}</div>
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
import { mapState } from 'vuex';

export default {
    components: { Draw },
    data() {
        return {
            drawName: '',
            gameTime: 0,
            roomId: null,
            canDraw: false,
            drawAnswer: '',
            roomUserList: []
        }
    },
    async mounted() {
        this.roomId = this.$route.params.roomId;

        // let users = await api.getRoomUserListByRoomId(this.roomId);
        // if ((users ? users[0].userId : null) === Number(localStorage.getItem('userId'))
        //     && (users ? users[0].userName : null) === localStorage.getItem('userName')) {
        //     this.canDraw = true;
        // }
    },
    methods: {
        submitAnswer() {
            console.log("drawAnswer: ", this.drawAnswer);
        }
    },
    watch: {
        gameInfo(newVal, oldVal) {
            this.canDraw = newVal.drawUserId === Number(localStorage.getItem('userId'));
            this.drawName = newVal.topicName || newVal.topicPrompt;
            this.gameTime = newVal.gameTime;
            this.roomUserList = newVal.roomUserList;
            console.log("newVal: ", newVal);
        },
        showAnswerInfo(newVal, oldVal) {
            if (newVal.showAnswer) {
                // 弹窗
                this.showAnswerInfo = Object.assign({}, this.showAnswerInfo, { showAnswer: false });
            }
        }
    },
    computed: {
        ...mapState({
            gameInfo: state => state.gameInfo,
            showAnswerInfo: state => state.showAnswerInfo
        })
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