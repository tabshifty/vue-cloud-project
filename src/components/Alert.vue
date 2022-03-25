<template>
  <div class="alert-mask">
    <div class="alert-wrapper">
      <div class="alert-body">
        <span>{{message}}</span>
      </div>
      <div class="confirm-wrapper">
        <div class="confirm" @click="onConfirm">确认</div>
        <div class="cancel" @click="onCancel">取消</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Alert",
  props: {
    message: String,
    onConfirm: Function,
    onCancel: Function,
  }
}
</script>
<style lang="scss" scoped>
  .alert-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 9999;
    background-color: rgba(94, 104, 121, 0.288);
  }
  .alert-wrapper {
    position: absolute;
    width: 300px;
    top: 50%;
    left: 50%;
    background: #dde1e7;
    border-radius: 5px;
    box-shadow: -3px -3px 7px #ffffff73, 3px 3px 5px rgba(94, 104, 121, 0.288);
    transform: translate(-50%, -50%);
  }
  .alert-body {
    padding: 25px 20px;
  }
  .confirm-wrapper {
    display: flex;
    border-top: 1px solid rgba(94, 104, 121, 0.688);
    width: 100%;
    >div {
      width: calc(50%);
      padding: 10px;
      cursor: pointer;
      &:first-child {
        // background-color: red;
        border-right: 1px solid rgba(94, 104, 121, 0.688);
      }
    }
  }
</style>