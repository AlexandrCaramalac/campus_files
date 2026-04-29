import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data } = await client
    .from("kommentar_datei")
    .select("*, profile(name)")
    .eq("dateiID", event.context.params.id)
    .order("created_at", { ascending: false });

  return { kommentare: data ?? [] };
})
