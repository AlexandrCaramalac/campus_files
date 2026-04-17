<script setup>
import { ref, computed } from "vue"

const { data } = await useFetch("/api/kurse")

const search = ref("")

const filteredCourses = computed(() => {
  if (!data.value?.courses) return []

  if (!search.value) return data.value.courses

  return data.value.courses.filter(course =>
    course.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const highlightMatch = (text) => {
  if (!search.value) return text

  const regex = new RegExp(`(${search.value})`, "gi")
  return text.replace(regex, `<span class="bg-yellow-200">$1</span>`)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 p-6 md:p-12">
    <div class="max-w-4xl mx-auto">
      
      <h1 class="text-4xl font-black uppercase tracking-tight text-slate-800 mb-8 ml-2">
        Alle Kurse
      </h1>

      <input
        v-model="search"
        type="text"
        placeholder="Kurse suchen..."
        class="w-full mb-6 px-6 py-4 rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
      
      <ul class="space-y-4">
        <li v-for="course in filteredCourses" :key="course.id" 
            class="group bg-white border border-slate-100 p-2 rounded-[2rem] shadow-md shadow-blue-900/5 hover:shadow-xl hover:shadow-teal-900/10 hover:border-teal-200 transition-all duration-300 transform hover:-translate-y-1">
          
          <NuxtLink :to="`/courses/${course.id}`" class="flex items-center justify-between p-4 w-full cursor-pointer">
            
            <h2 class="text-xl md:text-2xl font-bold text-slate-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-500 group-hover:to-blue-600 transition-all duration-300">
              <span v-html="highlightMatch(course.name)"></span>
            </h2>
            
            <div class="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
              <span class="text-2xl leading-none">&rarr;</span>
            </div>
            
          </NuxtLink>
          
        </li>
      </ul>

    </div>
  </div>
</template>
