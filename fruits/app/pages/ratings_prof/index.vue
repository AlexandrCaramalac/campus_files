<script setup>
    const {data} = await useFetch("/api/nutzer/dozenten")
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl">Dozenten</h1>
    <ul class="space-y-4">
      <li v-for="nutzer in data.dozenten" :key="nutzer.id" class="border p-4 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold">{{ nutzer.name }}</h2>
      </li>
    </ul>
  </div>
</template>