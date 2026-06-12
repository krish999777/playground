import express from 'express'
import multer from 'multer'
import cors from 'cors'
import dotenv from 'dotenv'
import {v2 as cloudinary} from 'cloudinary'
import { copyFile } from 'node:fs/promises'

const app=express()
dotenv.config()

const cloud_name=process.env.CLOUD_NAME
const api_key=process.env.API_KEY
const api_secret=process.env.API_SECRET
if(!cloud_name||!api_key||!api_secret){
    console.log('.env variables missing')
    process.exit(1)
}
cloudinary.config({
    cloud_name,api_key,api_secret
})

const storage=multer.memoryStorage()

const upload=multer({
    storage
})

app.use(cors())
app.use(express.json())
app.post('/upload',upload.single('photo'),async (req,res)=>{
    try{

        const uploadResult:any=await new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream((error,result)=>{
                if(error){
                    return reject(error)
                }
                return resolve(result)
            }).end(req.file?.buffer)
        })
        console.log(uploadResult)
        res.status(200).json({url:uploadResult.secure_url,publicId:uploadResult.public_id})
    }catch(err){
        return res.status(500).json({error:'Internal Server error'})
    }
})

app.post('/delete',async (req,res)=>{
    const id=req.body.id
    const result=await cloudinary.uploader.destroy(id)
    console.log(result)
    res.status(200).json({message:"Delete successful"})
})

app.listen(8000,()=>console.log('Server listening on port 8000'))