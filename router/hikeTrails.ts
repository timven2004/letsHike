import express from "express"
import { client } from "../main"

export const hikeTrails = express.Router()

hikeTrails.get('/9hiketrails/api/index', async (req,res)=>{
    const images = await client.query(`
    SELECT * FROM image_hiking_trail
    `)
    res.json(images.rows);
})

hikeTrails.get('/9hiketrails/intro/:id', async (req,res)=>{
    const data = await client.query(`
    SELECT * FROM hiking_trail 
    WHERE id=$1
    `,[req.params.id])

res.json(data["rows"]);
})