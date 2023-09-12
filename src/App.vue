<script>
import { getCurrentInstance } from 'vue';

export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  onError: function (e) {
    const {
      appContext: {
        config: {
          globalProperties: global
        }
      }
    } = getCurrentInstance();
    global.$console.error(e);
  },
}
</script>

<style>
/*每个页面公共css */
</style>
