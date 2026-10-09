import { serverSupabaseClient } from '#supabase/server'
/**
 * Prüft, ob der aktuell eingeloggte Nutzer
 * den angegebenen Kurs bereits bewertet hat.
 */
export default eventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { data: { user } } = await client.auth.getUser()

    const query = getQuery(event)
    const kursID = Number(query.kursID)
    const dozentID = Number(query.dozentID)

    if (!Number.isInteger(kursID) || kursID <= 0 || !Number.isInteger(dozentID) || dozentID <= 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bitte wähle eine Lehrperson aus, die diesen Kurs unterrichtet.'
        })
    }

    // Falls niemand eingeloggt ist:
    // -> Es kann keine Bewertung existieren
    if (!user) {
        return {
            alreadyRated: false,
            reason: 'Nicht eingeloggt'
        }
    }

    const { data: unterrichtet, error: assignmentError } = await client
        .from('unterrichtet')
        .select('kursID')
        .eq('kursID', kursID)
        .eq('dozentID', dozentID)
        .maybeSingle()

    if (assignmentError) {
        console.error('Supabase Zuordnungsfehler:', assignmentError)
        throw createError({
            statusCode: 500,
            statusMessage: 'Die Kurs-Lehrperson-Zuordnung konnte nicht geprüft werden.'
        })
    }
    if (!unterrichtet) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Diese Lehrperson unterrichtet den ausgewählten Kurs nicht.'
        })
    }

    // Prüft in "bewertung_kurs", ob beereits eine Bewertung existiert:
    const { data, error } = await client
        .from('bewertung_kurs')
        .select('id')
        .eq('kursID', kursID)
        .eq('dozentID', dozentID)
        .eq('nutzerID', user.id)
        .limit(1)

    if (error) {
        console.error('Supabase Fehler:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Die Kursbewertung konnte nicht geprüft werden.'
        })
    }

    // Gibt true zurück, wenn mindestens eine Bewertung gefunden wurde
    // Gibt false zurück, wenn keine Bewertung existiert
    return {
        alreadyRated: data && data.length > 0
    }
})