'use strict';
const publicIP = require("public-ip");
const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

class IP {

  constructor(db) {
    this.db = db;
    this.save = this.save.bind(this);
    this.get = this.get.bind(this);
  }

  save(address, callback) {
    const ip = {
      address: address,
      created_at: Date.now()
    }

    this.db.saveIP(ip, function (err) {
      if (err) {
        callback(err);
      } else {
        console.log("IP updated.");
        callback();
      }
    });
  }

  get() {
    return publicIP.v4()
      .then(ip => {
        console.log(ip);
        return ip;
      })
      .catch(err => {
        console.log(err);
        return err;
      })
  }
}

module.exports = IP;


// module.exports.updateIP = (event, context, callback) => {
//   const timestamp = new Date().getTime();

//   const data = JSON.parse(event.body);
//   if (typeof data.ip !== 'string') {
//     console.error('Validation Failed');
//     callback(new Error('Couldn\'t update IP.'));
//     return;
//   }

//   const params = {
//     TableName: process.env.DYNAMODB_TABLE,
//     Item: {
//       id: uuid.v1(),
//       created_at: timestamp,
//       ip: data.ip
//     },
//   };

//   // write the todo to the database
//   dynamoDb.put(params, (error) => {
//     // handle potential errors
//     if (error) {
//       console.error(error);
//       callback(new Error('Couldn\'t update IP.'));
//       return;
//     }

//     // create a response
//     const response = {
//       statusCode: 200,
//       body: JSON.stringify(params.Item),
//     };
//     callback(null, response);
//   });
// };

// module.exports.getIP = (event, context, callback) => {
//   dynamoDb.scan(params, (error, result) => {
//     // handle potential errors
//     if (error) {
//       console.error(error);
//       callback(new Error('Couldn\'t fetch the todos.'));
//       return;
//     }

//     // create a response
//     const response = {
//       statusCode: 200,
//       body: JSON.stringify(result.Items),
//     };
//     callback(null, response);
//   });
// };