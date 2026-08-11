import {ChatOllama} from '@langchain/ollama'
import multer from 'multer'
import express from 'express'

const model=new ChatOllama('minicpm-v4.5:8b')

const app=express()

const upload=multer({
    storage:multer.memoryStorage(),
    fileFilter:(req,file,cb)=>{
        const acceptedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        ];
        if(acceptedTypes.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error('Only images accepted'))
        }
    }
})

app.post('/image',upload.single('image'),async (req,res)=>{
    const data=req.file?.buffer.toString('base64')
    const resp=await model.invoke([
        {type:'system',content:'You will be provided with an image of a road. Identify how crowded the road is, how many vehicles there are, and categorize them.'},
        {type:'human',content:[
            {type:'image_url',image_url:`data:${req.file?.mimetype};base64,${data}`}
        ]}
    ])
    console.log(resp.content)
})

app.listen(8000,()=>console.log('Server listening on port 8000'))