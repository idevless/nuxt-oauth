<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div>
    <div>{{ error?.statusMessage }}</div>
    <h2>{{ error?.data }}</h2>

    <button @click="handleError">清除错误</button>
  </div>
</template>
