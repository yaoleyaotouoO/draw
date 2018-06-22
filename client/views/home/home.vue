<template>
    <div>
        <mt-header class="home-background" fixed title="主页">
            <router-link to="/login" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <div class="home-margin-top">
            <mt-button class="home-button-margin-top" type='default' size='large' v-for="room in roomList" :key="room.id" @click="goToRoom(room.id)">{{room.name}}</mt-button>
        </div>
        <div class="home-msgbox-wrapper">
            <mt-button type='primary' size='large' @click="createRoom">创建房间</mt-button>
        </div>
    </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import api from '../../model/model';
import { mapState } from 'vuex';
import moment from 'moment';

export default {
    data() {
        return {
        }
    },
    async mounted() {
        let data = await api.getRoomList();
        this.$store.commit('addRoomList', data);
    },
    methods: {
        createRoom() {
            MessageBox.prompt('请输入房间名').then(({ value, action }) => {
                console.log(`value: ${value}  action: ${action}`);
                this.$webSocket.send(JSON.stringify({ data: { roomName: value, createTime: moment().format('YYYY-MM-DD HH:mm:ss') }, type: 'createRoom' }));
            });
        },
        goToRoom(roomId) {
            this.$webSocket.send(JSON.stringify({
                data: {
                    userId: Number(localStorage.getItem('userId')),
                    userName: localStorage.getItem('userName'),
                    roomId: roomId
                },
                type: 'addRoomUser'
            }));

            this.$store.commit('setRoomId', roomId); 
            this.$store.commit('deleteRoomUser');
            this.$router.push({ name: 'room', params: { roomId: roomId } });
        }
    },
    computed: {
        ...mapState({
            roomList: state => state.roomList
        })
    }
}
</script>

<style>
.home-margin-top {
    margin-top: 50px;
}

.home-button-margin-top {
    margin-top: 10px;
}

.home-background {
    background-color: #26a2ff;
}

.home-msgbox-wrapper {
    top: 50%;
    position: absolute;
    width: 95%;
}
</style>


