import { Request, Response } from "express";
import { EditVendorInputs, VendorLoginInputs } from "../dto";
import { Vendor } from "../models/Vendor";
import { generateSignature } from "../utils";
import { findVendor } from "./AdminController";

/**
 * Business Logic: Authenticate and Log Vendor into System
 * @req {string} contains incoming registered email and password
 * @res {string} authenticated vendor id else error
 * @return {ObjectId} Status code 200 and the vendor generated ID
 */
export const vendorLogin = async (req:Request, res:Response) => {
  const { email, password } = <VendorLoginInputs>req.body;
  if (!email) {
    return res.status(400).json({ error: 'Missing Email' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Missing Password' });
  }
  try {
    const user = await Vendor.authLogin(email, password);
    const signature = generateSignature({
      _id: user._id,
      email: user.email,
      productType: user.productType,
      name: user.name
    });

    return res.status(200).json(signature);
  } catch (err) {
    return res.status(404).json({ error: err });
  }
}

/**
 * Business Logic: Lets authorised users access the Vendor Profile
 * @req {Object} contains authenticated user payload from vendorPayload interface
 * @res {Object} a JSON object containing vendor information
 * @return {Object} Status code 200 and Vendor Profile JSON Object
 */
export const getVendorProfile = async (req: Request, res: Response) => {
  const user = req.user;
  if(user) {
    const existingVendor = await findVendor(user._id);
    return res.json(existingVendor);
  }
  return res.status(400).json({ error: 'Vendor Information Not Found'});
}

/**
 * Business Logic: Authorised Users can change particulars of profile information
 * @req {string} contains items to change
 * @res {Object} a JSON object containing updatedvendor profile information
 * @return {Object} Status code 200 and Vendor updated Profile JSON Object
 */
export const updateVendorProfile = async (req: Request, res: Response) => {
  const { productType, name, address, phone } = <EditVendorInputs>req.body;
  const user = req.user;
  if(user) {
    const existingVendor = await findVendor(user._id);
    if(existingVendor) {
      existingVendor.name = name;
      existingVendor.productType = productType;
      existingVendor.address = address;
      existingVendor.phone = phone
      const updatedResults = await existingVendor.save();
      return res.status(204).json(updatedResults);
    }
    return res.status(404).json({ error: `User: ${user._id} information not updated!` });
  }
  return res.status(400).json({ error: 'Vendor Information Not Found' });
}

export const updateVendorService = async (req: Request, res: Response) => {
  //
}