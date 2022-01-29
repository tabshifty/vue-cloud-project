<template>
  <section class="record">
    <header>
      <h2>中文字幕</h2>
    </header>
    <div class="record__list" v-for="list in recordList" :key="list.id">
      <p>演员： {{list.actor}}</p>
      <p>{{list.title}}</p>
      <p class="magnet" v-if="showMagnet"><a :href="list.magnet">磁力链接: {{list.magnet}}</a></p>
      <img v-for="link in list.imgUrls" :src="link" alt="" :key="link">
    </div>
    <button v-show="skip" @click="getPrev">上一页</button>
      <span>第<input class="curpage" :value="skip+1" @input="increase" @keyup.enter="gotoPage">页 </span>
      <span>/ 共{{pages}}页</span>
    <button v-show="skip<pages" @click="getNext">下一页</button>
  </section>
</template>

<script>
import axios from 'axios' 
const domain = "http://192.168.8.27"
const token = localStorage.getItem('token')
axios.interceptors.request.use(function(config) {
  config.headers.authorization = 'Bearer '+token
  return config
})
export default {
  name: 'Home',
  data: function(){
    return {
      recordList:[],
      skip: 0,
      total: 0,
      number: 5,
      showMagnet: true//navigator.userAgent.includes('115Browser')
    }
  },
  mounted: function() {
    axios.get(`${domain}/recordlist?skip=${this.skip}&number=${this.number}&count=1`).then(response => {
      if(Array.isArray(response.data.msg)) {
        this.recordList.push(...response.data.msg)
        this.total = response.data.total
      } else {
        console.log(response.data.msg)
      }
      // 
    }).catch(err => {
      console.log(err)
    })
  },
  computed:{
    pages() {
      return Math.ceil(this.total / this.number)
    },
  },
  methods: {
    getPrev() {
      if(this.skip) {
        this.skip--
      }
      this.gotoPage()
    },
    getNext() {
      if(this.skip < this.pages) {
        this.skip++
      }
      this.gotoPage()
    },
    gotoPage() {
      if(this.skip < 0 || this.skip > this.pages) return
      axios.get(`${domain}/recordlist?skip=${this.skip*this.number}&number=${this.number}`).then(response => {
        if(Array.isArray(response.data.msg)) {
          this.recordList= response.data.msg
        } else {
          console.log(response.data.msg)
        }
        //   
      })
    },
    increase(evt) {
      const value = evt.target.value
      if (value<1 ||value>this.pages) {
        return
      } else {
        this.skip = value - 1
      }

    }
  },
  watch: {
    skip() {
      window.scrollTo({
        top: 0,
        // behavior: 'smooth'
      })
    }
  }
}
</script>
<style scoped>

  header {
    position: sticky;
    top: 0;
    background: red;
    height: 96px;
    box-shadow: 0 0 10px 2px #eec6c6;
    display: flex;
    align-items: center;
  }
  h2 {
    margin: 0;
    padding: 0;
    margin-left: 120px;
    font-size: 36px;
    color: white;
  }
  .record {
    padding-bottom: 40px;
  }
  .record__list {
      padding: 40px 0;
  }
  .record__list:nth-of-type(even) {
    background: #eec6c6
  }
  
  .record__list img,.record__list p {
    width: 100%;
    max-width: 720px;
    display: block;
    margin: 10px auto;
  }
  .record__list p {
    text-align: left;
    font-size: 18px;
  }
  .record__list>p.magnet {
    margin-bottom: 40px;
  }

  p.magnet a {
    text-decoration: none;
    color: rgba(44, 37, 36, .75);
  }
  p.magnet a:hover {
    text-decoration: underline;
  }
  .curpage {
    width: 20px;
  }
  @media screen and (max-width: 800px){
    
    .record__list img, .record__list p { 
      width: 90%;
    }
  }
</style>