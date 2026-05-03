<script setup>
import { ref } from 'vue'

const route = useRoute()

// NEU: 'refresh: refreshLecturer' hinzugefügt, um die Daten nach der Bewertung stumm neu zu laden
const { data: lecturer, refresh: refreshLecturer } = await useFetch('/api/dozenten/' + route.params.id)
const { data: forums } = await useFetch('/api/dozenten/foren/' + route.params.id)

// NEU: Steuerung für das Bewertungs-Pop-up
const zeigeDozentBewertung = ref(false)

const datenNeuLaden = async () => {
  await refreshLecturer()
}

// Sterne-Funktion (wie auf der Kurs-Seite)
const generiereSterne = (wert) => {
  if (!wert || isNaN(wert)) return '☆☆☆☆☆';
  const gerundet = Math.round(wert);
  return '★'.repeat(gerundet) + '☆'.repeat(5 - gerundet);
}

</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-black font-sans text-slate-800 dark:text-gray-100 pb-12 transition-colors duration-300">
    <div class="max-w-7xl mx-auto p-4 md:p-8">

      <!-- NEU: Zurück-Link -->
      <div class="mb-6 pl-2">
        <NuxtLink to="/lecturers" class="inline-flex items-center text-green-600 dark:text-green-400 hover:text-blue-700 dark:hover:text-blue-400 font-bold transition-colors">
          <span class="mr-2 text-2xl leading-none">&larr;</span> Zurück zur Dozentenübersicht
        </NuxtLink>
      </div>

      <!-- HEADER -->
      <header class="rounded-[2.5rem] bg-gradient-to-br from-green-400 to-blue-600 dark:from-green-700 dark:to-blue-900 p-10 shadow-lg shadow-blue-900/10 dark:shadow-black/50 mb-8 relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>

        <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tight text-white relative z-10">
          {{ lecturer?.dozent?.vorname }} {{ lecturer?.dozent?.nachname }}
        </h1>

        <p class="mt-4 text-lg text-green-50 dark:text-gray-200 max-w-3xl relative z-10 font-medium leading-relaxed">
          Bewertungsübersicht & Informationen zum Dozenten
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- LEFT SIDE -->
        <div class="lg:col-span-2 space-y-8">

          <!-- BEWERTUNGEN -->
          <section class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl shadow-green-900/5 dark:shadow-black/40 border border-green-50 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <div class="p-8">

              <h2 class="text-xl font-extrabold text-slate-700 dark:text-gray-100 uppercase tracking-widest mb-6">
                Bewertungen
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div class="bg-slate-50 dark:bg-gray-800 p-5 rounded-2xl transition-colors duration-300">
                  <p class="text-sm text-slate-400 dark:text-gray-500 font-bold">Verständlichkeit</p>
                  <div class="text-amber-400 text-lg my-1">
                    {{ generiereSterne(lecturer?.bewertungen?.verstaendlichkeit) }}
                  </div>
                  <p class="text-sm font-semibold text-slate-800 dark:text-gray-100">
                    {{ lecturer?.bewertungen?.verstaendlichkeit || '-' }}
                  </p>
                </div>

                <div class="bg-slate-50 dark:bg-gray-800 p-5 rounded-2xl transition-colors duration-300">
                  <p class="text-sm text-slate-400 dark:text-gray-500 font-bold">Struktur</p>
                  <div class="text-amber-400 text-lg my-1">
                    {{ generiereSterne(lecturer?.bewertungen?.struktur) }}
                  </div>
                  <p class="text-sm font-semibold text-slate-800 dark:text-gray-100">
                    {{ lecturer?.bewertungen?.struktur || '-' }}
                  </p>
                </div>

                <div class="bg-slate-50 dark:bg-gray-800 p-5 rounded-2xl transition-colors duration-300">
                  <p class="text-sm text-slate-400 dark:text-gray-500 font-bold">Engagement</p>
                  <div class="text-amber-400 text-lg my-1">
                    {{ generiereSterne(lecturer?.bewertungen?.engagement) }}
                  </div>
                  <p class="text-sm font-semibold text-slate-800 dark:text-gray-100">
                    {{ lecturer?.bewertungen?.engagement || '-' }}
                  </p>
                </div>

                <div class="bg-slate-50 dark:bg-gray-800 p-5 rounded-2xl transition-colors duration-300">
                  <p class="text-sm text-slate-400 dark:text-gray-500 font-bold">Freundlichkeit</p>
                  <div class="text-amber-400 text-lg my-1">
                    {{ generiereSterne(lecturer?.bewertungen?.freundlichkeit) }}
                  </div>
                  <p class="text-sm font-semibold text-slate-800 dark:text-gray-100">
                    {{ lecturer?.bewertungen?.freundlichkeit || '-' }}
                  </p>
                </div>

              </div>

              <!-- GESAMT -->
              <div class="mt-8 text-center flex flex-col items-center">
                <p class="text-sm text-slate-400 dark:text-gray-500 font-bold">Gesamtbewertung</p>
                <div class="text-amber-400 text-2xl my-2">
                  {{ generiereSterne(lecturer?.bewertungen?.gesamtbewertung) }}
                </div>
                <p class="font-bold text-lg text-slate-800 dark:text-gray-100 mb-6">
                  {{ lecturer?.bewertungen?.gesamtbewertung || 'Keine Bewertung' }}
                </p>

                <!-- NEU: Bewerten-Button -->
                <button 
                  @click="zeigeDozentBewertung = true" 
                  class="w-full max-w-sm bg-slate-50 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-gray-700 text-slate-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-bold py-3 rounded-xl transition-colors border border-slate-100 dark:border-gray-700">
                  Dozent bewerten
                </button>
              </div>

            </div>
          </section>

          <!-- KURSE -->
          <section class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl shadow-blue-900/5 dark:shadow-black/40 border border-slate-100 dark:border-gray-700 transition-colors duration-300">
            <div class="p-8">

              <h2 class="text-xl font-extrabold text-slate-700 dark:text-gray-100 uppercase tracking-widest mb-6">
                Unterrichtete Kurse
              </h2>

              <div class="space-y-3">
                <div
                    v-for="(course, index) in lecturer?.kurse"
                    :key="index"
                    class="p-4 bg-slate-50 dark:bg-gray-800 rounded-xl font-semibold hover:bg-green-50 dark:hover:bg-gray-700 transition-colors text-slate-800 dark:text-gray-100"
                >
                  {{ course }}
                </div>
              </div>

            </div>
          </section>

        </div>

        <!-- RIGHT SIDE (FORUM) -->
        <aside class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl shadow-green-900/5 dark:shadow-black/40 border border-slate-100 dark:border-gray-700 flex flex-col h-fit overflow-hidden transition-colors duration-300">

          <div class="p-6 bg-slate-50 dark:bg-gray-800 border-b border-slate-100 dark:border-gray-700 text-center transition-colors duration-300">
            <h2 class="font-extrabold text-slate-700 dark:text-gray-100 uppercase tracking-widest text-sm">
              Diskussionen
            </h2>
          </div>

          <div class="p-6 space-y-6">

            <div
                v-for="item in forums?.beitraege"
                :key="item.id"
                class="group cursor-pointer border-b border-slate-100 dark:border-gray-700 pb-4 last:border-none"
            >
              <p class="font-bold text-sm text-slate-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ item.thema }}
              </p>

              <p class="text-xs font-medium text-slate-400 dark:text-gray-500 mt-1">
                {{ item.profile.name }} ·
                {{ new Date(item.created_at).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) }}
              </p>

              <NuxtLink
                  :to="`/lecturers/${route.params.id}/${item.id}`"
                  class="text-blue-600 dark:text-blue-400 text-xs font-bold mt-2 inline-block hover:underline"
              >
                Kommentare ansehen →
              </NuxtLink>
            </div>

          </div>

        </aside>

      </div>
    </div>
  </div>

  <!-- NEU: MODAL: Dozent bewerten -->
  <div v-if="zeigeDozentBewertung" class="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <BewertungProf 
      :dozentId="route.params.id" 
      @abbrechen="zeigeDozentBewertung = false" 
      @gespeichert="zeigeDozentBewertung = false; datenNeuLaden()" 
    />
  </div>

</template>