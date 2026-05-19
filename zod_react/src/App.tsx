import type {SubmitEvent} from 'react'
import {useState} from 'react'
import * as z from 'zod'
export default function(){
  const [validationError,setValidationError]=useState<string[]>([])
  
  const formSchema=z.object({
    name:z.string().trim().min(3,"Name must be atleast 3 characters"),
    email:z.email(`Invalid email`),
    password: z.string().min(8, "Password must be at least 8 characters")
  }).refine(
    data=>data.password!==data.name,
    {message:"Password cannot be same as name"}
  )
  function handleSubmit(e:SubmitEvent){
    setValidationError([])
    e.preventDefault()
    const form:HTMLFormElement=e.target
    const formData=new FormData(form)
    const data={
     name:formData.get('name'),
     email:formData.get('email'),
     password:formData.get('password')
    }
    const result=formSchema.safeParse(data)
    if(!result.success){
      setValidationError(result.error.issues.map(issue=>issue.message))
      return
    }
    console.log(result.data)
  }
  return(
    <>
    {<div>{validationError.map((err,index)=><div key={index}>{err}</div>)}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" required/>
        <input type="email" name="email" required/>
        <input type="password" name="password" required/>
        <button>Submit</button>
      </form>
    </>
  )
}