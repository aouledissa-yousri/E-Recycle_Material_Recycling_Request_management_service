import axios from "axios"
import { HOSTS } from '../../../connectedHosts'
import { KeyError } from "../../errors/KeyError"
import { RecycleRequest } from '../../models/RecycleRequest'
import jwtDecode from 'jwt-decode';
import { GainRecycleCoinsPayload } from '../../payloads/GainRecycleCoinsPayloads';
import { AddMakeRecycleRequestNotification } from '../../payloads/AddMakeRecycleRequestNotification';
import { DateHelper } from '../../helpers/DateHelper';


export abstract class RecycleRequestService {

    public static async getRecycleRequests(token: string){

        const {data, status} = await axios.get<RecycleRequest[]>(
            HOSTS[0]+"/getRecycleRequests/",
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: "application/json",
                    Token: token
                }
            }
        )


        return data

    }

    public static async makeRecycleRequest(token: string, payload: any){

        try{

            let recycleRequest = RecycleRequest.createRecycleRequest(payload)

            const {data, status} = await axios.post(
                HOSTS[0]+"/makeRecycleRequest/",
                recycleRequest.getData(),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: "application/json",
                        Token: token
                    },

                }
            )



            axios.patch(
                HOSTS[1]+"/gainRecycleCoins",
                /*{
                    "id": jwtDecode(token)["id"], 
                    "recycleRequest": recycleRequest.getData()
                },*/

                GainRecycleCoinsPayload.createGainRecycleCoinsPayload(jwtDecode(token)["id"], recycleRequest).getData(),

                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: "application/json",
                        Token: token
                    },

                }
            
            )




                        
            axios.post(
                HOSTS[1]+"/addMakeRecycleRequestNotification",
                AddMakeRecycleRequestNotification.createAddMakeRecycleRequestNotification("New recycle request has been made", DateHelper.getCurrentTimestamp(), false).getData(),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: "application/json",
                        Token: token
                    },

                }
            )


            return data

        }catch(error){

            if(error instanceof KeyError){
                return {"message": "Invalid parameters"}
            }
        }
        

    }

    public static async withdrawRecycleRequest(token: string, payload: any){
        try{

            
            let recycleRequestId = payload["id"]

            const {data, status} = await axios.delete(
                HOSTS[0]+"/withdrawRecycleRequest/",
                
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: "application/json",
                        Token: token
                    },

                    data: {
                        "id": recycleRequestId
                    }
                }
                
            )

            return data

        }catch(error){

            if(error instanceof KeyError){
                return {"message": "Invalid parameters"}
            }

        }
    }

    public static async getAllRecycleRequests(token: string){

        const {data, status} = await axios.get<RecycleRequest[]>(
            HOSTS[0]+"/getAllRecycleRequests/",
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: "application/json",
                    Token: token
                }
            }
        )


        return data

    }

    public static async getValidatedRecycleRequests(token: string){

        const {data, status} = await axios.get<RecycleRequest[]>(
            HOSTS[0]+"/getValidatedRecycleRequests/",
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: "application/json",
                    Token: token
                }
            }
        )


        return data

    }

    public static async validateRecycleRequest(token: string, payload: any){

        try{

            const {data, status} = await axios.patch(
                HOSTS[0]+"/validateRecycleRequest/",
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: "application/json",
                        Token: token
                    },
    
                }
            )
    
            axios.post(
                HOSTS[1]+"/addValidateRecycleRequestNotification",
                {
                    "id": payload["id"],
                    "notification": AddMakeRecycleRequestNotification.createAddMakeRecycleRequestNotification("The garbage you provided has been collected thank you for contributing to environmental protection", DateHelper.getCurrentTimestamp(), false),
                },
                
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: "application/json",
                        Token: token
                    },
    
                }
            )
    
            return data

        }catch(error){
            return {"message": "unknown error"}
        }
    }


    public static async completeRecycleRequest(token: string, payload: any){

        const {data, status} = await axios.patch(
            HOSTS[0]+"/completeRecycleRequest/",
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: "application/json",
                    Token: token
                },

            }
        )

        axios.post(
            HOSTS[1]+"/addCompleteRecycleRequestNotification",
            {
                "id": payload["id"],
                "notification": AddMakeRecycleRequestNotification.createAddMakeRecycleRequestNotification("The garbage you provided has been collected thank you for contributing to environmental protection", DateHelper.getCurrentTimestamp(), false),
            },

            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: "application/json",
                    Token: token
                },

            }
        )

        return data
    }

}