import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data: { user } } = await client.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Du musst angemeldet sein, um eine Bewertung abzugeben.' })
  }

  const body = await readBody(event) ?? {}
  const kursID = Number(body.kursID)
  const dozentID = Number(body.dozentID)

  if (!Number.isInteger(kursID) || kursID <= 0 || !Number.isInteger(dozentID) || dozentID <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Bitte wähle Kurs und Lehrperson aus.' })
  }

  const ratingFields = ['aufwand', 'nutzen', 'schwierigkeit', 'praxisbezug', 'gesamtbewertung']
  const ratingValues = Object.fromEntries(
    ratingFields.map((field) => [field, Number(body[field])])
  )
  if (Object.values(ratingValues).some((value) => !Number.isInteger(value) || value < 1 || value > 5)) {
    throw createError({ statusCode: 400, statusMessage: 'Alle Bewertungswerte müssen zwischen 1 und 5 liegen.' })
  }

  const { data: unterrichtet, error: assignmentError } = await client
    .from('unterrichtet')
    .select('kursID')
    .eq('kursID', kursID)
    .eq('dozentID', dozentID)
    .maybeSingle()

  if (assignmentError) {
    console.error('Supabase assignment check error:', assignmentError)
    throw createError({ statusCode: 500, statusMessage: 'Die Kurs-Lehrperson-Zuordnung konnte nicht geprüft werden.' })
  }
  if (!unterrichtet) {
    throw createError({ statusCode: 400, statusMessage: 'Diese Lehrperson unterrichtet den ausgewählten Kurs nicht.' })
  }

  const { data, error } = await client
    .from('bewertung_kurs')
    .insert({
      kursID,
      dozentID,
      nutzerID: user.id,
      ...ratingValues,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      const { data: existingRating, error: lookupError } = await client
        .from('bewertung_kurs')
        .select('id')
        .eq('kursID', kursID)
        .eq('dozentID', dozentID)
        .eq('nutzerID', user.id)
        .maybeSingle()

      if (lookupError) {
        console.error('Supabase duplicate rating lookup error:', lookupError)
        throw createError({ statusCode: 500, statusMessage: 'Die vorhandene Kursbewertung konnte nicht geprüft werden.' })
      }
      if (existingRating) {
        throw createError({ statusCode: 409, statusMessage: 'Du hast diesen Kurs bei dieser Lehrperson bereits bewertet.' })
      }

      console.error('Unexpected unique constraint on course rating:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Die Datenbank macht komische Sachen. Oder so.',
      })
    }
    console.error('Supabase course rating insert error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Die Kursbewertung konnte nicht gespeichert werden.' })
  }

  return { success: true, bewertung: data }
})
