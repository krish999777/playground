import axios from 'axios'

const api=axios.create({
    baseURL:'https://jsonplaceholder.typicode.com'
})

export async function getPosts(){
    try{
        const res=await api.get('/posts')
        return res.data
    }catch(err){
        if (err instanceof Error) {
            throw new Error(err.message); // Now safe to access message
        }else{
            throw new Error('unknown error')
        }
    }
}
export async function postPosts(body:{userId:number,title:string,body:string}){
    try{
        const res=await api.post('/posts',body)
        return res.data
    }catch(err){
        if(err instanceof Error){
            throw new Error(err.message)
        }else{
            throw new Error('unknown error')
        }
    }
}