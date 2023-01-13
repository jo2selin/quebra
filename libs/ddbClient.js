// Create service client module using ES6 syntax.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// Set the AWS Region.
// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
export { ddbClient };
