import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

const SECRET_KEY: string = process.env.SECRET_KEY || " "

export const authTokenVerification = async (req: Request, res: Response, next: NextFunction): Promise<any | undefined> => {
  try {
    let token = req.signedCookies.authtoken;
    // console.log("auth token: ", token)
    if (!token) {
      return res.status(401).json({
        errors: [{ msg: "Unauthorized request! Token not found.", path: "unauthorized" }],
      });
    }

    const decoded = jwt.verify(token, SECRET_KEY );
    if (!decoded) {
      return res.status(401).json({
        errors: [{ msg: "Unauthorized request! Invalid token.", path: "unauthorized" }],
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      errors: [{ msg: "Unauthorized request! Invalid or expired token.", path: "unauthorized" }],
    });
  }
}
