<template>
  <div class="home">
    <!-- 使用topology组件 -->
    <topology
      :configs="topologyConfigs"
      :materials="materials"
      :user="user"
      :data="data"
      @event="onEvent"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// 导入topology-vue组件
import topology from 'topology-vue';
// 需要导入topology-vue.css
import 'topology-vue/topology-vue.css';

import {
  defalutMaterials,
  defalutMaterialTabs,
  iconMenus,
  userMenus,
} from './data';

Vue.use(topology);

declare const window: any;

@Component({})
export default class Home extends Vue {
  topologyConfigs = {
    license: {
      key: 'key',
      value: 'value',
      version: 'version',
    },
    logo: {
      img: 'http://topology.le5le.com/img/favicon.ico',
      url: 'http://topology.le5le.com',
      target: '_blank',
      text: 'le5le',
    },
    menus: iconMenus,
    loginUrl: 'https://account.le5le.com',
    signupUrl: 'https://account.le5le.com',
    userMenus: userMenus,
    materialTabs: defalutMaterialTabs,
    dataOptionsFn: (pen: any, key: string, value: string) => {
      // pen - 当前画笔对象
      // key - 表单输入左侧的属性名
      // value - 仅下拉搜索时有效，当前输入文本
      console.log('dataOptionsFn', pen, key, value);
      // ************
      // 根据实际业务场景 + 参数返回数组对象。
      // Do sth.
      // ************
      return [
        {
          label: '选项1',
          value: 1,
        },
        {
          label: '选项2',
          value: 2,
        },
        {
          label: '选项3',
          value: 3,
        },
      ];
    },
    // locale: 'zh',
  };

  user: any = {
    username: 'le5le',
  };

  materials = {
    system: defalutMaterials,
    iconUrls: ['http://at.alicdn.com/t/font_1331132_g7tv7fmj6c9.css'],
    uploadUrl: '/api/file',
    uploadHeaders: {
      Authorization: 'your token',
    },
    uploadParams: {
      mydata: 1,
    },
  };

  data: any = {
    websocket: '',
    mqttUrl: '',
    component: !!this.$route.query.component,
  };

  created() {
    // 注册图形库
    this.registerBuiness();
    const data = (window as any).topologyData;
    // 预览页返回，存在缓存数据
    if (data) {
      this.data = Object.assign({}, data);
      setTimeout(() => {
        (window as any).topologyData = null;
      }, 200);
    } else {
    }
  }

  registerBuiness() {
    if (window.registerTools) {
      window.registerTools();
    }
    if (window.topologyTools) {
      this.materials.system.push({
        name: '企业图形库',
        expand: false,
        show: true,
        list: window.topologyTools,
      });
    }
    if (window.registerIot) {
      window.registerIot(this.topologyConfigs.license);
    }
    this.materials.system.push({
      iconUrl: '//at.alicdn.com/t/font_2366205_nnqrrnc9mta.css', // 替换成真实的地址
      show: true,
      list: [], // 此处留空数组就好，会自动填充
    });
  }

  onEvent(e: { name: string; params: any }) {
    switch (e.name) {
      case 'logout':
        // 退出登录
        this.user = null;
        // Do sth.
        break;

      case 'openMaterialGroup':
        // 展开/折叠图标工具栏分组
        console.log('openMaterialGroup', e.params);
        // Do sth.
        break;

      case 'addMaterial':
        // 添加“我的组件”
        // Do sth. For example:
        this.$router.push({
          path: '/',
          query: { component: '1' },
        });
        break;

      case 'editMaterial':
        // 编辑“我的组件”
        // Do sth. For example:
        this.$router.push({
          path: '/',
          query: { id: e.params.id, component: '1' },
        });
        break;

      case 'open':
        // 导航菜单configs.menus里面定义的action
        // 比如这里表示打开文件
        break;
      case 'save':
        // 导航菜单configs.menus里面定义的action
        // 比如这里表示保存文件
        break;
      case 'addImageUrl':
        // 在“我的图片”里面添加了一张新图片
        // this.addImageUrl(e.params);
        break;
      case 'deleteImage':
        // 在“我的图片”里面删除了一张图片
        // this.deleteImage(e.params);
        break;
      case 'preview':
        // 点击工具栏“预览”

        // 保存当前编辑数据，方便预览时直接打开
        (window as any).topologyData = (window as any).topology.data;
        this.$router.push({
          path: '/preview',
          query: { id: 'xxx', r: '1' },
        });
        break;

      // ...
      // ...
    }
  }
}
</script>
<style lang="scss">
.home {
  height: 100vh;
}
</style>
