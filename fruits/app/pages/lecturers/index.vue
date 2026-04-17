<script setup>
    const {data} = await useFetch("/api/dozenten")
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl">Hier entsteht eine Liste aller Dozenten, alphabetisch nach Nachname sortiert</h1>
    <ul class="space-y-4">
      <li v-for="nutzer in data.dozenten" :key="nutzer.id" class="border p-4 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold">{{nutzer.vorname}} {{ nutzer.nachname }}</h2>
        <NuxtLink :to="`/lecturers/${nutzer.id}`" class="text-green-600 hover:text-green-800">Zu den Bewertungen</NuxtLink>
      </li>
    </ul>
  </div>
</template>