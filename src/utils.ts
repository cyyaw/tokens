export type CardInfo = {
    card_number: string;
    cvv: string;
    expiration_year: string;
    expiration_month: string;
    email: string;
    id: string;
    updatedAt: number;
    token: string;
    ttl: number;
}

export type Response = {
    statusCode: number;
    body: any;

}

export type GetTokenParams = {
    token: string;
}

export function checkToken(token: string) {
    return token.length === 16 && /^[a-zA-Z0-9]+$/.test(token);
}

export function checkBearerToken(bearer_token: string) {
    return bearer_token.length === 24 && /^[a-zA-Z_]+$/.test(bearer_token) && bearer_token === 'pk_test_LsRBKejzCOEEWOsw';
}

export function checkEmail(email: string): boolean {

    const domains = ["gmail.com","hotmail.com","yahoo.es"];
    let ret = false;
    for(let i=0; i<domains.length; i++){
        if(email.includes(domains[i])){
            ret = true;
            break;
        }

    }

    return email.length<=100 && email.length >= 5 && email.includes("@") && email.includes(".") && ret;
}