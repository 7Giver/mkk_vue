<template>
  <div class="container">
    <el-radio-group v-model="radio">
      <el-radio v-for="(item, index) in list" :key="index" :label="index">
        {{ item.ticketChannelName }}
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: "ticketChannelReset",
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      radio: 0,
    };
  },
  created() {},
  methods: {
    getData() {
      let data = this.list[this.radio];
      if (!data.ticketChannelId) {
        return;
      } else {
        return data;
      }
    },
  },
};
</script>
