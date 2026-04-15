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
            to="/files" 
            class="text-gray-700 font-medium hover:text-green-600 transition"
          >
            Module
          </NuxtLink>
        </li>
        <li class="pr-4">
          <NuxtLink
              to="/forum"
              class="text-gray-700 font-medium hover:text-green-600 transition"
          >
            Forum
          </NuxtLink>
        </li>

        <!-- Bewertungen Dropdown -->
        <li class="relative pr-4">
          <button 
            @click="toggleRatingsDropdown"
            class="flex items-center text-gray-700 font-medium hover:text-green-600 transition"
          >
            Bewertungen
            <svg 
              class="ml-1 h-4 w-4 transition-transform" 
              :class="{ 'rotate-180': ratingsDropdownOpen }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <!-- Dropdown Menu -->
          <div 
            v-if="ratingsDropdownOpen"
            class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border"
          >
            <div class="py-1">
              <NuxtLink 
                to="/ratings_prof"
                @click="closeRatingsDropdown"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                Dozenten
              </NuxtLink>
              <NuxtLink 
                to="/ratings_course"
                @click="closeRatingsDropdown"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                Module
              </NuxtLink>
            </div>
          </div>
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
