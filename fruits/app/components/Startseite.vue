<script setup lang="ts">
/*
  Holt den aktuell eingeloggten User von Supabase:
  null = nicht eingeloggt
  Objekt = eingeloggt
*/
const user = useSupabaseUser()

/*
  Darkmode Zustand
*/
const isDark = ref(false)

/*
  Toggle Darkmode:
  - fügt oder entfernt die Klasse 'dark' am <html>-Element
*/
const toggleDarkMode = () => {
  isDark.value = !isDark.value

  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>

  <!-- FOOTER CONTAINER -->
  <footer class="relative bg-gray-900 text-gray-300 dark:bg-gray-950 dark:text-gray-400 py-10 mt-16">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Layout:
           mobil = untereinander
           desktop = nebeneinander -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">

        <!-- LEFT: Logo + Slogan -->
        <div class="text-center md:text-left">

          <!-- Logo -->
          <h2
              class="text-xl font-semibold text-white dark:text-gray-100
         transition-all duration-300
         hover:scale-105
         hover:text-transparent
         hover:bg-clip-text
         hover:bg-gradient-to-r
         hover:from-teal-500 hover:to-blue-600
         dark:hover:text-transparent
         dark:hover:bg-clip-text
         dark:hover:bg-gradient-to-r
         dark:hover:from-teal-400 dark:hover:to-blue-500"
          >
            StudySync
          </h2>

          <!-- Slogan -->
          <p
              class="text-sm text-gray-400 dark:text-gray-500
                   transition-all duration-300
                   hover:scale-105
                   hover:text-transparent
                   hover:bg-clip-text
                   hover:bg-gradient-to-r
                   hover:from-teal-500 hover:to-blue-600"
          >
            From students, for students.
          </p>
        </div>

        <!-- CENTER: Copyright -->
        <div class="w-full flex justify-center text-sm">

          <!--
            Dynamischer Link:
            - Eingeloggt → Dashboard
            - Ausgeloggt → Klick blockiert
          -->
          <NuxtLink
              :to="user ? '/dashboard' : '#'"
              @click="!user && $event.preventDefault()"
              :class="[
              // Hover-Effekt immer aktiv
              'text-sm transition-all duration-300 hover:scale-105 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-600',

              // Farbe je nach Zustand + Darkmode
              user
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-300 dark:text-gray-600 cursor-default'
            ]"
          >
            © 2026 StudySync – From students, for students.
          </NuxtLink>
        </div>

        <!-- RIGHT: Fachschaft -->
        <div class="text-sm text-gray-400 dark:text-gray-500 text-center md:text-right">
          <a
              href="https://fsmathinf.uni-osnabrueck.de/"
              target="_blank"
              rel="noopener noreferrer"
              class="transition-all duration-300
                   hover:scale-105
                   hover:text-transparent
                   hover:bg-clip-text
                   hover:bg-gradient-to-r
                   hover:from-teal-500 hover:to-blue-600"
          >
            Fachschaft
          </a>
        </div>

      </div>
    </div>

    <!-- DARKMODE BUTTON -->
    <button
        @click="toggleDarkMode"
        class="absolute right-6 top-1/2 -translate-y-1/2
             text-lg text-gray-500 dark:text-gray-400
             hover:text-white transition-all duration-300"
        aria-label="Darkmode umschalten"
    >
      {{ isDark ? '☀️' : '🌙' }}
    </button>

  </footer>
</template>