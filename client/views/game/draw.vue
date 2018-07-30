<template>
    <div>
        <el-row class="draw-draw-el-cl-row-top" :style="{height: canDraw ? '92%' : '100%'}">
            <el-col class="draw-draw-el-col-left" :span="1">
            </el-col>
            <el-col class="draw-draw-el-col-center" :span="22">
                <div class="draw-draw-canvas-info">
                    <canvas v-if="canDraw" ref='canvasDom' :width="canvasWidth" :height="canvasHeight" @touchstart='start' @touchmove='move' @touchend='end'></canvas>
                    <canvas v-else ref='canvasDom' :width="canvasWidth" :height="canvasHeight"></canvas>
                </div>
            </el-col>
            <el-col class="draw-draw-el-col-right" :span="1">
                <div></div>
            </el-col>
        </el-row>

        <div class="draw-draw-artboard-bottom" v-if="canDraw">
            <!-- <div class="draw-draw-artboard-bottom"> -->
            <svg class="draw-icon icon" aria-hidden="true" @click="changePenColor">
                <use xlink:href="#icon-color-filling" :style="penColor"></use>
            </svg>
            <svg class="draw-icon-special icon" aria-hidden="true" @click="changePenWidth">
                <use xlink:href="#icon-subtract" style="color:#FCFCFC;"></use>
            </svg>
            <div style="color:#FCFCFC;">{{this.penWidth}}</div>
            <svg class="draw-icon icon" aria-hidden="true">
                <use xlink:href="#icon-back" style="color:#FCFCFC;"></use>
            </svg>
            <svg class="draw-icon icon" aria-hidden="true">
                <use xlink:href="#icon-more" style="color:#FCFCFC;"></use>
            </svg>
            <svg class="draw-icon icon" aria-hidden="true" @click="clear">
                <use xlink:href="#icon-delete" style="color:#FCFCFC;"></use>
            </svg>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
        roomId: String,
        canDraw: Boolean
    },
    data() {
        return {
            ctx: '',
            canvasWidth: 0,
            canvasHeight: 0,
            offsetLeft: 0,
            offsetTop: 0,
            penColor: '',
            penColorList: [
                { color: '#000000' }, // 黑色
                { color: '#d81e06' }, // 红色
                { color: '#f4ea2a' }, // 黄色
                { color: '#1afa29' }, // 绿色
                { color: '#1296db' }  // 蓝色
            ],
            penWidth: '',
            penWidthList: [1, 2, 3, 4, 5]
        }
    },
    mounted() {
        this.getCanvasSize();
        let canvasDom = this.$refs.canvasDom;
        let { offsetLeft, offsetTop } = this.getOffset(canvasDom);
        this.offsetLeft = offsetLeft;
        this.offsetTop = offsetTop;

        var ctx = canvasDom.getContext('2d');
        this.ctx = ctx;

        this.penColor = this.penColorList[0];
        this.ctx.strokeStyle = this.penColor.color;
        this.penWidth = this.penWidthList[0];
        this.ctx.lineWidth = this.penWidth;
    },
    updated() {
        this.getCanvasSize();
    },
    methods: {
        // 获取 canvas大小
        getCanvasSize() {
            let canvasDom = this.$refs.canvasDom;
            let parentDom = canvasDom.parentNode;
            this.canvasWidth = parentDom.offsetWidth;
            this.canvasHeight = parentDom.offsetHeight;
        },
        // 获取任意元素的offsetLeft/offsetTop值
        getOffset(obj) {
            var arr = []
            var offsetL = 0
            var offsetT = 0
            while (obj != window.document.body && obj != null) {
                offsetL += obj.offsetLeft
                offsetT += obj.offsetTop
                obj = obj.offsetParent
            }

            return { offsetLeft: offsetL, offsetTop: offsetT }
        },
        draw(data) {
            switch (data.type) {
                case 'start':
                    this.ctx.beginPath();
                    this.ctx.moveTo(data.x, data.y);
                    this.ctx.stroke();
                    break;
                case 'move':
                    this.ctx.lineTo(data.x, data.y);
                    this.ctx.stroke();
                    break;
                case 'end':
                    this.ctx.stroke();
                    break;
                case 'clear':
                    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                    break;
                case 'changePenColor':
                    this.ctx.strokeStyle = data.data;
                    break;
                case 'changePenWidth':
                    this.ctx.lineWidth = data.data;
                    break;
                default:
                    console.warn('draw not type!');
            }
            if (!this.canDraw) return;

            this.$webSocket.send(JSON.stringify({
                data: {
                    type: data.type,
                    x: data.x,
                    y: data.y,
                    data: data.data,
                    roomId: this.roomId
                },
                type: 'drawPicture'
            }));
        },
        getPoint(e) {
            let touch = e.touches[0];
            let x = touch.clientX - this.offsetLeft;
            let y = touch.clientY - this.offsetTop;
            return { x, y };
        },
        start(e) {
            let { x, y } = this.getPoint(e);
            this.draw({ x, y, type: 'start' });
        },
        move(e) {
            let { x, y } = this.getPoint(e);
            this.draw({ x, y, type: 'move' });
        },
        end(e) {
            this.draw({ type: 'end' });
        },
        async clear() {
            let result = await this.$alert('确定执行清除操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            });
            if (result !== 'confirm') return;

            this.draw({ type: 'clear' });
        },
        changePenColor() {
            let penColorLength = this.penColorList.length;
            let penColorIndex = this.penColorList.indexOf(this.penColor);
            penColorIndex = penColorIndex + 1 >= penColorLength ? 0 : penColorIndex + 1;
            this.penColor = this.penColorList[penColorIndex];

            this.draw({ type: 'changePenColor', data: this.penColor.color });
        },
        changePenWidth() {
            let penWidthLength = this.penWidthList.length;
            let penWidthIndex = this.penWidthList.indexOf(this.penWidth);
            penWidthIndex = penWidthIndex + 1 >= penWidthLength ? 0 : penWidthIndex + 1;
            this.penWidth = this.penWidthList[penWidthIndex];

            this.draw({ type: 'changePenWidth', data: this.penWidth });
        }
    },
    watch: {
        drawPictureData(newVal, oldVal) {
            if (this.canDraw) return;

            this.draw(newVal);
        }
    },
    computed: {
        ...mapState({
            drawPictureData: state => state.drawPictureData
        }),
    }
}
</script>

<style>
body {
  margin: 0px;
}

.draw-draw-artboard-bottom {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409eff;
}

.draw-draw-el-cl-row-top {
  /* height: 92%; */
}

.draw-draw-artboard-bottom {
  height: 8%;
}

.draw-draw-el-col-left {
  height: 100%;
}

.draw-draw-canvas-info {
  background-color: white;
  width: 96%;
  height: 96%;
  margin: auto;
  margin-top: 2%;
  border-radius: 15px;
}

.draw-draw-el-col-center {
  height: 100%;
}

.draw-draw-el-col-right {
  height: 100%;
}

.draw-icon-special {
  width: 10%;
  font-size: 35px;
  line-height: 100px;
  color: #333;
}

.draw-icon {
  width: 20%;
  font-size: 35px;
  line-height: 100px;
  color: #333;
}
</style>

