import { Request, Response, NextFunction } from "express"

export const checkSession = (req: Request, res: Response, next: NextFunction) => {
    if (req.session["user_id"]) {
        next()
    } else res.redirect("/login.html")
}