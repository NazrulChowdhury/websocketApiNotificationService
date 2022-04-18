import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { DynamoDB } from "aws-sdk"

const tableName = process.env.TABLE_NAME
const primaryKey = process.env.PRIMARY_KEY
const db = new DynamoDB.DocumentClient({})

export const handler = async(event : APIGatewayProxyEvent) : Promise <APIGatewayProxyResult>=> {
    const result : APIGatewayProxyResult = {
        statusCode : 200,
        body : ''
    }
    try{
        await db.delete({
            TableName : tableName!,
            Key : {
                primaryKey : event.requestContext.connectionId
            }
        }).promise()
        result.body = 'Disconnected'
    } catch(error){
        result.statusCode = 500,
        result.body = 'Failed to disconnect: ' + JSON.stringify(error)
    }

    return result   
}