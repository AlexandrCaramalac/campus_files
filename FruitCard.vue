<script setup>
const props = defineProps({
  fruit: Object
})

/**
 * Macht die Farbe "weicher" (pastell)
 */
const softColor = computed(() => {
  if (!props.fruit.color) return '#f3f4f6' // fallback (gray-100)

  // Hex → RGB
  const hex = props.fruit.color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Mischung mit weiß → softer Ton
  const mix = (c) => Math.round(c + (255 - c) * 0.8)

  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`
})
</script>

<template>
  <NuxtLink :to="`/fruits/${fruit.id}`">
    <div 
      class="rounded-2xl p-6 flex flex-col items-center text-center transition hover:shadow-lg w-full max-w-xs"
      :style="{ backgroundColor: softColor }"
    >
      
      <!-- Rundes Bild -->
      <div class="w-20 h-20 sm:w-24 sm:h-24 mb-4">
        <img 
          :src="fruit.img" 
          :alt="fruit.name"
          class="w-full h-full object-cover rounded-full border-4 border-white shadow-sm"
        >
      </div>

      <!-- Name -->
      <h3 class="text-base sm:text-lg font-semibold text-gray-800">
        {{ fruit.name }}
      </h3>

    </div>
    </NuxtLink>
</template>

