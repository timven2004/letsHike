import express from "express"
import { client } from "../main"

export const hikeTrails = express.Router()

hikeTrails.get('/9hiketrails/api/index', async (req,res)=>{
    const images = await client.query(`
    SELECT * FROM image_hiking_trail
    `)
    res.json(images.rows);
})