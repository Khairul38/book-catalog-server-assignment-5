import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import {
  IAdmin,
  ILoginAdminResponse,
  IRefreshTokenAdminResponse,
} from "./admin.interface";
import httpStatus from "http-status";
import {
  createAdminToDB,
  loginAdminFromDB,
  refreshTokenAdminFromDB,
  getAdminProfileFromDB,
  updateAdminProfileToDB,
} from "./admin.service";
import config from "../../../config";

export const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...adminData } = req.body;

  const result = await createAdminToDB(adminData);

  sendResponse<IAdmin>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin created successfully",
    data: result,
  });
});

export const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await loginAdminFromDB(loginData);
  const { refreshToken, ...others } = result;

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<ILoginAdminResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin logged in successfully !",
    data: others,
  });
});

export const getAdminProfile = catchAsync(
  async (req: Request, res: Response) => {
    const admin = req.user;

    const result = await getAdminProfileFromDB(admin);

    sendResponse<IAdmin>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admin information retrieved successfully",
      data: result,
    });
  }
);

export const updateAdminProfile = catchAsync(
  async (req: Request, res: Response) => {
    const admin = req.user;
    const updatedData = req.body;

    const result = await updateAdminProfileToDB(admin, updatedData);

    sendResponse<IAdmin>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admin updated successfully",
      data: result,
    });
  }
);

export const refreshTokenAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await refreshTokenAdminFromDB(refreshToken);

    // set refresh token into cookie
    const cookieOptions = {
      secure: config.env === "production",
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    sendResponse<IRefreshTokenAdminResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New admin access token generated successfully !",
      data: result,
    });
  }
);
