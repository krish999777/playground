import {useState} from 'react'

export default function(){

  const [data,setData]=useState<null|{
    role: string,
    id: number,
    iat: number,
    exp: number
}>(null)
  async function handleLogout(){
    const res=await fetch('http://localhost:8000/logout',{
      method:'POST',
      credentials:'include'
    })
    const data=await res.json()
    console.log(data)
  }

  async function handleSubmit(e:any){
    e.preventDefault()
    const form=e.target
    const formData=new FormData(form)
    const email:any=(formData.get('email'))
    const password:any=(formData.get('password'))
    const res=await fetch('http://localhost:8000/login',{
      credentials:'include',
      method:'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password
      })
    })
    const data=await res.json()
    console.log(data)
  }
  async function getProfile(){
    const res=await fetch('http://localhost:8000/profile',{
      credentials:'include'
    })
    const data=await res.json()
    setData(data)
  }
  return(
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" required={true} name="email"/>
        <input type="text" name="password"/>
        <button>Submit</button>
      </form>
      <button onClick={getProfile}>Get profile</button>
      {data?
      <div>
        <div>{data.id}</div>
        <div>{data.role}</div>
      </div>:null}
      <a href="http://localhost:8000/profile">Backend</a>
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}