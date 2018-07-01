<template>
    <div>
        <mt-header>
            <div slot="left">{{canDraw ? '我画：': '提示：'}}{{drawName}}</div>
            <div slot="right">{{ gameTime}}</div>
        </mt-header>
        <draw ref="drawContext" :room-id="roomId" :can-draw="canDraw"></draw>
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
import { MessageBox } from 'mint-ui';

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
    },
    methods: {
        submitAnswer() {
            console.log("drawAnswer: ", this.drawAnswer);
            // 提交答案，然后由服务器返回结果并监听显示数据
            this.$webSocket.send(JSON.stringify({
                data: {
                    drawAnswer: this.drawAnswer,
                    roomId: this.roomId,
                    userId: Number(localStorage.getItem('userId')),
                    userName: localStorage.getItem('userName')
                },
                type: 'submitAnswer'
            }));
        }
    },
    watch: {
        gameInfo(newVal, oldVal) {
            this.canDraw = newVal.drawUserId === Number(localStorage.getItem('userId'));
            this.drawName = newVal.topicName || newVal.topicPrompt;
            this.gameTime = newVal.gameTime;
            this.roomUserList = newVal.roomUserList;

            // 判断游戏时间, 清空画布
            if (newVal.gameTime === 10) {
                this.$refs.drawContext.draw({ type: 'clear' });
                console.log("gameInfo newVal: ", newVal);
            }
        },
        showAnswerInfo(newVal, oldVal) {
            if (newVal.showAnswer) {
                // 弹窗
                MessageBox('本轮答案', this.showAnswerInfo.topicName);
                this.$store.commit('setShowAnswerInfo', { showAnswer: false });
            }
        },
        async gameOverData(newVal, oldVal) {
            if (newVal.showScore) {
                // 显示所有人的分数
                console.log("gameOverData newVal: ", newVal);
                this.$refs.drawContext.draw({ type: 'clear' });
                let result = await MessageBox({
                    title: '分数统计',
                    message: 'test',
                    closeOnClickModal: false
                });
                if (result === "confirm") {
                    this.$router.push({ name: 'room', params: { roomId: this.roomId } });
                }
                console.log("MessageBox result: ", result);
                this.$store.commit('setGameOverData', { showScore: false });
            }
        }
    },
    computed: {
        ...mapState({
            gameInfo: state => state.gameInfo,
            showAnswerInfo: state => state.showAnswerInfo,
            gameOverData: state => state.gameOverData
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