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
import { Component, Vue, Watch } from 'vue-property-decorator';

// 导入topology-vue组件
import topology from 'topology-vue';
// 需要导入topology-vue.css
import 'topology-vue/topology-vue.css';

import axios from 'axios';

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
      key: 'le5le',
      value: 'le5le',
      version: 'le5le',
    },
    logo: {
      img: '/img/icons/favicon-32x32.png',
      url: 'http://topology.le5le.com',
      target: '_blank',
      text: 'Topology',
    },
    menus: iconMenus,
    loginUrl: 'https://account.le5le.com',
    signupUrl: 'https://account.le5le.com',
    userMenus: userMenus,
    materialTabs: defalutMaterialTabs,
    dataOptionsFn: (pen: Node, key: string, value: string) => {
      console.log(pen);

      const keys = [{ value: 'aaa', label: '1' }];
      const values = [{ value: '000', label: '1' }];
      return {
        keys,
        // value: true, // 可配置，部门情况可能出现类型报错
        values,
      };
    },
  };

  user: any = {
    username: 'le5le',
  };

  materials: any = {
    topology: [],
    system: [],
    uploadUrl: '/api/image',
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
    const data = (window as any).topologyData;
    // 预览页返回，存在缓存数据
    if (data) {
      this.data = { data: Object.assign({}, data) };
      setTimeout(() => {
        (window as any).topologyData = null;
      }, 200);
    } else {
    }

    this.getMaterials();

    this.init();
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
      // 配置水池
      this.materials.system.push({
        name: '企业组件（需要购买）',
        expand: true,
        show: true,
        list: [
          {
            name: '水池', // 工具栏提示文字
            icon: 't-icon t-pool', // 工具栏显示字体图标
            // image: 'url', //  图片URL 与上面 icon 二选一即可
            data: {
              // json对象，符合topology节点（Node）的数据结构，具体可以参照 API 文档
              text: '水池', // 拖拽出现后现在在图形中心文字
              rect: {
                // 宽高必填项
                width: 400,
                height: 200,
              },
              name: 'pool', // 该值作为水池的统一标识
              data: {
                // 我的数据
                style: {
                  // 提前配置样式
                  background: '#1890ff',
                  borderWidth: 15,
                  borderColor: '#C2C2C2',
                },
              },
            },
          },
        ],
      });
    }
    this.materials.system.push({
      iconUrl: '/iconfont/demo/iconfont.css', // 替换成真实的地址
      show: true,
      list: [], // 此处留空数组就好，会自动填充
    });
  }

  @Watch('$route')
  routerChanged() {
    this.init();
  }

  async init() {
    if (this.$route.query.id) {
      let ret: any = await axios.get('/api/topology/' + this.$route.query.id, {
        params: {
          version: this.$route.query.version,
          view: 1,
        },
      });
      if (ret.error) {
        return;
      }

      if (!ret.pens) {
        const data = ret.data;
        delete ret.data;
        ret = Object.assign(ret, data);
      }
      this.data = ret;
    } else {
      this.data = (window as any).topologyData || {
        component: !!this.$route.query.component,
        folder: this.$route.query.folder,
      };

      setTimeout(() => {
        (window as any).topologyData = null;
      }, 200);
    }
  }

  async getMaterials() {
    let folder: any = await axios.get('/api/user/folder');
    if (folder.data.error) {
      folder = {};
    } else {
      folder = folder.data;
    }

    if (folder.topology) {
      this.materials.topology = [];
      folder.topology.forEach((name: any) => {
        this.materials.topology.push({
          name,
          show: true,
          expand: true,
          list: [],
        });
      });
    }

    if (folder.user) {
      this.materials.user = [];
      folder.user.forEach((name: any) => {
        this.materials.user.push({
          name,
          show: true,
          expand: true,
          list: [],
        });
      });
    }

    const tools: any = await axios.get('/api/tools');
    const group: any = {};
    tools.data.forEach((item: any) => {
      if (!group[item.subClassName]) {
        group[item.subClassName] = {
          name: item.subClassName,
          show: true,
          expand: true,
          list: [item],
        };
      } else {
        group[item.subClassName].list.push(item);
      }
    });

    this.materials.system = [];
    for (const key in group) {
      this.materials.system.push(group[key]);
    }

    // 注册图形库
    this.registerBuiness();

    const topologies: any = await axios.get('/api/topologies', {
      params: {
        pageIndex: 1,
        pageCount: 100,
        component: 'all',
      },
    });

    if (topologies.data.list) {
      this.materials.topology.push({
        name: '未分类',
        show: true,
        expand: true,
        list: [],
      });

      if (!this.materials.user) {
        this.materials.user = [];
      }
      this.materials.user.push({
        name: '未分类',
        show: true,
        expand: true,
        list: [],
      });
      topologies.data.list.forEach((item: any) => {
        if (item.component) {
          this.materials.user.forEach((folder: any) => {
            if (item.folder === folder.name) {
              folder.list.push(item);
            }

            if (!item.folder && folder.name === '未分类') {
              folder.list.push(item);
            }
          });
        } else {
          this.materials.topology.forEach((folder: any) => {
            if (item.folder === folder.name) {
              folder.list.push(item);
            }

            if (!item.folder && folder.name === '未分类') {
              folder.list.push(item);
            }
          });
        }
      });
    }

    const componentImages: any = await axios.get('/api/user/component/images', {
      params: {
        pageIndex: 1,
        pageCount: 100,
      },
    });
    if (componentImages.data.list) {
      componentImages.data.list.forEach((item: any) => {
        this.materials.user.forEach((folder: any) => {
          if (item.folder === folder.name) {
            folder.list.push(item);
          }

          if (!item.folder && folder.name === '未分类') {
            folder.list.push(item);
          }
        });
      });
    }

    this.materials = Object.assign({}, this.materials);
  }

  onEvent(e: { name: string; params: any }) {
    console.log('onEvent', e);
    switch (e.name) {
      case 'add-topology-folder':
        this.addTopologyFolder(e.params);
        break;
      case 'rename-topology-folder':
        this.renameTopologyFolder(e.params);
        break;
      case 'remove-topology-folder':
        this.removeTopologyFolder(e.params);
        break;

      case 'add-user-folder':
        this.addUserFolder(e.params);
        break;
      case 'rename-user-folder':
        this.renameUserFolder(e.params);
        break;
      case 'remove-user-folder':
        this.removeUserFolder(e.params);
        break;
      case 'addImageUrl':
        this.addComponentImage(e.params);
        break;
      case 'deleteImage':
        this.deleteComponentImage(e.params);
        break;
      case 'logout':
        // 退出登录
        this.user = null;
        // Do sth.
        break;

      case 't-topology-folder-open': // 打开文件夹
        this.openFolder(e.params);
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
          query: { folder: e.params, component: '1', r: Date.now() + '' },
        });
        break;

      case 'editMaterial':
        // 编辑“我的组件”
        // Do sth. For example:
        this.$router.push({
          path: '/',
          query: {
            id: e.params.id,
            folder: e.params,
            component: '1',
            r: Date.now() + '',
          },
        });
        break;

      case 'newFile':
        this.$router.push({
          path: '/',
          query: { folder: e.params, r: Date.now() + '' },
        });
        break;
      case 'save':
        this.save();
        break;

      case 'view':
        this.$router.push({
          path: '/',
          query: { id: e.params.id, r: Date.now() + '' },
        });
        break;
      case 'preview':
        // 点击工具栏“预览”
        // 保存当前编辑数据，方便预览时直接打开
        (window as any).topologyData = (window as any).topology.data;
        this.$router.push({
          path: '/preview',
          query: { id: this.$route.query.id, r: Date.now() + '' },
        });
        break;

      // ...
      // ...
    }
  }

  async addTopologyFolder(name: string) {
    let folder: any = await axios.post('/api/user/folder', {
      type: 'topology',
      name,
    });
    if (folder.data.error) {
      alert('新增文件夹失败：' + folder.data.error);
    }
  }

  async renameTopologyFolder(params: any) {
    params.type = 'topology';
    let folder: any = await axios.post('/api/user/folder', params);
    if (folder.data.error) {
      alert('修改文件夹失败：' + folder.data.error);
    }
  }

  async removeTopologyFolder(params: any) {
    params.type = 'topology';
    let folder: any = await axios.post('/api/user/folder/delete', params);
    if (folder.data.error) {
      alert('删除文件夹失败：' + folder.data.error);
    }
  }

  async addUserFolder(name: string) {
    let folder: any = await axios.post('/api/user/folder', {
      type: 'user',
      name,
    });
    if (folder.data.error) {
      alert('新增文件夹失败：' + folder.data.error);
    }
  }

  async renameUserFolder(params: any) {
    params.type = 'user';
    let folder: any = await axios.post('/api/user/folder', params);
    if (folder.data.error) {
      alert('修改文件夹失败：' + folder.data.error);
    }
  }

  async removeUserFolder(params: any) {
    params.type = 'user';
    let folder: any = await axios.post('/api/user/folder/delete', params);
    if (folder.data.error) {
      alert('删除文件夹失败：' + folder.data.error);
    }
  }

  async openFolder(params: { folder: string; component: boolean }) {
    const rep: any = await axios.get('/api/user/topologies', {
      params: {
        folder: params.folder,
        component: params.component,
        pageIndex: 1,
        pageCount: 100,
      },
    });
    // 对数据进行调整
    if (params.component) {
      // 组件
      let userFolder = this.materials.user?.find((item: any) => {
        return item.name === params.folder;
      });
      if (userFolder) {
        // 存在该文件夹，且数据不为空
        userFolder.list = rep.list ? rep.list : [];
        userFolder.loading = false;
      }
    } else {
      // 图纸
      let topologyFolder = this.materials.topology?.find(
        (item: any) => item.name === params.folder
      );
      if (topologyFolder) {
        // 存在该文件夹，且数据不为空
        topologyFolder.list = rep.list ? rep.list : [];
        topologyFolder.loading = false;
      }
    }
  }

  save(tip = true) {
    (window as any).topology.toImage(10, 'image/png', 1, async (blob: any) => {
      if (this.data.id) {
        if (!(await this.delImage(this.data.image))) {
          return;
        }
      }

      const file = await this.upload(blob, true);
      if (!file) {
        return;
      }

      this.data = Object.assign({}, (window as any).topology.pureData());
      if (this.data.component) {
        this.data.componentData = (window as any).topology.toComponent();
      }

      this.data.image = file.data.url;

      let ret: any;
      if (!this.data.name) {
        this.data.name = `topology.${new Date().toLocaleString()}`;
      }
      if (this.data.id) {
        ret = await axios.put('/api/user/topology', this.data);
      } else {
        ret = await axios.post('/api/user/topology', this.data);
      }

      if (ret.data.error) {
        return null;
      }

      if (!this.data.id || this.$route.query.version) {
        this.data.id = ret.data.id;
        this.$router.push({
          path: '/',
          query: { id: this.data.id },
        });
      } else {
      }

      tip && alert('保存成功！');

      this.getMaterials();
    });
  }

  async upload(blob: Blob, shared = false, filename = '/topology/thumb.png') {
    const form = new FormData();
    form.append('path', filename);
    form.append('randomName', '1');
    form.append('public', shared + '');
    form.append('file', blob);
    const ret: any = await axios.post('/api/image', form);
    if (ret.data.error) {
      return null;
    }

    return ret;
  }

  async delImage(image: string) {
    const ret: any = await axios.delete('/api' + image);
    if (ret.data.error) {
      return false;
    }

    return true;
  }

  async addComponentImage(params: any) {
    const ret: any = await axios.post('/api/user/component/image', params);
    if (ret.error) {
      return false;
    }

    this.getMaterials();
  }

  async deleteComponentImage(params: any) {
    const ret: any = await axios.post(
      '/api/user/component/image/delete',
      params
    );
    if (ret.error) {
      return false;
    }

    this.getMaterials();
  }
}
</script>
<style lang="scss">
.home {
  height: 100vh;
}
</style>
