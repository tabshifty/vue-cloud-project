<template>
  <div ref="wrapper" :class='["video-wrapper", loaded ?"show": ""]'>
    <video ref="video" controls muted :src="videosrc"></video>
    <div v-if="!loaded" class="messages">
      <span>加载中...</span>
      <span>{{messages}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Avideo',
  data: function() {
    return {
      messages: '',
      videosrc: '',
      loaded: false
    }
  },
  props: {
    code: String,
  },
  mounted() {
    let video = document.createElement('video')
    const code = this.code
    const that = this
    const srcArray = [
      `//cc3001.dmm.co.jp/litevideo/freepv/${code[0]}/${code.substring(0,3)}/${code.replace('-','00')}/${code.replace('-','00')}_dmb_w.mp4`,
      `//cc3001.dmm.co.jp/litevideo/freepv/${code[0]}/${code.substring(0,3)}/${code.replace('-','00')}/${code.replace('-','00')}_mhb_w.mp4`,
      `//cc3001.dmm.co.jp/litevideo/freepv/${code[0]}/${code.substring(0,3)}/${code.replace('-','')}/${code.replace('-','')}_dmb_w.mp4`,
      `//cc3001.dmm.co.jp/litevideo/freepv/${`h_067${code}`[0]}/${`h_067${code}`.substring(0,3)}/${`h_067${code}`.replace('-','')}/${`h_067${code}`.replace('-','')}_dmb_w.mp4`,
      `//cc3001.dmm.co.jp/litevideo/freepv/${`h_1100${code}`[0]}/${`h_1100${code}`.substring(0,3)}/${`h_1100${code}`.replace('-','00')}/${`h_1100${code}`.replace('-','00')}_dmb_w.mp4`,
      `//cc3001.dmm.co.jp/litevideo/freepv/${`1${code}`[0]}/${`1${code}`.substring(0,3)}/${`1${code}`.replace('-','')}/${`1${code}`.replace('-','')}_dmb_w.mp4`,
      `//cc3001.dmm.co.jp/litevideo/freepv/${`13${code}`[0]}/${`13${code}`.substring(0,3)}/${`13${code}`.replace('-','')}/${`13${code}`.replace('-','')}_dmb_w.mp4`,
      `//cc3001.dmm.co.jp/litevideo/freepv/${`118${code}`[0]}/${`118${code}`.substring(0,3)}/${`118${code}`.replace('-','')}/${`118${code}`.replace('-','')}_dm_w.mp4`,
      `//cc3001.dmm.co.jp/litevideo/freepv/${`84${code}`[0]}/${`84${code}`.substring(0,3)}/${`84${code}`.replace('-','')}/${`84${code}`.replace('-','')}_dm_w.mp4`,
      `//cc3001.dmm.co.jp/litevideo/freepv/${`1${code}`[0]}/${`1${code}`.substring(0,3)}/${`1${code}`.replace('-','00')}/${`1${code}`.replace('-','00')}_dm_w.mp4`,
    ]
    let src = srcArray.pop()
    this.$refs.video.addEventListener('timeupdate',() => {
      if (that.$refs.wrapper.getBoundingClientRect().left < 0) {
        that.$refs.video.pause()
      }
    })
    video.onerror = () => {
      src = srcArray.pop()
      if (!src) {
        that.messages = "未找到视频源"
      } else {
        that.messages = `正在寻找视频源`
        video.src = src
      }
    }
    video.addEventListener('canplay', () => {
      // if (video.readyState >=3) {
        that.videosrc = src
        that.loaded = true
        video = null
      // }
    })
    video.src = src
  }
}
</script>
<style lang="scss" scoped>
  .video-wrapper {
    position: relative;
    width: 720px;
    margin: auto;
    @media screen and(max-width: 719.8px) {
      width: 100%;
    }
    video {
      width: 100%;
    }
    &::after {
      content: '';
      background: #000000;
      display: block;
      position: absolute;
      z-index: 2;
      width: 100%;
      height: 100%;
      top: 0;
    }
    &.show {
      &::after {
        display: none;
      }
    }
  }
  .messages {
    // display: none;
    position: absolute;
    top: 10px;
    left: 10px;
    color: white;
    z-index: 10;
    span {
      display: block;
      text-align: left;
      margin-bottom: 3px;
    }
  }

</style>