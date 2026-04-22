<template>
  <nav class="sticky top-0 z-50 bg-white shadow-md">
    <div class="flex items-center justify-between px-6 py-3">
      
      <ul class="flex items-center">
        <li class="pr-4">
          <NuxtLink to="/" class="text-gray-700 font-medium hover:text-green-600 transition">
            Startseite
          </NuxtLink>
        </li>
        <li class="pr-4">
          <NuxtLink to="/guide" class="text-gray-700 font-medium hover:text-green-600 transition">
            Anleitung
          </NuxtLink>
        </li>
        <li class="pr-4">
          <NuxtLink to="/courses" class="text-gray-700 font-medium hover:text-green-600 transition">
            Kurse
          </NuxtLink>
        </li>
        <li class="pr-4">
          <NuxtLink to="/lecturers" class="text-gray-700 font-medium hover:text-green-600 transition">
            Dozenten
          </NuxtLink>
        </li>
      </ul>

      <div class="flex items-center">
        <NuxtLink to="/dataAdd">
          <button class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition mr-2">
            Datei hochladen
          </button>
        </NuxtLink>

        <NuxtLink v-if="!user" to="/login">
          <button class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition ml-2">
            Login
          </button>
        </NuxtLink>

        <div v-else class="flex items-center">
          <NuxtLink to="/profil">
            <button class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition ml-2">
              Profil
            </button>
          </NuxtLink>
          
          <button
            @click="logout"
            class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition ml-4"
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
const user = ref(null)

// Authentifizierungsstatus beim Laden der Komponente prüfen
onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  user.value = data.session?.user ?? null

  // Auf Änderungen des Auth-Status reagieren (Login/Logout)
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user ?? null
  })
})

// Logout-Funktion
const logout = async () => {
  await supabase.auth.signOut()
  user.value = null
  navigateTo('/')
}

// Dropdown-Logik (falls für spätere Funktionen wie "Bewertungen" benötigt)
const ratingsDropdownOpen = ref(false)

const toggleRatingsDropdown = () => {
  ratingsDropdownOpen.value = !ratingsDropdownOpen.value
}

const closeRatingsDropdown = () => {
  ratingsDropdownOpen.value = false
}

// Event Listener für Klicks außerhalb von Dropdowns
if (process.client) {
  document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.relative')
    if (dropdown && !dropdown.contains(e.target)) {
      closeRatingsDropdown()
    }
  })
}
</script>