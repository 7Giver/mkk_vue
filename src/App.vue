<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default  {
  name:  'App'
}
</script>
<style>
  .van-grid-item__icon+.van-grid-item__text{
    font-size: 0.36rem;
  }
  .van-cell{
    font-size: 0.36rem!important;
  }
</style>
