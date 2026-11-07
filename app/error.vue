<template>
  <main class="error">
    <p class="eyebrow">Error {{ error?.statusCode || 500 }}</p>
    <h1>{{ error?.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}</h1>
    <p>
      {{ error?.statusCode === 404
        ? "The page you're looking for doesn't exist or has been moved."
        : 'An unexpected error occurred. Please try again.' }}
    </p>
    <button class="btn btn--primary" @click="clearError({ redirect: '/' })">Back to home</button>
  </main>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
</script>

<style scoped>
.error {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  text-align: center;
}

.error h1 { font-size: clamp(32px, 5vw, 48px); }
.error p:not(.eyebrow) { max-width: 420px; margin-bottom: 8px; }
</style>
