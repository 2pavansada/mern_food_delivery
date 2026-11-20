import express from "express";
import authMiddleware from './../middleware/auth.js';
import { 
    placeOrder, 
    verifyOrder, 
    userOrders, 
    trackOrder, 
    listOrders, 
    updateStatus, 
    getAllowedStatuses 
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/track/:orderId", authMiddleware, trackOrder);
orderRouter.get('/list', listOrders);
orderRouter.post('/status', updateStatus);
orderRouter.get('/allowed-status/:orderId', getAllowedStatuses);

export default orderRouter;
