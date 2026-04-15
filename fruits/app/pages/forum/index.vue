<script setup>
const posts = [
  {
    id: 1,
    title: 'Tipps für Theoretische Informatik?',
    type: 'Modul',
    reference: 'Theoretische Informatik',
    author: 'Anna',
    replies: 12
  },
  {
    id: 2,
    title: 'Wie ist Prof. Brinkmeier?',
    type: 'Dozent',
    reference: 'Brinkmeier',
    author: 'Leon',
    replies: 5
  }
]
</script>

<template>
  <div class="min-h-screen bg-gray-100 px-6 py-8">
    <div class="max-w-5xl mx-auto">

      <!-- Titel + Button -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Forum</h1>

        <NuxtLink to="/forum/create">
          <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Neuer Beitrag
          </button>
        </NuxtLink>
      </div>

      <!-- Beiträge -->
      <div class="space-y-4">
        <div
            v-for="post in posts"
            :key="post.id"
            class="bg-white p-5 rounded-xl shadow-md"
        >
          <h2 class="text-xl font-semibold">{{ post.title }}</h2>

          <p class="text-sm text-gray-500 mt-1">
            {{ post.type }} · {{ post.reference }} · von {{ post.author }}
          </p>

          <p class="text-sm mt-2">
            {{ post.replies }} Antworten
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>