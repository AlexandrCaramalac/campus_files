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

  // Hilfsfunktion: Wandelt eine Zahl (0-5) in Sterne um
      const generiereSterne = (wert) => {
          if (!wert || isNaN(wert)) return '☆☆☆☆☆';
          const gerundet = Math.round(wert); // z.B. 3.5 wird zu 4 Sternen
          return '★'.repeat(gerundet) + '☆'.repeat(5 - gerundet);
      }
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
                
                <!-- Vorher war das nur ein <button> -->
                <NuxtLink :to="`/dataAdd?kursId=${urlId}`">
                  <button class="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:-translate-y-1 shadow-md mb-8 flex items-center gap-2">
                    <span class="text-2xl leading-none">+</span> MEHR HOCHLADEN
                  </button>
                </NuxtLink>

                <div class="flex border-b border-slate-100 mb-6 overflow-x-auto gap-4">
                  <button 
                    v-for="tab in tabs" :key="tab"
                    @click="aktiverTab = tab" 
                    :class="['pb-3 font-bold text-sm transition-colors whitespace-nowrap', 
                    aktiverTab === tab ? 'text-green-600 border-b-4 border-green-500' : 'text-slate-400 hover:text-slate-600']"
                  >
                    {{ tab.toUpperCase() }}
                  </button>
                </div>

                <div class="space-y-4">
                  <div
                    v-for="file in materialien.filter(m => aktiverTab === 'Alle Ressourcen' || m.typ === aktiverTab)" :key="file.id"
                    class="flex items-center justify-between p-4 bg-slate-50 border border-transparent rounded-2xl hover:bg-green-50 hover:border-green-100 transition-colors"
                  >
                    <NuxtLink
                      :to="`/courses/${urlId}/dateien/${file.id}`"
                      class="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                    >
                      <div class="w-12 h-12 flex items-center justify-center bg-white text-green-500 rounded-full shadow-sm text-xl flex-shrink-0">
                        📄
                      </div>
                      <div class="min-w-0">
                        <p class="font-bold text-slate-800 truncate">{{ file.name }}</p>
                        <p class="text-xs text-slate-500 font-medium">Uploaded by {{ file.autor }}, {{ file.datum }}</p>
                      </div>
                    </NuxtLink>

                    <!-- DOWNLOAD (erzwingt das Herunterladen) -->
                    <a
                      :href="file.urlDownload"
                      :download="file.name"
                      class="ml-4 p-2 text-slate-400 hover:text-blue-500 transition-colors flex-shrink-0"
                      title="Herunterladen">
                      📥
                    </a>
                  </div>
                </div>

              </div>
            </section>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-blue-900/5 hover:border-green-200 transition-colors">
              <p class="text-sm font-bold text-slate-400 mb-2">Dozent</p>
              <p class="font-bold text-slate-800 text-lg">{{ modulDaten.dozent }}</p>
              
              <!-- HIER wird die Funktion für den Dozenten aufgerufen -->
              <div class="flex text-amber-400 my-2 text-lg">
                {{ generiereSterne(modulDaten.bewertungDozent) }}
              </div>
              
              <!-- Die Zahl kann man zusätzlich noch schön auf eine Nachkommastelle runden -->
              <p class="text-xs font-semibold text-slate-500">
                Rating: {{ isNaN(modulDaten.bewertungDozent) ? '-' : Number(modulDaten.bewertungDozent).toFixed(1) }}
              </p>
              <!-- NEU: Button zum Bewerten -->
              <button 
                v-if="aktuelleDozentId" 
                @click="zeigeDozentBewertung = true" 
                class="mt-4 w-full bg-slate-50 hover:bg-green-50 text-slate-600 hover:text-green-600 font-bold py-2 rounded-xl text-sm transition-colors border border-slate-100">
                Dozent bewerten
              </button>
            </div>

            <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-blue-900/5 hover:border-green-200 transition-colors">
              <p class="text-sm font-bold text-slate-400 mb-2">Kurs</p>
              <p class="font-bold text-slate-800 text-lg line-clamp-1">{{ modulDaten.name }}</p>
              
              <!-- HIER wird die Funktion für den Kurs aufgerufen -->
              <div class="flex text-amber-400 my-2 text-lg">
                {{ generiereSterne(modulDaten.bewertungModul) }}
              </div>
              
              <p class="text-xs font-semibold text-slate-500">
                Rating: {{ isNaN(modulDaten.bewertungModul) ? '-' : Number(modulDaten.bewertungModul).toFixed(1) }}
              </p>

              <button 
                @click="zeigeKursBewertung = true" 
                class="mt-4 w-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-bold py-2 rounded-xl text-sm transition-colors border border-slate-100">
                Kurs bewerten
              </button>
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

            <div class="p-6 mt-auto bg-slate-50 space-y-4">
              <textarea
                class="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm"
                rows="3"
                placeholder="Stell eine Frage..."
              ></textarea>

              <button class="w-full bg-slate-800 text-white font-bold py-3 rounded-full hover:bg-green-600 transition-colors shadow-md">
                POSTEN
              </button>

              <NuxtLink to="/forum" class="block">
                <button class="w-full bg-slate-800 text-white font-bold py-3 rounded-full hover:bg-green-600 transition-colors shadow-md">
                  ALLE BEITRÄGE
                </button>
              </NuxtLink>
            </div>
            
          </aside>

        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-4 md:p-8">
      <h2 class="font-bold text-xl mb-4">API Daten-Übersicht</h2>

      <div class="mt-4 bg-white p-6 rounded-2xl shadow">
        <h3 class="font-bold mb-2">Bewertungen</h3>
        <p>
          Aufwand: {{ course?.bewertungen?.aufwand || "Noch keine Bewertungen" }}<br>
          Nutzen: {{ course?.bewertungen?.nutzen || "Noch keine Bewertungen" }}<br>
          Schwierigkeit: {{ course?.bewertungen?.schwierigkeit || "Noch keine Bewertungen" }}<br>
          Praxisbezug: {{ course?.bewertungen?.praxisbezug || "Noch keine Bewertungen" }}<br>
          Gesamtbewertung: {{ course?.bewertungen?.gesamtbewertung || "Noch keine Bewertungen" }}
        </p>
      </div>

      <div class="mt-6 bg-white p-6 rounded-2xl shadow">
        <h3 class="font-bold mb-2">Dozenten</h3>
        <ul v-if="course?.dozenten?.length > 0">
          <li v-for="entry in course.dozenten" :key="entry.dozent.id">
            {{ entry.dozent.vorname }} {{ entry.dozent.nachname }} 
            — Gesamtbewertung: {{ entry.dozent.gesamtbewertung || "Noch keine Bewertungen" }}
          </li>
        </ul>
        <p v-else>Keine Einträge.</p>
      </div>

      <div class="mt-6 bg-white p-6 rounded-2xl shadow">
        <h3 class="font-bold mb-2">Forumsbeiträge</h3>
        <ul v-if="forums?.beitraege?.length > 0" class="space-y-4">
          <li v-for="item in forums.beitraege" :key="item.id" class="border-b pb-4">
            <span class="font-semibold">{{ item.thema }}</span> <br>
            <span class="text-sm text-slate-500">von {{ item.profile.name }} am 
              {{ new Date(item.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
            </span>
            <br>
            <NuxtLink :to="`/courses/${route.params.id}/${item.id}`" class="text-blue-600 hover:underline text-sm mt-2 inline-block">
              Kommentare ansehen
            </NuxtLink>
          </li>
        </ul>
        <p v-else>Keine Beiträge vorhanden.</p>
      </div>

      <div class="mt-6 bg-white p-6 rounded-2xl shadow">
        <h3 class="font-bold mb-2">Dateien in diesem Kurs</h3>
        <ul v-if="files?.dateien?.length > 0" class="space-y-2">
          <li v-for="item in files.dateien" :key="item.id" class="flex gap-4 items-center">
            <span>{{ item.typ }}: {{ item.dateiname }}</span>
            <a :href="`${publicUrlBase}${item.dateipfad}`" class="text-blue-600 hover:underline text-sm" target="_blank">
              Anzeigen
            </a>
            <a :href="`${publicUrlBase}${item.dateipfad}?download=${item.dateiname}`" :download="item.dateiname" class="text-green-600 hover:underline text-sm">
              Download
            </a>
          </li>
        </ul>
        <p v-else>Keine Dateien vorhanden.</p>
      </div>
    </div>
    <!-- MODAL: Kurs bewerten -->
  <div v-if="zeigeKursBewertung" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <!-- Hier wird die Komponente aufgerufen. Man übergibt die kursId und lauscht auf die Events. -->
    <BewertungKurs 
      :kursId="urlId" 
      @abbrechen="zeigeKursBewertung = false" 
      @gespeichert="zeigeKursBewertung = false; datenNeuLaden()" 
    />
  </div>

  <!-- MODAL: Dozent bewerten -->
  <div v-if="zeigeDozentBewertung" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <!-- HIER: Name auf BewertungProf geändert, passend zur Datei im components-Ordner! -->
    <BewertungProf 
      :dozentId="aktuelleDozentId" 
      @abbrechen="zeigeDozentBewertung = false" 
      @gespeichert="zeigeDozentBewertung = false; datenNeuLaden()" 
    />
  </div>
</template>
