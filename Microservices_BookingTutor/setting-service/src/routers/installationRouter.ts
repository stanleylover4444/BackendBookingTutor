import { Router, Request, Response, NextFunction } from "express";
import {
  createInstallation,
  deleteInstallationToken,
} from "../controllers/installationController";

const installationRouter = Router();

installationRouter.post("/createInstallation", (req: Request, res: Response, next: NextFunction) => createInstallation(req, res));
installationRouter.delete("/deleteInstallationToken", (req: Request, res: Response, next: NextFunction) => deleteInstallationToken(req, res));

export default installationRouter;