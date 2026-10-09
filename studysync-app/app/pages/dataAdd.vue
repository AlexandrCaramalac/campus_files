<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

// Lade Kurse für das Dropdown
const { data: kurseData, pending, error } = await useFetch('/api/kurse');

const route = useRoute();

const dateitypen = [
  { value: 'skript', label: 'Skripte' },
  { value: 'uebungsaufgabe', label: 'Übungsaufgaben' },
  { value: 'mitschrift', label: 'Mitschriften' },
  { value: 'altklausur', label: 'Altklausuren' },
] as const;
type DateiTyp = typeof dateitypen[number]['value'];

// Formulardaten
const selectedKurs = ref(null);
const selectedDozent = ref('');
const dozenten = ref([]);
const dozentenError = ref('');
const selectedTyp = ref<DateiTyp>('skript');
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

watch(selectedKurs, async (kursId) => {
  selectedDozent.value = '';
  dozenten.value = [];
  dozentenError.value = '';
  if (!kursId) return;

  try {
    const kursData = await $fetch(`/api/kurse/${kursId}`);
    if (String(selectedKurs.value) !== String(kursId)) return;
    dozenten.value = (kursData.dozenten ?? [])
      .map((entry) => entry.dozent)
      .filter(Boolean);
  } catch (error) {
    if (String(selectedKurs.value) !== String(kursId)) return;
    console.error('Fehler beim Laden der Lehrenden:', error);
    dozentenError.value = 'Die Lehrenden für diesen Kurs konnten nicht geladen werden.';
  }
});

function handleFileChange(event) {
  selectedFile.value = event.target.files[0];
}

async function uploadFile() {
  if (!selectedFile.value || !selectedKurs.value || !selectedDozent.value || !selectedTyp.value || !selectedJahr.value || !selectedSemester.value) {
    uploadStatus.value = 'error';
    uploadMessage.value = 'Bitte Kurs, Lehrperson, alle weiteren Felder und eine Datei auswählen.';
    return;
  }

  const currentYear = new Date().getFullYear();
  if (Number(selectedJahr.value) > currentYear) {
    uploadStatus.value = 'error';
    uploadMessage.value = 'Woah - Ein Zeitreisender!';
    return;
  }

  isUploading.value = true;
  uploadMessage.value = '';
  uploadStatus.value = '';

  const formData = new FormData();
  formData.append('kursID', selectedKurs.value);
  formData.append('dozentID', selectedDozent.value);
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

    // Formular vollständig zurücksetzen
    selectedKurs.value = null;
    selectedDozent.value = '';
    selectedTyp.value = 'skript';
    selectedSemester.value = 'Sommersemester';
    selectedJahr.value = '';
    selectedFile.value = null;

    // File-Input visuell zurücksetzen
    const fileInput = document.getElementById('file');

    if (fileInput) {
      fileInput.value = '';
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
  <div class="h-[calc(100vh-140px)] bg-slate-50 dark:bg-black font-sans text-slate-800 dark:text-gray-100 transition-colors duration-300 overflow-hidden">
    <div class="max-w-4xl mx-auto p-4 md:p-6 h-full overflow-y-auto">

      <!-- HEADER -->
      <header class="rounded-[2rem] bg-gradient-to-br from-green-400 to-blue-600 dark:from-green-700 dark:to-blue-900 p-4 shadow-lg shadow-blue-900/10 dark:shadow-black/50 mb-2 relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>

        <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tight text-white relative z-10">
          Datei hochladen
        </h1>

        <p class="mt-4 text-lg text-green-50 dark:text-gray-200 relative z-10 font-medium">
          Teile deine Materialien mit anderen Studierenden
        </p>
      </header>

      <!-- FORM CARD -->
      <section class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl shadow-green-900/5 dark:shadow-black/40 border border-green-50 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        <div class="p-4 md:p-6">

          <form @submit.prevent="uploadFile" class="space-y-3 md:space-y-4">

            <!-- KURS -->
            <div>
              <label class="block text-sm font-bold text-slate-600 mb-2">
                Kurs
              </label>

              <select
                  v-model="selectedKurs"
                  class="w-full p-4 rounded-xl border border-slate-200 dark:border-gray-700
                        bg-slate-50 dark:bg-gray-800
                        text-slate-800 dark:text-gray-100
                        focus:outline-none focus:ring-2 focus:ring-green-400
                        transition-colors duration-300"
                  required
              >
                <option
                    class="bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-100"
                    :value="null"
                    disabled
                >
                  {{ pending ? 'Lade Kurse...' : 'Bitte einen Kurs wählen...' }}
                </option>

                <option
                    v-for="course in kurseData?.courses"
                    :key="course.id"
                    :value="course.id"
                    class="bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-100"
                >
                  {{ course.name }}
                </option>
              </select>

              <p v-if="error" class="text-red-500 text-sm mt-2">
                Fehler beim Laden der Kurse.
              </p>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-600 mb-2">
                Lehrperson
              </label>
              <div class="relative">
                <select
                  v-model="selectedDozent"
                  class="w-full appearance-none p-4 pr-12 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-300 disabled:opacity-60"
                  required
                  :disabled="!selectedKurs || dozenten.length === 0"
                >
                  <option value="" disabled>
                    {{ !selectedKurs ? 'Bitte zuerst einen Kurs wählen...' : 'Bitte eine Lehrperson wählen...' }}
                  </option>
                  <option v-for="dozent in dozenten" :key="dozent.id" :value="String(dozent.id)">
                    {{ dozent.vorname }} {{ dozent.nachname }}
                  </option>
                </select>
                <span class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-gray-500">⌄</span>
              </div>
              <p v-if="dozentenError" class="text-red-500 text-sm mt-2">{{ dozentenError }}</p>
              <p v-else-if="selectedKurs && dozenten.length === 0" class="text-red-500 text-sm mt-2">
                Für diesen Kurs ist keine Lehrperson hinterlegt; Dateien können nicht zugeordnet werden.
              </p>
            </div>

            <!-- TYP -->
            <div>
              <label class="block text-sm font-bold text-slate-600 mb-2">
                Typ
              </label>

              <select
                  v-model="selectedTyp"
                  class="w-full p-4 rounded-xl border border-slate-200 dark:border-gray-700
                  bg-slate-50 dark:bg-gray-800
                  text-slate-800 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-green-400
                  transition-colors duration-300"
                  required
              >
                <option
                    v-for="dateityp in dateitypen"
                    :key="dateityp.value"
                    :value="dateityp.value"
                    class="bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-100"
                >
                  {{ dateityp.label }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              <!-- Semester -->
              <div>
                <label class="block text-sm font-bold text-slate-600 mb-2">
                  Semester
                </label>
                <select
                    v-model="selectedSemester"
                    class="w-full p-4 rounded-xl border border-slate-200 dark:border-gray-700
                    bg-slate-50 dark:bg-gray-800
                    text-slate-800 dark:text-gray-100
                    focus:outline-none focus:ring-2 focus:ring-green-400
                    transition-colors duration-300"
                    required
                >
                  <option
                      value="Sommersemester"
                      class="bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-100"
                  >
                    Sommersemester (SoSe)
                  </option>

                  <option
                      value="Wintersemester"
                      class="bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-100"
                  >
                    Wintersemester (WiSe)
                  </option>
                </select>
              </div>

              <!-- Jahr -->
              <div>
                <label class="block text-sm font-bold text-slate-600 mb-2">
                  Jahr
                </label>
                <input
                    type="number"
                    v-model="selectedJahr"
                    placeholder="z.B. 2025"
                    min="1990"
                    max="2100"
                    step="1"
                    class="w-full p-4 rounded-xl border border-slate-200 dark:border-gray-700
                    bg-slate-50 dark:bg-gray-800
                    text-slate-800 dark:text-gray-100
                    placeholder:text-slate-400 dark:placeholder:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-green-400
                    transition-colors duration-300"
                    required
                />
              </div>
            </div>

            <!-- FILE -->
            <div>
              <label class="block text-sm font-bold text-slate-600 dark:text-gray-300 mb-2">
                Datei auswählen
              </label>

              <input
                  type="file"
                  id="file"
                  @change="handleFileChange"
                  class="w-full p-3 rounded-xl
                  border border-slate-200 dark:border-gray-700
                  bg-white dark:bg-gray-800
                  text-slate-800 dark:text-gray-100
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:bg-gradient-to-r file:from-green-500 file:to-blue-500
                  file:text-white file:font-bold
                  hover:file:opacity-90
                  transition-colors duration-300"
                  required
              >
            </div>

            <!-- BUTTON -->
            <button
                type="submit"
                :disabled="isUploading"
                class="w-full bg-gradient-to-r
                from-green-500 to-blue-500
                hover:from-green-400 hover:to-blue-400
                dark:from-green-600 dark:to-blue-700
                dark:hover:from-green-500 dark:hover:to-blue-600
                text-white font-bold py-2 rounded-full
                transition-all transform hover:-translate-y-1
                shadow-md dark:shadow-black/40
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isUploading ? 'Lade hoch...' : 'Hochladen' }}
            </button>

            <!-- MESSAGE -->
            <p
              v-if="uploadMessage"
              :class="[
                'text-sm font-semibold mt-2 text-center',
                uploadMessage.includes('erfolgreich') ? 'text-green-600' : 'text-red-500'
              ]"
            >
              {{ uploadMessage }}
            </p>

          </form>

        </div>
      </section>

    </div>
  </div>
</template>