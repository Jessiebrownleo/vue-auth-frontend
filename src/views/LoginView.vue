<template>
  <AuthForm title="Welcome Back" buttonText="Sign In" :submit="handleLogin" ref="form">
    <div class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
            id="email"
            v-model="email"
            type="email"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            @blur="validateEmail"
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
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
              @click="togglePasswordVisibility"
          >
            {{ showPassword ? 'Hide' : 'Show' }}
          </button>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
              id="remember-me"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
        </div>
        <router-link to="/forgot-password" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Forgot your password?
        </router-link>
      </div>
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      <div class="mt-6">
        <div id="google-signin-button" class="flex justify-center"></div>
      </div>
      <!-- Additional UI for Google login conflict -->
      <div v-if="showGoogleConflict" class="mt-4 text-sm text-gray-600 text-center">
        <p>{{ googleConflictMessage }}</p>
        <div class="mt-2 flex justify-center space-x-4">
          <button @click="usePasswordLogin" class="text-indigo-600 hover:text-indigo-500 font-medium">Use Password</button>
          <router-link to="/link-google" class="text-indigo-600 hover:text-indigo-500 font-medium">Link Account</router-link>
        </div>
      </div>
    </div>
  </AuthForm>
  <p class="mt-4 text-center text-sm text-gray-600">
    Not a member?
    <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">Sign up now</router-link>
  </p>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AuthForm from '../components/AuthForm.vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const router = useRouter()
const authStore = useAuthStore()
const form = ref<InstanceType<typeof AuthForm> | null>(null)
const emailError = ref('')
const showGoogleConflict = ref(false)
const googleConflictMessage = ref('')

const isFormValid = computed(() => {
  return email.value && password.value && !emailError.value
})

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = 'Please enter a valid email address';
  } else {
    emailError.value = '';
  }
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

async function handleLogin() {
  if (!isFormValid.value) {
    form.value!.error = 'Please fill in all fields correctly';
    return;
  }

  try {
    console.log('Starting login process...');
    await authStore.login(email.value, password.value, rememberMe.value);
    console.log('Login successful!');
    form.value!.message = 'Logged in successfully!';
    setTimeout(() => router.push('/'), 1500);
  } catch (error: any) {
    console.error('Login failed:', error);
    form.value!.error = error.response?.data?.message || 'Login failed';
  }
}

async function handleGoogleLogin(credential: string) {
  try {
    console.log('Starting Google login process...');
    const result = await authStore.googleLogin(credential);
    if (result.success) {
      console.log('Google login successful!');
      form.value!.message = 'Logged in with Google successfully!';
      showGoogleConflict.value = false;
      setTimeout(() => router.push('/'), 1500);
    } else {
      console.error('Google login failed:', result.error);
      form.value!.error = result.error;
      if (result.error.includes('email/password account')) {
        showGoogleConflict.value = true;
        googleConflictMessage.value = result.error;
      }
    }
  } catch (error: any) {
    console.error('Google login failed:', error);
    form.value!.error = error.response?.data?.message || 'Google login failed';
  }
}

function usePasswordLogin() {
  showGoogleConflict.value = false;
  form.value!.error = ''; // Clear error to allow password entry
}

onMounted(() => {
  console.log('Initializing Google Auth...');
  authStore.initGoogleAuth(handleGoogleLogin);
});
</script>