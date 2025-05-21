import express from "express";


import {
  getCustomers,
  updateCustomer,
} from "../controllers/customerController";

const customerRoutes = express.Router();

customerRoutes.get("/", getCustomers);
customerRoutes.put("/:customerId", updateCustomer);

export default customerRoutes;
