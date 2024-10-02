<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import menus from '@/router/menu.js'
import ILogo from '@/components/icons/ILogo.vue';

import MyMenu from '@/components/MyMenu.vue'

const router = useRouter()

let defaultActive = ref('1')
console.log();
menus.forEach(item => {
  if (item.route === location.pathname) {
    defaultActive.value = item.id;
  }
})

</script>

<template>
  <div class="container">
    <div class="nav">
      <div class="nav-head">
        <div class="nav-head-logo">
          <ILogo size="40" />
        </div>
        <h3>Personal Bill</h3>
      </div>
      <MyMenu :data="menus" :defaultActive="defaultActive" />
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: var(--primary-color);
}

.nav {
  width: 240px;
}

.nav-head {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-head-logo {
  fill: var(--secondary-color);
}

.nav-head h3 {
  font-size: 24px;
  color: var(--secondary-color);
  font-weight: 100;
  margin-left: 10px;
}
</style>
