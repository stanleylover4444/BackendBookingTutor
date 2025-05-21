import { body } from "express-validator";

export const customerRegisterValidator = [
  body("username")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Username không được để trống"),

  body("fullName")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Full name không được để trống"),

  body("phoneNumber")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Phone number không được để trống")
    .matches(/^(07|08|09|03|05)\d{8}$/)
    .withMessage(
      "Phone number phải bắt đầu bằng 07, 08, 09, 03, hoặc 05 và có độ dài 10 ký tự"
    ),

  body("email").isEmail().normalizeEmail().withMessage("Email không hợp lệ"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password phải có ít nhất 8 ký tự"),
];

export const customerLoginValidator = [
  body("username")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Username không được để trống"),
  body("password")
    .isString()
    .notEmpty()
    .withMessage("Password không được để trống"),
];
