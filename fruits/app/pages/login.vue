<template>
  <!--
    Login-Seite:
    Lightmode: grüner heller Verlauf
    Darkmode: schwarzer/dunkler Verlauf
  -->
  <div
      class="min-h-screen
           bg-gradient-to-br from-green-50 to-emerald-100
           dark:from-black dark:to-gray-950
           flex items-center justify-center p-4
           transition-colors duration-300"
  >
    <!-- Login/Register Karte -->
    <div
        class="bg-white dark:bg-gray-900
             rounded-2xl shadow-lg dark:shadow-black/50
             border border-transparent dark:border-gray-700
             w-full max-w-md p-8
             transition-colors duration-300"
    >

      <!-- Logo / Title -->
      <div class="text-center mb-8">
        <h1 class="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Willkommen zurück
        </h1>
      </div>

      <!-- Tab Toggle -->
      <div class="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 transition-colors duration-300">
        <button
            @click="mode = 'login'"
            :class="mode === 'login'
            ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
            class="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
        >
          Login
        </button>

        <button
            @click="mode = 'register'"
            :class="mode === 'register'
            ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
            class="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
        >
          Registrieren
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <div v-if="mode === 'register'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Vorname
          </label>
          <input
              type="text"
              v-model="firstName"
              placeholder="Max"
              class="w-full px-4 py-2.5
                   border border-gray-200 dark:border-gray-700
                   rounded-xl
                   bg-white dark:bg-gray-800
                   text-gray-800 dark:text-gray-100
                   placeholder:text-gray-400 dark:placeholder:text-gray-500
                   focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
                   transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            E-Mail
          </label>
          <input
              type="email"
              v-model="email"
              placeholder="max@example.com"
              class="w-full px-4 py-2.5
                   border border-gray-200 dark:border-gray-700
                   rounded-xl
                   bg-white dark:bg-gray-800
                   text-gray-800 dark:text-gray-100
                   placeholder:text-gray-400 dark:placeholder:text-gray-500
                   focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
                   transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Passwort
          </label>
          <input
              type="password"
              v-model="password"
              placeholder="••••••••"
              class="w-full px-4 py-2.5
                   border border-gray-200 dark:border-gray-700
                   rounded-xl
                   bg-white dark:bg-gray-800
                   text-gray-800 dark:text-gray-100
                   placeholder:text-gray-400 dark:placeholder:text-gray-500
                   focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
                   transition"
          />
        </div>

        <!-- Status Message -->
        <p
            v-if="message"
            :class="isError
            ? 'text-red-500 dark:text-red-400'
            : 'text-emerald-600 dark:text-emerald-400'"
            class="text-sm text-center"
        >
          {{ message }}
        </p>

        <!-- Primary Button -->
        <button
            @click="mode === 'login' ? login() : createAccount()"
            class="w-full bg-emerald-500 hover:bg-emerald-600
                 dark:bg-emerald-600 dark:hover:bg-emerald-500
                 text-white font-semibold py-2.5 rounded-xl
                 transition-colors mt-2"
        >
          {{ mode === 'login' ? 'Einloggen' : 'Account erstellen' }}
        </button>
      </div>

      <!-- Divider -->
      <div class="flex items-center my-6">
        <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        <span class="px-3 text-xs text-gray-400 dark:text-gray-500">oder</span>
        <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <!-- Secondary actions -->
      <div class="flex gap-2">
        <button
            @click="seeUser"
            class="flex-1 text-sm
                 text-gray-500 dark:text-gray-400
                 hover:text-gray-700 dark:hover:text-gray-200
                 border border-gray-200 dark:border-gray-700
                 hover:border-gray-300 dark:hover:border-gray-500
                 py-2 rounded-xl transition-colors"
        >
          Session prüfen
        </button>

        <button
            @click="logout"
            class="flex-1 text-sm
                 text-red-400 dark:text-red-400
                 hover:text-red-600 dark:hover:text-red-300
                 border border-gray-200 dark:border-gray-700
                 hover:border-red-200 dark:hover:border-red-500
                 py-2 rounded-xl transition-colors"
        >
          Logout
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const mode = ref("login")
const email = ref("")
const password = ref("")
const firstName = ref("")
const message = ref("")
const isError = ref(false)

function showMessage(text, error = false) {
  message.value = text
  isError.value = error

  setTimeout(() => {
    message.value = ""
  }, 3000)
}

async function createAccount() {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: { first_name: firstName.value }
    }
  })

  if (error) {
    showMessage(error.message, true)
  } else {
    showMessage("Account erstellt! Bitte E-Mail bestätigen.")
  }
}

async function login() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    showMessage(error.message, true)
  } else {
    showMessage("Erfolgreich eingeloggt!")
    await navigateTo("/dashboard")
  }
}

async function seeUser() {
  const { data } = await supabase.auth.getSession()

  console.log("Aktuelle Session:", data.session)

  showMessage(data.session ? `Session aktiv für ${data.session.user.email}` : "Keine Session")
}

async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    showMessage(error.message, true)
  } else {
    showMessage("Erfolgreich ausgeloggt.")
    await navigateTo("/login")
  }
}
</script>