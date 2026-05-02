<script setup>
import { ref } from 'vue';

const { data: kurseData, pending, error } = await useFetch('/api/kurse');

const selectedKurs = ref(null);
const selectedTyp = ref('altklausur');
const selectedFile = ref(null);
const isUploading = ref(false);
const uploadMessage = ref('');

function handleFileChange(event) {
  selectedFile.value = event.target.files[0];
}

async function uploadFile() {
  if (!selectedFile.value || !selectedKurs.value || !selectedTyp.value) {
    uploadMessage.value = 'Bitte alle Felder ausfüllen.';
    return;
  }

  isUploading.value = true;
  uploadMessage.value = '';

  const formData = new FormData();
  formData.append('kursID', selectedKurs.value);
  formData.append('typ', selectedTyp.value);
  formData.append('file', selectedFile.value, selectedFile.value.name);

  try {
    const result = await $fetch('/api/dateien', {
      method: 'POST',
      body: formData,
    });

    uploadMessage.value = `Upload erfolgreich! Datei: ${result.file.dateiname}`;
    selectedKurs.value = null;
    selectedFile.value = null;
    document.getElementById('file').value = '';

  } catch (error) {
    console.error('Upload-Fehler:', error);
    uploadMessage.value = error.data?.statusMessage || 'Ein Fehler ist aufgetreten.';
  } finally {
    isUploading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
    <div class="max-w-4xl mx-auto p-4 md:p-8">

      <!-- HEADER -->
      <header class="rounded-[2.5rem] bg-gradient-to-br from-green-400 to-blue-600 p-10 shadow-lg shadow-blue-900/10 mb-8 relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        
        <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tight text-white relative z-10">
          Datei hochladen
        </h1>

        <p class="mt-4 text-lg text-green-50 relative z-10 font-medium">
          Teile deine Materialien mit anderen Studierenden
        </p>
      </header>

      <!-- FORM CARD -->
      <section class="bg-white rounded-[2rem] shadow-xl shadow-green-900/5 border border-green-50 overflow-hidden">
        <div class="p-8">

          <form @submit.prevent="uploadFile" class="space-y-6">

            <!-- KURS -->
            <div>
              <label class="block text-sm font-bold text-slate-600 mb-2">
                Kurs
              </label>

              <select 
                v-model="selectedKurs"
                class="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
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

              <p v-if="error" class="text-red-500 text-sm mt-2">
                Fehler beim Laden der Kurse.
              </p>
            </div>

            <!-- TYP -->
            <div>
              <label class="block text-sm font-bold text-slate-600 mb-2">
                Typ
              </label>

              <select 
                v-model="selectedTyp"
                class="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              >
                <option value="altklausur">Altklausuren</option>
                <option value="loesung">Aufgabenlösungen</option>
                <option value="mitschrift">Mitschriften</option>
              </select>
            </div>

            <!-- FILE -->
            <div>
              <label class="block text-sm font-bold text-slate-600 mb-2">
                Datei auswählen
              </label>

              <input 
                type="file" 
                id="file" 
                @change="handleFileChange"
                class="w-full p-3 rounded-xl border border-slate-200 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-green-500 file:to-blue-500 file:text-white file:font-bold hover:file:opacity-90 transition"
                required
              >
            </div>

            <!-- BUTTON -->
            <button 
              type="submit" 
              :disabled="isUploading"
              class="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white font-bold py-4 rounded-full transition-all transform hover:-translate-y-1 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isUploading ? 'Lade hoch...' : 'Hochladen' }}
            </button>

            <!-- MESSAGE -->
            <p 
              v-if="uploadMessage"
              :class="[
                'text-sm font-semibold mt-2',
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