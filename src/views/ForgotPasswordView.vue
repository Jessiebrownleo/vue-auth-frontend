<template>
  <AuthForm title="Forgot Password" buttonText="Send Reset Link" :submit="handleForgot" ref="form">
    <div class="space-y-4">
      <div>
        <label class="block text-gray-700 font-medium">Email</label>
        <input v-model="email" type="email" class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
    </div>
  </AuthForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import AuthForm from '../components/AuthForm.vue'

const email = ref('')
const authStore = useAuthStore()
const form = ref<InstanceType<typeof AuthForm> | null>(null)

async function handleForgot() {
  try {
    await authStore.forgotPassword(email.value)
    form.value!.message = 'Reset link sent! Check your email.'
  } catch (error: any) {
    form.value!.error = error.response?.data?.message || 'Request failed'
  }
}
</script>