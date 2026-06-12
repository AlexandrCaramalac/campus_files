<template>
  <div class="flex min-h-screen flex-col bg-slate-50 dark:bg-black transition-colors duration-300">
    <!-- Loading bis Auth geklärt ist -->
    <div v-if="isLoading" class="flex min-h-screen items-center justify-center">
      <div class="text-slate-500">Loading...</div>
    </div>

    <!-- Nur rendern wenn Auth geklärt -->
    <template v-else>
      <NavBar />
      <main class="flex-grow bg-slate-50 dark:bg-black">
        <NuxtPage />
      </main>
      <Footer />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const router = useRouter()
const supabase = useSupabaseClient()
const isLoading = ref(true)

// Nur hier dürfen Nutzer hin, die nicht eingeloggt sind und umgekehrt dürfen eingeloggte Nutzer hier nicht hin
const publicRoutes = ['/', '/login', '/update-password']

onMounted(async () => {
  // Warte bis Session geladen ist
  const { data: { session } } = await supabase.auth.getSession()

  const currentPath = router.currentRoute.value.path

  // NICHT eingeloggt
  if (!session) {
    if (!publicRoutes.includes(currentPath)) {
      await router.push('/login')
    }
  }

  // EINGELOGGT
  else {
    // Nur vom Login oder der Startseite ins Dashboard leiten!
    // Auf /update-password darf man auch mit Session bleiben.
    if (currentPath === '/' || currentPath === '/login') {
      await router.push('/dashboard')
    }
  }

  isLoading.value = false
})
</script>

<style>
input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill,
input:-webkit-autofill:hover,
textarea:-webkit-autofill:hover,
select:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill:focus,
select:-webkit-autofill:focus {
  -webkit-text-fill-color: #0f172a !important;
  background-color: rgba(248, 250, 252, 1) !important;
  -webkit-box-shadow: 0 0 0px 1000px rgba(248, 250, 252, 1) inset !important;
  box-shadow: 0 0 0px 1000px rgba(248, 250, 252, 1) inset !important;
  transition: background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s !important;
}

.dark input:-webkit-autofill,
.dark textarea:-webkit-autofill,
.dark select:-webkit-autofill,
.dark input:-webkit-autofill:hover,
.dark textarea:-webkit-autofill:hover,
.dark select:-webkit-autofill:hover,
.dark input:-webkit-autofill:focus,
.dark textarea:-webkit-autofill:focus,
.dark select:-webkit-autofill:focus {
  -webkit-text-fill-color: #f8fafc !important;
  background-color: rgba(31, 41, 55, 1) !important;
  -webkit-box-shadow: 0 0 0px 1000px rgba(31, 41, 55, 1) inset !important;
  box-shadow: 0 0 0px 1000px rgba(31, 41, 55, 1) inset !important;
  transition: background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s !important;
}
</style>