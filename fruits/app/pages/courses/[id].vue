<script setup>
// --- LOGIK-BEREICH ---
// Hier importiert man die benötigten Vue-Funktionen für reaktive Variablen und berechnete Werte.
import { ref, computed } from 'vue'

// 1. URL auslesen: Man holt sich die aktuelle Route, um den Parameter zu extrahieren.
const route = useRoute()
const urlId = route.params.id // Entspricht der 'id' in der URL (z.B. /module/7 -> 7)

// 2. Daten laden: Man fragt asynchron alle Kurse von der API ab.
const { data } = await useFetch("/api/kurse")

// 3. Den passenden Kurs finden: 
// Sobald die Daten da sind, sucht man exakt den Kurs heraus, dessen ID mit der URL übereinstimmt.
const aktuellerKurs = computed(() => {
  if (!data.value?.courses) return null
  return data.value.courses.find(course => course.id.toString() === urlId)
})

// 4. Tab-Steuerung:
// 'aktiverTab' speichert, was gerade ausgewählt ist. Ändert man den Wert (Klick), passt sich die Ansicht automatisch an.
const aktiverTab = ref('Altklausuren')
const tabs = ['Altklausuren', 'Lösungen', 'Mitschriften', 'Alle Ressourcen']

// 5. Daten zusammenstellen:
// Hier kombiniert man die echten API-Daten mit Platzhaltern (für noch nicht existierende Felder in der Datenbank).
const modulDaten = computed(() => {
  return {
    // Dynamische Werte (aus aktuellerKurs extrahiert)
    id: aktuellerKurs.value ? aktuellerKurs.value.modul_id : 'Lädt...', 
    name: aktuellerKurs.value ? aktuellerKurs.value.name : 'Kurs wird geladen...',
    
    // Statische Platzhalter für die visuelle Präsentation
    dozent: 'Prof. Müller',
    beschreibung: 'An exploration of relational databases, SQL programming, database design, normalization, concurrency control, and NoSQL systems.',
    bewertungModul: 3.5,
    bewertungDozent: 4.5
  }
})

// 6. Testdaten für die hochgeladenen Materialien
const materialien = ref([
  { name: 'SS2023_Altklausur.pdf', autor: 'Ben', datum: '12.03.2026', typ: 'Altklausuren' },
  { name: 'WS2022_Prüfung.pdf', autor: 'Clara', datum: '18.01.2026', typ: 'Altklausuren' },
  { name: 'SQL_CheatSheet.doc', autor: 'Jan', datum: '05.02.2026', typ: 'Lösungen' }
])
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
    <div class="max-w-7xl mx-auto p-4 md:p-8">
      
      <div class="mb-6 pl-2">
        <NuxtLink to="/courses" class="inline-flex items-center text-green-600 hover:text-blue-700 font-bold transition-colors">
          <span class="mr-2 text-2xl leading-none">&larr;</span> Zurück zur Kursübersicht
        </NuxtLink>
      </div>

      <header class="rounded-[2.5rem] bg-gradient-to-br from-green-400 to-blue-600 p-10 shadow-lg shadow-blue-900/10 mb-8 relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        
        <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tight text-white relative z-10">
          {{ modulDaten.name }}
        </h1>
        <p class="mt-4 text-lg text-green-50 max-w-3xl relative z-10 font-medium leading-relaxed">
          {{ modulDaten.beschreibung }}
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-8">
          
          <section class="bg-white rounded-[2rem] shadow-xl shadow-green-900/5 border border-green-50 overflow-hidden">
            <div class="p-8">
              
              <button class="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:-translate-y-1 shadow-md mb-8 flex items-center gap-2">
                <span class="text-2xl leading-none">+</span> MEHR HOCHLADEN
              </button>

              <div class="flex border-b border-slate-100 mb-6 overflow-x-auto gap-4">
                <button 
                  v-for="tab in tabs" :key="tab"
                  @click="aktiverTab = tab" 
                  :class="['pb-3 font-bold text-sm transition-colors whitespace-nowrap', 
                  /* Dynamisches CSS: Ist der Tab aktiv, bekommt er einen dicken grünen Unterstrich und grüne Schrift. */
                  aktiverTab === tab ? 'text-green-600 border-b-4 border-green-500' : 'text-slate-400 hover:text-slate-600']"
                >
                  {{ tab.toUpperCase() }}
                </button>
              </div>

              <div class="space-y-4">
                <div 
                  v-for="file in materialien.filter(m => aktiverTab === 'Alle Ressourcen' || m.typ === aktiverTab)" :key="file.name"
                  class="flex items-center justify-between p-4 bg-slate-50 border border-transparent rounded-2xl hover:bg-green-50 hover:border-green-100 transition-colors"
                >
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 flex items-center justify-center bg-white text-green-500 rounded-full shadow-sm text-xl">
                      📄
                    </div>
                    <div>
                      <p class="font-bold text-slate-800">{{ file.name }}</p>
                      <p class="text-xs text-slate-500 font-medium">Uploaded by {{ file.autor }}, {{ file.datum }}</p>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button class="p-2 text-slate-400 hover:text-green-500 transition-colors">📋</button>
                    <button class="p-2 text-slate-400 hover:text-blue-500 transition-colors">📥</button>
                  </div>
                </div>
              </div>

            </div>
          </section>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-blue-900/5 hover:border-green-200 transition-colors">
              <p class="text-sm font-bold text-slate-400 mb-2">Dozent</p>
              <p class="font-bold text-slate-800 text-lg">{{ modulDaten.dozent }}</p>
              <div class="flex text-amber-400 my-2 text-lg">★★★★★</div>
              <p class="text-xs font-semibold text-slate-500">Rating: {{ modulDaten.bewertungDozent }}</p>
            </div>

            <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-blue-900/5 hover:border-green-200 transition-colors">
              <p class="text-sm font-bold text-slate-400 mb-2">Kurs</p>
              <p class="font-bold text-slate-800 text-lg line-clamp-1">{{ modulDaten.name }}</p>
              <div class="flex text-amber-400 my-2 text-lg">★★★☆☆</div>
              <p class="text-xs font-semibold text-slate-500">Rating: {{ modulDaten.bewertungModul }}</p>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-[2rem] border border-green-100 shadow-lg shadow-blue-900/5 flex flex-col justify-center items-center text-center">
              <p class="text-sm font-bold text-green-600 mb-1 uppercase tracking-wider">Kurs-ID</p>
              <p class="text-2xl font-black text-blue-900">{{ modulDaten.id }}</p>
            </div>
          </div>

        </div>

        <aside class="bg-white rounded-[2rem] shadow-xl shadow-green-900/5 border border-slate-100 flex flex-col h-fit overflow-hidden">
          
          <div class="p-6 bg-slate-50 border-b border-slate-100 text-center">
            <h2 class="font-extrabold text-slate-700 uppercase tracking-widest text-sm">Diskussionen</h2>
          </div>
          
          <div class="p-6 space-y-6">
            <div class="group cursor-pointer">
              <p class="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">SQL JOIN-Fragen?</p>
              <p class="text-xs font-medium text-slate-400 mt-1">Darian · vor 12 Min</p>
            </div>
            <div class="border-t border-slate-100 pt-5 group cursor-pointer">
              <p class="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">Wann sind die Ergebnisse?</p>
              <p class="text-xs font-medium text-slate-400 mt-1">Clara · vor 2 Std</p>
            </div>
            <div class="border-t border-slate-100 pt-5 group cursor-pointer">
              <p class="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">Wie lerne ich Normalisierung?</p>
              <p class="text-xs font-medium text-slate-400 mt-1">Jan · gestern</p>
            </div>
          </div>

          <div class="p-6 mt-autobg-slate-50">
            <textarea class="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none shadow-inner" rows="3" placeholder="Stell eine Frage..."></textarea>
            <button class="w-full mt-4 bg-slate-800 text-white font-bold py-3 rounded-full hover:bg-green-600 transition-colors shadow-md">
              POSTEN
            </button>
          </div>

          <NuxtLink to="/forum" class="p-6 bg-slate-50">
            <button class="w-full mt-4 bg-slate-800 text-white font-bold py-3 rounded-full hover:bg-green-600 transition-colors shadow-md">
              ALLE BEITRÄGE
            </button>
          </NuxtLink>
          
        </aside>

      </div>
    </div>
  </div>
</template> 