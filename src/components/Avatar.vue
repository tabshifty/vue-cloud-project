<template>
  <div class="avatar">
    <div class="img-wrapper">
      <div v-if="!imgUri" class="loader"></div>
      <div v-else class="avatar-img">
        <img :src="imgUri" alt="">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:"Avatar",
  props: {
    imgUri: String,
  }
  
}
</script>
<style lang="scss" scoped>
  .avatar {
    position: absolute;
    width: 160px;
    height: 160px;
    padding: 6px;
    background-color: #ffffff;
    * {
      width: 100%;
      height: 100%;
    }
  }
  .img-wrapper {
    width: 100%;
    height: 100%;
  }
  img {
    width: 100;
  }

</style>