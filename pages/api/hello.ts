// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import 'dotenv/config'
import mongoose from 'mongoose';
import {
  databaseHost,
  databaseName,
  databasePort,
} from '../../src/config';
import * as models from  '../../src/models';


// Build the connection string
let dbURI = `mongodb://${databaseHost}:${databasePort}/${databaseName}`;


mongoose.connect(dbURI).then(() => {
    console.info('Initialization complete');
  })
  .catch((err) => {
    console.info('Connection with MongoDB error');
    console.error(err);
  });

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  console.info('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.error('Mongoose default connection error: ' + err);
});





type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  //models.AttributeModel.create({name:'expiry date2'+Math.random(),type:'DATE'});
  let att= await models.AttributeModel.find({}).exec();
  await models.AssignedAttributeModel.create({attribute:att[0]._id,attributeValue:new Date()});
  res.status(200).json(att)
}
