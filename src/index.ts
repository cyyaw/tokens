import {Context, APIGatewayProxyCallback, APIGatewayEvent, APIGatewayProxyResult} from 'aws-lambda';
import {isValid } from 'luhn-js';
import ShortUniqueId from 'short-unique-id';
import {CardInfo, checkBearerToken, Response} from "./utils";
import {create} from "./create";
import {read} from "./read";


export const handler =  async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback): Promise<void> => {

    const result =  await TokensFunction (event).then((result) => {
        callback(null, result);

    });




}



function unauthorized() {
    return {
        statusCode: 401,
        body: JSON.stringify({
            message: 'Unauthorized'
        })
    };
}

async function TokensFunction(event: APIGatewayEvent): Promise<any>  {



    let body;
    let statusCode = 200;
    const headers = {
        'Content-Type': 'application/json',
    }

    if(event.rawPath === '/tokens') {

        const authorization = event.headers.authorization || '';
        if(authorization.indexOf('Bearer ')===0){
            const bearer_token = authorization.substring(7);

            if(!checkBearerToken(bearer_token)){
                return unauthorized();
            }
        }else{

            return unauthorized();
        }


        let response:Response = {} as Response;

        try {
            switch (event.requestContext.http.method) {
                case 'GET':
                    response = await read(event);
                    body = response.body
                    statusCode = response.statusCode;
                    break;
                case 'POST':
                    response = await create(event.body||'{}');
                    body = response.body
                    statusCode = response.statusCode;
                    break;
            }
        } catch (err: any) {
            statusCode = 400;
            body = err.message;
        } finally {
            body = JSON.stringify(body);
        }







    }else{

            statusCode= 404;


    }



    return {
        statusCode: statusCode,
        body:body||'{}',
        headers:headers,
    };
}
