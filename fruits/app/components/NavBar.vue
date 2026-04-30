<template>
  <!-- Navbar:
       Lightmode: weiß
       Darkmode: schwarz
  -->
  <nav class="sticky top-0 z-50 bg-white dark:bg-black shadow-md dark:shadow-gray-900 transition-colors duration-300">
    <div class="flex items-center justify-between px-6 py-3">

      <!-- Linke Navigation:
           Wird nur angezeigt, wenn ein User eingeloggt ist.
      -->
      <ul class="flex items-center">
        <template v-if="user">
          <li class="pr-4">
            <NuxtLink
                :to="startseiteLink"
                class="text-gray-700 dark:text-gray-200 font-medium hover:text-green-600 dark:hover:text-teal-400 transition"
            >
              Startseite
            </NuxtLink>
          </li>

          <li class="pr-4">
            <NuxtLink
                to="/guide"
                class="text-gray-700 dark:text-gray-200 font-medium hover:text-green-600 dark:hover:text-teal-400 transition"
            >
              Anleitung
            </NuxtLink>
          </li>

          <li class="pr-4">
            <NuxtLink
                to="/courses"
                class="text-gray-700 dark:text-gray-200 font-medium hover:text-green-600 dark:hover:text-teal-400 transition"
            >
              Kurse
            </NuxtLink>
          </li>

          <li class="pr-4">
            <NuxtLink
                to="/lecturers"
                class="text-gray-700 dark:text-gray-200 font-medium hover:text-green-600 dark:hover:text-teal-400 transition"
            >
              Dozenten
            </NuxtLink>
          </li>
        </template>
      </ul>

      <!-- Rechte Button-Leiste -->
      <div class="flex items-center">

        <!-- Datei hochladen:
             Nur sichtbar, wenn User eingeloggt ist.
        -->
        <NuxtLink v-if="user" to="/dataAdd">
          <button
              class="bg-gray-500 dark:bg-gray-700 text-white px-4 py-2 rounded-lg
                   hover:bg-gray-600 dark:hover:bg-gray-600 transition mr-2"
          >
            Datei hochladen
          </button>
        </NuxtLink>

        <!-- Login:
             Nur sichtbar, wenn kein User eingeloggt ist.
        -->
        <NuxtLink v-if="!user" to="/login">
          <button
              class="bg-gray-500 dark:bg-gray-700 text-white px-4 py-2 rounded-lg
                   hover:bg-gray-600 dark:hover:bg-gray-600 transition ml-2"
          >
            Login
          </button>
        </NuxtLink>

        <!-- Profil + Logout:
             Nur sichtbar, wenn User eingeloggt ist.
        -->
        <div v-else class="flex items-center">
          <NuxtLink to="/profil">
            <button
                class="bg-gray-500 dark:bg-gray-700 text-white px-4 py-2 rounded-lg
                     hover:bg-gray-600 dark:hover:bg-gray-600 transition ml-2"
            >
              Profil
            </button>
          </NuxtLink>

          <button
              @click="logout"
              class="bg-red-500 dark:bg-red-700 text-white px-4 py-2 rounded-lg
                   hover:bg-red-600 dark:hover:bg-red-600 transition ml-4"
          >
            Logout
          </button>
        </div>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const supabase = useSupabaseClient()

/*
  Speichert den aktuellen User:
  - null = ausgeloggt
  - Objekt = eingeloggt
*/
const user = ref(null)

/*
  Startseite-Link ist dynamisch:
  - ausgeloggt → '/'
  - eingeloggt → '/dashboard'
*/
const startseiteLink = ref('/')

/*
  Beim Laden der Navbar prüfen wir,
  ob bereits eine aktive Supabase-Session existiert.
*/
onMounted(async () => {
  const { data } = await supabase.auth.getSession()

  user.value = data.session?.user ?? null
  startseiteLink.value = data.session?.user ? '/dashboard' : '/'

  /*
    Reagiert automatisch auf Login/Logout.
  */
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user ?? null
    startseiteLink.value = session?.user ? '/dashboard' : '/'
  })
})

/*
  Logout:
  - Supabase meldet den User ab
  - lokaler User wird auf null gesetzt
  - Startseitenlink geht zurück auf '/'
  - User wird zur Landingpage geleitet
*/
const logout = async () => {
  await supabase.auth.signOut()
  user.value = null
  startseiteLink.value = '/'
  navigateTo('/')
}

/*
  Dropdown-Logik:
  Aktuell nicht sichtbar genutzt, aber kann später
  z. B. für Bewertungen verwendet werden.
*/
const ratingsDropdownOpen = ref(false)

const toggleRatingsDropdown = () => {
  ratingsDropdownOpen.value = !ratingsDropdownOpen.value
}

const closeRatingsDropdown = () => {
  ratingsDropdownOpen.value = false
}

/*
  Klick außerhalb eines Dropdowns:
  Schließt das Dropdown.
*/
if (process.client) {
  document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.relative')

    if (dropdown && !dropdown.contains(e.target)) {
      closeRatingsDropdown()
    }
  })
}
</script>