import { serverSupabaseClient } from "#supabase/server"

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const id = getRouterParam(event, 'id');

  if (!id) {
    return;
  }

  const { data } = await client.from("fruits").select("*").eq('id', id).single();

  return {fruits: data};
})