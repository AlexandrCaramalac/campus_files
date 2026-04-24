<script setup>
    const route = useRoute() 
    
    const { data: comments } = await useFetch('/api/kurse/foren/kommentare/' + route.params.forumId)

</script>

<template> 
    Hier stehen die Kommentare! <br><br>
    <ul>
        <li v-for="item in comments.beitraege" :key="item.id">
            {{ item.kommentar }} <br>
            von {{ item.profile.name }} <br>
            am {{ new Date(item.created_at).toLocaleDateString('de-DE', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) }} <br><br>
        </li>
    </ul>
</template>