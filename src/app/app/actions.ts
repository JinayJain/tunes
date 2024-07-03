"use server";

import { createClient } from "@/supabase/server";
import { ReactFlowJsonObject } from "reactflow";

export async function saveCreation(object: ReactFlowJsonObject) {
  const supabase = createClient();

  const { error } = await supabase.from("creation").insert([
    {
      title: "Untitled",
      content: JSON.stringify(object),
    },
  ]);

  if (error) {
    throw error;
  }
}
