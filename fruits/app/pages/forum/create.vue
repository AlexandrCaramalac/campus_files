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
  <div class="min-h-screen bg-gray-100 px-6 py-8">
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">

      <h1 class="text-2xl font-bold mb-6">Neuer Beitrag</h1>

      <!-- Titel -->
      <input
          v-model="title"
          placeholder="Titel"
          class="w-full border p-2 mb-4 rounded"
      />

      <!-- Typ -->
      <select v-model="type" class="w-full border p-2 mb-4 rounded">
        <option disabled value="">Bitte wählen</option>
        <option value="module">Modul</option>
        <option value="lecturer">Dozent</option>
        <option value="other">Sonstiges</option>
      </select>

      <!-- Kategorie -->
      <select
          v-if="type"
          v-model="reference"
          class="w-full border p-2 mb-4 rounded"
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
          class="w-full border p-2 mb-4 rounded"
      ></textarea>

      <button
          @click="submitPost"
          class="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Posten
      </button>

    </div>
  </div>
</template>
<style scoped>

</style>