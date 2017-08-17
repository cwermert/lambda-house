'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.name !== 'string' || typeof data.floor !== 'number') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the room.'));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#room_name': 'name',
      '#room_floor': 'floor'
    },
    ExpressionAttributeValues: {
      ':name': data.name,
      ':floor': data.floor,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #room_name = :name, #room_floor = :floor, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the room in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t update the room.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};