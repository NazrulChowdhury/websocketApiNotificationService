import { Stack } from "aws-cdk-lib"
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway"
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb"
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { join } from "path"

export interface TableProps {
    tableName : string,
    primaryKey : string,
    connectLambdaPath ?: string,
    disconnectLambdaPath ?: string,
    onMessageLambdaPath ?: string
}
export class GenericTable {
    private stack : Stack
    private table : Table
    private props : TableProps
    private connectLambda : NodejsFunction | undefined
    private disconnectLambda : NodejsFunction | undefined
    private onMessageLambda : NodejsFunction | undefined
    public connectLambdaIntegration : LambdaIntegration
    public disconnectLambdaIntegration : LambdaIntegration
    public onMessageLambdaIntegration : LambdaIntegration

    public constructor(stack : Stack, props : TableProps){
        this.stack = stack,
        this.props = props,
        this.initialize()
    }
    private initialize(){
        this.createTable()
        this.createLambdas()
        this.grantTableRights()
    }
    private createTable(){
        this.table = new Table(this.stack, this.props.tableName, {
            partitionKey : {
                name : this.props.primaryKey,
                type : AttributeType.STRING
            },
            tableName : this.props.tableName
        })
    }
    private createNewLambda(lambdaName : string){
        return new NodejsFunction(this.stack, lambdaName, {
            entry : (join(__dirname, '..', 'services', `${lambdaName}.ts`)),
            handler : 'handler',
            functionName : lambdaName,
            environment : {
                PRIMARY_KEY : this.props.primaryKey,
                TABLE_NAME : this.props.tableName
            }
        })
    }
    private createLambdas(){
        if(this.props.connectLambdaPath){
            this.connectLambda = this.createNewLambda(this.props.connectLambdaPath)
            this.connectLambdaIntegration = new LambdaIntegration(this.connectLambda)
        }
        if(this.props.disconnectLambdaPath) {
            this.disconnectLambda = this.createNewLambda(this.props.disconnectLambdaPath)
            this.disconnectLambdaIntegration = new LambdaIntegration(this.disconnectLambda)
        }
        if(this.props.onMessageLambdaPath){
            this.onMessageLambda = this.createNewLambda(this.props.onMessageLambdaPath)
            this.onMessageLambdaIntegration = new LambdaIntegration(this.onMessageLambda)
        }
    }
    private grantTableRights (){
        if(this.connectLambda){
            this.table.grantReadWriteData(this.connectLambda)
        }
        if(this.disconnectLambda){
            this.table.grantReadWriteData(this.disconnectLambda)
        }
        if(this.onMessageLambda){
            this.table.grantReadWriteData(this.onMessageLambda)
        }
    }
}