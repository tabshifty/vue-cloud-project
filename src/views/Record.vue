<template>
  <section class="record">
    <header>
      <div :class="['hamburger', global.displaymenu? 'open' :'']" @click="showMobileMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <h2><a href="/record/list">Avbase</a></h2>
      <ul class="menu">
        <li><a href="/record/list?ca=domestic">国产</a></li>
        <li><a href="/record/list?ca=uncensored">无码</a></li>
        <li><a href="/record/list?ca=censored">有码</a></li>
        <li><a href="/record/list?ca=caption">中文字幕</a></li>
        <li><a href="/record/list?ca=western">欧美</a></li>
      </ul>
      <input class="search" v-model="global.code" type="text" @keyup.enter="searchByCode" placeholder="Search">
      <a class="login" href="javascript:void(0)" @click="loginout" >登出</a>
      <nav class="nav--mobile" v-show="global.displaymenu" @click="showMobileMenu">
        <ul class="menu menu--mobile" @click.stop>
          <li><a href="/record/list?ca=domestic">国产</a></li>
          <li><a href="/record/list?ca=uncensored">无码</a></li>
          <li><a href="/record/list?ca=censored">有码</a></li>
          <li><a href="/record/list?ca=caption">中文字幕</a></li>
          <li><a href="/record/list?ca=western">欧美</a></li>
        </ul>
        <input class="search search--mobile" v-model="global.code" type="text" @keyup.enter="searchByCode" placeholder="Search">
      </nav>
    </header>
    <div v-show="coverUri" class="modal" @click="coverUri=``">
      <VueSlickCarousel ref="carousel" v-bind="global.setting" v-if="coverUri">
        <div class="img-wrapper" v-if="global.number" @click.stop="">
            <!-- <iframe width="560" height="360" type="text/html" scrolling="no" :src="`https://www.dmm.co.jp/service/digitalapi/-/html5_player/=/cid=${global.number}/mtype=AhRVShI_/service=litevideo/mode=/width=560/height=360/`" frameborder="0"></iframe> -->
          <!-- <video controls :src="`//cc3001.dmm.co.jp/litevideo/freepv/${global.number[0]}/${global.number.substring(0,3)}/${global.number}/${global.number}_mhb_w.mp4`"></video> -->
          <Avideo :code="global.number" />
        </div>
        <div class="img-wrapper" v-for="uri in coverUri" :key="uri">
            <img :src="uri.replace('thumb', 'medium')" alt="" @load="slickImgLoaded" @click.stop="">
        </div>
      </VueSlickCarousel>
      <div class="slick-buttons">
        <div class="prev" @click.stop="slickPrev"><span class="icon">&#xe65f;</span></div>
        <div class="next" @click.stop="slickNext"><span class="icon">&#xe615;</span></div>
      </div>
    </div>
    <Alert v-show="global.listId"
      :message="global.alertmessage"
      :onConfirm="confirmDelete"
      :onCancel="cancelDelete" />
    <div class="sub__container">
      <div class="record__list" v-for="list in recordList" :key="list.id">
        <div class="img-wrapper"  @click="showLargeCover(list.imgUrls, list.title.split(' ')[0])">
          
          <div class="img-clip" >
            <img v-lazy="list.imgUrls[0]">
          
          </div>
        </div>
        <div class="text-wrapper">
          <div class="text-content">
            <h3 class="title">
              {{!list.tag.includes('domestic')?`番号：${list.title.split(' ')[0]}`:list.title}} <a :href="list.magnet"><span class="icon">&#xe6c1;</span></a>
            </h3>
            <p v-if="!list.tag.includes('domestic')" >{{list.title.split(' ').filter((v,i) => i > 0).join(' ')}}</p>
            
            <p class="actor">
              演员： 
              <a class="actor__item" v-for="item in Array.isArray(list.actor)?list.actor:(list.actor?list.actor.split(' '):[])"
                :href="`/record/list?&actor=${item}`" 
                :key="item">{{item}}</a>
            </p>
            <p class="tag">
              <a v-for="tag in list.tag" :key="tag" :href="`/record/list?ca=${tag}`">
                <span class="icon" >{{global.tagMap[tag]}}</span>
              </a>
            </p>
          </div>
          <div class="editor">
            <span class="icon">&#xe66e;</span>
            <span class="icon" @click="setListid(list.id)">&#xe6b4;</span>
          </div>
          <div class="update">
            <span>更新于 {{format(list.create_at)}}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="pagination" ref="pagination">
      <button class="prevBtn" v-show="skip" @click="getPrev">上一页</button>
      <div class="page-wrapper">
        <span>第<input class="curpage" :value="skip+1" @input="increase" @keyup.enter="enterhook">页 </span>
        <span>/ 共{{pages}}页</span>
      </div>
      <button class="nextBtn" v-show="skip+1<pages" @click="getNext">下一页</button>
    </div>
    
  </section>
</template>

<script>
//https://www.dmm.co.jp/service/-/html5_player/=/cid=rbk040/mtype=AhRVShI_/service=mono/floor=dvd/mode=/
// import axios from 'axios' 
import VueSlickCarousel from 'vue-slick-carousel'
import axiosRequest from '../utils/request'
import formatTime from '../utils/time'
import debounce from 'debounce'
// import Avatar from '@/components/Avatar.vue'
import Avideo from '@/components/Video.vue'
import Alert from '@/components/Alert.vue'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
let apiPath = "recordlist"
export default {
  name: 'Record',
  data: function(){
    return {
      recordList:[],
      skip: 0,
      total: 1,
      number: 18,
      type: 'sub',
      actorImg: '',
      coverUri:'',
      global: {
        listId: '',
        alertmessage: "确认删除？",
        code:"",
        number:'',
        setting: {
          arrows: false,
        },
        displaymenu: false,
        tagMap: {
          'censored':'有码',
          'uncensored':'无码',
          'domestic':'国产',
          'caption':'中文字幕',
          'western':'欧美'
        }
      }
    }
  },
  components:{
    Alert,
    VueSlickCarousel,
    Avideo
  },
  created: function() {
    sessionStorage.setItem('ca', 'all')
  },
  mounted: function() {
    let {ca, page, actor} = this.$route.query
    ca = ca ||sessionStorage.getItem('ca')
    this.skip = page ? page - 1 : this.skip
    actor =actor ? actor : ''
    sessionStorage.setItem('ca',ca)
    axiosRequest.get(`/${apiPath}?skip=${this.skip*this.number}&number=${this.number}&count=1&ca=${ca}&actor=${actor}`).then(response => {
      
      if(Array.isArray(response.data.msg)) {
        this.recordList.push(...response.data.msg)
        this.total = response.data.total
      } else {
        console.log(response.data.msg)
      }
      
    }).catch(err => {
      console.log(err)
      this.$router.push({path: '/login/login-in', query: {from: this.$route.fullPath}})
    })
    // test
    this.$nextTick(() => { 
        setTimeout(()=> {
        let height = this.$refs.pagination.clientHeight
        document.documentElement.style.setProperty('--footer-height', `${height}px`)
      }, 1000)
    })
    window.addEventListener('resize',debounce(() => {
      let height = this.$refs.pagination.clientHeight
      document.documentElement.style.setProperty('--footer-height', `${height}px`)
    }))
  },
  computed:{
    pages() {
      return Math.ceil(this.total / this.number)
    }
  },
  methods: {
    enterhook() {
      this.pushPage()
      this.gotoPage()
    },
    format(ms) {
      return formatTime(ms)
    },
    loginout(){
      localStorage.removeItem('token')
      this.$router.go()
    },
    pushPage() {
      this.$router.push({path: '/record/list',query: {...this.$route.query, page: this.skip + 1}})
    },
    getPrev() {
      if(this.skip) {
        this.skip--
      }
      this.pushPage()
      // this.gotoPage()
    },
    getNext() {
      if(this.skip < this.pages) {
        this.skip++
      }
      this.pushPage()
      // this.gotoPage()
    },
    slickNext() {
      this.$refs.carousel.next()
    },
    slickPrev() {
      this.$refs.carousel.prev()
    },
    searchByCode() {
      const {code} = this.global
      if (!code) {
        return "";
      }
      axiosRequest.post('/recordlist/search', {code}).then(response => {
        if(Array.isArray(response.data.msg)) {
          this.recordList=response.data.msg
        } else {
          console.log(response.data.msg)
        }
      }).catch(err => {
        console.log(err)
        // this.$router.push({path: '/login/login-in', query: {from: this.$route.fullPath}})
    })
    },
    showLargeCover(uri, code){
      const reg = /^[a-zA-z]+-[0-9]+/ig
      this.coverUri = uri
      this.global.number = reg.test(code.toLowerCase()) ? code.toLowerCase() : ''
      console.log(this.global.number)
    },
    showMobileMenu() {
      this.global.displaymenu = !this.global.displaymenu
    },
    setListid(id) {
      this.global.listId = id
    },
    confirmDelete() {
      const id = this.global.listId
      let index = -1
      axiosRequest.post('/recordlist/delete', {id}).then(response => {
        console.log(response.data)
        if (response.data.msg == "200") {
          this.global.alertmessage = "删除成功！"
          this.recordList.forEach((v,i) => {
            if (v.id == id){
              index = i
            }
          })
          this.recordList.splice(index, 1)
        } else {
          this.global.alertmessage = "未知错误"
        }
        setTimeout(() => {
          this.global.listId = ''
          this.global.alertmessage = "确认删除？"
        }, 500)
      }).catch(err=>{
        console.log(err)
        this.global.alertmessage = "未知错误"
        setTimeout(() => {
          this.global.listId = ''
          this.global.alertmessage = "确认删除？"
        }, 500)
      })
    },
    cancelDelete() {
      this.global.listId = ''
    },
    hideAvatar() {
      this.actorImg = ''
    },
    gotoPage() {
      let ca = this.$route.query.ca || sessionStorage.getItem('ca'),
            actor = this.$route.query.actor || '';
      if(this.skip < 0 || this.skip > this.pages) return
      axiosRequest.get(`/${apiPath}?skip=${this.skip*this.number}&number=${this.number}&ca=${ca}&actor=${actor}`).then(response => {
        if(Array.isArray(response.data.msg)) {
          this.recordList= response.data.msg
          window.scrollTo({
            top: 0,
            // behavior: 'smooth'
          })
        } else {
          console.log(response.data.msg)
        }
        //   
      }).catch(err => {
        console.log(err)
        this.$router.push({path: '/login/login-in', query: {from: this.$route.fullPath}})
      })
      
    },
    increase(evt) {
      const value = evt.target.value
      if (value<1 ||value>this.pages) {
        return
      } else {
        this.skip = value - 1
      }

    },
    slickImgLoaded(e) {
      const img = e.path[0];
      const [width, height] = [img.naturalWidth, img.naturalHeight];
      if (height > width) {
        img.setAttribute('style', 'width:auto;height:70vh;margin:auto')
      }
    },
  },
  watch: {
    skip() {
      if (this.skip == this.$route.query.page - 1){
        this.gotoPage()
      }
      
    }
  }
}
</script>
<style lang="scss" scoped>
  iframe {
    overflow: hidden;
    border: none;
    @media  (max-width: 560px) {
      max-width: 100%;
    }
  }
  .menu {
    display: flex;
    margin-left: auto;
    li {
      list-style: none;
      padding:0 .25rem;
    }
    @media screen and(max-width: 767.8px){
      display: none;
    }
  }
  .nav--mobile {
    position: fixed;
    width: 100%;
    height: 100vh;
    background-color: rgba(39, 40, 43, 0.888);
    top: 0;
    left: 0;
    z-index: 9999;
    align-items: center;
    @media screen and (min-width:768px) {
      display: none;
    }
    .menu--mobile {
      margin-top: 10rem;
      @media screen and (max-width:767.8px) {
        display: flex;
        flex-direction: column;
        font-size: 20px;
        li {
          margin: .6rem auto;
        }
      }
    }
    input.search--mobile {
      display: inline-block;
      margin: auto;
      @media screen and (min-width: 479.8px){
        display: none;
      }
    }
  }
  .icon {
    font-family: 'iconfont';
    transition: all .3s cubic-bezier(0.165, 0.84, 0.44, 1);
    cursor: pointer;
    &:hover {
      color: red;
    }
  }

  input {
    border: none;
    margin: 2rem;
    &.search {
      width: 160px;
      padding: 10px 12px;
      box-shadow: inset -3px -3px 7px #ffffff73, inset 3px 3px 5px rgba(94, 104, 121, 0.288);
      @media screen and(max-width: 767.8px){
        margin-left: auto;
      }
      @media screen and(max-width: 479.8px){
        display: none;
      }
    }
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 99999;
    background: rgba(94, 104, 121, 0.688);
    .slick-slider {
      top: 50%;
      transform: translateY(-50%);
    }
    .slick-buttons {
      width: 80%;
      max-width: 900px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      span {
        color: #dde1e7;
        font-size: 24px;
      }
    }
    .img-wrapper {
      width: 80%;
      max-width: 900px;
      display: inline-block;
      position: relative;
      @media screen and (max-width: 576px) {
        width: 100%;
      }
      img {
        width: 100%;
      }
    }
  }
  header {
    position: sticky;
    top: 0;
    background: #1f1f1f;
    height: 96px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 50px;
    z-index: 999;
    @media screen and (max-width: 576px) {
      padding: 0 25px;
      height: 84px;
    }
    a {
      color: white;
      &.login {
        margin-left: auto;
      }
    }
  }
  .hamburger {
    position: relative;
    z-index: 100000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 22px;
    height: 16px;
    cursor: pointer;
    margin-top: 5px;
    margin-right: .8rem;
    span {
      width: 100%;
      height: 2px;
      border-radius: 2px;
      background-color: white;
      transition: transform .3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
    &.open {
      span {
        &:first-child {
          transform-origin: 0 100%;
          transform: rotate(45deg);
        }
        &:nth-child(2) {
          opacity: 0;
        }
        &:last-child {
          transform-origin: 12% 100%;
          transform: rotate(-45deg);
        }
      }
    }
    @media screen and (min-width: 768px){
      display: none;
    }
  }
  h2 {
    margin: 0;
    padding: 0;
    font-size: 36px;
    a {
      color: white;
    @media screen and (max-width: 576px) {
      font-size: 30px;
    }
    }
  }
  a {
    text-decoration: none;
  }
  .record {
    padding-bottom: 40px;
    min-height: 100vh;
    // visibility: hidden;
  }
  .sub__container,.ls__container {
    padding: 25px 50px;
    @media screen and (max-width: 768px) {
      padding-left: 25px;
      padding-right: 25px;
    }
    padding-bottom: var(--footer-height);
    display: flex;
    flex-wrap: wrap;
  }
  .record__list {
    display: flex;
    width: calc(50% - 30px);
    margin: 10px 15px;
    padding: 10px;
    // background-color: ivory;
    background: #dde1e7;
    border-radius: 5px;
    box-shadow: -3px -3px 7px #ffffff73, 3px 3px 5px rgba(94, 104, 121, 0.288);
    @media screen and (max-width: 1124px) {
      width: 100%;
      margin: 20px 0;
    }
    @media screen and (max-width: 768px) {
      flex-direction: column;
      margin: 15px auto;
    }
    
    img[lazy="loading"] {
      background: url('../assets/images/Rolling-1s-60px.gif') center center no-repeat;
    }
    .actor__item {
      padding: 0 5px;
      color: #4d3252;
      text-decoration: underline;
    }
    .img-wrapper {
      position: relative;
      width: 60%;
      flex-shrink: 0;
      cursor: pointer;
      &::after {
        display: block;
        content: '';
        padding-bottom: 70%;
      }
      .img-clip {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      @media screen and (max-width: 1100px) {
        width: 50%
      }
      @media screen and (max-width: 768px) {
        width: 100%
      }
    }
    .text-wrapper {
      text-align: left;
      margin-left: 10px;
      padding-right: 2rem;
      display: flex;
      flex-direction: column;
      .editor {
        margin-top: 10px;
        span.icon {
          font-size: 20px;
          margin-right: 10px;
        }
      }
      .update {
        margin-top: auto;
      }
      @media screen and (max-width: 1100px) {
        padding-right: 0;
      }
      @media screen and (max-width: 768px) {
        margin-top: 1rem;
      }
      h3 {
        margin-bottom: 10px;
        word-break: break-word;
        .icon {
          font-family: 'iconfont'; 
          color: red;
          margin-right: 5px;
        }
      }
      p {
        font-size: 16px;
        padding-bottom: .5rem;
      }
      .actor {
        .icon {
          font-size: 18px;
          cursor: pointer;
          &:hover {
            color: red;
          }
        }
      }
      .tag {
        padding: 10px 0;
        a {
          &:not(:last-child){
            margin-right: 10px; 
          }
          color: rgb(155, 129, 129);
        }
        span {
          font-size: 12px;
          box-shadow: -3px -3px 7px #ffffff73, 3px 3px 5px rgba(94, 104, 121, 0.288);
          padding: 6px 10px;
        }
      }
    }
  }
  
  .record__list img,.record__list p {
    width: 100%;
    // max-width: 720px;
    display: block;
  }
  .record__list p {
    text-align: left;
    font-size: 18px;
  }
  .record__list>p.magnet {
    margin-bottom: 40px;
  }

  
  .pagination {
    position: fixed;
    bottom: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    padding:10px 25px;
    color: #4d3252;
    background: #dde1e7;
    border-radius: 3px;
    box-shadow: -3px -3px 7px #ffffff73, 3px 3px 5px rgba(94, 104, 121, 0.288);
    button {
      margin: 0 20px;
      padding: 10px 16px;
      background: #dde1e7;
      border-radius: 3px;
      border: none;
      box-shadow: -3px -3px 7px #ffffff73, 3px 3px 5px rgba(94, 104, 121, 0.288);
      cursor: pointer;
      @media screen and(max-width: 576px) {
        margin-top: 20px;
        &:first-child {
          order: 2;
        }
        &:last-child {
          order: 3;
        }
      }
    }
    .page-wrapper {
      @media screen and(max-width: 576px) {
        width: 80%;
      }
    }
    input {
      width: 60px;
      border: none;
      padding: 5px 16px;  
      margin: 0 6px;
      background: #dde1e7;
      box-shadow: inset -3px -3px 7px #ffffff73, inset 3px 3px 5px rgba(94, 104, 121, 0.288);
    }
  }
  
</style>