import express from 'express'
import type {Request,Response} from 'express'
import multer from 'multer'
import cors from 'cors'

const app=express()
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file.fieldname==='avatar'){
            cb(null,'avatar/')
        }else if(file.fieldname==='resume'){
            cb(null,'resume/')
        }else{
            cb(new Error('Invalid fieldName'),'uploads/')
        }
    },
    filename:(req,file,cb)=>{
        cb(null,`${file.fieldname}-${Date.now()}-${file.originalname}`)
    }
})
const upload=multer({
    dest:'uploads/',
    fileFilter:(req:Request,file,cb)=>{
        const acceptedTypes=['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if(acceptedTypes.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error('Only images are accepted'))
        }
    },
    limits:{
        fileSize:1024*1024
    },
    storage:storage
})

app.use('/uploads',express.static('uploads'))
app.use(cors())
app.post(
    '/upload',
    upload.fields([
        {name:'avatar',maxCount:1},
        {name:'resume',maxCount:1}
    ]),
    (req:Request,res:Response)=>{
        res.json({message:'uploaded'})
    }
);

app.listen(8000,()=>console.log('Server listening on port 8000'))