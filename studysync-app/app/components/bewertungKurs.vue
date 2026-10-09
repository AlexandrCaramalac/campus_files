<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  kursId: {
    type: [String, Number],
    required: true
  },
  dozenten: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['gespeichert', 'abbrechen'])

const user = useSupabaseUser()

// Alle Kriterien sind manuell einstellbar, inklusive Gesamtbewertung
const aufwand = ref(3)
const nutzen = ref(3)
const schwierigkeit = ref(3)
const praxisbezug = ref(3)
const gesamt = ref(3)
const selectedDozentId = ref('')
const fehler = ref('')

const isLoading = ref(false)

watch(
  () => props.dozenten,
  (dozenten) => {
    selectedDozentId.value = dozenten.length === 1 ? String(dozenten[0].id) : ''
  },
  { immediate: true }
)

const speichern = async () => {
  if (!user.value) {
    fehler.value = 'Du musst angemeldet sein, um eine Bewertung abzugeben.'
    return
  }
  if (!selectedDozentId.value) {
    fehler.value = 'Bitte wähle die Lehrperson aus, die diesen Kurs unterrichtet.'
    return
  }

  isLoading.value = true
  fehler.value = ''
  try {
    const { alreadyRated } = await $fetch(
      `/api/kurse/bewertung/check?kursID=${props.kursId}&dozentID=${selectedDozentId.value}`
    )
    if (alreadyRated) {
      fehler.value = 'Du hast diesen Kurs bei dieser Lehrperson bereits bewertet.'
      return
    }

    await $fetch('/api/kurse/bewertung', {
      method: 'POST',
      body: {
        kursID: props.kursId,
        dozentID: Number(selectedDozentId.value),
        aufwand: aufwand.value,
        nutzen: nutzen.value,
        schwierigkeit: schwierigkeit.value,
        praxisbezug: praxisbezug.value,
        gesamtbewertung: gesamt.value
      }
    })
    emit('gespeichert')
  } catch (error) {
    fehler.value = error?.data?.statusMessage || 'Die Kursbewertung konnte nicht gespeichert werden.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div
      class="bg-white dark:bg-gray-900
           p-8 rounded-[2rem]
           shadow-2xl dark:shadow-black/50
           border border-slate-100 dark:border-gray-700
           max-w-md w-full
           transition-colors duration-300"
  >
    <h3 class="font-black text-2xl text-slate-800 dark:text-gray-100 mb-6">
      Kurs bewerten
    </h3>

    <div class="space-y-6">

      <div v-if="dozenten.length > 1">
        <label for="kurs-bewertung-dozent" class="block text-sm font-bold text-slate-600 dark:text-gray-400 mb-2">
          Lehrperson
        </label>
        <div class="relative">
          <select
            id="kurs-bewertung-dozent"
            v-model="selectedDozentId"
            required
            :disabled="dozenten.length === 0"
            class="w-full appearance-none p-4 pr-12 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-300 disabled:opacity-60"
          >
            <option value="" disabled>Bitte Lehrperson auswählen...</option>
            <option v-for="dozent in dozenten" :key="dozent.id" :value="String(dozent.id)">
              {{ dozent.vorname }} {{ dozent.nachname }}
            </option>
          </select>
          <span class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-gray-500">⌄</span>
        </div>
        <p v-if="dozenten.length === 0" class="mt-2 text-sm text-red-500">
          Für diesen Kurs ist keine Lehrperson hinterlegt; eine Bewertung ist nicht möglich.
        </p>
      </div>
      <p v-else-if="dozenten.length === 1" class="text-sm font-semibold text-slate-500 dark:text-gray-400">
        Bewertung für {{ dozenten[0].vorname }} {{ dozenten[0].nachname }}
      </p>

      <p v-if="fehler" class="text-sm font-semibold text-red-500">{{ fehler }}</p>

      <!-- Aufwand -->
      <div>
        <label class="flex justify-between text-sm font-bold text-slate-600 dark:text-gray-400 mb-3">
          <span>Aufwand (1★ = Viel Aufwand)</span>
          <span class="text-blue-600 dark:text-blue-400">{{ aufwand}}</span>
        </label>
        <input
            type="range" min="1" max="5" step="1" v-model.number="aufwand"
            class="w-full h-4 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
        >
      </div>

      <!-- Nutzen -->
      <div>
        <label class="flex justify-between text-sm font-bold text-slate-600 dark:text-gray-400 mb-3">
          <span>Nutzen (5★ = Hoher Nutzen)</span>
          <span class="text-blue-600 dark:text-blue-400">{{ nutzen }}</span>
        </label>
        <input
            type="range" min="1" max="5" step="1" v-model.number="nutzen"
            class="w-full h-4 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
        >
      </div>

      <!-- Schwierigkeit -->
      <div>
        <label class="flex justify-between text-sm font-bold text-slate-600 dark:text-gray-400 mb-3">
          <span>Schwierigkeit (1★ = Hohe Schwierigkeit)</span>
          <span class="text-blue-600 dark:text-blue-400">{{ schwierigkeit}}</span>
        </label>
        <input
            type="range" min="1" max="5" step="1" v-model.number="schwierigkeit"
            class="w-full h-4 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
        >
      </div>

      <!-- Praxisbezug -->
      <div>
        <label class="flex justify-between text-sm font-bold text-slate-600 dark:text-gray-400 mb-3">
          <span>Praxisbezug (5★ = Hoher Praxisbezug)</span>
          <span class="text-blue-600 dark:text-blue-400">{{ praxisbezug}}</span>
        </label>
        <input
            type="range" min="1" max="5" step="1" v-model.number="praxisbezug"
            class="w-full h-4 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
        >
      </div>

      <!-- Gesamtbewertung -->
      <div class="pt-6 border-t border-slate-100 dark:border-gray-700">
        <label class="flex justify-between text-lg font-black text-slate-800 dark:text-gray-100 mb-3">
          <span>Gesamtbewertung </span>
          <span class="text-amber-500">{{ gesamt}} ★</span>
        </label>
        <input
            type="range" min="1" max="5" step="1" v-model.number="gesamt"
            class="w-full h-5 bg-amber-100 dark:bg-amber-900/40 rounded-lg appearance-none cursor-pointer accent-amber-500"
        >
      </div>

      <div class="flex gap-3 pt-4">
        <button
            @click="emit('abbrechen')"
            class="flex-1 py-4 font-bold
                 text-slate-500 dark:text-gray-400
                 bg-slate-100 dark:bg-gray-800
                 hover:bg-slate-200 dark:hover:bg-gray-700
                 rounded-2xl transition-colors"
        >
          Abbrechen
        </button>

        <button
            @click="speichern"
            :disabled="isLoading || dozenten.length === 0"
            class="flex-1 py-4 font-bold text-white
                 bg-blue-600 hover:bg-blue-700
                 dark:bg-blue-600 dark:hover:bg-blue-500
                 rounded-2xl transition-colors
                 shadow-lg shadow-blue-600/30 dark:shadow-blue-900/40"
        >
          {{ isLoading ? 'Speichert...' : 'Senden' }}
        </button>
      </div>
    </div>
  </div>
</template>