<template>
	<div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
		<div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

			<!-- Logo / Title -->
			<div class="text-center mb-8">

				<h1 class="text-gray-500 text-sm mt-1">Willkommen zurück</h1>
			</div>

			<!-- Tab Toggle -->
			<div class="flex bg-gray-100 rounded-xl p-1 mb-6">
				<button
					@click="mode = 'login'"
					:class="mode === 'login'
						? 'bg-white text-gray-800 shadow-sm'
						: 'text-gray-500 hover:text-gray-700'"
					class="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
				>
					Login
				</button>
				<button
					@click="mode = 'register'"
					:class="mode === 'register'
						? 'bg-white text-gray-800 shadow-sm'
						: 'text-gray-500 hover:text-gray-700'"
					class="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
				>
					Registrieren
				</button>
			</div>

			<!-- Form -->
			<div class="space-y-4">
				<div v-if="mode === 'register'">
					<label class="block text-sm font-medium text-gray-700 mb-1">Vorname</label>
					<input
						type="text"
						v-model="firstName"
						placeholder="Max"
						class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-gray-800"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
					<input
						type="email"
						v-model="email"
						placeholder="max@example.com"
						class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-gray-800"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
					<input
						type="password"
						v-model="password"
						placeholder="••••••••"
						class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-gray-800"
					/>
				</div>

				<!-- Status Message -->
				<p v-if="message" :class="isError ? 'text-red-500' : 'text-emerald-600'" class="text-sm text-center">
					{{ message }}
				</p>

				<!-- Primary Button -->
				<button
					@click="mode === 'login' ? login() : createAccount()"
					class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl transition-colors mt-2"
				>
					{{ mode === 'login' ? 'Einloggen' : 'Account erstellen' }}
				</button>
			</div>

			<!-- Divider -->
			<div class="flex items-center my-6">
				<div class="flex-1 h-px bg-gray-200"></div>
				<span class="px-3 text-xs text-gray-400">oder</span>
				<div class="flex-1 h-px bg-gray-200"></div>
			</div>

			<!-- Secondary actions -->
			<div class="flex gap-2">
				<button
					@click="seeUser"
					class="flex-1 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 py-2 rounded-xl transition-colors"
				>
					Session prüfen
				</button>
				<button
					@click="logout"
					class="flex-1 text-sm text-red-400 hover:text-red-600 border border-gray-200 hover:border-red-200 py-2 rounded-xl transition-colors"
				>
					Logout
				</button>
			</div>

		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "../clients/supabase"
import { useRouter } from "vue-router";

const mode = ref("login");
const email = ref("");
const password = ref("");
const firstName = ref("");
const message = ref("");
const isError = ref(false);
const router = useRouter();

function showMessage(text, error = false) {
	message.value = text;
	isError.value = error;
	setTimeout(() => { message.value = ""; }, 3000);
}

async function createAccount() {
	const { user, error } = await supabase.auth.signUp({
		email: email.value,
		password: password.value,
		options: {
			data: { first_name: firstName.value }
		}
	});
	if (error) {
		showMessage(error.message, true);
	} else {
		showMessage("Account erstellt! Bitte E-Mail bestätigen.");
    router.push("/login");
	}
}

async function login() {
	const { data, error } = await supabase.auth.signInWithPassword({
		email: email.value,
		password: password.value
	});
	if (error) {
		showMessage(error.message, true);
	} else {
		showMessage("Erfolgreich eingeloggt!");
    router.push("/");
	}
}

async function seeUser() {
	const localUser = await supabase.auth.getSession();
	console.log(localUser.data.session);
	showMessage(localUser.data.session ? "Session aktiv" : "Keine Session");
}

async function logout() {
	const { error } = await supabase.auth.signOut();
	if (error) {
		showMessage(error.message, true);
	} else {
		showMessage("Erfolgreich ausgeloggt.");
	}
}
</script>
