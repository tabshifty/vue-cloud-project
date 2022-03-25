<template>
  <div id="app" :class="device">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App',
  data: function() {
    return {
      device: window.ontouchstart ? 'mobile':'desktop'
    }
  },
  mounted: function() {
    // console.log(nprogress)
    // nprogress.start()
  },
}
</script>
<style>
@import url('../node_modules/nprogress/nprogress.css');
@font-face {
  font-family: 'iconfont';  /* Project id 3104054 */
  src: url('//at.alicdn.com/t/font_3104054_969g8u5vi.woff2?t=1646226840112') format('woff2'),
       url('//at.alicdn.com/t/font_3104054_969g8u5vi.woff?t=1646226840112') format('woff'),
       url('//at.alicdn.com/t/font_3104054_969g8u5vi.ttf?t=1646226840112') format('truetype');
}
*{
  box-sizing: border-box;
  /* user-select: none; */
}
#app {
  font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #E4EBF5;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

/*bad reset*/
input:focus-visible {
  outline: none;
}
</style>
