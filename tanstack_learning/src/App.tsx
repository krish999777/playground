import {getPosts} from './utils/api'
import {useQuery} from '@tanstack/react-query'

export default function(){
  const {data,isLoading,error}=useQuery({
    queryKey:["posts"], queryFn:getPosts
  })
  if(error){
    return <div>{error.message}</div>
  }
  if(isLoading){
    return <div>Loading...</div>
  }
  return(
      <div>
        {data?data.map((data:any)=>{
          return (<div key={data.id}><div>{data.title}</div><div>{data.body}</div></div>)
        }):null}
      </div>
  )
}