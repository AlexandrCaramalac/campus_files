<template>
  <footer class="bg-gray-900 text-gray-300 py-10 mt-16">
    <div class="max-w-7xl mx-auto px-6">

      <div class="flex flex-col md:flex-row justify-between items-center gap-6">

        <!-- Left: Logo / Name -->
        <div class="text-center md:text-left">
          <h2 class="text-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-600">
            StudySync
          </h2>
          <p class="text-sm text-gray-400 transition-all duration-300 hover:scale-105 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-600">
            From students, for students.
          </p>
        </div>

        <div class="w-full flex justify-center text-sm">
          <NuxtLink
              to="/"
              class="text-sm text-gray-400 transition-all duration-300 hover:scale-105 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-600"
          >
            © 2026 StudySync – From students, for students.
          </NuxtLink>
        </div>

        <div class="text-sm text-gray-400 text-center md:text-right">
          <a
              href="https://fsmathinf.uni-osnabrueck.de/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-gray-400 transition-all duration-300 hover:scale-105 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-600"
          >
            Fachschaft
          </a>
        </div>

      </div>

    </div>
  </footer>
</template>