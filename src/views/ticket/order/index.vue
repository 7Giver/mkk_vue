<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="所有订单" name="first">
        <all-orders v-if="activeName == 'first'"></all-orders>
      </el-tab-pane>
      <el-tab-pane label="待处理的订单" name="second">
        <undraw-orders v-if="activeName == 'second'"></undraw-orders>
      </el-tab-pane>
      <el-tab-pane label="我的订单" name="third">
        <mine-orders v-if="activeName == 'third'"></mine-orders>
      </el-tab-pane>
      <!-- <el-tab-pane label="降仓管理" name="fourth">降仓管理</el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import AllOrders from "./allOrders";
import MineOrders from "./mineOrders.vue";
import UndrawOrders from "./undrawOrders";
export default {
  components: {
    AllOrders,
    UndrawOrders,
    MineOrders,
  },
  data() {
    return {
      activeName: "first",
    };
  },
  created() {},
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
  },
};
</script>

<style scoped>
.app-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  padding: 0;
}
.el-tabs {
  border: none;
  height: 100%;
  overflow-y: scroll;
}
::v-deep .el-tabs__content {
  padding: 20px;
}
</style>
