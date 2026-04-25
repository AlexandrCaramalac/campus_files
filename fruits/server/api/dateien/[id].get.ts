import { serverSupabaseClient } from "#supabase/server"

/**
 * returns all files for a specific course
 */
export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data } = await client.from("dateien").select("*").eq("kursID", event.context.params.id);
  
  // @ts-ignore
  data?.sort((a, b) => a.created_at.localeCompare(b.created_at));

  return {dateien: data};
})