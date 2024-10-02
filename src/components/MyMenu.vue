<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'



let props = defineProps({
  data: {
    type: Array,
    default: []
  },
  defaultActive: {
    type: String,
    default: '1'
  },
})

const router = useRouter()

let activeIndex = ref('1');
activeIndex.value = props.defaultActive

const onMenuChange = (index) => {
  activeIndex.value = index;
  props.data.forEach(item => {
    if (item.id === index) {
      router.push(item.route)
    }
  })
}

</script>

<template>
  <div class="nav-menu">
    <div class="nav-menu-item" v-for="item in data" :key="item" :class="{ 'active': activeIndex === item.id }"
      @click="onMenuChange(item.id)">
      <div class="nav-menu-hover">
        <div class="nav-menu-icon">
          <component :is="item.icon" size="20" />
        </div>
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-menu {
  display: grid;
  grid-gap: 10px;
}

.nav-menu-item {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.nav-menu-item:hover .nav-menu-hover {
  background-color: var(--menu-selected-background);
  color: var(--secondary-color);
  fill: var(--secondary-color);
}

.nav-menu-item.active .nav-menu-hover {
  background-color: var(--menu-selected-background);
  color: var(--secondary-color);
  fill: var(--secondary-color);
}

.nav-menu-hover {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: left;
  align-items: center;
  font-size: 14px;
  font-weight: bolder;
  border-radius: 8px;
  color: var(--menu-inactive);
  fill: var(--menu-inactive);
  transition: all 0.3s;
}

.nav-menu-icon {
  margin-left: 10px;
  margin-right: 4px;
}
</style>
