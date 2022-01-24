<template>
  <div class="channel-container">
    <div class="channel-list" v-for="(item, index) in data" :key="index">
      <h3>{{ item.fullName }}</h3>
      <template v-if="item.children.length">
        <div class="content" v-for="(channel, idx) in item.children" :key="idx">
          <el-checkbox
            v-model="channel.checked"
            @change="checkChange($event, channel)"
          >
            {{ channel.fullName }}
          </el-checkbox>
          <div class="flex-wrap">
            <div class="input-item" v-if="channel.checked">
              <p class="label">优先级</p>
              <el-input
                v-model.number="channel.sortCode"
                placeholder="请输入优先级"
              ></el-input>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "channelForm",
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
    };
  },
  methods: {
    checkChange(e, item) {
      if (e === false) {
        this.$delete(item, 'sortCode');
      }
      // console.log(item);
    },
  },
};
</script>

<style lang="scss" scoped>
.channel-list {
  padding-left: 75px;
  padding-bottom: 8px;
  .content {
    display: flex;
    align-items: center;
    padding-left: 40px;
    margin-bottom: 8px;
  }
  .el-checkbox {
    flex: 1;
  }
  .flex-wrap {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .input-item {
    display: flex;
    align-items: center;
    &:first-child {
      margin-right: 20px;
    }
  }
  .el-input {
    width: 140px;
  }
  .label {
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
    margin-right: 10px;
    &::before {
      content: "*";
      color: #ff4949;
      margin-right: 4px;
    }
  }
}
</style>
