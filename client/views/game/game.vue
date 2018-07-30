<template>
    <el-container>
        <el-dialog title="分数统计" :visible.sync="showScoreTable" width="100%" :close-on-click-modal="false" :close-on-press-escape="false" @close="scoreTableClose">
            <el-table :data="gameOverScoreList">
                <el-table-column property="userName" label="用户名" width="300px"></el-table-column>
                <el-table-column property="score" label="总分" width="300px"></el-table-column>
            </el-table>
        </el-dialog>
        <el-header class="draw-game-el-header" height="6%">
            <el-row>
                <el-col class="draw-game-el-col-left" :span="8">
                    <p>时间</p>
                    <p>{{gameTime}}</p>
                </el-col>
                <el-col class="draw-game-el-col-center" :span="8">
                    <p>{{canDraw ? '题目': '提示'}}</p>
                    <p>{{drawName}}</p>
                </el-col>
                <el-col class="draw-game-el-col-right" :span="8">
                    <el-button class="draw-game-el-button-exit-game" size="normal" type="primary" @click="exitGame">退出游戏</el-button>
                </el-col>
            </el-row>
        </el-header>
        <el-main class="draw-game-el-main">
            <div class="draw-game-el-main-center">
                <draw class="draw-game-draw" ref="drawContext" :room-id="roomId" :can-draw="canDraw"></draw>
            </div>
            <div class="draw-game-el-main-bottom">
                <el-row class="draw-game-el-main-el-row">
                    <el-col class="draw-game-el-col-option-left" :span="5">
                        <div class="draw-game-user-info" v-for="item in roomUserList.slice(0, 3)" :key="item.userId">
                            <el-badge :value="item.score ? item.score : 0" :max="99" class="item">
                                <img :src="defaultProfile" class="draw-game-user-icon">
                            </el-badge>
                            <p class="draw-game-user-name">{{item.userName}}</p>
                        </div>
                    </el-col>
                    <el-col class="draw-game-el-col-option-center" :span="14">
                        <div ref="chatMessageDom" class="draw-game-user-chat-record">
                            <p v-for="(value, index) in chatMessageList" :key="index">{{value}}</p>
                        </div>
                    </el-col>
                    <el-col class="draw-game-el-col-option-right" :span="5">
                        <div class="draw-game-user-info" v-for="item in roomUserList.slice(3, 6)" :key="item.userId">
                            <el-badge :value="item.score ? item.score : 0" :max="99" class="item">
                                <img :src="defaultProfile" class="draw-game-user-icon">
                            </el-badge>
                            <p class="draw-game-user-name">{{item.userName}}</p>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-main>
        <el-footer v-if="canDraw" class="draw-game-el-footer-can-draw" height="6%"></el-footer>
        <el-footer v-else class="draw-game-el-footer" height="6%">
            <el-row>
                <el-col :span="18">
                    <input placeholder="输入答案" class="draw-game-draw-answer" v-model="drawAnswer" />
                </el-col>
                <el-col class="draw-game-el-col-submit-answer" :span="6">
                    <el-button class="draw-game-submit-answer" size="normal" type="primary" @click="submitAnswer" @keyup.enter="submitAnswer">提交</el-button>
                </el-col>
            </el-row>
        </el-footer>
    </el-container>
</template>

<script>
import Draw from './draw.vue';
import api from '../../model/model';
import { mapState } from 'vuex';
import defaultProfile from '../../assets/images/profile.jpg';
import { RoomUserStatusEnum } from '../../common/enums';

export default {
    components: { Draw },
    data() {
        return {
            showScoreTable: false,
            drawName: '',
            gameTime: 0,
            roomId: null,
            canDraw: false,
            drawAnswer: '',
            roomUserList: [],
            defaultProfile: defaultProfile,
            chatMessageList: []
        }
    },
    mounted() {
        this.roomId = this.$route.params.roomId;
    },
    methods: {
        submitAnswer() {
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

            this.drawAnswer = '';
        },
        async exitGame() {
            await api.deleteRoomUserByUserId({ roomId: this.roomId, userId: Number(localStorage.getItem('userId')) });
            this.$router.push({ name: 'home' });
        },
        async scoreTableClose() {
            // 游戏结束，返回到room界面, 应该设置用户状态为准备状态
            await api.updateRoomUserStatusByUserId({ userId: Number(localStorage.getItem('userId')), roomId: this.roomId, status: RoomUserStatusEnum.Ready })
            this.$router.push({ name: 'room', params: { roomId: this.roomId } });
        }
    },
    watch: {
        gameInfo(newVal, oldVal) {
            this.canDraw = newVal.drawUserId === Number(localStorage.getItem('userId'));
            this.drawName = newVal.topicName || newVal.topicPrompt;
            this.gameTime = newVal.gameTime;
            this.roomUserList = newVal.roomUserList;
            const oneRoundTime = 20;
            // 判断游戏时间, 清空画布
            if (newVal.gameTime === oneRoundTime) {
                this.$refs.drawContext.draw({ type: 'clear' });
            }
        },
        showAnswerInfo(newVal, oldVal) {
            if (newVal.showAnswer) {
                // 弹窗
                this.$alert(this.showAnswerInfo.topicName, '本轮答案', {
                    confirmButtonText: '确定',
                    callback: action => {
                        console.log("action: ", action);
                    }
                });
                this.$store.commit('setShowAnswerInfo', { showAnswer: false });
            }
        },
        showChatMessage(newVal, oldVal) {
            if (newVal.showChatMessage) {
                // 插入到消息中
                if (this.chatMessageList.length > 20) {
                    this.chatMessageList.shift();
                }
                this.chatMessageList.push(newVal.chatMessage);
                let chatMessageDom = this.$refs.chatMessageDom;
                console.log("chatMessageDom: ", chatMessageDom);
                console.log("chatMessageDom: ", chatMessageDom.scrollTop);
                console.log("chatMessageDom: ", chatMessageDom.scrollHeight);
                chatMessageDom.scrollTop = chatMessageDom.scrollHeight + chatMessageDom.scrollTop;

                this.$store.commit('setChatMessage', { showChatMessage: false });
            }
        },
        roomUserScoreList(newVal, oldVal) {
            // 接收到新的分数
            console.log("roomUserScoreList: ", newVal);
            this.roomUserList = this.roomUserList.map(x => {
                if (x.userId) {
                    x.score = newVal.filter(y => y.userId === x.userId).shift().score;
                }
                return x;
            });
        },
        async gameOverScoreList(newVal, oldVal) {
            // 显示所有人的分数
            console.log("gameOverData newVal: ", newVal);
            this.$refs.drawContext.draw({ type: 'clear' });
            this.showScoreTable = true;
        }
    },
    computed: {
        ...mapState({
            gameInfo: state => state.gameInfo,
            showAnswerInfo: state => state.showAnswerInfo,
            showChatMessage: state => state.showChatMessage,
            gameOverScoreList: state => state.gameOverScoreList,
            roomUserScoreList: state => state.roomUserScoreList
        })
    }
}
</script>

<style>
p {
  margin: 0;
}

.el-badge__content.is-fixed {
  right: 15px;
}

.draw-game-el-button-exit-game {
  color: black;
}

.draw-game-el-main-el-row {
  height: 100%;
}

.draw-game-el-col-submit-answer {
  text-align: center;
}

.draw-game-submit-answer {
  width: 90%;
  height: 100%;
}

.draw-game-draw-answer {
  text-align: left;
  border: 1px solid #409eff;
  background-color: transparent;
  color: #000;
  display: block;
  width: 100%;
  font-size: 18px;
  height: 100%;
  outline: 0;
  position: relative;
}

.draw-game-user-chat-record {
  background-color: white;
  overflow: auto;
  height: 90%;
  width: 90%;
  word-wrap: break-word;
  border-radius: 15px;
  border: 1px solid #409eff;
  margin: auto;
  margin-top: 10px;
}

.draw-game-user-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.draw-game-user-info {
  padding-top: 10px;
  text-align: center;
}

.draw-game-user-name {
  margin-top: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: auto;
  background-color: #409eff;
  color: white;
  /* color: black; */
  font-size: 10px;
  border-radius: 15px;
  text-align: center;
}

.draw-game-el-main-bottom {
  height: 34%;
}

.draw-game-el-col-option-left {
  height: 100%;
}

.draw-game-el-col-option-center {
  height: 100%;
}

.draw-game-el-col-option-right {
}

.draw-game-el-col-left {
  padding-left: 20px;
}

.draw-game-el-col-center {
  text-align: center;
}

.draw-game-el-col-right {
  text-align: right;
}

.draw-game-draw {
  /* background-color: white; */
  height: 100%;
}

.draw-game-el-main-center {
  height: 66%;
}

.draw-game-el-main {
  padding: 0px;
  background-color: #87cefa;
  height: 88%;
}

.draw-game-el-footer {
  padding: 0px;
  background-color: white;
}

.draw-game-el-footer-can-draw {
  padding: 0px;
  background-color: #87cefa;
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