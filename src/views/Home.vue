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

import { defalutMaterials, userMaterials, images } from './data';

@Component({
  components: {
    topology,
  },
})
export default class Home extends Vue {
  license = {
    key: '企业版授权码',
    value: '国产原创开源发展做出我们的贡献',
  };
  topologyConfigs = {
    logo: {
      img: 'http://topology.le5le.com/assets/img/favicon.ico',
      url: 'http://topology.le5le.com',
      target: '_blank',
    },
    menus: [
      {
        name: '文件(自定义菜单1)',
        children: [
          { name: '新建文件', keyboard: 'Ctrl+N', action: 'open' },
          { name: '打开文件', keyboard: 'Ctrl+O', action: 'loadNew' },
          { name: '导入文件', keyboard: 'Ctrl+I', action: 'load' },
          {},
          { name: '保存', keyboard: 'Ctrl+S', action: 'save' },
          { name: '另存为', keyboard: 'Ctrl+Shift+I', action: 'saveAs' },
          { name: '下载JSON文件', action: 'downloadJson' },
          { name: '下载zip打包文件', action: 'downloadZip' },
          {},
          { name: '导出为HTML', action: 'downloadHtml' },
          {},
          { name: '下载为PNG', action: 'downloadPng' },
          { name: '下载为SVG', action: 'downloadSvg' },
        ],
      },
      {
        name: '编辑(自定义菜单2)',
        children: [
          { name: '撤销', keyboard: 'Ctrl+Z', action: 'undo' },
          { name: '恢复  ', keyboard: 'Ctrl+Shift+Z', action: 'redo' },
          {},
          { name: '剪切  ', keyboard: 'Ctrl+X', action: 'cut' },
          { name: '复制  ', keyboard: 'Ctrl+C', action: 'copy' },
          { name: '粘贴  ', keyboard: 'Ctrl+V', action: 'paste' },
        ],
      },
      {
        name: '我的菜单3',
        router: '/page',
      },
    ],
    loginUrl: 'https://account.le5le.com',
    signupUrl: 'https://account.le5le.com',
    userMenus: [
      { name: '个人中心', router: '/user/home' },
      {},
      {
        name: '账号设置',
        url: 'https://account.le5le.com/user/profile',
        target: '_blank',
      },
      {},
      { name: '退出', action: 'logout' },
    ],
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
  };

  user: any = {
    username: 'le5le',
  };

  materials = {
    system: defalutMaterials,
    user: userMaterials,
    images,
    uploadUrl: '/api/file',
    uploadHeaders: {
      Authorization: 'your token',
    },
    uploadParams: {
      mydata: 1,
    },
  };

  data: any = {};

  created() {
    const data = (window as any).topologyData;
    // 预览页返回，存在缓存数据
    if (data) {
      this.data = { data: Object.assign({}, data) };
      setTimeout(() => {
        (window as any).topologyData = null;
      }, 200);
    } else {
    }
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
