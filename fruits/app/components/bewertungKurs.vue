<script setup>
import { ref } from 'vue'

const props = defineProps({
  kursId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['gespeichert', 'abbrechen'])

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Alle Kriterien sind jetzt manuell einstellbar, inklusive Gesamtbewertung
const aufwand = ref(3)
const nutzen = ref(3)
const schwierigkeit = ref(3)
const praxisbezug = ref(3)
const gesamt = ref(3) // Vorher automatisch, jetzt manuell

const isLoading = ref(false)

const speichern = async () => {
  if (!user.value) {
    alert("Man muss eingeloggt sein, um eine Bewertung abzugeben.")
    return
  }

  isLoading.value = true

  const { error } = await supabase
    .from('bewertung_kurs') // <-- Richtige Tabelle für den Kurs
    .insert({
      kursID: props.kursId,        // <-- WICHTIG: Bitte prüfen, ob die Spalte in Supabase wirklich 'kursID' heißt!
      nutzerID: user.value.sub,    // <-- HIER AUCH DIE LÖSUNG: .sub statt .id nutzen!
      aufwand: aufwand.value,
      nutzen: nutzen.value,
      schwierigkeit: schwierigkeit.value,
      praxisbezug: praxisbezug.value,
      gesamtbewertung: gesamt.value
    })

  isLoading.value = false

  if (error) {
    console.error("Fehler von Supabase:", error)
    alert("Fehler beim Speichern der Kurs-Bewertung.")
  } else {
    emit('gespeichert') 
  }
}
</script>

<template>
  <div class="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 max-w-md w-full">
    <h3 class="font-black text-2xl text-slate-800 mb-6">Kurs bewerten</h3>
    
    <div class="space-y-6">
      
      <!-- Aufwand -->
      <div>
        <label class="flex justify-between text-sm font-bold text-slate-600 mb-3">
          <span>Aufwand</span>
          <span class="text-blue-600">{{ aufwand.toFixed(1) }}</span>
        </label>
        <input type="range" min="1" max="5" step="0.5" v-model.number="aufwand" 
          class="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
      </div>
      
      <!-- Nutzen -->
      <div>
        <label class="flex justify-between text-sm font-bold text-slate-600 mb-3">
          <span>Nutzen</span>
          <span class="text-blue-600">{{ nutzen.toFixed(1) }}</span>
        </label>
        <input type="range" min="1" max="5" step="0.5" v-model.number="nutzen" 
          class="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
      </div>

      <!-- Schwierigkeit -->
      <div>
        <label class="flex justify-between text-sm font-bold text-slate-600 mb-3">
          <span>Schwierigkeit</span>
          <span class="text-blue-600">{{ schwierigkeit.toFixed(1) }}</span>
        </label>
        <input type="range" min="1" max="5" step="0.5" v-model.number="schwierigkeit" 
          class="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
      </div>

      <!-- Praxisbezug -->
      <div>
        <label class="flex justify-between text-sm font-bold text-slate-600 mb-3">
          <span>Praxisbezug</span>
          <span class="text-blue-600">{{ praxisbezug.toFixed(1) }}</span>
        </label>
        <input type="range" min="1" max="5" step="0.5" v-model.number="praxisbezug" 
          class="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
      </div>

      <!-- MANUELLE GESAMTBEWERTUNG -->
      <div class="pt-6 border-t border-slate-100">
        <label class="flex justify-between text-lg font-black text-slate-800 mb-3">
          <span>Gesamtbewertung</span>
          <span class="text-amber-500">{{ gesamt.toFixed(1) }} ★</span>
        </label>
        <input type="range" min="1" max="5" step="0.5" v-model.number="gesamt" 
          class="w-full h-5 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-500">
      </div>

      <div class="flex gap-3 pt-4">
        <button @click="emit('abbrechen')" class="flex-1 py-4 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors">
          Abbrechen
        </button>
        <button @click="speichern" :disabled="isLoading" class="flex-1 py-4 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-colors shadow-lg shadow-blue-600/30">
          {{ isLoading ? 'Speichert...' : 'Senden' }}
        </button>
      </div>
    </div>
  </div>
</template>