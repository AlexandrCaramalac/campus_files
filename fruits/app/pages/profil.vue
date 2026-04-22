<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="max-w-3xl mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">Mein Profil</h1>

    <div v-if="loading" class="text-gray-600 mb-4">
      Profil wird geladen...
    </div>

    <div v-else>
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Benutzername
        </label>
        <input
            v-model="username"
            type="text"
            class="w-full border rounded-lg px-4 py-2"
            placeholder="Dein Name"
        />
      </div>

      <div class="mb-6">
        <p class="block text-sm font-medium text-gray-700 mb-3">
          Wähle ein Profilbild
        </p>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
              v-for="avatarOption in avatars"
              :key="avatarOption"
              @click="selectedAvatar = avatarOption"
              class="border rounded-xl p-2 transition hover:shadow-md"
              :class="selectedAvatar === avatarOption ? 'ring-2 ring-green-500 border-green-500' : 'border-gray-300'"
          >
            <img
                :src="avatarOption"
                alt="Avatar"
                class="w-full h-24 object-cover rounded-lg"
            />
          </button>
        </div>
      </div>

      <div class="mb-6" v-if="selectedAvatar">
        <p class="text-sm font-medium text-gray-700 mb-2">Vorschau</p>
        <img
            :src="selectedAvatar"
            alt="Ausgewähltes Profilbild"
            class="w-32 h-32 object-cover rounded-full border"
        />
      </div>

      <button
          @click="saveProfile"
          class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Speichern
      </button>

      <p v-if="message" class="mt-4 text-green-600">
        {{ message }}
      </p>

      <p v-if="errorMessage" class="mt-4 text-red-600">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>