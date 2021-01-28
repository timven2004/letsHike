import { Request, Response, NextFunction } from "express"
import { client } from "../main"

// Check User is login
export const checkSession = (req: Request, res: Response, next: NextFunction) => {
    if (req.session["user_id"]) {
        next()
    } else res.redirect("/login.html")
}

export const checkEventOrganizer = async (req: Request, res: Response, next: NextFunction) => {
    const event_id = req.query.id
    const user_id = req.session["user_id"]
    const organizer = (await client.query(`
        SELECT organizer FROM event 
        WHERE id = $1 
    `, [event_id])).rows[0].organizer
    if (organizer === user_id) {
        next()
        return
    }
    res.json("??")
}