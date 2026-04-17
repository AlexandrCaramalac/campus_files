<script setup>

const route = useRoute() 
// used to get all the information about the lecturer, including the average ratings and the courses they teach, see api for details
const { data: lecturer } = await useFetch('/api/dozenten/' + route.params.id)
// used to get all the forums for the lecturer, including the name of the user that created the forum and the date it was created
const { data: forums } = await useFetch('/api/dozenten/foren/' + route.params.id)

</script>

<template>
  <h1 class="font-bold">
    Hier entsteht die Bewertungsseite für den Dozenten {{lecturer.dozent.vorname}} {{ lecturer.dozent.nachname}}. <br>
    Die angezeigten Bewerungen entsprechen den in Supabase berechneten Durchschnittswerten für diesen Dozenten. <br>
    Bewertungen sind als Sterne von 1 bis 5 dargestellt, wobei 5 die beste Bewertung ist. Das ist so in supabase auch als enum definiert.
  </h1>
  <p>
    Verständlichkeit: {{ lecturer.bewertungen.verstaendlichkeit }}<br>
    Struktur: {{ lecturer.bewertungen.struktur }}<br>
    Engagement: {{ lecturer.bewertungen.engagement }}<br>
    Freundlichkeit: {{ lecturer.bewertungen.freundlichkeit }}<br>
    Gesamtbewertung: {{ lecturer.bewertungen.gesamtbewertung }}<br>
  </p>
  <h2 class="font-bold">Der Dozent unterichtet folgende Kurse:</h2>
  <ul>
    <li v-for="(course, index) in lecturer.kurse" :key="index">
      {{ course }}
    </li>
  </ul>
  <h1 class="font-bold">
    Zu {{lecturer.dozent.vorname}} {{ lecturer.dozent.nachname}} existieren folgende Forumsbeiträge: <br>
  </h1>
  <ul>
    <li v-for="item in forums.beitraege" :key="item.id">
      {{ item.thema }} <br>
      (nicht) geschrieben von {{ item.profile.name }} <br>
      am {{ new Date(item.created_at).toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) }} <br>
      <NuxtLink :to="`/lecturers/${route.params.id}/${item.id}`">
        Kommentare
      </NuxtLink> <br><br>
    </li>
  </ul>

</template>