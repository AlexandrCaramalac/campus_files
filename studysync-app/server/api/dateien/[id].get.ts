import { serverSupabaseClient } from "#supabase/server"

/**
 * returns all files for a specific course
 */
export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const dozentID = getQuery(event).dozentID;

  // @ts-ignore
  let query = client.from("dateien").select("*, profile(name)").eq("kursID", event.context.params.id);
  if (dozentID) query = query.eq("dozentID", Number(dozentID));
  const { data } = await query;
  
  // @ts-ignore
  data?.sort((a, b) => b.jahr - a.jahr);

  return {dateien: data};
})