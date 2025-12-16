import React, {useEffect, useRef, useState} from "react";

const TodoList = () => {
const [inputValue, setInputValue] = useState("");
const [list, setList] = useState([]);
const username = "codesarah";

const seededRef = useRef(false);

const toDoTask = [
    {label: "Go to shopping", is_done: false},
    {label: "Go to market", is_done: false},
    {label: "Watch Dexter", is_done: false},
    {label: "Watch Attack on Titan", is_done: false},
     {label: "Waiting for the next Movie: Demons Slayer 2026", is_done: false},
];

const seedInitialTasks = async () => {
    await Promise.all(
        toDoTask.map(task =>
            fetch(`https://playground.4geeks.com/todo/todos/codesarah`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(task),
            })
         )
    );
};


useEffect(() => {
    fetch(`https://playground.4geeks.com/todo/users/codesarah`, {
        method: "POST",
        headers: {"Content-Type": "application/json"}
    })
    .then(res => res.json())
    .then(data => console.log("User already exists", data))
    .catch(err => console.error(err));

    getTasks();
}, []);



const getTasks = async () => {
   const res = await fetch(`https://playground.4geeks.com/todo/users/codesarah`);
   const data = await res.json();

        if (!data.todos || data.todos.length === 0 ) {
         await seedInitialTasks();
           return getTasks();       
        }  
            setList(data.todos);

    };

const addTask = (e) => {
    e.preventDefault();

    if(inputValue.trim() === "") return;

    const newTask = {
        label: inputValue,
        is_done: false
    };

    fetch(`https://playground.4geeks.com/todo/todos/codesarah`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newTask)
    })

    .then(res => res.json())
    .then(() => {
        setInputValue("");
        getTasks();
    })
    .catch(err => console.error(err));
};

const deleteTask = (taskId) => {
    fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
        method: "DELETE"
    })
    .then(() => getTasks())
    .catch(err => console.error(err));
};

return (
    <div className="todo-container">
        <h1 className="todo-tit">To Do's</h1>
        <form className="todo-form"
        onSubmit={addTask}>
          <input className="todo-input"
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)}
          type="text"  
          placeholder="What needs to be done?"/>

          </form>

          <ul className="todo-list">
            {list.map((item, index) => (
                <li key={item.id} className="task-item">
                    <span>{item.label}</span>
                <span className="delete-btn" onClick={() => deleteTask(item.id)}>X</span>
                </li>
            ))}
          </ul>
          <div className="todo-foot">{list.length} item(s)</div>
    </div>
);
};


export default TodoList;