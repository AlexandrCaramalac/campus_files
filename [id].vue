<script setup>

const route = useRoute() 

const { data } = await useFetch('/api/fruits/' + route.params.id)
</script>

<template>
  <h1>
    {{data.fruits.name}}
  </h1>
</template>

