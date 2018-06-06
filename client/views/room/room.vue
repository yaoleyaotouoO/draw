<template>
    <div>
        <mt-header fixed :title="myUserName + '的房间'">
            <router-link to="/home" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>

        <div class="room-margin-top">
            <ul class="room-list">
                <li v-for="item in showUserList" :key="item.seatId">
                    <a href="javascript: void(0)">{{ item.userName }}</a>
                </li>
            </ul>

            <mt-button type='primary' size='large' v-if="canStartGame" @click="startGame">开始游戏</mt-button>
            <mt-button type='primary' v-else disabled size='large'>只有房主才能开始游戏</mt-button>
        </div>
    </div>
</template>

<script>
import api from '../../model/model';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            myUserName: localStorage.getItem('userName')
        }
    },
    async mounted() {
        let users = await api.getRoomUserList(this.$route.params.roomId);
        this.$store.commit('addRoomUser', users);
    },
    methods: {
        startGame() {
            this.$webSocket.send(JSON.stringify({
                data: {
                    roomId: this.roomId
                },
                type: 'startGame'
            }));

        //    this.$router.push({ name: 'game', params: { roomId: this.roomId } });
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
        ...mapState({
            roomUserList: state => state.roomUserList,
            roomId: state => state.roomId
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