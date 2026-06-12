<script setup>
import { ref } from 'vue'

/*
  Speichert, welche FAQ gerade geöffnet ist.
  null = keine FAQ ist geöffnet
*/
const openIndex = ref(null)

/*
  FAQ-Daten:
  Jede Frage besteht aus:
  - frage
  - antwort
*/
const faqs = [
  {
    frage: 'Für wen ist StudySync geeignet?',
    antwort: 'Für Studierende des Fachbereichs 06 der Universität Osnabrück.'
  },
  {
    frage: 'Wofür ist StudySync?',
    antwort: 'StudySync ist ein Ort, an dem Studierende Skripte, Mitschriften und Probeklausuren teilen können. Je mehr wir unser Wissen miteinander teilen, ' +
        'desto einfacher wird das Lernen für alle.'
  },
  {
    frage: 'Muss ich angemeldet sein, um StudySync zu nutzen?',
    antwort: 'Ja, die meisten Inhalte von StudySync sind erst nach dem Login zugänglich. Dadurch soll sichergestellt werden, dass die Plattform vor allem von Studierenden genutzt wird.'
  },
  {
    frage: 'Wer kann Dateien hochladen?',
    antwort: 'Jeder, der bereit ist, seine Unterlagen zu teilen. Einfach den "Hochladen" Button nutzen und die Felder entsprechend ausfüllen. Uploads sind bis ' +
        '50 MB möglich.'
  },
  {
    frage: 'Wie kann ich Dateien herunterladen?',
    antwort: 'Wenn zu einem Kurs Dateien vorhanden sind, kannst du diese in der Kursübersicht oder auf der jeweiligen Kursseite ansehen und herunterladen.'
  },
  {
    frage: 'Wofür ist das Forum gedacht?',
    antwort: 'Im Forum können Fragen zu Kursen, Lernmaterialien oder organisatorischen Themen gestellt und beantwortet werden. Es soll den Austausch zwischen Studierenden erleichtern.'
  },
  {
    frage: 'Wie funktionieren die Bewertungen?',
    antwort: 'In der jeweiligen Kursübersicht findest du die Gesamtbewertung eines Kurses sowie des zugehörigen Dozierenden. Dozierende können zusätzlich über den Menüpunkt' +
        ' "Dozierende" gesucht und dort anhand eines Sternesystems bewertet werden. Ein Stern steht für die niedrigste, fünf Sterne für die höchste Bewertung. Dabei wird ' +
        'bewusst zwischen Kursen und Dozierenden unterschieden, da sich Dozierende im Laufe der Zeit ändern können. Einzelne Bewertungen spiegeln stets subjektive Eindrücke ' +
        'wider, während die Gesamtbewertung einen aktuellen Überblick über die Qualität eines Kurses oder eines Dozierenden geben soll.'
  },
  {
    frage: 'Warum gibt es getrennte Bewertungen für Kurse und Dozierende?',
    antwort: 'Kurse und Dozierende werden getrennt bewertet, weil ein Kurs über mehrere Semester bestehen kann, während sich die lehrende Person ändern kann. So bleiben die Bewertungen übersichtlicher und aussagekräftiger.'
  },
  {
    frage: 'Sind Bewertungen anonym?',
    antwort: 'Bewertungen einzelner Nutzender sind nur für Admins sichtbar. Anderen Nutzenden werden ausschließlich anonyme Durchschnittswerte angezeigt.'
  },

]

/*
  Öffnet oder schließt eine FAQ:
  - Wenn die FAQ schon offen ist → schließen
  - Wenn sie geschlossen ist → öffnen
*/
function toggle(index) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>

  <div
      class="min-h-[calc(100vh-260px)] bg-slate-50 dark:bg-black
           font-sans text-slate-800 dark:text-gray-100
           p-6 md:p-12 transition-colors duration-300"
  >
    <div class="max-w-4xl mx-auto">

      <!-- Überschrift -->
      <h1
          class="text-4xl font-black uppercase tracking-tight
               text-slate-800 dark:text-gray-100
               mb-8 ml-2"
      >
        Anleitung / FAQ
      </h1>

      <ul class="space-y-4">
        <li
            v-for="(faq, index) in faqs"
            :key="index"
            class="group bg-white dark:bg-gray-900
                 border border-slate-100 dark:border-gray-700
                 p-2 rounded-[2rem]
                 shadow-md shadow-blue-900/5 dark:shadow-black/40
                 hover:shadow-xl hover:shadow-teal-900/10
                 hover:border-teal-200 dark:hover:border-teal-500
                 transition-all duration-300 transform hover:-translate-y-1"
        >
          <button
              @click="toggle(index)"
              class="flex items-center justify-between p-4 w-full text-left"
          >
            <div class="flex-1 pr-4">

              <!-- Frage -->
              <h2
                  class="text-xl md:text-2xl font-bold
                       text-slate-700 dark:text-gray-100
                       group-hover:text-transparent group-hover:bg-clip-text
                       group-hover:bg-gradient-to-r group-hover:from-teal-500 group-hover:to-blue-600
                       dark:group-hover:from-teal-400 dark:group-hover:to-blue-500
                       transition-all duration-300"
              >
                {{ faq.frage }}
              </h2>

              <!-- Antwort mit Animation -->
              <transition name="faq">
                <div
                    v-if="openIndex === index"
                    class="mt-4 text-slate-600 dark:text-gray-400 text-base leading-relaxed"
                >
                  {{ faq.antwort }}
                </div>
              </transition>
            </div>

            <!-- Plus / Minus Kreis -->
            <div
                class="w-12 h-12 flex items-center justify-center rounded-full
                     bg-slate-50 dark:bg-gray-800
                     text-slate-400 dark:text-gray-400
                     group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-blue-500
                     group-hover:text-white
                     transition-all duration-300 shadow-sm shrink-0"
            >
              <span class="text-2xl leading-none">
                {{ openIndex === index ? '−' : '+' }}
              </span>
            </div>
          </button>
        </li>
      </ul>

    </div>
  </div>
</template>

<style scoped>
.faq-enter-active,
.faq-leave-active {
  transition: all 0.25s ease;
}

.faq-enter-from,
.faq-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.faq-enter-to,
.faq-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>