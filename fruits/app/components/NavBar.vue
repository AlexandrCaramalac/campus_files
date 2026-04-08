<template>
  <nav class="sticky top-0 z-50 bg-white shadow-md">
    <div class="flex items-center justify-between px-6 py-3">
      
      <!-- Links (links positioniert) -->
      <ul class="flex items-center">
        <li class="pr-4">
          <NuxtLink 
            to="/fruits" 
            class="text-gray-700 font-medium hover:text-green-600 transition"
          >
            Explore Fruit Library
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/" 
            class="text-gray-700 font-medium hover:text-green-600 transition"
          >
            Home
          </NuxtLink>
        </li>
      </ul>

      <!-- Logo (mittig positioniert) -->
      <div class="flex justify-center">
        <img 
          src="https://www.diagnosisdiet.com/assets/images/6/fruit-og-z8vk4201s653efw.jpg" 
          alt="Logo"
          class="h-10 object-contain"
        >
      </div>

      <!-- Button (rechts) -->
      <div>
        <NuxtLink to="/fruitAdd">
          <button class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
            Add Fruit
          </button>
        </NuxtLink>
      </div>

    </div>
  </nav>
</template>
