import { serverSupabaseClient } from "#supabase/server"

/**
 * returns all data for a specfic lecturer, including their ratings and the courses they teach
 * courses are sorted by name
 */
export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  // returns all data from the lecturer with the specified id
  // @ts-ignore 
  const { data: data_lecturer } = await client.from("dozent").select("*").eq("id", event.context.params.id).single();

  // returns all ratings for the lecturer with the specified id using the sql query I defined in supabase
  // @ts-ignore
  const { data: data_ratings } = await client.rpc("get_dozent_ratings", { p_dozent_id: event.context.params.id }).single();

  // returns all courses taught by the lecturer with the specified id using a join query
  // @ts-ignore
  const { data: data_courses_unmapped } = await client
  .from("unterrichtet")
  .select(`
    kurs (
      name
    )
  `)
  // @ts-ignore
  .eq("dozentID", event.context.params.id);

  // maps the data to only include the course names
  // @ts-ignore
  const data_courses = data_courses_unmapped.map(e => e.kurs.name).sort();

  return {dozent: data_lecturer, bewertungen: data_ratings, kurse: data_courses};
})