<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// Lade Kurse für das Dropdown
const { data: kurseData, pending, error } = await useFetch('/api/kurse');

const route = useRoute();

// Formulardaten
const selectedKurs = ref(null);
const selectedTyp = ref('altklausur');
const selectedSemester = ref('Sommersemester'); 
const selectedJahr = ref(''); // Speichert nun ein volles Jahr (z.B. 2025)
const selectedFile = ref(null);

// Status
const isUploading = ref(false);
const uploadMessage = ref('');
const uploadStatus = ref(''); // 'success' oder 'error'

// Wenn man von einer Kurs-Seite kommt, den Kurs direkt vorab auswählen
onMounted(() => {
  if (route.query.kursId) {
    // Die ID aus der URL in eine Zahl umwandeln (falls die IDs in der DB Zahlen sind)
    selectedKurs.value = Number(route.query.kursId) || route.query.kursId;
  }
});

function handleFileChange(event) {
  selectedFile.value = event.target.files[0];
}

async function uploadFile() {
  if (!selectedFile.value || !selectedKurs.value || !selectedTyp.value || !selectedJahr.value || !selectedSemester.value) {
    uploadStatus.value = 'error';
    uploadMessage.value = 'Bitte alle Felder ausfüllen und eine Datei auswählen.';
    return;
  }

  isUploading.value = true;
  uploadMessage.value = '';
  uploadStatus.value = '';

  const formData = new FormData();
  formData.append('kursID', selectedKurs.value);
  formData.append('typ', selectedTyp.value);
  formData.append('semester', selectedSemester.value);
  formData.append('jahr', selectedJahr.value);
  formData.append('file', selectedFile.value, selectedFile.value.name);

  try {
    const result = await $fetch('/api/dateien', {
      method: 'POST',
      body: formData,
    });

    uploadStatus.value = 'success';
    uploadMessage.value = `Upload erfolgreich! Danke für das Teilen.`;
    
    // Formular zurücksetzen (Kurs bleibt ausgewählt für weitere Uploads)
    selectedTyp.value = 'altklausur';
    selectedJahr.value = '';
    selectedFile.value = null;
    if (document.getElementById('fileUpload')) {
      document.getElementById('fileUpload').value = '';
    }

  } catch (error) {
    console.error('Upload-Fehler:', error);
    uploadStatus.value = 'error';
    uploadMessage.value = error.data?.statusMessage || 'Ein Fehler ist beim Hochladen aufgetreten.';
  } finally {
    isUploading.value = false;
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-black font-sans text-slate-800 dark:text-gray-100 pb-12 transition-colors duration-300">
    <div class="max-w-3xl mx-auto p-4 md:p-8">

      <!-- Zurück-Navigation -->
      <div class="mb-6 pl-2">
        <button @click="$router.back()" class="inline-flex items-center text-green-600 dark:text-green-400 hover:text-blue-700 dark:hover:text-blue-400 font-bold transition-colors">
          <span class="mr-2 text-2xl leading-none">&larr;</span> Zurück
        </button>
      </div>

      <!-- HEADER -->
      <header class="rounded-[2.5rem] bg-gradient-to-br from-teal-400 to-blue-600 dark:from-teal-700 dark:to-blue-900 p-10 shadow-lg shadow-blue-900/10 dark:shadow-black/50 mb-8 relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tight text-white relative z-10">
          Material teilen
        </h1>
        <p class="mt-4 text-lg text-teal-50 dark:text-gray-200 relative z-10 font-medium">
          Lade Altklausuren, Mitschriften oder Lösungen hoch und hilf deinen Kommilitonen.
        </p>
      </header>

      <!-- UPLOAD FORMULAR -->
      <main class="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 dark:shadow-black/40 border border-slate-100 dark:border-gray-800 transition-colors duration-300">
        
        <form @submit.prevent="uploadFile" class="space-y-6">
          
          <!-- Kursauswahl -->
          <div>
            <label for="kurs" class="block text-sm font-bold text-slate-600 dark:text-gray-400 mb-2">Modul / Kurs</label>
            <select 
              id="kurs" 
              v-model="selectedKurs" 
              required
              class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-800 dark:text-gray-100 focus:ring-2 focus:ring-teal-400 outline-none transition-colors appearance-none cursor-pointer"
            >
              <option :value="null" disabled>
                {{ pending ? 'Lade Kurse...' : 'Bitte einen Kurs wählen...' }}
              </option>
              <option 
                v-for="course in kurseData?.courses" 
                :key="course.id" 
                :value="course.id"
              >
                {{ course.name }}
              </option>
            </select>
            <p v-if="error" class="text-red-500 text-xs mt-1 font-semibold">Fehler beim Laden der Kurse.</p>
          </div>

          <!-- Dateityp -->
          <div>
            <label for="typ" class="block text-sm font-bold text-slate-600 dark:text-gray-400 mb-2">Art des Dokuments</label>
            <select 
              id="typ" 
              v-model="selectedTyp" 
              required
              class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-800 dark:text-gray-100 focus:ring-2 focus:ring-teal-400 outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="altklausur">Altklausur</option>
              <option value="loesung">Aufgabenlösung</option>
              <option value="mitschrift">Mitschrift / Zusammenfassung</option>
            </select>
          </div>

          <!-- Semester & Jahr (Nebeneinander) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="semester" class="block text-sm font-bold text-slate-600 dark:text-gray-400 mb-2">Semester</label>
              <select 
                id="semester" 
                v-model="selectedSemester" 
                required
                class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-800 dark:text-gray-100 focus:ring-2 focus:ring-teal-400 outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="Sommersemester">Sommersemester (SoSe)</option>
                <option value="Wintersemester">Wintersemester (WiSe)</option>
              </select>
            </div>

            <div>
              <label for="jahr" class="block text-sm font-bold text-slate-600 dark:text-gray-400 mb-2">Jahr</label>
              <!-- Geändert auf type="number", um nur noch volle Jahre zu erlauben -->
              <input 
                type="number" 
                id="jahr" 
                v-model="selectedJahr" 
                placeholder="z.B. 2025"
                required 
                min="1990"
                max="2100"
                step="1"
                title="Bitte ein vierstelliges Jahr eingeben (z.B. 2025)"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-800 dark:text-gray-100 focus:ring-2 focus:ring-teal-400 outline-none transition-colors"
              />
            </div>
          </div>

          <!-- Dateiupload -->
          <div>
            <label class="block text-sm font-bold text-slate-600 dark:text-gray-400 mb-2">Datei auswählen</label>
            <div class="relative w-full border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors group cursor-pointer">
              
              <input 
                type="file" 
                id="fileUpload" 
                @change="handleFileChange" 
                required 
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
              
              <div class="flex flex-col items-center justify-center pointer-events-none">
                <span class="text-4xl mb-3 text-slate-300 dark:text-gray-500 group-hover:text-teal-400 transition-colors">📄</span>
                <p v-if="!selectedFile" class="font-bold text-slate-600 dark:text-gray-300">
                  Klicken oder Datei hierher ziehen
                </p>
                <p v-else class="font-bold text-teal-600 dark:text-teal-400 break-all px-4">
                  {{ selectedFile.name }}
                </p>
                <p v-if="!selectedFile" class="text-xs text-slate-400 dark:text-gray-500 mt-2">
                  PDF, DOCX, ZIP, PNG oder JPG
                </p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button 
              type="submit" 
              :disabled="isUploading"
              class="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              <span v-if="isUploading" class="animate-spin text-xl leading-none">↻</span>
              {{ isUploading ? 'Wird hochgeladen...' : 'Datei hochladen' }}
            </button>
          </div>

          <!-- Feedback Message -->
          <div 
            v-if="uploadMessage" 
            :class="[
              'p-4 rounded-xl font-bold text-center text-sm transition-all',
              uploadStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
            ]"
          >
            {{ uploadMessage }}
          </div>

        </form>
      </main>

    </div>
  </div>
</template>