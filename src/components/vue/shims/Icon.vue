<script setup lang="ts">
import { computed } from 'vue'
import * as Lucide from 'lucide-vue-next'

const props = defineProps<{
  name?: string
  size?: string | number
}>()

// Convert "lucide:flask-conical" → "FlaskConical"
function toPascal(s: string): string {
  return s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
}

const component = computed(() => {
  if (!props.name) return null
  const raw = props.name.replace(/^lucide:/, '')
  const pascal = toPascal(raw)
  return (Lucide as any)[pascal] || (Lucide as any).Circle
})

const sizeValue = computed(() => {
  if (typeof props.size === 'number') return props.size
  if (typeof props.size === 'string') return parseInt(props.size, 10) || 16
  return 16
})
</script>

<template>
  <component v-if="component" :is="component" :size="sizeValue" stroke-width="1.75" aria-hidden="true" />
</template>
