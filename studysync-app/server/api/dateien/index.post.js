import { serverSupabaseClient } from '#supabase/server';
import { readMultipartFormData } from 'h3'
import { randomUUID } from 'crypto';

/**
 * uploads a file to storage in supabase if the user is authenticated only
 * if upload to either storage or dateien (to link the storage) fails, the file
 * will not be uploaded at all
 */
export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = (await client.auth.getUser()).data.user;

  // not logged in
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Nicht autorisiert' });
  }

  const multipartData = await readMultipartFormData(event);

  const jahrData = multipartData?.find(el => el.name === 'jahr');
  const semesterData = multipartData?.find(el => el.name === 'semester'); // NEU
  const kursIdData = multipartData?.find(el => el.name === 'kursID');
  const dozentIdData = multipartData?.find(el => el.name === 'dozentID');
  const typData = multipartData?.find(el => el.name === 'typ');
  const fileData = multipartData?.find(el => el.name === 'file');

  // NEU: semesterData in die Prüfung aufgenommen
  if (!kursIdData || !typData || !jahrData || !semesterData || !fileData || !fileData.filename) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'Bitte wähle einen Kurs und gib Typ, Jahr, Semester sowie eine Datei an.'
    });
  } 

  const kursID = Number(kursIdData.data.toString());
  const dozentIdValue = dozentIdData?.data.toString().trim() ?? '';
  const dozentID = dozentIdValue ? Number(dozentIdValue) : null;
  if (!Number.isInteger(kursID) || kursID <= 0 || (dozentID !== null && (!Number.isInteger(dozentID) || dozentID <= 0))) {
    throw createError({ statusCode: 400, statusMessage: 'Kurs oder Lehrperson ist ungültig.' });
  }

  if (dozentID !== null) {
    const { data: unterrichtet, error: assignmentError } = await client
      .from('unterrichtet')
      .select('kursID')
      .eq('kursID', kursID)
      .eq('dozentID', dozentID)
      .maybeSingle();

    if (assignmentError) {
      console.error('Supabase assignment check error:', assignmentError);
      throw createError({ statusCode: 500, statusMessage: 'Die Kurs-Lehrperson-Zuordnung konnte nicht geprüft werden.' });
    }
    if (!unterrichtet) {
      throw createError({ statusCode: 400, statusMessage: 'Diese Lehrperson unterrichtet den ausgewählten Kurs nicht.' });
    }
  }

  const typ = typData.data.toString();
  if (!['skript', 'uebungsaufgabe', 'mitschrift', 'altklausur'].includes(typ)) {
    throw createError({ statusCode: 400, statusMessage: 'Der Dateityp muss Skript, Übungsaufgabe, Mitschrift oder Altklausur sein.' });
  }
  const dateiname = fileData.filename;

  const ext = fileData.filename?.split('.').pop();
  const uuidName = `${randomUUID()}.${ext}`;
  const einzigartigerDateiname = `${user.id}-${Date.now()}-${uuidName}`;

  const dateipfad = `${typ}/${kursID}/${einzigartigerDateiname}`;

  // NEU: Jahr und Semester als Text auslesen (kein parseInt mehr für das Jahr)
  const jahr = jahrData.data.toString().trim();
  const semester = semesterData.data.toString().trim();
  
  const { error: uploadError } = await client.storage
    .from('kurs_dateien')
    .upload(dateipfad, fileData.data, {
      contentType: fileData.type,
      upsert: false
    });

  if (uploadError) {
    console.error('Error:', uploadError);
    throw createError({ statusCode: 500, statusMessage: 'Datei konnte nicht hochgeladen werden.' });
  }

  const { data: dbData, error: insertError } = await client
  .from('dateien')
  .insert({
    typ: typ,
    kursID: kursID,
    dozentID: dozentID,
    nutzerID: user.id,
    dateipfad: dateipfad,
    dateiname: dateiname,
    jahr: jahr,           // Jahr wird als Text gespeichert
    semester: semester    // NEU: Semester wird gespeichert
  })
  .select()
  .single();

  if (insertError) {
    console.error('Supabase DB Error:', insertError);
    await client.storage.from('kurs_dateien').remove([dateipfad]);
    throw createError({ statusCode: 500, statusMessage: 'Datei-Informationen konnten nicht gespeichert werden.' });
  }
  
  console.log("RAW filename:", fileData.filename);
  console.log("TYPE:", fileData.type);
  return { success: true, file: dbData };
});