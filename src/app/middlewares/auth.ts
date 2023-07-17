import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../errors/apiError";
import httpStatus from "http-status";
import { verifyToken } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";

export const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "Please provide authorized token"
        );
      }
      // verify token
      let verifiedUser = null;

      verifiedUser = verifyToken(token, config.jwt.secret as Secret);

      req.user = verifiedUser; // _id, role, phoneNumber

      // role diye guard korar jnno
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
