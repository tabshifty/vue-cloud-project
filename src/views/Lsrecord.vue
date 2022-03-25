<template>
  <section class="record">
    <header>
      <h2>Lesbian</h2>
    </header>
    <div class="record__list" v-for="list in recordList" :key="list.id">
      <p>{{list.title}}</p>
      <p>演员： {{list.actor}}</p>
      <p class="magnet" v-for="item in list.magnets" :key="item.magnet"><a :href="item.magnet">磁力链接: {{item.size}}</a></p>
      <img :src="list.coverUri" alt="">
    </div>
    <button v-show="skip" @click="getPrev">上一页</button>
      <span>第<input class="curpage" :value="skip+1" @input="increase" @keyup.enter="gotoPage">页 </span>
      <span>/ 共{{pages}}页</span>
    <button v-show="skip<pages" @click="getNext">下一页</button>
  </section>
</template>

<script>
import axios from 'axios' 
const domain = 'http://124.223.65.151'
const token = localStorage.getItem('token')
let apiPath = "recordlist/lsdata"
axios.interceptors.request.use(function(config) {
  config.headers.authorization = 'Bearer '+token
  return config
})
export default {
  name: 'Lsrecord',
  data: function(){
    return {
      recordList:[],
      skip: 0,
      total: 0,
      number: 5,
      showMagnet: true//navigator.userAgent.includes('115Browser')
    }
  },
  created: function() {
    
  },
  mounted: function() {
   
    console.log(this.$route)
    axios.get(`${domain}/${apiPath}?skip=${this.skip}&number=${this.number}&count=1`).then(response => {
      if(Array.isArray(response.data.msg)) {
        this.recordList.push(...response.data.msg)
        this.total = response.data.total
        console.log(this.recordList)
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
      axios.get(`${domain}/${apiPath}?skip=${this.skip*this.number}&number=${this.number}`).then(response => {
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