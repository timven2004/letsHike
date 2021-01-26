import express from "express"
import { client } from "../main"

export const hikeTrails = express.Router()

hikeTrails.get('/9hiketrails/api/index', async (req,res)=>{
    
    try{    const images = await client.query(`
    SELECT * FROM image_hiking_trail
    JOIN hiking_trail
    ON image_hiking_trail.id = hiking_trail.id
    `)
    res.json(images.rows);
} catch (e){
    console.log(e)
}

})

hikeTrails.get('/9hiketrails/intro/:id', async (req,res)=>{
    try{const data = await client.query(`
    SELECT * FROM hiking_trail 
    JOIN image_hiking_trail
    ON hiking_trail.id=$1
    WHERE image_hiking_trail.hiking_trail_id=$1
    `,[req.params.id])

res.json(data["rows"]);}

catch (e){
    console.log(e)
}
})