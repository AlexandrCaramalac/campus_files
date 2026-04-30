<script setup>
const route = useRoute()

const { data: comments } = await useFetch('/api/dozenten/foren/kommentare/' + route.params.forumId)
</script>

<template>
  <div
      class="min-h-screen bg-slate-50 dark:bg-black
           text-slate-800 dark:text-gray-100
           p-6 transition-colors duration-300"
  >
    <div class="max-w-4xl mx-auto">

      <h1 class="text-2xl font-bold mb-6 text-slate-800 dark:text-gray-100">
        Kommentare
      </h1>

      <ul class="space-y-4">
        <li
            v-for="item in comments.beitraege"
            :key="item.id"
            class="bg-white dark:bg-gray-900
                 border border-slate-100 dark:border-gray-700
                 rounded-2xl p-4
                 shadow-md dark:shadow-black/40
                 transition-colors duration-300"
        >
          <p class="text-slate-700 dark:text-gray-100 mb-2">
            {{ item.kommentar }}
          </p>

          <p class="text-sm text-slate-500 dark:text-gray-400">
            von {{ item.profile.name }}
          </p>

          <p class="text-xs text-slate-400 dark:text-gray-500 mt-1">
            am {{ new Date(item.created_at).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) }}
          </p>
        </li>
      </ul>

    </div>
  </div>
</template>