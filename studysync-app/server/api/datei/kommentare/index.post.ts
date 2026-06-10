import { serverSupabaseClient } from "#supabase/server"
import { readBody } from "h3"

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = (await client.auth.getUser()).data.user as any;
  const userId = user?.id ?? user?.sub;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Nicht autorisiert" });
  }


  const body = await readBody(event);
  const dateiID = Number(body.dateiID);
  const kommentar = String(body.kommentar ?? "").trim();

  if (!dateiID || !kommentar) {
    throw createError({ statusCode: 400, statusMessage: "Fehlende Daten" });
  }

  if (kommentar.length > 1000) {
    throw createError({ statusCode: 400, statusMessage: "Der Kommentar darf maximal 1000 Zeichen lang sein." });
  }

  const { data, error } = await (client.from("kommentar_datei") as any)
    .insert({ dateiID, nutzerID: userId, kommentar })
    .select("*, profile(name)")
    .single();

  if (error) {
    console.error("Kommentar-Datei Insert Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Kommentar konnte nicht gespeichert werden"
    });
  }

  return { kommentar: data };
})
