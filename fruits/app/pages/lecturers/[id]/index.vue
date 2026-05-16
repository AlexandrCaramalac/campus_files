<script setup>
import { ref } from 'vue'

const route = useRoute()

// NEU: 'refresh: refreshLecturer' hinzugefügt, um die Daten nach der Bewertung stumm neu zu laden
const { data: lecturer, refresh: refreshLecturer } = await useFetch('/api/dozenten/' + route.params.id)
const { data: forums, refresh: refreshForums } = await useFetch('/api/dozenten/foren/' + route.params.id)

const user = useSupabaseUser()
const neuesDiskussionsThema = ref('')
const postet = ref(false)
const postFehler = ref('')

const diskussionPosten = async () => {
  if (!neuesDiskussionsThema.value.trim()) return
  postet.value = true
  postFehler.value = ''
  try {
    await $fetch('/api/dozenten/foren', {
      method: 'POST',
      body: { dozentID: Number(route.params.id), thema: neuesDiskussionsThema.value.trim() }
    })
    neuesDiskussionsThema.value = ''
    await refreshForums()
  } catch (err) {
    postFehler.value = err?.data?.message || err?.message || 'Beitrag konnte nicht gespeichert werden.'
  } finally {
    postet.value = false
  }
}

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

              <!--Verlinkung zu den Kursen-->
              <NuxtLink
                  v-for="course in lecturer?.kurse"
                  :key="course.id"
                  :to="`/courses/${course.id}`"
                  class="block p-4 bg-slate-50 dark:bg-gray-800 rounded-xl font-semibold hover:bg-green-50 dark:hover:bg-gray-700 transition-colors text-slate-800 dark:text-gray-100"
              >
                {{ course.name }}
              </NuxtLink>

            </div>
          </section>

        </div>

        <!-- RIGHT SIDE (FORUM) -->
        <aside class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl shadow-green-900/5 dark:shadow-black/40 border border-slate-100 dark:border-gray-700 flex flex-col h-fit overflow-hidden transition-colors duration-300">

          <div class="p-6 bg-slate-50 dark:bg-gray-800 border-b border-slate-100 dark:border-gray-700 text-center transition-colors duration-300">
            <h2 class="font-extrabold text-slate-700 dark:text-gray-100 uppercase tracking-widest text-sm">Diskussionen</h2>
          </div>

          <!-- Beitragsliste -->
          <div class="p-6 space-y-4 max-h-72 overflow-y-auto">
            <div v-if="!forums?.beitraege?.length" class="text-center py-4 text-slate-400 dark:text-gray-500 text-sm">
              Noch keine Diskussionen.
            </div>
            <NuxtLink
              v-for="(item, index) in forums?.beitraege"
              :key="item.id"
              :to="`/lecturers/${route.params.id}/${item.id}`"
              :class="['block group', index > 0 ? 'border-t border-slate-100 dark:border-gray-700 pt-4' : '']"
            >
              <div class="flex items-start justify-between gap-2 mb-2">
                <p class="font-bold text-sm text-slate-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{{ item.thema }}</p>
                <span
                  v-if="item.kommentar_dozent?.[0]?.count > 0"
                  class="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-blue-500 mt-1"
                  title="Wurde beantwortet"
                ></span>
              </div>
              <div class="flex items-center gap-2">
                <img
                  v-if="item.profile?.avatar"
                  :src="`/avatars/${item.profile.avatar}.png`"
                  :alt="item.profile?.name || 'Nutzer'"
                  class="w-5 h-5 rounded-full object-cover flex-shrink-0"
                />
                <div v-else class="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center flex-shrink-0 text-white text-[10px] font-black">
                  {{ (item.profile?.name || 'N')[0].toUpperCase() }}
                </div>
                <p class="text-xs font-medium text-slate-400 dark:text-gray-500">
                  {{ item.profile?.name || 'Nutzer' }} ·
                  {{ new Date(item.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
                </p>
              </div>
            </NuxtLink>
          </div>

          <!-- Eingabe -->
          <div class="p-6 mt-auto bg-slate-50 dark:bg-gray-800 border-t border-slate-100 dark:border-gray-700 space-y-3 transition-colors duration-300">
            <div v-if="user">
              <p v-if="postFehler" class="text-red-500 text-xs font-medium mb-2">{{ postFehler }}</p>
              <textarea
                v-model="neuesDiskussionsThema"
                class="w-full p-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-2xl text-sm text-slate-800 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-300"
                rows="3"
                placeholder="Stell eine Frage..."
                :disabled="postet"
              ></textarea>
              <button
                @click="diskussionPosten"
                :disabled="postet || !neuesDiskussionsThema.trim()"
                class="w-full bg-slate-800 dark:bg-gray-700 text-white font-bold py-3 rounded-full hover:bg-green-600 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md text-sm mt-3"
              >
                {{ postet ? 'WIRD GEPOSTET...' : 'POSTEN' }}
              </button>
            </div>
            <div v-else class="text-center py-2">
              <p class="text-slate-500 dark:text-gray-400 text-sm mb-3 font-medium">Anmelden um zu diskutieren.</p>
              <NuxtLink
                to="/login"
                class="inline-block bg-slate-800 dark:bg-gray-700 text-white font-bold py-2 px-6 rounded-full hover:bg-green-600 dark:hover:bg-green-600 transition-colors text-sm"
              >
                Anmelden
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