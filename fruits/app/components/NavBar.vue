<template>
  <nav class="sticky top-0 z-50 bg-white shadow-md">
    <div class="flex items-center justify-between px-6 py-3">

      <ul class="flex items-center">
        <li class="pr-4">
          <NuxtLink
              to="/"
              class="text-gray-700 font-medium hover:text-green-600 transition"
          >
            Startseite
          </NuxtLink>
        </li>
        <li class="pr-4">
          <NuxtLink
              to="/anleitung"
              class="text-gray-700 font-medium hover:text-green-600 transition"
          >
            Anleitung
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
              to="/lecturers"
              class="text-gray-700 font-medium hover:text-green-600 transition"
          >
            Dozenten
          </NuxtLink>
        </li>

        <li class="pr-4">
          <NuxtLink
              to="/profil"
              class="text-gray-700 font-medium hover:text-green-600 transition"
          >
            Profil
          </NuxtLink>
        </li>
      </ul>

      <div>
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

        <NuxtLink v-if="user" to="/profil">
          <button class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition ml-2">
            Profil
          </button>
        </NuxtLink>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useSupabaseUser } from '#imports'

const user = useSupabaseUser()

const ratingsDropdownOpen = ref(false)

const toggleRatingsDropdown = () => {
  ratingsDropdownOpen.value = !ratingsDropdownOpen.value
}

const closeRatingsDropdown = () => {
  ratingsDropdownOpen.value = false
}

if (process.client) {
  document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.relative')
    if (dropdown && !dropdown.contains(e.target)) {
      closeRatingsDropdown()
    }
  })
}
</script>