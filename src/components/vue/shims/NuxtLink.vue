<script setup lang="ts">
defineProps<{ to?: string; href?: string; exactActiveClass?: string }>()
</script>
<template>
  <a :href="(to || href) as string"><slot /></a>
</template>
