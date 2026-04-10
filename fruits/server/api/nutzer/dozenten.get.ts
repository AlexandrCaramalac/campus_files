import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {

  // Mit der Datenbank verbinden
  const client = await serverSupabaseClient(event);

  // In der Datenbank nach den Dozenten suchen
  const { data } = await client
    .from("rolle")
    .select("hat_Rolle(nutzer(id, name, created_at, fachbereichID))")
    .eq("rolle", "Dozent");

  // Überprüfen, ob Daten zurückgekommen sind
  if (data === null || data === undefined) {
    return { dozenten: [] };
  }

  if (data.length === 0) {
    return { dozenten: [] };
  }

  // Die erste (und einzige) Rolle "Dozent" holen
  const dozentenRolle = data[0];

  // Überprüfen, ob die Rolle existiert
  if (dozentenRolle === null || dozentenRolle === undefined) {
    return { dozenten: [] };
  }

  // Die Verknüpfungen zwischen Rolle und Nutzer holen
  const verknuepfungen = dozentenRolle.hat_Rolle;

  // Überprüfen, ob Verknüpfungen vorhanden sind
  if (verknuepfungen === null || verknuepfungen === undefined) {
    return { dozenten: [] };
  }

  // Eine neue Liste für die Dozenten erstellen
  const dozenten = [];

  // Mit einer for-Schleife durch alle Verknüpfungen gehen
  for (let i = 0; i < verknuepfungen.length; i = i + 1) {
    const einzelneVerknuepfung = verknuepfungen[i];
    const nutzer = einzelneVerknuepfung.nutzer;
    dozenten.push(nutzer);
  }

  // Die Liste aller Dozenten zurückgeben
  return { dozenten };
})