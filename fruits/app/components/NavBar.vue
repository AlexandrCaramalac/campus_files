<template>
  <nav class="sticky top-0 z-50 bg-white shadow-md">
    <div class="flex items-center justify-between px-6 py-3">
      
      <ul class="flex items-center">
        <li class="pr-4">
          <NuxtLink 
            to="/"
            class="text-gray-700 font-medium hover:text-green-600 transition"
          >
            Home
          </NuxtLink>
        </li>
        <li class="pr-4">
          <NuxtLink 
            to="/courses" 
            class="text-gray-700 font-medium hover:text-green-600 transition"
          >
            Module
          </NuxtLink>
        </li>
        <li class="pr-4">
          <NuxtLink 
            to="/ratings_prof"
            class="text-gray-700 font-medium hover:text-green-600 transition"
          >
            Dozenten
          </NuxtLink>

        </li>
      </ul>
      

      <!-- Button (rechts) -->
      <div>
        <NuxtLink to="/dataAdd">
          <button class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition mr-2">
            Datei hochladen
          </button>
        </NuxtLink>

        <NuxtLink to="/login">
          <button @click="handleLoginClick" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition ml-2">
  Login
</button>
        </NuxtLink>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

// Navigation zu Login-Seite
const handleLoginClick = () => {
  console.log("Button Login clicked")
  navigateTo('/login')
}

// Dropdown state
const ratingsDropdownOpen = ref(false)

// Dropdown umschalten
const toggleRatingsDropdown = () => {
  ratingsDropdownOpen.value = !ratingsDropdownOpen.value
}

// Dropdown schließen
const closeRatingsDropdown = () => {
  ratingsDropdownOpen.value = false
}

// Event Listener für Klicks außerhalb
if (process.client) {
  document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.relative')
    if (dropdown && !dropdown.contains(e.target)) {
      closeRatingsDropdown()
    }
  })
}
</script>
