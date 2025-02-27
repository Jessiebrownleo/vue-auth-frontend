<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
    <div class="bg-white rounded-xl shadow-xl p-8 max-w-md w-full transform transition-all duration-500 hover:scale-105">
      <div class="flex flex-col items-center">
        <div class="bg-green-100 p-4 rounded-full mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 class="text-4xl font-bold text-gray-800 mb-2 text-center">
          Welcome to <span class="text-indigo-600">DotnetAuth</span>
        </h1>

        <div class="h-1 w-20 bg-indigo-600 rounded my-4"></div>

        <p class="text-lg text-gray-600 mb-6 text-center">
          You have successfully logged in!
        </p>

<!--        <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 flex items-center">-->
<!--          <span>Go to Dashboard</span>-->
<!--          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">-->
<!--            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />-->
<!--          </svg>-->
<!--        </button>-->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// You can add any required functionality here
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.bg-white {
  animation: fadeIn 0.6s ease-out forwards;
}
</style>

