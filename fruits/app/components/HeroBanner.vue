<template>
  <section class="bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
      
      <!-- Left Content -->
      <div class="md:w-1/2 space-y-6 text-center md:text-left">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800">
          Fresh & Healthy Fruits
        </h1>
        
        <p class="text-gray-600 text-lg">
          Discover a wide variety of fresh fruits and manage your collection easily.
        </p>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <NuxtLink to="/fruits">
            <button class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
              Explore Fruits Library
            </button>
          </NuxtLink>
          <NuxtLink to="/fruitAdd">
            <button class="border border-green-500 text-green-500 px-6 py-3 rounded-lg hover:bg-green-50 transition">
              Add a Fruit
            </button>
          </NuxtLink>
        </div>
      </div>

      <!-- Right Image -->
      <div class="md:w-1/2 mt-10 md:mt-0 flex justify-center">
        <img 
          src="https://www.diagnosisdiet.com/assets/images/6/fruit-og-z8vk4201s653efw.jpg" 
          alt="Fruits"
          class="w-full max-w-md rounded-xl shadow-lg object-cover"
        >
      </div>

    </div>
  </section>
</template>