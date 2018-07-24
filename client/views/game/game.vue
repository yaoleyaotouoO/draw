<template>
    <el-container>
        <el-header class="draw-game-el-header" height="6%">
            <el-row>
                <el-col class="draw-game-el-col-left" :span="8">
                    <p>111</p>
                    <p>222</p>
                </el-col>
                <el-col class="draw-game-el-col-center" :span="8">
                    <p>111</p>
                    <p>222</p>
                </el-col>
                <el-col class="draw-game-el-col-right" :span="8">
                    333
                </el-col>
            </el-row>
        </el-header>
        <el-main class="draw-game-el-main">
            <div class="draw-game-center">
                <draw class="draw-game-draw" ref="drawContext" :room-id="roomId" :can-draw="canDraw"></draw>
            </div>
            <div class="draw-game-artboard-options">
                
            </div>
        </el-main>
        <el-footer class="draw-game-el-footer" height="6%">Footer</el-footer>
    </el-container>
    <!-- <el-container>
        <el-header class="draw-game-el-header" height="30px">
            <div class="draw-game-header-draw-name">{{canDraw ? '我画：': '提示：'}}{{drawName}}</div>
            <div class="draw-game-header-game-time">{{gameTime}}</div>
        </el-header>
        <el-main class="draw-game-el-main">
            <draw ref="drawContext" :room-id="roomId" :can-draw="canDraw"></draw>
            <div v-if="!canDraw" class="game-features">
                <input placeholder="输入答案" class="game-input" v-model="drawAnswer" />
                <el-button class="game-button" size="normal" type="primary" @click="submitAnswer">提交</el-button>
            </div>
        </el-main>
    </el-container> -->
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
    // watch: {
    //     gameInfo(newVal, oldVal) {
    //         this.canDraw = newVal.drawUserId === Number(localStorage.getItem('userId'));
    //         this.drawName = newVal.topicName || newVal.topicPrompt;
    //         this.gameTime = newVal.gameTime;
    //         this.roomUserList = newVal.roomUserList;

    //         // 判断游戏时间, 清空画布
    //         if (newVal.gameTime === 10) {
    //             this.$refs.drawContext.draw({ type: 'clear' });
    //             console.log("gameInfo newVal: ", newVal);
    //         }
    //     },
    //     showAnswerInfo(newVal, oldVal) {
    //         if (newVal.showAnswer) {
    //             // 弹窗
    //             this.$alert(this.showAnswerInfo.topicName, '本轮答案', {
    //                 confirmButtonText: '确定',
    //                 callback: action => {
    //                     console.log("action: ", action);
    //                 }
    //             });
    //             this.$store.commit('setShowAnswerInfo', { showAnswer: false });
    //         }
    //     },
    //     async gameOverData(newVal, oldVal) {
    //         if (newVal.showScore) {
    //             // 显示所有人的分数
    //             console.log("gameOverData newVal: ", newVal);
    //             this.$refs.drawContext.draw({ type: 'clear' });

    //             let result = await this.$alert('test', '分数统计', {
    //                 confirmButtonText: '确定'
    //             });
    //             console.log(`result: ${result}`)
    //             if (result === "confirm") {
    //                 this.$router.push({ name: 'room', params: { roomId: this.roomId } });
    //             }
    //             console.log("MessageBox result: ", result);
    //             this.$store.commit('setGameOverData', { showScore: false });
    //         }
    //     }
    // },
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
p {
  margin: 0;
}

.draw-game-el-col-left {
  padding-left: 20px;
}

.draw-game-el-col-center {
  text-align: center;
}

.draw-game-el-col-right {
  padding-right: 20px;
  text-align: right;
}

.draw-game-artboard-options {
  margin-top: 10px;
  background-color: #a4d3ee;
  height: 40px;
}

.draw-game-draw {
  margin: 10 20 10 20;
  background-color: white;
  height: 100%;
}

.draw-game-center {
  height: 50%;
}

.draw-game-el-main {
  padding: 0px;
  background-color: #87cefa;
  height: 88%;
}

.draw-game-el-footer {
  background-color: white;
}

.draw-game-el-header {
  padding: 0px;
  background-color: #409eff;
}

.draw-game-header-draw-name {
  color: white;
  float: left;
}

.draw-game-header-game-time {
  color: white;
  float: right;
}

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
  border: 1px solid #409eff;
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