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
  const forumID = Number(body.forumID);
  let kommentar = String(body.kommentar ?? "");

  if (!forumID || !kommentar.trim()) {
    throw createError({ statusCode: 400, statusMessage: "Fehlende Daten" });
  }

  // 1) Länge prüfen
  if (kommentar.length > 1000) {
    throw createError({
      statusCode: 400,
      statusMessage: "Kommentar zu lang"
    });
  }

  // 2) HTML entfernen
  const cleanKommentar = sanitizeHtml(kommentar.trim(), {
    allowedTags: [],
    allowedAttributes: {}
  });

  // 3) Schimpfwortfilter
  const bannedWords = ["idiot", "arsch", "fuck"];

  const normalized = cleanKommentar
    .toLowerCase()
    .replace(/[^a-zA-Zäöüß0-9 ]/g, "");

  const containsBadWord = bannedWords.some(word =>
    normalized.includes(word)
  );

  if (containsBadWord) {
    throw createError({
      statusCode: 400,
      statusMessage: "Unangemessener Kommentar"
    });
  }

  const { data, error } = await (client.from("kommentar_dozent") as any)
    .insert({
      forumID,
      nutzerID: userId,
      kommentar: cleanKommentar
    })
    .select("*, profile(name, avatar)")
    .single();

  if (error) {
    console.error("Kommentar-Dozent Insert Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Kommentar konnte nicht gespeichert werden"
    });
  }

  return { kommentar: data };
});