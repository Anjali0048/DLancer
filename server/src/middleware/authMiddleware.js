var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY || " ";
export const authTokenVerification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.signedCookies.authtoken;
        // console.log("auth token: ", token)
        if (!token) {
            return res.status(401).json({
                errors: [{ msg: "Unauthorized request! Token not found.", path: "unauthorized" }],
            });
        }
        const decoded = jwt.verify(token, SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                errors: [{ msg: "Unauthorized request! Invalid token.", path: "unauthorized" }],
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            errors: [{ msg: "Unauthorized request! Invalid or expired token.", path: "unauthorized" }],
        });
    }
});
