import express from 'express'
import dotenv from 'dotenv'
import db from './db.js'
import * as z from 'zod'
import openai from './openai.js'
import {zodResponseFormat} from 'openai/helpers/zod'

dotenv.config()

const app=express()

const responseSchema=z.object({
    success:z.boolean(),
    error:z.string().optional().nullable(),
    query:z.string().optional().nullable()
})

app.get('/',async (req,res)=>{
    const {search:rawSearch}=req.query
    const result=z.string().min(1).trim().safeParse(rawSearch)
    if(!result.success){
        return res.status(400).json({error:"Invalid search query param"})
    }
    const search=result.data
    let messages=[{
        role:'system'as const,
        content:`
        You are a text to SQL converter,
        You have the schema of all the tables,
        You have to create an SQL query to fulfill the users request to search only,
        You must only use SELECT and nothing else,
        You have to respond in a JSON file in the following format:
        {
            success:true||false,
            error:undefined||string,
            query:undefined||string
        }
        If the users query is not related to these tables or asks for things other than search, then keep success field false, query field null and error field as:
        Sorry I am unable to satisfy this query

        If you can make the SQL query then keep the success field true,error field null and query field as the SQL query needed to answers the users question
        Create the SQL query from what the user asks, I have provided an example

        column_name,data_type,is_nullable
        users:
        "id"	"integer"	"NO"
        "name"	"text"	"NO"
        "email"	"text"	"NO"
        "password"	"text"	"NO"
        "role"	"USER-DEFINED"	"NO"
        "profilepublicid"	"text"	"YES"
        "profileurl"	"text"	"NO"

        resumes:
        "id"	"integer"	"NO"
        "userid"	"integer"	"NO"
        "title"	"text"	"NO"
        "summary"	"text"	"NO"
        "skills"	"ARRAY"	"YES"
        "linkedin"	"text"	"YES"
        "visibility"	"boolean"	"NO"

        education:
        "id"	"integer"	"NO"
        "resumeid"	"integer"	"NO"
        "institution"	"text"	"NO"
        "degree"	"text"	"YES"
        "enddate"	"timestamp without time zone"	"YES"
        "startdate"	"timestamp without time zone"	"NO"

        experience:
        "id"	"integer"	"NO"
        "resumeid"	"integer"	"NO"
        "company"	"text"	"NO"
        "role"	"text"	"NO"
        "startdate"	"timestamp without time zone"	"NO"
        "enddate"	"timestamp without time zone"	"YES"

        projects:
        "id"	"integer"	"NO"
        "resumeid"	"integer"	"NO"
        "name"	"text"	"NO"
        "description"	"text"	"NO"
        "sourcecode"	"text"	"YES"
        "deployedlink"	"text"	"YES"

        achievements:
        "id"	"integer"	"NO"
        "resumeid"	"integer"	"NO"
        "name"	"text"	"NO"
        "description"	"text"	"NO"


        Relationships:
            - resumes.userid → users.id (each resume belongs to one user)
            - education.resumeid → resumes.id
            - experience.resumeid → resumes.id
            - projects.resumeid → resumes.id
            - achievements.resumeid → resumes.id
        `
    },{
        role:'user' as const,
        content:'How many users exist'
    },{
        role:'assistant' as const,
        content:`{
            "success":true,
            "error":null,
            "query":"SELECT COUNT(*) FROM users"
        }`
    },{
        role:'user' as const,
        content:'How many users have resumes'
    },{
        role:'assistant' as const,
        content:`{
            "success":true,
            "error":null,
            "query":"SELECT COUNT(*) FROM resumes"
        }`
    },{
        role:'user' as const,
        content:'Which user has the most skills listed'
    },{
        role:'assistant' as const,
        content:`{
            "success":true,
            "error":null,
            "query":"SELECT u.id, u.name, cardinality(r.skills) AS skill_count FROM users u JOIN resumes r ON r.userid = u.id ORDER BY skill_count DESC LIMIT 1"
        }`
    },{
        role:'user' as const,
        content:'Delete all users who never logged in'
    },{
        role:'assistant' as const,
        content:`{
            "success":false,
            "error":"Sorry I am unable to satisfy this query",
            "query":null
        }`
    },{
        role:'user' as const,
        content:'List the top 3 institutions with most recent graduates'
    },{
        role:'assistant' as const,
        content:`{
            "success":true,
            "error":null,
            "query":"SELECT institution, COUNT(*) AS grad_count FROM education WHERE enddate IS NOT NULL GROUP BY institution ORDER BY grad_count DESC LIMIT 3"
        }`
    },{
        role:'user' as const,
        content:'Find users whose resumes are not visible'
    },{
        role:'assistant' as const,
        content:`{
            "success":true,
            "error":null,
            "query":"SELECT u.name, u.email FROM users u JOIN resumes r ON r.userid = u.id WHERE r.visibility = false"
        }`
    },{
        role:'user' as const,
        content:'What is the average number of experience entries per resume'
    },{
        role:'assistant' as const,
        content:`{
            "success":true,
            "error":null,
            "query":"SELECT AVG(exp_count) FROM (SELECT resumeid, COUNT(*) AS exp_count FROM experience GROUP BY resumeid) sub"
        }`
    },{
        role:'user' as const,
        content:'Update all resumes to be visible'
    },{
        role:'assistant' as const,
        content:`{
            "success":false,
            "error":"Sorry I am unable to satisfy this query",
            "query":null
        }`
    },{
        role:'user' as const,
        content:search
    }]
    try{
        const response=await openai.chat.completions.create({
            model:'lfm2.5:8b',
            messages,
            response_format:zodResponseFormat(responseSchema,'query'),
            temperature:0
        })
        const data=response.choices[0]?.message.content
        console.log(data)
    }catch(err:any){
        console.log(err.message)
        return res.status(500).json({error:"Internal server error"})
    }
})

const PORT=process.env.PORT||8000

app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))