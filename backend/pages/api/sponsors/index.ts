import { NextApiRequest, NextApiResponse } from "next";
import { connectMongo } from "../../../lib/mongoose";
import { Sponsor } from "../../../models/Sponsor";
import { ok, badRequest, serverError, unauthorized, forbidden, created } from "../../../lib/response";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectMongo();
    if (req.method === "GET") {
      const list = await (Sponsor as any).find({} as any).sort({ tier: 1, name: 1 });
      return ok(res, list);
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session) return unauthorized(res);
    const role = (session.user as any)?.role;
    if (role !== "ORGANIZER") return forbidden(res);

    if (req.method === "POST") {
      const { name, tier, logoUrl, websiteUrl, description } = req.body as any;
      if (!name || !tier || !logoUrl || !websiteUrl) return badRequest(res, "Missing fields");
      const createdSponsor = await (Sponsor as any).create({ name, tier, logoUrl, websiteUrl, description } as any);
      return created(res, createdSponsor);
    }

    if (req.method === "PUT") {
      const { id, ...updates } = req.body as any;
      if (!id) return badRequest(res, "Missing id");
      const updated = await (Sponsor as any).findByIdAndUpdate(id as any, updates as any, { new: true } as any);
      return ok(res, updated);
    }

    if (req.method === "DELETE") {
      const { id } = req.query as any;
      if (!id) return badRequest(res, "Missing id");
      await (Sponsor as any).findByIdAndDelete(id as any);
      return ok(res, { deleted: true });
    }

    return badRequest(res, "Method not allowed");
  } catch (error) {
    return serverError(res, error);
  }
}


