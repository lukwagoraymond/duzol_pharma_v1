import express from 'express';

import { customerSignUp, customerLogin, customerVerify, requestOtp, getCustomerProfile, editCustomerProfile, createOrder, getOrders, getOrdersById } from '../controllers';

import { authenticate } from '../middlewares';

const router = express.Router();

/* ------------------ Signup / Create Customer ................... */
router.post('/signup', customerSignUp);
/* ------------------ Login ................... */
router.post('/login', customerLogin);
/* ------------------ Authentication ................... */
router.use(authenticate);
/* ------------------ Verify Customer Account ................... */
router.patch('/verify', customerVerify);
/* ------------------ OTP / request OTP ................... */
router.get('/otp', requestOtp);
/* ------------------ Customer Profile -------------------------- */
router.get('/profile', getCustomerProfile);
router.patch('/profile', editCustomerProfile);
/* ------------------ Order -------------------------- */
router.post('/create-order', createOrder);
router.get('/orders', getOrders);
router.get('/order/:id', getOrdersById);

export { router as CustomerRoute };