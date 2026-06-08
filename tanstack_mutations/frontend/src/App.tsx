import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query'
import {getTodos,postTodos,deleteTodo} from './utils/api'
import type {SubmitEvent} from 'react'

export default function App(){
  const {data,isLoading,error}=useQuery({
    queryKey:['todos'], queryFn:getTodos
  })
  const queryClient=useQueryClient()
  const mutation=useMutation({
    mutationFn:postTodos,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['todos']})
    }
  })
  const deleteMutation=useMutation({
    mutationFn:deleteTodo,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['todos']})
    }
  })
  function deleteTodoFn(){
    deleteMutation.mutate(2)
  }
  async function handleSubmit(e:SubmitEvent){
    e.preventDefault()
    const form:HTMLFormElement=e.target
    const formData=new FormData(form)
    const title=String(formData.get('title'))
    const description=String(formData.get('description'))
    mutation.mutate({
      title,
      description
    })
  }

  if(isLoading){
    return(
      <div>Loading...</div>
    )
  }
  if(mutation.isPending){
    return(
      <div>Mutation loading......................</div>
    )
  }
  if(error){
    return(
      <div>{error.message}</div>
    )
  }
  return(
    <div>
      {data.map((todo:any)=>{
        return(
          <div key={todo.id}>
             <div>{todo.id}</div>
             <div>{todo.title}</div>
             <div>{todo.description}</div>
          </div>
        )
      })}
      <form onSubmit={handleSubmit}>
        Title:<input type="text" required={true} name="title"/>
        Description:<input type="text" required={true} name="description"/>
        <button>Submit</button>
      </form>
      <button onClick={deleteTodoFn}>Delete 2</button>
    </div>
  )
}