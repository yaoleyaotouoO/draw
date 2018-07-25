<template>
    <el-container>
        <el-header class="draw-home-header" height="100px">
            <img src="../../assets/images/profile.jpg" class="draw-round-icon">
            <span class="draw-home-name">摇了摇头oO</span>
        </el-header>
        <el-main>
            <el-row>
                <el-col :span="8">
                    <div class="draw-home-play-div">
                        <i class="draw-home-play el-icon-tickets"></i>
                        <p>玩法</p>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="draw-home-play-div">
                        <i class="draw-home-play el-icon-minus"></i>
                        <p>排行榜</p>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="draw-home-play-div">
                        <i class="draw-home-play el-icon-date"></i>
                        <p>公告</p>
                    </div>
                </el-col>
            </el-row>
            <el-card class="box-card draw-home-box-card">
                <el-row>
                    <el-col :span="14">
                        <img src="../../assets/images/profile.jpg" class="draw-home-box-card-icon">
                    </el-col>
                    <el-col :span="10">
                        <p class="draw-home-card-font-color">创建房间</p>
                        <p class="draw-home-card-font-color">约好友一起来画</p>
                        <a href="javasrcipt:void(0)" class="draw-home-card-font-color" @click="createRoom">开始创建 ></a>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="box-card draw-home-box-card">
                <el-row>
                    <el-col :span="14">
                        <p class="draw-home-card-font-color">自由匹配</p>
                        <p class="draw-home-card-font-color">灵魂画手进阶之路</p>
                        <a href="javasrcipt:void(0)" class="draw-home-card-font-color">立即开始 ></a>
                    </el-col>
                    <el-col :span="10">
                        <img src="../../assets/images/profile.jpg" class="draw-home-box-card-icon">
                    </el-col>
                </el-row>
            </el-card>
            <el-row class="draw-home-room-row">
                <el-col :span="12">
                    <el-button type="primary" class="draw-home-room-row-button" icon="el-icon-search" @click="findRoom">查找房间</el-button>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" class="draw-home-room-row-list-button" icon="el-icon-menu">房间列表</el-button>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import api from '../../model/model';
import { mapState } from 'vuex';

export default {
    data() {
        return {
        }
    },
    async mounted() {
        // let loadingInstance = this.$loading();
        // let data = await api.getRoomList();
        // loadingInstance.close();
        // this.$store.commit('addRoomList', data);
    },
    methods: {
        async createRoom() {
            let { value, action } = await this.$prompt('请输入房间名', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            });
            if (!value) {
                this.$message({
                    message: '请输入有效的房间名',
                    type: 'warning'
                });
                return;
            }

            let loadingInstance = this.$loading();
            let roomId = await api.createRoom(value);
            loadingInstance.close();
            if (!roomId) {
                this.$message({
                    message: '此房间名已经存在，请重新创建',
                    type: 'warning'
                });
                return;
            }

            this.$router.push({ name: 'room', params: { roomId } });
        },
        async findRoom() {
            let { value, action } = await this.$prompt('请输入需要查找的房间名', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            });
            if (!value) {
                this.$message({
                    message: '搜索的房间不存在',
                    type: 'warning'
                });
                return;
            }

            let loadingInstance = this.$loading();
            let result = await api.findRoom(value);
            loadingInstance.close();
            let roomId = result[0] && result[0].id;
            if (roomId) {
                this.$router.push({ name: 'room', params: { roomId } });
                return;
            }

            this.$message({
                message: '搜索的房间不存在',
                type: 'warning'
            });
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
.draw-round-icon {
    padding-top: 10px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    float: left;
}

.draw-home-header {
    background-color: #409eff;
}

.draw-home-name {
    float: left;
    color: black;
    padding-left: 15px;
    padding-top: 40px;
}

.draw-home-play-div {
    text-align: center;
}

.draw-home-play {
    font-size: 50px;
}

p {
    margin-top: 0px;
    margin-bottom: 0px;
}

.draw-home-box-card {
    margin-top: 10px;
    height: 100px;
    background-color: #409eff;
}

.draw-home-box-card-icon {
    width: 80px;
    height: 80px;
    float: left;
}

.draw-home-card-font-color {
    color: white;
    padding-top: 3px;
}

.draw-home-room-info {
    background-color: #409eff;
}

.draw-home-room-row {
    margin-top: 10px;
}

.draw-home-room-row-button {
    height: 60px;
    width: 95%;
}

.draw-home-room-row-list-button {
    height: 60px;
    width: 95%;
    float: right;
}

.home-margin-top {
    margin-top: 50px;
}

.home-button-margin-top {
    margin-top: 10px;
}

.home-msgbox-wrapper {
    top: 50%;
    position: absolute;
    width: 95%;
}
</style>


