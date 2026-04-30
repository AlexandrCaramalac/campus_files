<script setup>
import { ref, computed } from 'vue'

const title = ref('')
const content = ref('')
const type = ref('')
const reference = ref('')

const modules = ['Theoretische Informatik', 'Datenbanken']
const lecturers = ['Brinkmeier', 'Chimani']
const others = ['Allgemein', 'Klausuren']

const options = computed(() => {
  if (type.value === 'module') return modules
  if (type.value === 'lecturer') return lecturers
  if (type.value === 'other') return others
  return []
})

function submitPost() {
  console.log({
    title: title.value,
    content: content.value,
    type: type.value,
    reference: reference.value
  })
}
</script>

<template>
  <div
      class="min-h-screen bg-gray-100 dark:bg-black
           text-slate-800 dark:text-gray-100
           px-6 py-8 transition-colors duration-300"
  >
    <div
        class="max-w-3xl mx-auto
             bg-white dark:bg-gray-900
             border border-slate-100 dark:border-gray-700
             p-6 rounded-xl shadow-md dark:shadow-black/40
             transition-colors duration-300"
    >

      <h1 class="text-2xl font-bold mb-6 text-slate-800 dark:text-gray-100">
        Neuer Beitrag
      </h1>

      <!-- Titel -->
      <input
          v-model="title"
          placeholder="Titel"
          class="w-full border border-slate-200 dark:border-gray-700
               bg-white dark:bg-gray-800
               text-slate-800 dark:text-gray-100
               placeholder:text-slate-400 dark:placeholder:text-gray-500
               p-2 mb-4 rounded
               focus:outline-none focus:ring-2 focus:ring-green-400
               transition-colors duration-300"
      />

      <!-- Typ -->
      <select
          v-model="type"
          class="w-full border border-slate-200 dark:border-gray-700
               bg-white dark:bg-gray-800
               text-slate-800 dark:text-gray-100
               p-2 mb-4 rounded
               focus:outline-none focus:ring-2 focus:ring-green-400
               transition-colors duration-300"
      >
        <option disabled value="">Bitte wählen</option>
        <option value="module">Modul</option>
        <option value="lecturer">Dozent</option>
        <option value="other">Sonstiges</option>
      </select>

      <!-- Kategorie -->
      <select
          v-if="type"
          v-model="reference"
          class="w-full border border-slate-200 dark:border-gray-700
               bg-white dark:bg-gray-800
               text-slate-800 dark:text-gray-100
               p-2 mb-4 rounded
               focus:outline-none focus:ring-2 focus:ring-green-400
               transition-colors duration-300"
      >
        <option disabled value="">Kategorie wählen</option>
        <option v-for="opt in options" :key="opt">
          {{ opt }}
        </option>
      </select>

      <!-- Text -->
      <textarea
          v-model="content"
          placeholder="Dein Beitrag..."
          class="w-full border border-slate-200 dark:border-gray-700
               bg-white dark:bg-gray-800
               text-slate-800 dark:text-gray-100
               placeholder:text-slate-400 dark:placeholder:text-gray-500
               p-2 mb-4 rounded
               focus:outline-none focus:ring-2 focus:ring-green-400
               transition-colors duration-300"
      ></textarea>

      <button
          @click="submitPost"
          class="bg-green-600 hover:bg-green-700
               dark:bg-green-600 dark:hover:bg-green-500
               text-white px-4 py-2 rounded-lg
               transition-colors duration-300"
      >
        Posten
      </button>

    </div>
  </div>
</template>

<style scoped>

</style>