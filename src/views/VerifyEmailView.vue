<template>
  <AuthForm
      :title="'Verify Your Email'"
      :buttonText="'Verify Email'"
      :submit="handleVerify"
      ref="formRef"
      class="max-w-md mx-auto"
  >
    <div class="space-y-6">
      <!-- Email display -->
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Your Email</label>
        <div class="flex items-center">
          <span class="text-gray-800 dark:text-gray-200 font-medium">{{ email }}</span>
          <span class="ml-2 bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">Pending Verification</span>
        </div>
      </div>

      <!-- OTP Input -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Verification Code</label>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">Enter the 6-digit code sent to your email</p>

        <div class="flex justify-center">
          <div class="grid grid-cols-6 gap-2">
            <input
                v-for="(_, index) in 6"
                :key="index"
                :ref="(el) => { if(el) otpInputs[index] = el as HTMLInputElement }"
                v-model="otpDigits[index]"
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="w-10 h-12 text-center border-2 rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-lg font-bold"
                @input="handleOtpInput(index)"
                @keydown="handleKeyDown($event, index)"
            />
          </div>
        </div>
      </div>

      <!-- Resend code option -->
      <div class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Didn't receive the code?
          <button
              type="button"
              class="text-primary hover:text-primary-dark font-medium"
              :disabled="resendCooldown > 0"
              @click="resendCode"
          >
            {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code' }}
          </button>
        </p>
      </div>
    </div>
  </AuthForm>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AuthForm from '../components/AuthForm.vue'

const email = ref('')
const otpDigits = ref(Array(6).fill(''))
const otpInputs = ref<HTMLInputElement[]>([])
const resendCooldown = ref(0)
const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<InstanceType<typeof AuthForm> | null>(null)

// Computed property for the full OTP
const otp = computed(() => otpDigits.value.join(''))

onMounted(() => {
  email.value = authStore.email || ''
  if (!email.value) {
    router.push('/register') // Redirect back if no email stored
  }

  // Focus the first input
  setTimeout(() => {
    if (otpInputs.value[0]) {
      otpInputs.value[0].focus()
    }
  }, 100)
})

function handleOtpInput(index: number) {
  // Move to next input after filling current one
  if (otpDigits.value[index] && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }

  // Auto-submit when all digits are filled
  if (otpDigits.value.every(digit => digit) && otp.value.length === 6) {
    handleVerify()
  }
}

function handleKeyDown(event: KeyboardEvent, index: number) {
  // Handle backspace
  if (event.key === 'Backspace') {
    if (!otpDigits.value[index] && index > 0) {
      otpDigits.value[index - 1] = ''
      otpInputs.value[index - 1]?.focus()
    }
  }

  // Allow only numbers
  if (!/^\d$/.test(event.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
    event.preventDefault()
  }
}

async function handleVerify() {
  if (otp.value.length !== 6) {
    if (formRef.value) {
      formRef.value.error = 'Please enter all 6 digits of the verification code'
    }
    return
  }

  try {
    await authStore.verifyEmail(email.value, otp.value)
    if (formRef.value) {
      formRef.value.message = 'Email verified successfully! Redirecting to login...'
    }
    setTimeout(() => router.push('/login'), 1500)
  } catch (error: any) {
    if (formRef.value) {
      formRef.value.error = error.response?.data?.message || 'Verification failed. Please check your code and try again.'
    }
  }
}

function resendCode() {
  if (resendCooldown.value > 0) return

  // Start cooldown
  resendCooldown.value = 60
  const timer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)

  // Call resend API - make sure this method exists in your auth store
  if ('resendVerificationCode' in authStore) {
    (authStore as any).resendVerificationCode(email.value)
        .then(() => {
          if (formRef.value) {
            formRef.value.message = 'A new verification code has been sent to your email'
          }
        })
        .catch((error: any) => {
          if (formRef.value) {
            formRef.value.error = error.response?.data?.message || 'Failed to resend code'
          }
        })
  } else {
    if (formRef.value) {
      formRef.value.error = 'Resend verification code functionality is not available'
    }
  }
}
</script>

<style scoped>
/* Animation for focus state */
input:focus {
  transform: scale(1.05);
  transition: transform 0.15s ease-in-out;
}

/* Custom colors */
:deep(.dark) {
  --color-primary: #8B5CF6;
  --color-primary-dark: #7C3AED;
}

:root {
  --color-primary: #6366F1;
  --color-primary-dark: #4F46E5;
}

.text-primary {
  color: var(--color-primary);
}

.text-primary-dark {
  color: var(--color-primary-dark);
}

.focus\:border-primary:focus {
  border-color: var(--color-primary);
}

.focus\:ring-primary:focus {
  --tw-ring-color: var(--color-primary);
}
</style>