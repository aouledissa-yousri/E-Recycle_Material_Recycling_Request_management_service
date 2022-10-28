import { RecycleRequestController } from "./RecycleRequestController" 
import express from "express" 

let recycleRequestControllerRoutes = express.Router()

//put your routes here

    
recycleRequestControllerRoutes.get("/getRecycleRequests", (request, response) => RecycleRequestController.getRecycleRequests(request.headers.token).then(recycleRequests => response.send(recycleRequests)))
recycleRequestControllerRoutes.post("/makeRecycleRequest", (request, response) => RecycleRequestController.makeRecycleRequest(request.body.headers["Token"], request.body.data).then(result => response.send(result)))
recycleRequestControllerRoutes.delete("/withdrawRecycleRequest", (request, response) => RecycleRequestController.withdrawRecycleRequest(request.headers.token, request.body).then(result => response.send(result)))

export { recycleRequestControllerRoutes }