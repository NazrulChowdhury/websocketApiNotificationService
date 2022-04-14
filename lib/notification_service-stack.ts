import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
//import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha'
import {WebSocketApi} from '@aws-cdk/aws-apigatewayv2-alpha'

export class NotificationServiceStack extends Stack { 

 // const websocketapi = new WebSocketApi(this, 'notificationSocketApi',{})
 // const webSocketApi = new WebSocketApi(this, 'TodosWebsocketApi', { 
//   connectRouteOptions: { integration: new LambdaWebSocketIntegration({ handler: connectHandler }) },
//   disconnectRouteOptions: { integration: new LambdaWebSocketIntegration({ handler: disconnetHandler }) },
// });

// const apiStage = new WebSocketStage(this, 'DevStage', {
//   webSocketApi,
//   stageName: 'dev',
//   autoDeploy: true,
// });
  private webSocketApi = new WebSocketApi(this, 'notificationSocketApi', {})

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
 //const webSocketApi = new WebSocketApi(this, 'webSocketApi',{})

}
