import { serverSupabaseClient } from "#supabase/server"

// not yet implemented, version from fruits, will be adapted to current project later on
export default eventHandler(async (event) => {

  const client = await serverSupabaseClient(event);
  const body = await readBody(event) 

  const { data, error } = await client
    .from('fruits')
    .insert([
      { name: body.name, color: body.color },
    ])
    .select()
  console.log(error)
  return {body};
})