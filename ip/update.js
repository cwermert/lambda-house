'use strict';
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
AWS.config.update({ region: 'us-east-1' });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();

  console.log(typeof event.body);

  const data = (typeof event.body === "string") ? JSON.parse(event.body) : event.body;

  if (typeof data.address !== 'string') {
    console.error('Validation Failed');
    console.log(data);
    callback(new Error('Couldn\'t update IP.'));
    return new Error('Couldn\'t update IP.');
  }

  const params = {
    TableName: process.env.DYNAMODB_IP_TABLE,
    Item: {
      id: uuid.v1(),
      created_at: timestamp,
      address: data.address
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t update IP.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};