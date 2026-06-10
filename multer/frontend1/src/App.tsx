export default function App(){
  async function handleSubmit(e:any){
    e.preventDefault()
    const form=e.target
    const formData=new FormData(form)
    const res=await fetch('http://localhost:8000/upload',{
      method:'POST',
      body:formData
    })
    const data=await res.json()
    console.log(data)
  }
  return(
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name"/>
        <input type="file" name="avatar"/>
        <input type="file" name="resume"/>
        <button>Submit</button>
      </form>
    </>
  )
}