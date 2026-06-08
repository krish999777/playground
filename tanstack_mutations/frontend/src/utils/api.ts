import axios from 'axios'

const api=axios.create({
    baseURL:'http://localhost:8000'
})

export async function getTodos(){
    const res=await api.get('/todos')
    return res.data
}
export async function postTodos({title,description}:{title:string,description:string}){
    const res=await api.post('/todos',{
        title,
        description
    })
    return res.data
}
export async function deleteTodo(id:number){
    const res=await api.delete('/todos/'+id)
    return res.data
}