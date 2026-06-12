/**
 * deletes a file from both the database table and the bucket if the file belongs to the given user
 */
import { serverSupabaseClient, serverSupabaseServiceRole } from "#supabase/server"
import { getRouterParam } from "h3"

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const serviceClient = serverSupabaseServiceRole(event);
  
  const user = (await client.auth.getUser()).data.user as any;
  const userId = user?.id ?? user?.sub;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: "Nicht autorisiert" });
  }

  const id = Number(getRouterParam(event, "id"));

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Fehlende ID" });
  }

  // normal client for table
  const { data: datei, error: fetchError } = await (client.from("dateien") as any)
    .select("dateipfad")
    .eq("id", id)
    .eq("nutzerID", userId)
    .single();


  // when trying to delete a file that does not belong to the user: throw error and do not continue
  if (fetchError || !datei) {
    throw createError({ statusCode: 404, statusMessage: "Datei nicht gefunden" });
  }

  // secret client for storage
  const { error: storageError } = await serviceClient.storage
    .from("kurs_dateien")
    .remove([datei.dateipfad]);

  if (storageError) {
    throw createError({
      statusCode: 500,
      statusMessage: storageError.message || "Datei konnte nicht gelöscht werden"
    });
  }

  return { success: true };
});