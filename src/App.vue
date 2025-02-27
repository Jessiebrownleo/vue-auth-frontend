<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
    <Navbar />
    <router-view class="container mx-auto p-6" />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
</script>