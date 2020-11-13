<template>
  <div class="preview">
    <topology preview="true" :data="data" />
    <div class="tools" v-if="showTools">
      <a-button type="primary" @click="onBack">
        <a-icon type="left" /> 返回
      </a-button>
      <div></div>
      <a-button type="primary" style="margin-right: 0" @click="onSizeWindow">
        <a-icon type="border" />
        适合窗口大小
      </a-button>
      <a-button type="primary" @click="onSizeOri">
        <a-icon type="fullscreen-exit" />
        实际大小
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import Topology from 'topology-vue';

import { Button, Icon } from 'ant-design-vue';

declare const topology: any;

Vue.use(Button);
Vue.use(Icon);

@Component({
  components: {
    Topology,
  },
})
export default class Preview extends Vue {
  data: any = { data: {} };
  locked = 0;
  showTools = true;

  @Watch('$route')
  routerChanged() {
    this.init();
  }

  created() {
    const data = (window as any).topologyData;
    if (data) {
      this.locked = data.locked;
      data.locked = 1;
      this.data = { data: Object.assign({}, data) };
      setTimeout(() => {
        (window as any).topologyData = null;
      }, 200);
    } else {
      this.init();
    }

    this.showTools = !!this.$route.query.r;
  }

  async init() {
    if (this.$route.query.id) {
      // const ret: any = await axios.get(
      //   '/api/topology/' + this.$route.query.id,
      //   {
      //     params: {
      //       version: this.$route.query.version,
      //       view: 1,
      //     },
      //   }
      // );
      // if (ret.error) {
      //   return;
      // }
      // ret.data.locked = 1;
      // this.data = ret;
    }
  }

  onSizeWindow() {
    topology.fitView(16);
  }

  onSizeOri() {
    topology.open(this.data.data);
  }

  onBack() {
    topology.data.locked = this.locked;
    (window as any).topologyData = topology.data;
    this.$router.go(-1);
  }
}
</script>
<style lang="scss" scoped>
.preview {
  position: relative;
  height: 100vh;

  .tools {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    display: flex;
    & > div {
      flex-grow: 1;
    }

    button {
      margin: 12px 16px;
    }
  }
}
</style>