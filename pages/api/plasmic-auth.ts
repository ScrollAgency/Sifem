import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { getPlasmicAuthData } from "../../utils/plasmic-auth";

export default async function getPlasmicAuthDataHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabaseServerClient = createPagesServerClient({ req, res });
  res.json(await getPlasmicAuthData(supabaseServerClient));
}
