<template>
    <div>
        <div>
            <p class="game-spacing">我画: {{drawName}} ({{drawType}})</p>
            <p style="float:right;" class="game-spacing">{{countDown}}</p>
        </div>
        <draw />
    </div>
</template>

<script>
import Draw from './draw.vue';

export default {
    components: { Draw },
    data() {
        return {
            drawName: '摇了摇头',
            drawType: '词语',
            countDown: 90
        }
    }
}
</script>

<style>
.game-spacing {
    margin-top: 4px;
    margin-bottom: 4px;
    float:left;
}
</style>

