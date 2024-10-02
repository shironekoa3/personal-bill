<script setup>
import { ref } from 'vue'
import HomeNav from '@/views/layouts/HomeNav.vue';
import HomeContent from '@/views/layouts/HomeContent.vue';

defineProps({
    msg: String,
})

const count = ref(0)
</script>

<template>
    <div class="container">
        <HomeNav />
        <div class="content">
            <router-view />
        </div>
    </div>
</template>

<style scoped>
.container {
    margin: 0;
    width: calc(100vw - 20px);
    height: calc(100vh - 20px);
    border-radius: 20px;
    position: relative;
}

.content {
    border-radius: 14px;
    position: fixed;
    left: 250px;
    top: 20px;
    width: calc(100vw - 20px - 240px - 10px);
    height: calc(100vh - 20px - 20px);
    background-color: #fff;
}
</style>
