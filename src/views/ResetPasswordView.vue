<template>
  <AuthForm title="Reset Password" buttonText="Reset" :submit="handleReset" ref="form">
    <div class="space-y-4">
      <div>
        <label class="block text-gray-700 font-medium">Email</label>
        <input v-model="email" type="email" class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
      <div>
        <label class="block text-gray-700 font-medium">New Password</label>
        <input v-model="newPassword" type="password" class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
      <div>
        <label class="block text-gray-700 font-medium">Confirm Password</label>
        <input
            v-model="confirmPassword"
            type="password"
            class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            @blur="validatePasswords"
        />
        <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
      </div>
    </div>
  </AuthForm>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AuthForm from '../components/AuthForm.vue'

const email = ref('')
const token = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const form = ref<InstanceType<typeof AuthForm> | null>(null)

// Initialize email and token from URL query parameters
email.value = route.query.email as string || ''
token.value = route.query.token as string || ''

const isFormValid = computed(() => {
  return email.value &&
      newPassword.value &&
      confirmPassword.value &&
      !passwordError.value &&
      newPassword.value === confirmPassword.value
})

function validatePasswords() {
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match'
  } else {
    passwordError.value = ''
  }
}

async function handleReset() {
  if (!isFormValid.value) {
    form.value!.error = passwordError.value || 'Please fill in all fields correctly'
    return
  }

  try {
    await authStore.resetPassword(email.value, token.value, newPassword.value)
    form.value!.message = 'Password reset successful! Redirecting to login...'
    setTimeout(() => router.push('/login'), 2000)
  } catch (error: any) {
    form.value!.error = error.response?.data?.message || 'Reset failed'
  }
}
</script>