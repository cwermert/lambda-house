'use strict';

module.exports.get = (event, context, callback) => {
  const timestamp = new Date().getTime();

  // const data = JSON.parse(event.body);
  // 
  const data = event.body;
  if (typeof data.address !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t update IP.'));
    return;
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