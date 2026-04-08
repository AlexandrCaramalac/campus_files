<script setup>
import FruitCard from '~/components/FruitCard.vue'

const {data} = await useFetch("/api/fruits")

// Beispiel-Daten

</script>

<template>
  <section class="max-w-7xl mx-auto px-6 py-16">
    
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-800">Our Fresh Fruits</h1>
      <p class="text-gray-600 mt-4">
        Explore our collection of healthy and delicious fruits. Click on a fruit to learn more!
      </p>
    </div>

    <!-- Fruit Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <FruitCard
          v-for="fruit in data.fruits"
          :key="fruit.id"
          :fruit = fruit
        />
    </div>

  </section>
</template>

