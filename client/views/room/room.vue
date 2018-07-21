<template>
    <div>
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
    </div>
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