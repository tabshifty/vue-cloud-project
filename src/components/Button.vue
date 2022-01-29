<template>
  <div class="btn__wrapper">
    <button 
      :class="['btn', 'btn--style',customClass, typeClass]" 
      :type="btnType"
      :disabled="loading"
      @click="pesudoClick">
      <span v-if="loading" class="loading">提交中...</span>
      <span v-else>{{btnText}}</span>
    </button>
  </div>
</template>
<script>
export default {
  name: 'FakeButton',
  props: {
    customClass: String,
    btnType: {
      type: String,
      default: 'button'
    },
    btnText: String,
    pesudoClick: {
      type: Function,
      default: () => {console.log('Success')}
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  data: function() {
    return {

    }
  },
  computed: {
    typeClass() {
      return `${this.btnType}--style`
    }
  }
}
</script>
<style lang="scss" scoped>
.btn__wrapper {
  display: inline-block;
  button{
    padding: 0;
    box-sizing: border-box;
    &:disabled {
      background-color: #d3c3c3;
      cursor: not-allowed;
    }
  }
  .btn {
    position: relative;
    width: 120px;
    height: 50px;
    margin: 20px;
    cursor: pointer;
    overflow: hidden;
  }
  .btn--style {
    background: rgb(83, 151, 190);
    color: rgb(60, 75, 75);
    border: 1px solid #bebebe;
    border-radius: 5px;
    color: white
  }
  .submit--style {
    background: white;
    color: black;
  }
  .loading {
    font-size: 14px;
    color: #17a2b8;
  }
  .loader {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scaleX(0);
    transform-origin: left;
    background-color: lighten($color: #28a745, $amount: 10%); //#dc3545
    transition: transform 15s cubic-bezier(0, 0.6, 1, 1);
    &.active {
      transform: scaleX(.8);
    }
    &.success, &.failed{
      transform: scaleX(1);
      transition: transform, background-color 300ms cubic-bezier(0.4, 0, 1, 1);
    }
  }

}
</style>