<script setup>
// --- LOGIK-BEREICH ---
import { ref, computed } from 'vue'

// 1. URL auslesen
const route = useRoute()
const urlId = route.params.id

// 2. Daten laden: Man fragt nun nur noch den spezifischen Kurs und dessen Zusatzdaten ab.
const { data: course } = await useFetch('/api/kurse/' + urlId)
const { data: forums } = await useFetch('/api/kurse/foren/' + urlId)
const { data: files } = await useFetch('/api/dateien/' + urlId)

const supabase = useSupabaseClient()
const { data: { publicUrl } } = supabase.storage.from('kurs_dateien').getPublicUrl('')
const publicUrlBase = publicUrl.endsWith('/') ? publicUrl : publicUrl + '/'

// 3. Tab-Steuerung
const aktiverTab = ref('Altklausuren')
const tabs = ['Altklausuren', 'Lösungen', 'Mitschriften', 'Alle Ressourcen']

// --- Steuerung für die Bewertungs-Popups ---
const zeigeKursBewertung = ref(false)
const zeigeDozentBewertung = ref(false)

// Die ID des aktuellen Dozenten sicher auslesen (falls einer existiert)
const aktuelleDozentId = computed(() => {
  return course.value?.dozenten?.[0]?.dozent?.id || null
})

// Wenn eine Bewertung gespeichert wurde, wird die Seite neu geladen,
// damit die neuen Sterne direkt sichtbar sind.
const datenNeuLaden = () => {
  window.location.reload()
}

// 4. Daten zusammenstellen:
// Hier bezieht man nun alle Werte (inklusive Beschreibung) dynamisch aus dem 'course' Objekt.
const modulDaten = computed(() => {
  const kursInfo = course.value?.kurs;
  const dozentenInfo = course.value?.dozenten;
  const bewertungen = course.value?.bewertungen;

  // Man nimmt den ersten Dozenten für die Anzeige, falls einer vorhanden ist
  const hauptDozent = dozentenInfo && dozentenInfo.length > 0
      ? `${dozentenInfo[0].dozent.vorname} ${dozentenInfo[0].dozent.nachname}`
      : 'Kein Dozent zugewiesen';

  const dozentBewertung = dozentenInfo && dozentenInfo.length > 0
      ? dozentenInfo[0].dozent.gesamtbewertung || 'Keine Bewertung'
      : '-';

  return {
    id: kursInfo?.modul_id || 'Lädt...',
    name: kursInfo?.name || 'Kurs wird geladen...',
    beschreibung: kursInfo?.beschreibung || 'Keine Beschreibung verfügbar.',
    dozent: hauptDozent,
    bewertungModul: bewertungen?.gesamtbewertung || 'Keine Bewertungen',
    bewertungDozent: dozentBewertung
  }
})

// 5. ECHTE Dateien aus der API aufbereiten (Testdaten gelöscht!)
// --- LOGIK-BEREICH der Kurs-Seite ---

// Hilfsfunktion: Wandelt den Datenbank-Namen in den Tab-Namen um
const formatDateityp = (dbTyp) => {
  if (dbTyp === 'altklausur') return 'Altklausuren'
  if (dbTyp === 'loesung') return 'Lösungen'
  if (dbTyp === 'mitschrift') return 'Mitschriften'
  return dbTyp // Falls mal was anderes drinsteht
}

// Dateien für die Liste aufbereiten
const materialien = computed(() => {
  if (!files.value?.dateien) return []

  return files.value.dateien.map(item => {
    return {
      id: item.id,
      name: item.dateiname || item.dateipfad.split('/').pop(), // Holt den Namen aus dem Pfad, falls 'dateiname' nicht existiert
      typ: formatDateityp(item.typ), // Hier übersetzen wir 'loesung' zu 'Lösungen'
      autor: item.profile?.name || 'Nutzer',
      datum: item.created_at ? new Date(item.created_at).toLocaleDateString('de-DE') : 'Unbekannt',
      urlAnsehen: `${publicUrlBase}${item.dateipfad}`,
      urlDownload: `${publicUrlBase}${item.dateipfad}?download=${item.dateiname || 'download'}`
    }
  })
})

// Hilfsfunktion: Wandelt eine Zahl (0-5) in volle, halbe und leere Sterne um
const generiereSterne = (wert) => {
  if (!wert || isNaN(wert)) return '☆☆☆☆☆';

  // Wir runden auf den nächsten halben Wert (z.B. 3.2 -> 3.0, 3.3 -> 3.5, 3.8 -> 4.0)
  const gerundet = Math.round(wert * 2) / 2;

  const volleSterne = Math.floor(gerundet); // Ganze Zahl vor dem Komma
  const hatHalbenStern = gerundet % 1 !== 0; // Wahr, wenn es z.B. 3.5 ist
  const leereSterne = 5 - Math.ceil(gerundet); // Der Rest auf 5

  let sterneText = '';

  // 1. Volle Sterne hinzufügen
  sterneText += '★'.repeat(volleSterne);

  // 2. Halben Stern hinzufügen (falls nötig)
  if (hatHalbenStern) {
    // Alternativen für den halben Stern: '⯨' oder '⯪' oder ein halbes SVG.
    // Wir nutzen hier ein gängiges Unicode-Zeichen.
    sterneText += '⯨';
  }

  // 3. Leere Sterne auffüllen
  sterneText += '☆'.repeat(leereSterne);

  return sterneText;
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-black font-sans text-slate-800 dark:text-gray-100 pb-12 transition-colors duration-300">
    <div class="max-w-7xl mx-auto p-4 md:p-8">

      <div class="mb-6 pl-2">
        <NuxtLink to="/courses" class="inline-flex items-center text-green-600 dark:text-green-400 hover:text-blue-700 dark:hover:text-blue-400 font-bold transition-colors">
          <span class="mr-2 text-2xl leading-none">&larr;</span> Zurück zur Kursübersicht
        </NuxtLink>
      </div>

      <header class="rounded-[2.5rem] bg-gradient-to-br from-green-400 to-blue-600 dark:from-green-700 dark:to-blue-900 p-10 shadow-lg shadow-blue-900/10 dark:shadow-black/50 mb-8 relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>

        <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tight text-white relative z-10">
          {{ modulDaten.name }}
        </h1>
        <p class="mt-4 text-lg text-green-50 dark:text-gray-200 max-w-3xl relative z-10 font-medium leading-relaxed">
          {{ modulDaten.beschreibung }}
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div class="lg:col-span-2 space-y-8">

          <section class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl shadow-green-900/5 dark:shadow-black/40 border border-green-50 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <div class="p-8">

              <!-- Vorher war das nur ein <button> -->
              <NuxtLink :to="`/dataAdd?kursId=${urlId}`">
                <button class="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 dark:from-green-600 dark:to-blue-700 dark:hover:from-green-500 dark:hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:-translate-y-1 shadow-md mb-8 flex items-center gap-2">
                  <span class="text-2xl leading-none">+</span> MEHR HOCHLADEN
                </button>
              </NuxtLink>

              <div class="flex border-b border-slate-100 dark:border-gray-700 mb-6 overflow-x-auto gap-4">
                <button
                    v-for="tab in tabs" :key="tab"
                    @click="aktiverTab = tab"
                    :class="['pb-3 font-bold text-sm transition-colors whitespace-nowrap',
                    aktiverTab === tab ? 'text-green-600 dark:text-green-400 border-b-4 border-green-500 dark:border-green-400' : 'text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300']"
                >
                  {{ tab.toUpperCase() }}
                </button>
              </div>

              <div class="space-y-4">

                <!-- NEU: Meldung, wenn die Liste nach dem Filtern leer ist -->
                <div
                    v-if="materialien.filter(m => aktiverTab === 'Alle Ressourcen' || m.typ === aktiverTab).length === 0"
                    class="p-8 text-center text-slate-400 dark:text-gray-400 font-medium bg-slate-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-gray-700 transition-colors duration-300"
                >
                  Noch keine Dateien in dieser Kategorie vorhanden.
                </div>

                <!-- BESTEHEND: Die normale Schleife für vorhandene Dateien -->
                <div
                    v-for="file in materialien.filter(m => aktiverTab === 'Alle Ressourcen' || m.typ === aktiverTab)" :key="file.id"
                    class="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-2xl hover:bg-green-50 dark:hover:bg-gray-700 hover:border-green-100 dark:hover:border-green-500 transition-colors"
                >
                  <NuxtLink
                      :to="`/courses/${urlId}/dateien/${file.id}`"
                      class="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                  >
                    <div class="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-900 text-green-500 dark:text-green-400 rounded-full shadow-sm text-xl flex-shrink-0">
                      📄
                    </div>
                    <div class="min-w-0">
                      <p class="font-bold text-slate-800 dark:text-gray-100 truncate">{{ file.name }}</p>
                      <p class="text-xs text-slate-500 dark:text-gray-400 font-medium">Uploaded by {{ file.autor }}, {{ file.datum }}</p>
                    </div>
                  </NuxtLink>

                  <!-- DOWNLOAD (erzwingt das Herunterladen) -->
                  <a
                      :href="file.urlDownload"
                      :download="file.name"
                      class="ml-4 p-2 text-slate-400 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex-shrink-0"
                      title="Herunterladen">
                    📥
                  </a>
                </div>

              </div>

            </div>
          </section>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div class="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-slate-100 dark:border-gray-700 shadow-lg shadow-blue-900/5 dark:shadow-black/40 hover:border-green-200 dark:hover:border-green-500 transition-colors">
              <p class="text-sm font-bold text-slate-400 dark:text-gray-500 mb-2">Dozent</p>
              <p class="font-bold text-slate-800 dark:text-gray-100 text-lg">{{ modulDaten.dozent }}</p>

              <!-- HIER wird die Funktion für den Dozenten aufgerufen -->
              <div class="flex text-amber-400 my-2 text-lg">
                {{ generiereSterne(modulDaten.bewertungDozent) }}
              </div>

              <!-- Die Zahl kann man zusätzlich noch schön auf eine Nachkommastelle runden -->
              <p class="text-xs font-semibold text-slate-500 dark:text-gray-400">
                Rating: {{ isNaN(modulDaten.bewertungDozent) ? '-' : Number(modulDaten.bewertungDozent).toFixed(1) }}
              </p>
              <!-- NEU: Button zum Bewerten -->
              <button
                  v-if="aktuelleDozentId"
                  @click="zeigeDozentBewertung = true"
                  class="mt-4 w-full bg-slate-50 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-gray-700 text-slate-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-bold py-2 rounded-xl text-sm transition-colors border border-slate-100 dark:border-gray-700">
                Dozent bewerten
              </button>
            </div>

            <div class="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-slate-100 dark:border-gray-700 shadow-lg shadow-blue-900/5 dark:shadow-black/40 hover:border-green-200 dark:hover:border-green-500 transition-colors">
              <p class="text-sm font-bold text-slate-400 dark:text-gray-500 mb-2">Kurs</p>
              <p class="font-bold text-slate-800 dark:text-gray-100 text-lg line-clamp-1">{{ modulDaten.name }}</p>

              <!-- HIER wird die Funktion für den Kurs aufgerufen -->
              <div class="flex text-amber-400 my-2 text-lg">
                {{ generiereSterne(modulDaten.bewertungModul) }}
              </div>

              <p class="text-xs font-semibold text-slate-500 dark:text-gray-400">
                Rating: {{ isNaN(modulDaten.bewertungModul) ? '-' : Number(modulDaten.bewertungModul).toFixed(1) }}
              </p>

              <button
                  @click="zeigeKursBewertung = true"
                  class="mt-4 w-full bg-slate-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-bold py-2 rounded-xl text-sm transition-colors border border-slate-100 dark:border-gray-700">
                Kurs bewerten
              </button>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-[2rem] border border-green-100 dark:border-gray-700 shadow-lg shadow-blue-900/5 dark:shadow-black/40 flex flex-col justify-center items-center text-center transition-colors duration-300">
              <p class="text-sm font-bold text-green-600 dark:text-green-400 mb-1 uppercase tracking-wider">Kurs-ID</p>
              <p class="text-2xl font-black text-blue-900 dark:text-blue-300">{{ modulDaten.id }}</p>
            </div>

          </div>

        </div>

        <aside class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl shadow-green-900/5 dark:shadow-black/40 border border-slate-100 dark:border-gray-700 flex flex-col h-fit overflow-hidden transition-colors duration-300">

          <div class="p-6 bg-slate-50 dark:bg-gray-800 border-b border-slate-100 dark:border-gray-700 text-center">
            <h2 class="font-extrabold text-slate-700 dark:text-gray-100 uppercase tracking-widest text-sm">Diskussionen</h2>
          </div>

          <div class="p-6 space-y-6">
            <div class="group cursor-pointer">
              <p class="font-bold text-sm text-slate-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">SQL JOIN-Fragen?</p>
              <p class="text-xs font-medium text-slate-400 dark:text-gray-500 mt-1">Darian · vor 12 Min</p>
            </div>
            <div class="border-t border-slate-100 dark:border-gray-700 pt-5 group cursor-pointer">
              <p class="font-bold text-sm text-slate-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Wann sind die Ergebnisse?</p>
              <p class="text-xs font-medium text-slate-400 dark:text-gray-500 mt-1">Clara · vor 2 Std</p>
            </div>
            <div class="border-t border-slate-100 dark:border-gray-700 pt-5 group cursor-pointer">
              <p class="font-bold text-sm text-slate-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Wie lerne ich Normalisierung?</p>
              <p class="text-xs font-medium text-slate-400 dark:text-gray-500 mt-1">Jan · gestern</p>
            </div>
          </div>

          <div class="p-6 mt-auto bg-slate-50 dark:bg-gray-800 space-y-4 transition-colors duration-300">
              <textarea
                  class="w-full p-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-2xl text-sm text-slate-800 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-300"
                  rows="3"
                  placeholder="Stell eine Frage..."
              ></textarea>

            <button class="w-full bg-slate-800 dark:bg-gray-700 text-white font-bold py-3 rounded-full hover:bg-green-600 dark:hover:bg-green-600 transition-colors shadow-md">
              POSTEN
            </button>

            <NuxtLink to="/forum" class="block">
              <button class="w-full bg-slate-800 dark:bg-gray-700 text-white font-bold py-3 rounded-full hover:bg-green-600 dark:hover:bg-green-600 transition-colors shadow-md">
                ALLE BEITRÄGE
              </button>
            </NuxtLink>
          </div>

        </aside>

      </div>
    </div>
  </div>


  <!-- MODAL: Kurs bewerten -->
  <div v-if="zeigeKursBewertung" class="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <!-- Hier wird die Komponente aufgerufen. Man übergibt die kursId und lauscht auf die Events. -->
    <BewertungKurs
        :kursId="urlId"
        @abbrechen="zeigeKursBewertung = false"
        @gespeichert="zeigeKursBewertung = false; datenNeuLaden()"
    />
  </div>

  <!-- MODAL: Dozent bewerten -->
  <div v-if="zeigeDozentBewertung" class="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <!-- HIER: Name auf BewertungProf geändert, passend zur Datei im components-Ordner! -->
    <BewertungProf
        :dozentId="aktuelleDozentId"
        @abbrechen="zeigeDozentBewertung = false"
        @gespeichert="zeigeDozentBewertung = false; datenNeuLaden()"
    />
  </div>
</template>