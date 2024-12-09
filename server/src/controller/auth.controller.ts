import { Request, Response } from "express";

const checkAuthRoute = (req: Request, res: Response) => {
  res.status(200).send("Auth Route Working Correct");
};

export { checkAuthRoute };
