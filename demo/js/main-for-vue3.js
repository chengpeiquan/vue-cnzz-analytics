/** 
 * 导入需要用到的组件
 */
const { createRouter, createWebHashHistory } = VueRouter;
const { createApp, getCurrentInstance, ref } = Vue;


/** 
 * 初始化路由
 * routes是来自 js/routes.js 里面的配置
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: 'cur',
  linkExactActiveClass: 'cur'
});


/** 
 * 创建实例
 */
const app = {
  setup () {
    // 插件要用到的一个代理组件
    const { proxy } = getCurrentInstance();

    // 初始化要用到的数据
    const pageUrl = ref('');
    const fromUrl = ref('');
    const category = ref('');
    const action = ref('');
    const label = ref('');
    const value = ref('');
    const nodeId = ref('');

    // 提交pv的操作
    const pv = () => {
      proxy.$pushCNZZ.pv(
        pageUrl.value,
        fromUrl.value
      );
    }

    // 提交事件的操作
    const event = () => {
      proxy.$pushCNZZ.event(
        category.value,
        action.value,
        label.value,
        value.value,
        nodeId.value
      );
    }

    // Vue 3.0 需要把模板要用到的东西 return 出去
    return {
      // 数据
      pageUrl,
      fromUrl,
      category,
      action,
      label,
      value,
      nodeId,

      // 方法
      pv,
      event
    }
  }
};


/** 
 * 初始化Vue
 */
createApp(app)
  // 启动路由
  .use(router)

  // 启动插件
  .use(cnzzAnalytics, {
    router: router,
    siteIdList: [
      11111,
      22222,
      33333
    ],
    isDebug: true
  })
  
  // 挂载到节点上
  .mount('#app');