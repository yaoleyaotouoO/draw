<template>
    <el-container>
        <!-- <el-button type="text" @click="dialogTableVisible = true">打开嵌套表格的 Dialog</el-button>
                                        <el-dialog title="收货地址" :visible.sync="dialogTableVisible" width="100%" :close-on-click-modal="false" :close-on-press-escape="false">
                                            <el-table :data="gridData">
                                                <el-table-column property="date" label="日期" width="300px"></el-table-column>
                                                <el-table-column property="name" label="姓名" width="300px"></el-table-column>
                                            </el-table>
                                        </el-dialog> -->
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
                    <el-button class="draw-game-el-button-exit-game" size="normal" type="primary">退出游戏</el-button>
                </el-col>
            </el-row>
        </el-header>
        <el-main class="draw-game-el-main">
            <div class="draw-game-el-main-center">
                <draw class="draw-game-draw" ref="drawContext" :room-id="roomId" :can-draw="canDraw"></draw>
            </div>
            <div class="draw-game-el-main-bottom">
                <el-row class="draw-game-el-main-el-row">
                    <el-col class="draw-game-el-col-option-left" :span="4">
                        <div class="draw-game-user-info" v-for="item in roomUserList.slice(0, 3)" :key="item.userId">
                            <img :src="defaultProfile" class="draw-game-user-icon">
                            <p class="draw-game-user-name">{{item.userName}}</p>
                        </div>
                        <!-- <div class="draw-game-user-info">
                            <img :src="defaultProfile" class="draw-game-user-icon">
                            <p class="draw-game-user-name">摇了摇头oO</p>
                        </div>
                        <div class="draw-game-user-info">
                            <img :src="defaultProfile" class="draw-game-user-icon">
                            <p class="draw-game-user-name">摇了摇头oO</p>
                        </div>
                        <div class="draw-game-user-info">
                            <img :src="defaultProfile" class="draw-game-user-icon">
                            <p class="draw-game-user-name">摇了摇头oO</p>
                        </div> -->
                    </el-col>
                    <el-col class="draw-game-el-col-option-center" :span="16">
                        <div class="draw-game-user-chat-record">
                            <p v-for="value in chatMessageList" :key="value">{{value}}</p>
                        </div>
                    </el-col>
                    <el-col class="draw-game-el-col-option-right" :span="4">
                        <div class="draw-game-user-info" v-for="item in roomUserList.slice(3, 6)" :key="item.userId">
                            <img :src="defaultProfile" class="draw-game-user-icon">
                            <p class="draw-game-user-name">{{item.userName}}</p>
                        </div>
                        <!-- <div class="draw-game-user-info">
                            <img :src="defaultProfile" class="draw-game-user-icon">
                            <p class="draw-game-user-name">摇了摇头oO</p>
                        </div>
                        <div class="draw-game-user-info">
                            <img :src="defaultProfile" class="draw-game-user-icon">
                            <p class="draw-game-user-name">摇了摇头oO</p>
                        </div>
                        <div class="draw-game-user-info">
                            <img :src="defaultProfile" class="draw-game-user-icon">
                            <p class="draw-game-user-name">摇了摇头oO</p>
                        </div> -->
                    </el-col>
                </el-row>
            </div>
        </el-main>
        <el-footer class="draw-game-el-footer" height="6%">
            <el-row>
                <el-col :span="18">
                    <input placeholder="输入答案" class="draw-game-draw-answer" v-model="drawAnswer" />
                </el-col>
                <el-col class="draw-game-el-col-submit-answer" :span="6">
                    <el-button class="draw-game-submit-answer" size="normal" type="primary" @click="submitAnswer">提交</el-button>
                </el-col>
            </el-row>
        </el-footer>
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
import defaultProfile from '../../assets/images/profile.jpg';
import { RoomUserStatusEnum } from '../../common/enums';

export default {
    components: { Draw },
    data() {
        return {
            gridData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }],
            dialogTableVisible: false,
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
    async mounted() {
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
        },
        async exitGame() {
            await api.deleteRoomUserByUserId({ roomId: this.roomId, userId: Number(localStorage.getItem('userId')) });
            this.$router.push({ name: 'home' });
        }
    },
    watch: {
        gameInfo(newVal, oldVal) {
            this.canDraw = newVal.drawUserId === Number(localStorage.getItem('userId'));
            this.drawName = newVal.topicName || newVal.topicPrompt;
            this.gameTime = newVal.gameTime;
            this.roomUserList = newVal.roomUserList;
            const oneRoundTime = 100;
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

                this.$store.commit('setChatMessage', { showChatMessage: false });
            }
        },
        async gameOverData(newVal, oldVal) {
            if (newVal.showScore) {
                // 显示所有人的分数
                console.log("gameOverData newVal: ", newVal);
                this.$refs.drawContext.draw({ type: 'clear' });

                let result = await this.$alert('test', '分数统计', {
                    confirmButtonText: '确定'
                });
                console.log(`result: ${result}`)
                if (result === "confirm") {
                    // 游戏结束，返回到room界面, 应该设置用户状态为准备状态
                    await api.updateRoomUserStatusByUserId({ userId: Number(localStorage.getItem('userId')), roomId: this.roomId, status: RoomUserStatusEnum.Ready })
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
            showChatMessage: state => state.showChatMessage,
            gameOverData: state => state.gameOverData
        })
    }
}
</script>

<style>
p {
  margin: 0;
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