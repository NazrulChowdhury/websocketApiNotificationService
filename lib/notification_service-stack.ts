import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {WebSocketApi, WebSocketStage} from '@aws-cdk/aws-apigatewayv2-alpha'
import { GenericTable } from './GenericTable'

export class NotificationServiceStack extends Stack { 

  private table = new GenericTable(this,{
    tableName : 'userTable',
    primaryKey : 'connectionId',
    connectLambdaPath : 'connect',
    disconnectLambdaPath : 'disconnect',
    // onMessageLambdaPath : 'onMessage',
    // defaultLambdaPath : 'default'
  })
  private webSocketApi = new WebSocketApi(this, 'notificationSocketApi', {
    apiName : 'notificationSocketApi',
    connectRouteOptions : {
      integration : this.table.connectLambdaIntegration
    },
    disconnectRouteOptions : {
      integration : this.table.disconnectLambdaIntegration
    },
    defaultRouteOptions : {
      integration : this.table.defaultLambdaIntegration
    },
     
  })

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
      // add custom route
    this.webSocketApi.addRoute('onMessage',{
      integration : this.table.onMessageLambdaIntegration
    })
    // add stage
    const webSocketApi = this.webSocketApi
    const stage = new WebSocketStage(this, 'WebsocketStage', {
      webSocketApi,
      autoDeploy : true,
      stageName: 'dev',
    })
    const connectionsArns = this.formatArn({
      service: 'execute-api',
      resourceName: `${stage.stageName}/POST/*`,
      resource: this.webSocketApi.apiId,
    })
    // ConnectionManagement On ApiGateway policy. 
    //permission is needed to post messages to connected WebSocket clients.
    this.table.onMessageLambdaAddPolicy('execute-api:ManageConnections', connectionsArns) 
    
  }


}
