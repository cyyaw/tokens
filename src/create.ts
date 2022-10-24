import {CardInfo, checkEmail, Response} from "./utils";
import {ddbDocClient} from "./ddbDocClient";
import {PutCommand} from "@aws-sdk/lib-dynamodb";
import {isValid} from "luhn-js";
import ShortUniqueId from "short-unique-id";


export const create = async (body: string) => {
    const card_info: CardInfo  = JSON.parse(body||'{}');

    const uid = new ShortUniqueId({length:16});

    const expiration_year_n:number  = Number(card_info.expiration_year);

    const expiration_month_n: number = Number(card_info.expiration_month);


    const current_year  = new Date().getFullYear();

    let response:Response = {} as Response;

    if (card_info.card_number.length>=13&& isValid(card_info.card_number) &&
        (card_info.cvv.length === 3 || card_info.cvv.length === 4) &&
        card_info.expiration_year.length===4 &&
        (card_info.expiration_month.length===2||card_info.expiration_month.length===1) &&
        (expiration_year_n>=current_year && expiration_year_n<=current_year+5) &&
        ((expiration_month_n>=1 && expiration_month_n<=12 )) &&
        checkEmail(card_info.email) ) {

        const data = card_info;
        data.token = uid();
        data.updatedAt = new Date().getTime();
        data.ttl = Math.floor( (new Date().getTime()+(15*60*1000))/1000);




        const params = {
            TableName: 'tokens',
            Item: data
        };

        try {
            await ddbDocClient.send(new PutCommand(params))
            response = {
                statusCode: 200,
                body: {
                    token: data.token
                }
            }


        } catch (err) {

            response = {
                statusCode: 500,
                body: {
                    message: 'Error'
                }
            }
        }

    }else{
       response = {
                statusCode: 400,
                body: {
                    message: 'Bad Request'
                }
            }
    }




    return response;
};
