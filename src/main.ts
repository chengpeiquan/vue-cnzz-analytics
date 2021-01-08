import PushCNZZ from '@m/pushCNZZ'
import getVueVersion from '@m/getVueVersion'

/** 
 * 定义插件
 */
export default function install (Vue: Vue, { router, siteIdList, isDebug = false }: Partial<Options>) {

  /** 
   * 一些环境和参数的检查
   */
  if ( typeof document === 'undefined' || typeof window === 'undefined' ) {
    return false;
  }

  if ( !router ) {
    throw new Error('[vue-cnzz-analytics] Must pass a Vue-Router instance to vue-cnzz-analytics.');
  }

  if ( !siteIdList ) {
    throw new Error('[vue-cnzz-analytics] Missing tracking domain ID, add at least one of cnzz analytics.');
  }

  /** 
   * 挂载推送的方法
   */
  const pushCNZZ = new PushCNZZ(siteIdList, isDebug);
  
  // 获取Vue版本（获取失败则默认为2）
  const VUE_VERSION: number = getVueVersion(Vue) || 2;

  // 2.x可以直接挂载到原型上
  if ( VUE_VERSION === 2 ) {
    Vue.prototype.$pushCNZZ = pushCNZZ;
  }

  // 3.x必须使用这个方式来挂载
  if ( VUE_VERSION === 3 ) {
    Vue.config.globalProperties.$pushCNZZ = pushCNZZ;
  }

  /** 
   * 部署站点并初始化
   */
  if ( siteIdList ) {
    pushCNZZ.init();
  }

  /** 
   * 路由切换时执行PV上报
   */
  router.afterEach( (to: To) => {
    const PAGE_PATH_DIR_COUNT = window.location.pathname.split('/').length;
    const PAGE_PATH = window.location.pathname.split('/').slice(0, PAGE_PATH_DIR_COUNT - 1).join('/');
    const PAGE_URL = router.mode === 'hash' ? `${PAGE_PATH}/#${to.fullPath}` : `${PAGE_PATH}${to.fullPath}`;

    pushCNZZ.pv(PAGE_URL);
  });
}
