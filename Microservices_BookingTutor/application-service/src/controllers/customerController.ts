import { Customer } from "../models/customerModel";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

const getCustomers = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.find().select("-password");
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi sever",
    });
  }
};

const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const updateData: any = { ...req.body };

    // Nếu có field password thì hash lại
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      updateData,
      { new: true }
    );

    if (!updatedCustomer) {
       res.status(404).json({ message: "Customer not found", customerId });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error,
    });
  }
};




export { getCustomers, updateCustomer };
