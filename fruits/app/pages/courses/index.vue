<script setup>
  const { data } = await useFetch("/api/kurse")
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 p-6 md:p-12">
    <div class="max-w-4xl mx-auto">
      
      <h1 class="text-4xl font-black uppercase tracking-tight text-slate-800 mb-8 ml-2">
        Alle Module
      </h1>
      
      <ul class="space-y-4">
        <li v-for="modul in data.module" :key="modul.id" 
            class="group bg-white border border-slate-100 p-2 rounded-[2rem] shadow-md shadow-blue-900/5 hover:shadow-xl hover:shadow-teal-900/10 hover:border-teal-200 transition-all duration-300 transform hover:-translate-y-1">
          
          <NuxtLink :to="`/module/${modul.id}`" class="flex items-center justify-between p-4 w-full cursor-pointer">
            
            <h2 class="text-xl md:text-2xl font-bold text-slate-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-500 group-hover:to-blue-600 transition-all duration-300">
              {{ modul.name }}
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