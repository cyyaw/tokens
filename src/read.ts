import {Response, GetTokenParams, checkToken} from "./utils";
import {APIGatewayEvent} from "aws-lambda";
import {ddbDocClient} from "./ddbDocClient";
import {GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";
import {GetItemCommand} from "@aws-sdk/client-dynamodb";
import {APIGatewayProxyEventQueryStringParameters} from "aws-lambda/trigger/api-gateway-proxy";



export const read = async (event:APIGatewayEvent) => {
    let response:Response = {} as Response;

    const tokenParams : APIGatewayProxyEventQueryStringParameters = event['queryStringParameters']||{};

    if(!checkToken(tokenParams.token||'')){
        return {
            statusCode: 400,
            body: {
                message: 'Invalid token'
            }
        }
    }



    const params = {
        TableName: 'tokens',
        Key: {"token": tokenParams.token},
        "ProjectionExpression": "card_number, expiration_month, expiration_year, email"
    };

    try {
        const data =await ddbDocClient.send(new GetCommand(params))
        response = {
            statusCode: Object.keys(data["Item"]||{}).length===4?200:204,
            body: data["Item"]


        }


    } catch (err) {

        response = {
            statusCode: 500,
            body: err
        }
    }


    return response;
};