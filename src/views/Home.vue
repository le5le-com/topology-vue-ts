<template>
  <div class="home">
    <!-- 使用topology组件 -->
    <topology />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// 导入topology-vue组件
import topology from 'topology-vue';
// 需要导入topology-vue.css
import 'topology-vue/topology-vue.css';

@Component({
  components: {
    topology,
  },
})
export default class Home extends Vue {}
</script>
<style lang="scss">
.home {
  height: 100vh;
}
</style>
