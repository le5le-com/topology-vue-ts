const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  configureWebpack: {
    devServer: {
      proxy: {
        '^/api': {
          target: 'http://192.168.1.25:8210',
          changeOrigin: true
        },
        '^/image': {
          target: 'http://192.168.1.25:8210',
          changeOrigin: true
        }
      }
    },
    plugins: []
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'font-size-base': '12px',
            'primary-color': '#1890ff',
            'link-color': '#1890ff',
            'border-radius-base': '2px',
            'success-color': '#52c41a',
            'warning-color': '#faad14',
            'error-color': '#f50000'
          },
          javascriptEnabled: true
        }
      }
    }
  },
  chainWebpack: config => {
    // if (process.env.NODE_ENV === 'production') {
    //   config.module.rule('ts').uses.delete('cache-loader');
    //   config.module
    //     .rule('ts')
    //     .use('ts-loader')
    //     .loader('ts-loader')
    //     .tap(opts => {
    //       opts.transpileOnly = false;
    //       opts.happyPackMode = false;
    //       return opts;
    //     });
    // }
  }
  // parallel: false
};
