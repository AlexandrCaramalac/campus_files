<script setup>
const route = useRoute()
const kursId = route.params.id
const dateiId = route.params.dateiId

const { data } = await useFetch('/api/datei/' + dateiId)
const { data: kommentarData, refresh: refreshKommentare } = await useFetch('/api/datei/kommentare/' + dateiId)

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const { data: { publicUrl } } = supabase.storage.from('kurs_dateien').getPublicUrl('')
const publicUrlBase = publicUrl.endsWith('/') ? publicUrl : publicUrl + '/'

const datei = computed(() => data.value?.datei)
const pdfUrl = computed(() => datei.value ? `${publicUrlBase}${datei.value.dateipfad}` : null)
const downloadUrl = computed(() => datei.value ? `${publicUrlBase}${datei.value.dateipfad}?download=${datei.value.dateiname}` : null)
const kommentare = computed(() => kommentarData.value?.kommentare ?? [])

const formatDateityp = (dbTyp) => {
  if (dbTyp === 'altklausur') return 'Altklausur'
  if (dbTyp === 'loesung') return 'Lösung'
  if (dbTyp === 'mitschrift') return 'Mitschrift'
  return dbTyp
}

const neuerKommentar = ref('')
const sendet = ref(false)
const fehler = ref('')

const kommentarAbsenden = async () => {
  if (!neuerKommentar.value.trim()) return
  sendet.value = true
  fehler.value = ''

  try {
    await $fetch('/api/datei/kommentare', {
      method: 'POST',
      body: { dateiID: Number(dateiId), kommentar: neuerKommentar.value.trim() }
    })
    neuerKommentar.value = ''
    await refreshKommentare()
  } catch (err) {
    fehler.value = err?.data?.message || err?.message || 'Kommentar konnte nicht gespeichert werden.'
  } finally {
    sendet.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
    <div class="max-w-7xl mx-auto p-4 md:p-8">

      <div class="mb-6 pl-2">
        <NuxtLink
          :to="`/courses/${kursId}`"
          class="inline-flex items-center text-green-600 hover:text-blue-700 font-bold transition-colors"
        >
          <span class="mr-2 text-2xl leading-none">&larr;</span> Zurück zum Kurs
        </NuxtLink>
      </div>

      <div v-if="datei">

        <!-- Header -->
        <header class="rounded-[2.5rem] bg-gradient-to-br from-green-400 to-blue-600 p-8 shadow-lg shadow-blue-900/10 mb-8 relative overflow-hidden">
          <div class="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div class="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p class="text-green-100 font-bold text-sm uppercase tracking-wider mb-2">
                {{ formatDateityp(datei.typ) }}
              </p>
              <h1 class="text-2xl md:text-3xl font-black text-white break-all">
                {{ datei.dateiname }}
              </h1>
              <p class="mt-2 text-green-50 text-sm font-medium">
                Hochgeladen am {{ new Date(datei.created_at).toLocaleDateString('de-DE') }}
              </p>
            </div>
            <a
              :href="downloadUrl"
              :download="datei.dateiname"
              class="flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 font-bold py-3 px-6 rounded-full shadow-md transition-colors text-sm whitespace-nowrap self-start"
            >
              📥 Herunterladen
            </a>
          </div>
        </header>

        <!-- PDF + Kommentare -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- PDF Viewer -->
          <div class="lg:col-span-2 bg-white rounded-[2rem] shadow-xl shadow-green-900/5 border border-green-50 overflow-hidden" style="height: 82vh;">
            <iframe
              :src="`${pdfUrl}#toolbar=1&view=FitH`"
              class="w-full h-full border-0"
              type="application/pdf"
              :title="datei.dateiname"
            />
          </div>

          <!-- Kommentare -->
          <aside class="lg:col-span-1 bg-white rounded-[2rem] shadow-xl shadow-green-900/5 border border-slate-100 flex flex-col overflow-hidden" style="height: 82vh;">

            <div class="p-5 bg-slate-50 border-b border-slate-100">
              <h2 class="font-extrabold text-slate-700 uppercase tracking-widest text-sm">
                Kommentare
                <span class="ml-2 text-xs font-bold text-slate-400 normal-case tracking-normal">
                  {{ kommentare.length }}
                </span>
              </h2>
            </div>

            <!-- Liste -->
            <div class="flex-1 overflow-y-auto p-5 space-y-4">
              <div v-if="kommentare.length === 0" class="text-center py-12 text-slate-400">
                <p class="text-3xl mb-2">💬</p>
                <p class="font-medium text-sm">Noch keine Kommentare.</p>
                <p class="text-xs mt-1">Sei der Erste!</p>
              </div>

              <div
                v-for="k in kommentare"
                :key="k.id"
                class="bg-slate-50 rounded-2xl p-4 border border-slate-100"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-bold text-sm text-slate-800">
                    {{ k.profile?.name || 'Nutzer' }}
                  </span>
                  <span class="text-xs text-slate-400 font-medium">
                    {{ new Date(k.created_at).toLocaleDateString('de-DE', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    }) }}
                  </span>
                </div>
                <p class="text-sm text-slate-700 leading-relaxed">{{ k.kommentar }}</p>
              </div>
            </div>

            <!-- Eingabebereich -->
            <div class="p-5 bg-slate-50 border-t border-slate-100">
              <div v-if="user">
                <p v-if="fehler" class="text-red-500 text-xs font-medium mb-2">{{ fehler }}</p>
                <textarea
                  v-model="neuerKommentar"
                  class="w-full p-3 bg-white border border-slate-200 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition"
                  rows="3"
                  placeholder="Schreib einen Kommentar..."
                  :disabled="sendet"
                />
                <button
                  @click="kommentarAbsenden"
                  :disabled="sendet || !neuerKommentar.trim()"
                  class="mt-3 w-full bg-slate-800 text-white font-bold py-3 rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md text-sm"
                >
                  {{ sendet ? 'Wird gesendet...' : 'KOMMENTIEREN' }}
                </button>
              </div>
              <div v-else class="text-center py-3">
                <p class="text-slate-500 text-sm mb-3 font-medium">Melde dich an, um zu kommentieren.</p>
                <NuxtLink
                  to="/login"
                  class="inline-block bg-slate-800 text-white font-bold py-2 px-6 rounded-full hover:bg-green-600 transition-colors text-sm"
                >
                  Anmelden
                </NuxtLink>
              </div>
            </div>

          </aside>

        </div>
      </div>

      <div v-else class="text-center py-32">
        <p class="text-slate-400 font-bold text-lg">Datei wird geladen...</p>
      </div>

    </div>
  </div>
</template>
