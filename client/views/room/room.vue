<template>
    <el-container>
        <!-- <div>
            <div style='position:absolute; z-index:2; width:300px; height:400px; left:0px; top:0px;background-color:#409eff;'></div>
            <div style='position:absolute; z-index:3; width:400px; height:300px; left:0px; top:0px;background-color:red;'></div>
        </div> -->
        <el-header height="auto" style="padding:0;">
            <div class="draw-room-padding"></div>
            <el-card class="box-card draw-room-card">
                <img src="../../assets/images/profile.jpg" class="draw-room-card-photo">
                <p class="draw-room-name">摇了摇头oO的房间</p>
            </el-card>
        </el-header>
        <el-main class="draw-room-main">
            <p class="draw-room-prompt"> 小提示: 房间满2人，房主即可开始游戏!</p>
            <el-row :gutter="20" class="draw-room-el-row" style="margin-left: 0px;margin-right: 0px;">
                <el-col :span="4" class="draw-room-user-info-col">
                    <div class="draw-room-user-info">
                        <p class="draw-room-user-status-name">房主</p>
                        <img src="../../assets/images/profile.jpg" class="draw-room-user-icon">
                        <p class="draw-room-user-name">摇了摇头oO</p>
                    </div>
                </el-col>
                <el-col :span="4" class="draw-room-user-info-col">
                    <div class="draw-room-user-info">
                        <p class="draw-room-user-status-name">房主</p>
                        <img src="../../assets/images/profile.jpg" class="draw-room-user-icon">
                        <p class="draw-room-user-name">摇了摇头oO</p>
                    </div>
                </el-col>
                <el-col :span="4" class="draw-room-user-info-col">
                    <div class="draw-room-user-info">
                        <p class="draw-room-user-status-name">房主</p>
                        <img src="../../assets/images/profile.jpg" class="draw-room-user-icon">
                        <p class="draw-room-user-name">摇了摇头oO</p>
                    </div>
                </el-col>
                <el-col :span="4" class="draw-room-user-info-col">
                    <div class="draw-room-user-info">
                        <p class="draw-room-user-status-name">房主</p>
                        <img src="../../assets/images/profile.jpg" class="draw-room-user-icon">
                        <p class="draw-room-user-name">摇了摇头oO</p>
                    </div>
                </el-col>
                <el-col :span="4" class="draw-room-user-info-col">
                    <div class="draw-room-user-info">
                        <p class="draw-room-user-status-name">房主</p>
                        <img src="../../assets/images/profile.jpg" class="draw-room-user-icon">
                        <p class="draw-room-user-name">摇了摇头oO</p>
                    </div>
                </el-col>
                <el-col :span="4" class="draw-room-user-info-col">
                    <div class="draw-room-user-info">
                        <p class="draw-room-user-status-name">房主</p>
                        <img src="../../assets/images/profile.jpg" class="draw-room-user-icon">
                        <p class="draw-room-user-name">摇了摇头oO</p>
                    </div>
                </el-col>
            </el-row>
            <el-row class="draw-room-button-row">
                <el-col :span="12">
                    <el-button type="primary" class="draw-room-button-row-ready">邀请好友</el-button>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" class="draw-room-button-row-list-button">开始</el-button>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
    <!-- <div>
        <el-header fixed :title="myUserName + '的房间'">
            <router-link to="/home" slot="left">
                <el-button icon="back" @click="backToHome">返回</el-button>
            </router-link>
        </el-header>

        <div class="room-margin-top">
            <ul class="room-list">
                <li v-for="item in showUserList" :key="item.seatId">
                    <a href="javascript: void(0)">{{ item.userName }}</a>
                </li>
            </ul>

            <el-button type='primary' :disabled="!canStart" size='large' v-if="canStartGame" @click="startGame">{{canStart ? '开始游戏' : '大于2人才能开始游戏'}}</el-button>
            <el-button type='primary' v-else disabled size='large'>只有房主才能开始游戏</el-button>
        </div>
    </div> -->
</template>

<script>
import api from '../../model/model';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            myUserName: localStorage.getItem('userName'),
            roomId: ''
        }
    },
    async mounted() {
        this.roomId = this.$route.params.roomId;
        localStorage.setItem('roomId', this.roomId);
        let loadingInstance = this.$loading();
        let userList = await api.getRoomUserListByRoomId(this.roomId);
        loadingInstance.close();
        this.$store.commit('addRoomUser', userList);
    },
    methods: {
        startGame() {
            this.$webSocket.send(JSON.stringify({
                data: {
                    roomId: this.roomId
                },
                type: 'startGame'
            }));
        },
        backToHome() {
            localStorage.removeItem('roomId');
            this.$webSocket.send(JSON.stringify({
                data: {
                    roomId: this.roomId,
                    userId: Number(localStorage.getItem('userId'))
                },
                type: 'deleteRoomUser'
            }));
        }
    },
    computed: {
        canStartGame() {
            return this.showUserList.some(x => (x.userId === Number(localStorage.getItem('userId')) && x.seatId === 0));
        },
        showUserList() {
            return [0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => {
                let data = {
                    seatId: i,
                    userName: this.roomUserList[i] ? this.roomUserList[i].userName : null,
                    userId: this.roomUserList[i] ? this.roomUserList[i].userId : null,
                }

                return data;
            });
        },
        canStart() {
            return this.roomUserList.length > 1
        },
        ...mapState({
            roomUserList: state => state.roomUserList
        })
    }
}
</script>

<style>
p {
  margin: 0;
}

.draw-room-padding {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 20%;
  left: 0px;
  top: 0px;
  background-color: #409eff;
}

.draw-room-card {
  position: relative;
  margin: 20 20 20 20;
  border: 0;
  margin-bottom: 0px;
}

.draw-room-card,
.el-card__body {
  padding: 0;
}

.draw-room-card-photo {
  width: 100%;
  height: 200px;
}

.draw-room-name {
  margin: 10px;
}

.draw-room-main {
  padding: 0px;
}

.draw-room-prompt {
  margin: 10px;
  text-align: center;
}

.draw-room-user-info {
  text-align: center;
}

.draw-room-user-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.draw-room-user-name {
    margin-top: 5px;
    text-overflow: ellipsis;
    overflow:hidden;
    white-space:nowrap;
    width: 40px;
    background:#ccc;
}

.draw-room-user-status-name {
    margin-bottom: 5px;
    text-overflow: ellipsis;
    overflow:hidden;
    white-space:nowrap;
    width: 40px;
    background:#409eff;
}

.draw-room-button-row {
  margin-top: 20px;
  padding: 0 20 0 20;
}

.draw-room-button-row-ready {
  height: 40px;
  width: 95%;
}

.draw-room-button-row-list-button {
  height: 40px;
  width: 95%;
  float: right;
}

.draw-room-el-row {
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
}

.room-margin-top {
  margin-top: 50px;
}

.room-list {
  padding-left: 20px;
  font-size: 12px;
  font-weight: bolder;
  overflow: hidden;
}

.room-list li {
  margin: 10px;
  list-style-image: none;
  list-style-type: none;
  background-color: #999999;
  border-right-width: 0px;
  border-right-style: solid;
  border-right-color: #000000;
  float: left;
  width: 70px;
  height: 45px;
  box-shadow: 0px 5px 5px #000000;
}

.room-list li a {
  color: #ffffff;
  text-decoration: none;
  margin: 0px;
  display: block;
  text-align: center;
  line-height: 45px;
}

.room-list li a:hover {
  background-color: #0099cc;
}

.room-startGame-button {
  margin-top: 20px;
}
</style>