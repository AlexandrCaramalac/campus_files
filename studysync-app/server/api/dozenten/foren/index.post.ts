import { serverSupabaseClient } from "#supabase/server"
import { readBody } from "h3"
import sanitizeHtml from "sanitize-html"

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = (await client.auth.getUser()).data.user as any;
  const userId = user?.id ?? user?.sub;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Nicht autorisiert" });
  }

  const body = await readBody(event);
  const dozentID = Number(body.dozentID);
  let thema = String(body.thema ?? "");

  if (!dozentID || !thema.trim()) {
    throw createError({ statusCode: 400, statusMessage: "Fehlende Daten" });
  }

  // 1) Länge prüfen
  if (thema.length > 1000) {
    throw createError({
      statusCode: 400,
      statusMessage: "Thema zu lang"
    });
  }

  // 2) HTML entfernen
  const cleanThema = sanitizeHtml(thema.trim(), {
    allowedTags: [],
    allowedAttributes: {}
  });

  // 3) Schimpfwortfilter
  const bannedWords = ["idiot", "arsch", "fuck"];

  const normalized = cleanThema
    .toLowerCase()
    .replace(/[^a-zA-Zäöüß0-9 ]/g, "");

  const containsBadWord = bannedWords.some(word =>
    normalized.includes(word)
  );

  if (containsBadWord) {
    throw createError({
      statusCode: 400,
      statusMessage: "Unangemessener Inhalt"
    });
  }

  const { data, error } = await (client.from("forum_dozent") as any)
    .insert({
      dozentID,
      nutzerID: userId,
      thema: cleanThema
    })
    .select("*, profile(name, avatar)")
    .single();

  if (error) {
    console.error("Forum-Dozent Insert Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Beitrag konnte nicht gespeichert werden"
    });
  }

  return { beitrag: data };
});