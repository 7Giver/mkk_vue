<template>
  <div class="log-container">
    <template v-if="list.length">
      <div
        class="log-item"
        v-for="(item, index) in list.slice(0, 50)"
        :key="index"
      >
        <el-tag effect="plain">{{ item.operatorName }}</el-tag>
        <el-tag size="mini">{{ item.insertTime }}</el-tag>
        <p class="log">{{ item.message }}</p>
      </div>
    </template>
    <div class="nodata" v-else>暂无数据</div>
  </div>
</template>

<script>
export default {
  name: "logBlock",
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style scoped>
.log-container {
  color: #666;
  padding-left: 10px;
  background-color: #f8f8f9;
  max-height: 80vh;
  overflow-y: scroll;
}
.log-item {
  display: flex;
  align-items: center;
}
.el-tag {
  font-size: 14px;
  margin-right: 12px;
}
.log {
  font-size: 13px;
}
.nodata {
  font-size: 15px;
  line-height: 60px;
}
</style>
