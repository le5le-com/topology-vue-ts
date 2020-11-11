<template>
  <div class="home">
    <!-- 使用topology组件 -->
    <topology :configs="topologyConfigs" :user="user" @event="onEvent" />
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
export default class Home extends Vue {
  data = {
    topologyConfigs: {
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
    },
  };

  user: any = {
    username: 'le5le',
  };

  onEvent(e:{ name: string; params: any }) {
      switch (e.name) {
        case "logout":
          this.user = null;
          // Do sth.
          break;
        // ...
        // ...
      }
    },
}
</script>
<style lang="scss">
.home {
  height: 100vh;
}
</style>
