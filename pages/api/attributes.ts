// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as models from "../../src/models";
import "../../src/db";

const randomStr = (length = 8) => {
  // Declare all characters
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Pick characers randomly
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case "DELETE":
      await models.AttributeModel.deleteMany({});
      res.status(200).json({ message: "success" });
      break;
    case "POST":
      if (req.query.random) {
        for (let i = 0; i < 30; i++) {
          const r = Math.random() * 3;
          const t = models.attributeTypes[Math.floor(r)];
          const n = "rand_" + randomStr();
          await models.AttributeModel.create({
            name: n,
            type: t,
          });
        }
        res.status(200).json({ message: "success" });
      } else {
        Math.round(Math.random() * 3);
        await models.AttributeModel.create(req.body);
        res.status(200).json({ message: "success" });
      }
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
