import { createClient } from "@/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("creation")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  if (!data) {
    return new Response("Not found", { status: 404 });
  }

  return Response.json(data);
}
