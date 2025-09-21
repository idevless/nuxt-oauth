<script setup lang="ts">
const userInfo = useCookie('oauth_user_info')
</script>

<template>
  <div class="space-x-4">
    <a target="_parent" :href="`/oauth/feishu?callbackUrl=${encodeURIComponent('/success')}`"
      >Feishu</a
    >
    <a target="_parent" :href="`/oauth/github?callbackUrl=${encodeURIComponent('/success')}`"
      >Github</a
    >
    <a target="_parent" href="/oauth/discord">Discord</a>
  </div>
  <pre class="text-pretty bg-elevated">
    {{ userInfo }}
  </pre>
</template>
