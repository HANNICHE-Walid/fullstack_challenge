// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../src/models";
import "../../src/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case "DELETE":
      await models.AssignedAttributeModel.deleteMany({});
      res.status(200).json({ message: "success" });
      break;
    case "POST":
      let n = await models.AssignedAttributeModel.create(req.body);
      res.status(200).json(n._id);
      break;
    case "PUT":
      let a = await models.AssignedAttributeModel.findByIdAndUpdate(
        req.query.id,
        req.body
      );
      res.status(200).json(a);
      break;
    case "GET":
      let attrib = await models.AssignedAttributeModel.findById(
        req.query.id
      ).exec();
      res.status(200).json(attrib);
      break;
    default:
      res.status(400).json({ message: "unkwon method" });
  }
}
