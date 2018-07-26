<template>
    <el-container>
        <el-header height="auto" style="padding:0;">
            <div class="draw-room-padding"></div>
            <el-card class="box-card draw-room-card">
                <img src="../../assets/images/profile.jpg" class="draw-room-card-photo">
                <p class="draw-room-name">摇了摇头oO的房间</p>
                <router-link to="/home">
                    <el-button type="primary" size="mini" class="draw-room-button-out" @click="backToHome">退出</el-button>
                </router-link>
            </el-card>
        </el-header>
        <el-main class="draw-room-main">
            <p class="draw-room-prompt"> 小提示: 房间满2人，房主即可开始游戏!</p>
            <el-row :gutter="20" class="draw-room-el-row" style="margin-left: 0px;margin-right: 0px;">
                <el-col :span="4" class="draw-room-user-info-col" v-for="item in showUserList" :key="item.seatId">
                    <div class="draw-room-user-info">
                        <p class="draw-room-user-status-name" :class="{'draw-room-user-no-status': !item.readyStatus}">{{item.readyStatus}}</p>
                        <img :src="item.profile" class="draw-room-user-icon">
                        <p class="draw-room-user-name">{{item.userName}}</p>
                    </div>
                </el-col>
            </el-row>
            <el-row class="draw-room-button-row">
                <el-col :span="12">
                    <el-button type="primary" class="draw-room-button-row-ready">邀请好友</el-button>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" :disabled="!canStart" class="draw-room-button-row-list-button" @click="startGame">开始</el-button>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import api from '../../model/model';
import { mapState } from 'vuex';
import defaultProfile from '../../assets/images/profile.jpg';


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
        this.$webSocket.readyState === 1 && this.$webSocket.send(JSON.stringify({
            data: {
                userId: Number(localStorage.getItem('userId')),
                userName: localStorage.getItem('userName'),
                roomId: this.roomId
            },
            type: 'changedRoomUser'
        }));
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
            console.log("this.roomUserList: ", this.roomUserList);
            return [0, 0, 0, 0, 0, 0].map((_, i) => {
                let data = {
                    seatId: i,
                    userName: this.roomUserList[i] ? this.roomUserList[i].userName : null,
                    userId: this.roomUserList[i] ? this.roomUserList[i].userId : null,
                    profile: this.roomUserList[i] ? (this.roomUserList[i].profile || defaultProfile) : defaultProfile,
                    readyStatus: i === 0 ? "房主" : (this.roomUserList[i] ? "已准备" : "")
                }

                return data;
            });
        },
        canStart() {
            return this.roomUserList.length > 1 && this.canStartGame
        },
        ...mapState({
            roomUserList: state => state.roomUserList
        })
    }
}
</script>

<style scoped>
p {
  margin: 0;
}

.draw-room-card >>> .el-card__body {
  padding: 0px;
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

.draw-room-card-photo {
  width: 100%;
  height: 200px;
}

.draw-room-name {
  margin: 10px;
  float: left;
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
  overflow: hidden;
  white-space: nowrap;
  width: 40px;
  background: #409eff;
  font-size: 10px;
  border-radius: 15px;
  color: white;
}

.draw-room-user-status-name {
  margin-bottom: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 40px;
  background: #409eff;
  font-size: 10px;
  color: white;
  border-radius: 15px;
}

.draw-room-user-no-status {
  padding-top: 16px;
  background-color: white;
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

.draw-room-button-out {
  float: right;
  margin: 7px;
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