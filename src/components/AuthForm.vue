<template>
  <form @submit.prevent="submit" class="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto space-y-6">
    <h2 class="text-3xl font-bold text-center text-gray-800">{{ title }}</h2>
    <slot></slot>
    <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold">
      {{ buttonText }}
    </button>
    <p v-if="message" class="text-center text-green-600">{{ message }}</p>
    <p v-if="error" class="text-center text-red-600">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
  buttonText: string
  submit: () => Promise<void>
}>()

const message = ref<string | null>(null)
const error = ref<string | null>(null)

defineExpose({ message, error })
</script>