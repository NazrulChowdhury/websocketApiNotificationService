import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { DynamoDB } from "aws-sdk"

const dbClient = new DynamoDB.DocumentClient({
    region: process.env.AWS_REGION
})
const primaryKey = process.env.PRIMARY_KEY
const tableName = process.env.TABLE_NAME

export const handler = async(event : APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    const result : APIGatewayProxyResult = {
        statusCode : 200,
        body : ''
    }
    try{
        await dbClient.put({
            TableName : tableName!,
            Item : {
                primaryKey : event.requestContext.connectionId
            }
        }).promise()
        result.body = 'Connected' 

    } catch(error ){
        result.statusCode = 500
        result.body = 'Failed to connect: ' + JSON.stringify(error)  
    }
    return result
}