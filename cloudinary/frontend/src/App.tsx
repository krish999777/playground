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
    async function handleDelete(e:any){
        e.preventDefault()
        const form=e.target
        const formData=new FormData(form)
        const id=formData.get('id')
        const res=await fetch('http://localhost:8000/delete',{
            method:'POST',
            headers:{"Content-Type":'application/json'},
            body:JSON.stringify({id})
        })
        const data=await res.json()
        console.log(data)
    }
    return(
        <>
            <form onSubmit={handleSubmit}>
                <input type="file" name="photo"/>
                <button>Submit</button>
            </form>
            <form onSubmit={handleDelete}>
                <input type="text" name="id"/>
                <button>Submit</button>
            </form>
        </>
    )
}