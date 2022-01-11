import { defineConfig } from 'umi';
import * as path from 'path';

export default defineConfig({
  title: '智慧云客服',
  favicon: `${
    process.env.NODE_ENV === 'production' ? '/webdemo/yxFinance/' : '/'
  }images/finance-logo.png`,
  publicPath:
    process.env.NODE_ENV === 'production' ? '/webdemo/yxFinance/' : '/',
  define: {
    'process.env.ENV': process.env.ENV,
  },
  hash: true,
  history: {
    type: 'hash',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  esbuild: {},
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/', component: '@/pages/login/index' },
        { path: '/meeting', component: '@/pages/meeting/index' },
      ],
    },
  ],
  fastRefresh: {},
  devServer: {
    https: {
      key: path.join(__dirname, './cert/key.pem'),
      cert: path.join(__dirname, './cert/cert.pem'),
    },
  },
  chainWebpack(memo) {
    memo.module
      .rule('media')
      .test(/\.mp(3|4)$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'));
  },
});
