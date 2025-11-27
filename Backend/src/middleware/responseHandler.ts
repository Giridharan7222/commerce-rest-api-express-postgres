import { Request, Response, NextFunction } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: string;
  };
}

export interface ExtendedResponse extends Response {
  success<T>(message: string, data?: T, statusCode?: number): this;
  fail(
    message: string,
    code?: string,
    details?: string,
    statusCode?: number,
  ): this;
}

export const responseHandler = (
  req: Request,
  res: ExtendedResponse,
  next: NextFunction,
) => {
  res.success = function <T>(
    message: string,
    data?: T,
    statusCode: number = 200,
  ) {
    const responseBody: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return this.status(statusCode).json(responseBody);
  };

  res.fail = function (
    message: string,
    code: string = "BAD_REQUEST",
    details: string = "",
    statusCode: number = 400,
  ) {
    const responseBody: ApiResponse = {
      success: false,
      message,
      error: { code, details },
    };
    return this.status(statusCode).json(responseBody);
  };

  next();
};
