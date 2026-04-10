<script setup>
    const {data} = await useFetch("/api/kurse")
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl">Module</h1>
    <ul class="space-y-4">
      <li v-for="modul in data.module" :key="modul.id" class="border p-4 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold">{{ modul.name }}</h2>
      </li>
    </ul>
  </div>
</template>