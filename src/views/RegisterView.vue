<template>
  <AuthForm title="Create an Account" buttonText="Sign Up" :submit="handleRegister" ref="form">
    <div class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
        <input
            id="username"
            v-model="username"
            type="text"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
        />
        <p v-if="usernameError" class="mt-1 text-sm text-red-600">{{ usernameError }}</p>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
            id="email"
            v-model="email"
            type="email"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
        />
        <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="relative">
          <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
              required
          />
          <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-indigo-600"
              @click="togglePasswordVisibility"
          >
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
        <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
      </div>

      <div class="flex items-center">
        <input
            id="terms"
            v-model="agreeToTerms"
            type="checkbox"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label for="terms" class="ml-2 block text-sm text-gray-900">
          I agree to the <a href="#" class="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a>
        </label>
      </div>

      <!-- Duplicate email feedback -->
      <div v-if="showEmailDuplicate" class="mt-4 text-sm text-gray-600 text-center">
        <p>{{ emailDuplicateMessage }}</p>
        <div class="mt-2 flex justify-center space-x-4">
          <router-link to="/login" class="text-indigo-600 hover:text-indigo-500 font-medium">Log In Instead</router-link>
          <router-link to="/forgot-password" class="text-indigo-600 hover:text-indigo-500 font-medium">Reset Password</router-link>
        </div>
      </div>
    </div>
  </AuthForm>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AuthForm from '../components/AuthForm.vue'

const username = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const agreeToTerms = ref(false)
const isSubmitting = ref(false)
const router = useRouter()
const authStore = useAuthStore()
const form = ref<InstanceType<typeof AuthForm> | null>(null)

const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const showEmailDuplicate = ref(false)
const emailDuplicateMessage = ref('')

const isFormValid = computed(() => {
  return username.value && email.value && password.value && agreeToTerms.value &&
      !usernameError.value && !emailError.value && !passwordError.value
})

// Validate username
watch(username, (value) => {
  if (value.length < 3) {
    usernameError.value = 'Username must be at least 3 characters long';
  } else {
    usernameError.value = '';
  }
})

// Validate email
watch(email, (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailError.value = emailRegex.test(value) ? '' : 'Please enter a valid email address';
})

// Validate password
watch(password, (value) => {
  if (value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long';
  } else if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value)) {
    passwordError.value = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  } else {
    passwordError.value = '';
  }
})

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

async function handleRegister() {
  if (!isFormValid.value) {
    form.value!.error = 'Please fill in all fields correctly and agree to the terms';
    return;
  }

  isSubmitting.value = true;

  try {
    console.log('Starting registration...');
    const result = await authStore.register(username.value, email.value, password.value);
    if (result.success) {
      console.log('Registration successful!');
      form.value!.message = 'Registration successful! Redirecting to verify your email...';
      showEmailDuplicate.value = false;
      setTimeout(() => router.push('/verify-email'), 1500);
    } else {
      console.error('Registration failed:', result.error);
      form.value!.error = result.error ?? 'Registration failed'; // Handle undefined
      if (result.error?.includes('Email already in use')) {
        showEmailDuplicate.value = true;
        emailDuplicateMessage.value = result.error ?? ''; // Handle undefined
      }
    }
  } catch (error: any) {
    console.error('Registration failed:', error);
    form.value!.error = error.response?.data?.message || 'Registration failed';
    if (error.response?.data?.message.includes('Email already in use')) {
      showEmailDuplicate.value = true;
      emailDuplicateMessage.value = error.response.data.message;
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>