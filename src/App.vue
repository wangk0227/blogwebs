<template>
    <RouterView v-if="isRouterAlive"/>
</template>
<script>

export default {
  // 重载刷新
  provide() {
    return {
      reload: this.reload,
      state:this.State
    }
  },
  data() {
    return {
      isRouterAlive: true,
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    State(val) {
      // is_show 显示中文
      if (val === 'N') {
        return '否'
      } else {
        return '是'
      }
    }
  }
}
</script>
<style scoped>
</style>
