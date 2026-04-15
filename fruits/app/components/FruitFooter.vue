<template>
  <footer class="bg-gray-900 text-gray-300 py-10 mt-16">
    <div class="max-w-7xl mx-auto px-6">

      <div class="flex flex-col md:flex-row justify-between items-center gap-6">

        <!-- Left: Logo / Name -->
        <div class="text-center md:text-left">
          <h2 class="text-xl font-semibold text-white">StudySync</h2>
          <p class="text-sm text-gray-400">
            From students, for students.
          </p>
        </div>

        <div class="flex gap-6 text-sm">
          <NuxtLink to="/" class="hover:text-white transition">Home</NuxtLink>
        </div>

        <div class="text-sm text-gray-400 text-center md:text-right">
          <a
              href="https://fsmathinf.uni-osnabrueck.de/"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-white transition"
          >
            Fachschaft
          </a>
        </div>

      </div>

    </div>
  </footer>
</template>