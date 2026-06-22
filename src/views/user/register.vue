<template>
  <div />
</template>

<script>
export default {
  name: 'RegisterRedirect',
  created() {
    this.$router.replace('/login?tab=register').catch(() => {});
  }
};
</script>
