// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../src/models";
import "../../src/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case "POST":
      await models.AttributeModel.create(req.body);
      res.status(200).json({ message: "success" });
      break;
    case "GET":
      if (req.query.count) {
        let count = await models.AttributeModel.count({}).exec();
        res.status(200).json(count);
      } else {
        let attrib = await models.AttributeModel.find({}).exec();
        res.status(200).json(attrib);
      }
      break;
    default:
      res.status(400).json({ message: "unkwon method" });
  }
}
