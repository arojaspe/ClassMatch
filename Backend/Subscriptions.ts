import e, {Request, Response} from "express";
import * as Funcs from "./Functions";
import {MercadoPagoConfig, PreApproval} from "mercadopago";
import * as Models from "./Models";
import dotenv from "dotenv";

dotenv.config();
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN as string;
export const client = new MercadoPagoConfig({accessToken: accessToken});

export const createSubscription = async (req: Request, res: Response) => {
    try {
        const currUser = await Funcs.isLoggedIn(req, res);
        const subscription = await new PreApproval(client).create({
            body: {
                back_url: "http://localhost:5000/api/",
                    reason: "ClassMatch Premium",
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    transaction_amount: 13900,
                    currency_id: "COP",
                },
                status: "pending",
                //notification_url: "https://aca1-200-118-80-60.ngrok-free.app/api/webhook",
            },
        });

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

export const receiveWebhook = async (req: Request, res: Response) => {
    const body: {data: {id: string}; type: string} = req.body;
    console.log(body);

    try {
        if(body.type === "subscription_preapproval" ) {
            const preapproval = await new PreApproval(client).get({id: body.data.id});
            const user = await Models.SUBSCRIPTIONS_MOD.findOne({where: {SUBSCRIPTION_API_ID: body.data.id}});
            const userId = user!.toJSON().USER_ID;
            
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
