<script setup>

const route = useRoute() 

const { data: lecturer } = await useFetch('/api/dozenten/' + route.params.id)
const { data: forums } = await useFetch('/api/dozenten/foren/' + route.params.id)

// Sterne-Funktion (wie auf deiner Kurs-Seite)
const generiereSterne = (wert) => {
  if (!wert || isNaN(wert)) return '☆☆☆☆☆';
  const gerundet = Math.round(wert);
  return '★'.repeat(gerundet) + '☆'.repeat(5 - gerundet);
}

</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
    <div class="max-w-7xl mx-auto p-4 md:p-8">

      <!-- HEADER -->
      <header class="rounded-[2.5rem] bg-gradient-to-br from-green-400 to-blue-600 p-10 shadow-lg shadow-blue-900/10 mb-8 relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        
        <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tight text-white relative z-10">
          {{ lecturer?.dozent?.vorname }} {{ lecturer?.dozent?.nachname }}
        </h1>

        <p class="mt-4 text-lg text-green-50 max-w-3xl relative z-10 font-medium leading-relaxed">
          Bewertungsübersicht & Informationen zum Dozenten
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- LEFT SIDE -->
        <div class="lg:col-span-2 space-y-8">

          <!-- BEWERTUNGEN -->
          <section class="bg-white rounded-[2rem] shadow-xl shadow-green-900/5 border border-green-50 overflow-hidden">
            <div class="p-8">

              <h2 class="text-xl font-extrabold text-slate-700 uppercase tracking-widest mb-6">
                Bewertungen
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div class="bg-slate-50 p-5 rounded-2xl">
                  <p class="text-sm text-slate-400 font-bold">Verständlichkeit</p>
                  <div class="text-amber-400 text-lg my-1">
                    {{ generiereSterne(lecturer?.bewertungen?.verstaendlichkeit) }}
                  </div>
                  <p class="text-sm font-semibold">
                    {{ lecturer?.bewertungen?.verstaendlichkeit || '-' }}
                  </p>
                </div>

                <div class="bg-slate-50 p-5 rounded-2xl">
                  <p class="text-sm text-slate-400 font-bold">Struktur</p>
                  <div class="text-amber-400 text-lg my-1">
                    {{ generiereSterne(lecturer?.bewertungen?.struktur) }}
                  </div>
                  <p class="text-sm font-semibold">
                    {{ lecturer?.bewertungen?.struktur || '-' }}
                  </p>
                </div>

                <div class="bg-slate-50 p-5 rounded-2xl">
                  <p class="text-sm text-slate-400 font-bold">Engagement</p>
                  <div class="text-amber-400 text-lg my-1">
                    {{ generiereSterne(lecturer?.bewertungen?.engagement) }}
                  </div>
                  <p class="text-sm font-semibold">
                    {{ lecturer?.bewertungen?.engagement || '-' }}
                  </p>
                </div>

                <div class="bg-slate-50 p-5 rounded-2xl">
                  <p class="text-sm text-slate-400 font-bold">Freundlichkeit</p>
                  <div class="text-amber-400 text-lg my-1">
                    {{ generiereSterne(lecturer?.bewertungen?.freundlichkeit) }}
                  </div>
                  <p class="text-sm font-semibold">
                    {{ lecturer?.bewertungen?.freundlichkeit || '-' }}
                  </p>
                </div>

              </div>

              <!-- GESAMT -->
              <div class="mt-8 text-center">
                <p class="text-sm text-slate-400 font-bold">Gesamtbewertung</p>
                <div class="text-amber-400 text-2xl my-2">
                  {{ generiereSterne(lecturer?.bewertungen?.gesamtbewertung) }}
                </div>
                <p class="font-bold text-lg">
                  {{ lecturer?.bewertungen?.gesamtbewertung || 'Keine Bewertung' }}
                </p>
              </div>

            </div>
          </section>

          <!-- KURSE -->
          <section class="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-slate-100">
            <div class="p-8">

              <h2 class="text-xl font-extrabold text-slate-700 uppercase tracking-widest mb-6">
                Unterrichtete Kurse
              </h2>

              <div class="space-y-3">
                <div 
                  v-for="(course, index) in lecturer?.kurse" 
                  :key="index"
                  class="p-4 bg-slate-50 rounded-xl font-semibold hover:bg-green-50 transition-colors"
                >
                  {{ course }}
                </div>
              </div>

            </div>
          </section>

        </div>

        <!-- RIGHT SIDE (FORUM) -->
        <aside class="bg-white rounded-[2rem] shadow-xl shadow-green-900/5 border border-slate-100 flex flex-col h-fit overflow-hidden">

          <div class="p-6 bg-slate-50 border-b border-slate-100 text-center">
            <h2 class="font-extrabold text-slate-700 uppercase tracking-widest text-sm">
              Diskussionen
            </h2>
          </div>

          <div class="p-6 space-y-6">

            <div 
              v-for="item in forums?.beitraege" 
              :key="item.id"
              class="group cursor-pointer border-b border-slate-100 pb-4 last:border-none"
            >
              <p class="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                {{ item.thema }}
              </p>

              <p class="text-xs font-medium text-slate-400 mt-1">
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
                class="text-blue-600 text-xs font-bold mt-2 inline-block hover:underline"
              >
                Kommentare ansehen →
              </NuxtLink>
            </div>

          </div>

        </aside>

      </div>
    </div>
  </div>
</template>