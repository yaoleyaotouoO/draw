<template>
    <canvas ref='canvasDom' width='400' height='300' style='border: 1px solid #999;' @touchstart='start' @touchmove='move' @touchend='end'>
    </canvas>
</template>

<script>
export default {
    data() {
        return {
            ctx: '',
            offsetLeft: 0,
            offsetTop: 0
        }
    },
    mounted() {
        let canvasDom = this.$refs.canvasDom;
        this.offsetLeft = canvasDom.offsetLeft;
        this.offsetTop = canvasDom.offsetTop;
        var ctx = canvasDom.getContext('2d');
        this.ctx = ctx;
        ctx.fillStyle = '#FF0000';
    },
    methods: {
        getPoint(e) {
            let touch = e.touches[0];
            let x = touch.clientX - this.offsetLeft;
            let y = touch.clientY - this.offsetTop;
            return { x, y };
        },
        start(e) {
            let { x, y } = this.getPoint(e);

            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.stroke();
            this.$webSocket.send({}, 'draw');
        },
        move(e) {
            let { x, y } = this.getPoint(e);

            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        },
        end(e) {
            this.ctx.stroke();
        }
    }
}
</script>
