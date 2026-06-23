import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import type { SubmitHandler } from 'react-hook-form'
import * as z from 'zod'

const LoginSchema=z.object({
    email:z.email({
        error:"Email must be valid"
    }),
    password:z.string().min(7,{
        error:"Password must be atleast 7 characters"
    })
})
type Inputs=z.infer<typeof LoginSchema>

export default function App(){
  const {register,handleSubmit,formState:{errors}}=useForm<Inputs>({
    resolver:zodResolver(LoginSchema)
  })
  const onSubmit:SubmitHandler<Inputs>=(data)=>console.log(data)
  return(
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')}/>
      <p>{errors.email?errors.email.message:null}</p>
      <input type="password"{...register('password')}/>
      <p>{errors.password?errors.password.message:null}</p>
      <button>Login</button>
    </form>
    </>
  )
}