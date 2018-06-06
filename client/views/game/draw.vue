<template>
    <div>
        <canvas ref='canvasDom' width='400' height='300' style='border: 1px solid #999;' @touchstart='start' @touchmove='move' @touchend='end'>
        </canvas>
    </div>
</template>

<script>
export default {
    props: {
        roomId: Number,
        canDraw: Boolean
    },
    data() {
        return {
            ctx: '',
            offsetLeft: 0,
            offsetTop: 0
        }
    },
    mounted() {
        console.log('draw roomId: ', this.roomId);
        console.log('draw canDraw: ', this.canDraw);
        let canvasDom = this.$refs.canvasDom;
        this.offsetLeft = canvasDom.offsetLeft;
        this.offsetTop = canvasDom.offsetTop;
        var ctx = canvasDom.getContext('2d');
        this.ctx = ctx;
        ctx.fillStyle = '#FF0000';
    },
    methods: {
        draw(data) {
            console.log('draw roomId: ', this.roomId);
            console.log('draw canDraw: ', this.canDraw);
            console.log("draw data: ", data);
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
                default:
                    console.warn('draw not type!');
            }
            if (!this.canDraw) return;

            this.$webSocket.send(JSON.stringify({
                data: {
                    type: data.type,
                    data: { x: data.x, y: data.y },
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
        }
    }
}
</script>
