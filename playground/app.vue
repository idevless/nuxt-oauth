<template>
  <div>
    <a target="_parent" href="/oauth/feishu">Feishu</a>
    <div>{{ errorMessage }}</div>
  </div>
</template>

<script setup>
const route = useRoute()
const errorMessage = ref('')

onMounted(() => {
  if (route.query.error) {
    errorMessage.value = route.query.error
  }
})
</script>
