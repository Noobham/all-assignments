import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
function App() {
  const [todos, setTodos] = useState([]);
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [edit,setEdit] = useState(0);
  

  useEffect(()=>{
    getTodos();
  },[])
  // "proxy":"",
  let getTodos =async ()=>{
    const resp = await axios.get("http://localhost:4000/todos");
    setTodos(resp.data);
    console.log(resp.data);
  }
  function add_todo(event){
    event.preventDefault();
    console.log("Clicked");
    fetch("http://localhost:4000/todos",{
      method:"POST",
      headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin":'*'
      },
      body:JSON.stringify({
        title,description
      }),
  }).then(
      (response)=>response.json()
    ).then(()=>{
      getTodos();
    })
  }

  let deleteTodo = (id)=>{
      fetch(`http://localhost:4000/todos/${id}`,{
        method:"DELETE",
      headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin":'*'
      }
      }).then(()=>{
        getTodos(); 
      })
  }
  return (
    <>
      <div className='main'>
        <h1>Easy Todo App</h1>
        <form action="" className='todo_form' onSubmit={add_todo}>
          <div className='mb-2'>
          <label htmlFor="title">Title :</label>
          <input type="text" name='title'  id="title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
          </div>
          <div className='mb-2'>
          <label htmlFor="desc">Description :</label>
          <input type="text" name="desc" id="desc" value={description} onChange={(e)=>setDescription(e.target.value)}/>
          </div>
          <input type="submit" value="submit"/>
        </form>

        <div>
          {
            todos && 
            todos.map((todo)=>{
              // eslint-disable-next-line react/jsx-key
                if(edit) return <Edit todo={todo}/>;
                else return <div className='mb-2' key={todo.id}>
                {/* <input type="text" value={todo.title} /> */}
                <span>{todo.title} : </span>
                <span>{todo.description}</span>
                <button onClick={()=>{setEdit(1)}}>Edit</button>
                <button onClick={()=>deleteTodo(todo.id)}>Delete</button>
              </div>;
            })
          }
        </div>
      </div>
    </>
  );
}
function Edit(props){
  let update = ()=>{

  }
  return <>
    <input type="text" value={props.todo.title} />
    <input type="text" value={props.todo.desc} />
    <button onSubmit={()=>{update()}}>update</button>
  </>
}
// function Todo(props) {
//     // Add a delete button here so user can delete a TODO.
//     return <div>
//         {props.title}
//     </div>
// }

export default App
