<template>
  <div>
    <a target="_parent" href="/oauth/feishu">Feishu</a>
    <a target="_parent" href="/oauth/github">Github</a>
    <a target="_parent" href="/oauth/discord">Discord</a>
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
