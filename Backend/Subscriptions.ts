import e, {Request, Response} from "express";
import * as Funcs from "./Functions";
import {MercadoPagoConfig, PreApproval} from "mercadopago";
import * as Models from "./Models";
import dotenv from "dotenv";
import * as crypto from "crypto";
import {accessToken, secretKey} from "./Connections";


export const client = new MercadoPagoConfig({accessToken: accessToken});


// A premium user will have both the premium plan and the api_id
// A premium user with paused pays will have no premium plan but api_id
// A basic user will have null api_id and basic plan

export const createSubscription = async (req: Request, res: Response) => {
    const userEmail = req.body.email;

    try {
        const currUser = await Funcs.isLoggedIn(req, res);
        const subscription = await new PreApproval(client).create({
            body: {
                back_url: "https://aca1-200-118-80-60.ngrok-free.app/api/",
                    reason: "ClassMatch Premium",
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    transaction_amount: 15900,
                    currency_id: "COP",
                },
                payer_email: userEmail,
                status: "pending",
                //notification_url: "https://aca1-200-118-80-60.ngrok-free.app/api/webhook",
            },
        });

        console.log(subscription);
        console.log(currUser.USER_ID);

        const [updatedRows] = await Models.SUBSCRIPTIONS_MOD.update(
            {SUBSCRIPTION_API_ID : subscription.id, SUBSCRIPTION_PLAN: "Basic"},
            {where: {SUBSCRIPTION_USER: currUser.USER_ID}}
        )
        
        res.status(200).send({
            message: "Subscription confirmation pending",
            data: subscription.init_point!,
        })
    } catch (error: any) {
        res.status(401).json({
            errors: [{
                message: "Error: " + error.message,
                extensions: {
                    code: "Subscriptions.createPlanSubscription"
                }
            }]
        })
    }
}

export const getPlan = async (req: Request, res: Response) => {
    const currUser = await Funcs.isLoggedIn(req, res);

    const subscription = await Models.SUBSCRIPTIONS_MOD.findOne({where: {SUBSCRIPTION_USER: currUser.USER_ID}});
    

    if(subscription) {
        const subscriptionRaw = subscription.toJSON();
        res.status(201).json(
            {
                message: "Plan encontrado",
                data: subscriptionRaw.SUBSCRIPTION_PLAN
            })
    } 
    else {
        res.status(404).json({
            errors: [{
                message: "No existe suscripción con ID: " + currUser.USER_ID,
                extensions: {
                    code: "Subs.getPlan - No user found"
                }
            }]
        })
    }
}

function verifySignature(req: any) {
    const headers = req.headers;

    // Obtain the x-signature value from the header
    const xSignature = headers['x-signature']!; // Assuming headers is an object containing request headers
    const xRequestId = headers['x-request-id']!; // Assuming headers is an object containing request headers

    // Obtain Query params related to the request URL
    const dataID = req.query['data.id'];

    // Separating the x-signature into parts
    const parts = xSignature.split(',');

    // Initializing variables to store ts and hash
    let ts;
    let hash;

    // Iterate over the values to obtain ts and v1
    parts.forEach((part : string) => {
        // Split each part into key and value
        const [key, value] = part.split('=');
        if (key && value) {
            const trimmedKey = key.trim();
            const trimmedValue = value.trim();
            if (trimmedKey === 'ts') {
                ts = trimmedValue;
            } else if (trimmedKey === 'v1') {
                hash = trimmedValue;
            }
        }
    });

    // Generate the manifest string
    const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

    // Create an HMAC signature
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(manifest);

    // Obtain the hash result as a hexadecimal string
    const sha = hmac.digest('hex');

    if (sha === hash) {
        // HMAC verification passed
        return true;
    } else {
        // HMAC verification failed
        return false;
}
}

export const receiveWebhook = async (req: Request, res: Response) => {
    const body: {data: {id: string}; type: string} = req.body;
    console.log(body);

    if (!verifySignature(req)) {
        console.log("Firma no válida, posible ataque.");
        res.status(403).send("Firma no válida");

        return;
    }

    try {
        if(body.type === "subscription_preapproval" ) {
            const preapproval = await new PreApproval(client).get({id: body.data.id});
            const subscription = await Models.SUBSCRIPTIONS_MOD.findOne({where: {SUBSCRIPTION_API_ID: body.data.id}});
            const userId = subscription!.toJSON().SUBSCRIPTION_USER;
            
            if(preapproval.status === "authorized") {
                const [updatedRows] = await Models.SUBSCRIPTIONS_MOD.update(
                    {SUBSCRIPTION_PLAN: "Premium"},
                    {where: {SUBSCRIPTION_USER: userId}}
                )
            }

            if(preapproval.status === "paused") {
                const [updatedRows] = await Models.SUBSCRIPTIONS_MOD.update(
                    {SUBSCRIPTION_PLAN: "Basic"},
                    {where: {SUBSCRIPTION_USER: userId}}
                )
            }

            if(preapproval.status === "cancelled") {
                const [updatedRows] = await Models.SUBSCRIPTIONS_MOD.update(
                    {SUBSCRIPTION_API_ID : null, SUBSCRIPTION_PLAN: "Basic"},
                    {where: {SUBSCRIPTION_USER: userId}}
                )
            }

            res.sendStatus(204);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500);
    }
}
