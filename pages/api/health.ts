import { NextApiRequest, NextApiResponse } from "next";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface ErrorResponse {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase
      .from("user_roles")
      .select("count(*)", { count: "exact" });

    if (error) throw error;

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      rowCount: data,
    });
  } catch (err) {
    const error = err as Error | ErrorResponse;
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
    });
  }
}
