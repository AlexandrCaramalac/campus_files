<script setup>
  const submitFruit = ref('')
  const color = ref('')
  const name = ref('')

  async function submitting() {
    const {body} = await $fetch('/api/fruits', {
      method: 'post',
      body: { name: name.value, color: color.value }
    })
  }


</script>

<template>
  <section class="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md mt-16">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Add a New Fruit</h1>

    <form @submit.prevent="submitting" class="flex flex-col gap-4">

      <!-- Name Input -->
      <div>
        <label class="block text-gray-700 font-medium mb-1" for="name">Name</label>
        <input
          v-model="name"
          id="name"
          type="text"
          placeholder="Enter fruit name"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:outline-none"
          required
        />
      </div>

      <!-- Color Dropdown -->
      <div>
        <label class="block text-gray-700 font-medium mb-1" for="color">Color</label>
        <select
          v-model="color"
          id="color"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:outline-none"
          required
        >
          <option value="" disabled>Select a color</option>
          <option value="#FF0000">Red</option>
          <option value="#FFFF00">Yellow</option>
          <option value="#00FF00">Green</option>
          <option value="#FFA500">Orange</option>
          <option value="#800080">Purple</option>
        </select>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="mt-4 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition"
      >
        Add Fruit
      </button>

    </form>


  </section>
</template>
