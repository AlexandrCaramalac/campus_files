<template>
  <footer class="bg-gray-900 text-gray-300 py-10 mt-16">
    <div class="max-w-7xl mx-auto px-6">
      
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        
        <!-- Left: Logo / Name -->
        <div class="text-center md:text-left">
          <h2 class="text-xl font-semibold text-white">FruitApp</h2>
          <p class="text-sm text-gray-400">
            Fresh fruits. Healthy life.
          </p>
        </div>

        <!-- Center: Navigation (nur Links, keine Buttons) -->
        <div class="flex gap-6 text-sm">
          <NuxtLink to="/" class="hover:text-white transition">Home</NuxtLink>
          <NuxtLink to="/fruits" class="hover:text-white transition">Fruits</NuxtLink>
        </div>

        <!-- Right: Info -->
        <div class="text-sm text-gray-400 text-center md:text-right">
          <p>© 2026 FruitApp</p>
          <p>All rights reserved</p>
        </div>

      </div>

    </div>
  </footer>
</template>