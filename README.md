FocusTab Browser Extension 📝

FocusTab is a minimalist browser extension designed to help users focus on their main goals by displaying personalized greetings, tasks, a motivational quote, and a TODO list on every new tab. It features a beautiful, randomly selected scenic background and a simple, intuitive interface.

![FocusTab-extension](/preview.png)

Live Demo:
https://focus-tab-extension.netlify.app/

⭐ Like & Save for Later
If you enjoy using FocusTab, consider starring or saving this browser extension for later use and updates!

index.html <br>
This is the main HTML file that serves as the entry point for the FocusTab extension. It sets up the root element and includes the necessary assets.<br>
- Sets the language to English and character encoding to UTF-8.<br>
- Links the favicon (logo.png) and stylesheets.<br>
- Loads the main JavaScript bundle (index-Bh3TeUh0.js) as a module.<br>
- Provides a <div id="root"></div> where the React app mounts.
<br>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FocusTab</title>
    <script type="module" crossorigin src="/assets/index-Bh3TeUh0.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-BcOEVQYO.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
<br>
main.jsx<br>
This file is the entry point for the React application. It mounts the React component tree to the DOM and wraps the app with a custom context provider for state management.<br>

-Uses React 18’s createRoot for concurrent rendering.

-Wraps the App component in <StrictMode> for highlighting potential issues.

-Uses BrwoserProvide (custom context) to manage browser extension state globally.

import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import App from './App.jsx'

import { BrwoserProvide } from './context/browser-extension.jsx'

createRoot(document.getElementById('root')).render(

  <BrwoserProvide>
    
    <StrictMode>
    
      <App />
      
    </StrictMode>,
    
  </BrwoserProvide>
  
)

index.css

This CSS file provides the overall styling for the extension. It uses a modern, clean, and focus-centric design.

Key Features:

-Imports Google Fonts (Bebas Neue for headings and Material Icons Outlined for icons).

-Sets up CSS variables for consistent color theming.

-Applies a responsive, full-screen background image.

-Provides utility classes for flex layouts, alignment, spacing, and typography.

-Styles inputs, buttons, and various containers for a cohesive look.

@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

@import url("https://fonts.googleapis.com/icon?family=Material+Icons+Outlined");

:root{
  --text-color-primary: #F8FAFC;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Bebas Neue", sans-serif;
}

/* ... (many utility and component styles) ... */

App.jsx

This is the root component of FocusTab. It determines which UI (Home or Task) to show based on whether the user has entered their name.

Key Features:

-Selects a random background from a collection of scenic images each time.

-Uses the custom useBrowser context for state management.

-Loads the user's name from localStorage and updates app state.

-Renders either the Task component (if user name exists) or Home (for first-time users).

import {images} from './db/images.js'

import { Home } from "./pages/Home/Home.jsx"

import './index.css'

import { useBrowser } from './context/browser-extension.jsx'

import { Task } from './pages/Home/Task.jsx'

import { useEffect } from 'react'

import { Reducer } from './reducer/Reducer.jsx'

const index = Math.floor(Math.random() * images.length)

const bgImage = images[index].image

function App() {
  const {name, browserDispatch} = useBrowser()

  useEffect(() => {
  
    const userName = localStorage.getItem("name")
    
    browserDispatch({ type: "NAME", payload: userName })
  }, [])

  return (
  
    <div className='app' style={{backgroundImage: `url("${bgImage}")`}}>
    
      { name ? <Task /> : <Home /> }
      
    </div>
    
  )
}

export default App

Architectural Data Flow

![architectural data flow](/architecturaldataflow.png)

Reducer.jsx

This file defines the reducer function for managing state in the custom context.

Features:

-Handles actions for updating name, time, greeting message, task, and task deletion.

-Returns a new state object based on the action type.

![redux](/redux.png)

export const Reducer = (state,{type,payload}) => {

  switch (type){
  
    case "NAME":
    
      return{ ...state, name:payload }
      
    case "TIME":
    
      return { ...state, time: payload }
      
    case "MESSAGE":
    
      return { ...state, message: payload >= 0 && payload < 12 ? "Good Morning" : payload >= 12 && payload <= 17 ? "Good Afternoon": "Good Evening" }
      
    case "TASK":
    
      return { ...state, task: payload }
      
    case "DELETE":
    
      return { ...state, task: null }
      
    default:
    
      return state
      
  }
  
}

Home.jsx

This component asks the user for their name when they first visit FocusTab.

Features:

-Displays a friendly greeting and prompts for the user’s name.

-On pressing "Enter", stores the name in localStorage and updates global state.

-Prevents default form submission to avoid unwanted page reloads.

import { useBrowser } from "../../context/browser-extension"

export const Home = () => {

  const {name, browserDispatch} = useBrowser()

  const handleNameChange = (event) => {
  
    if(event.key === "Enter" && event.target.value.length > 0){
    
      browserDispatch({ type: "NAME", payload: event.target.value },[])
      
      localStorage.setItem("name",event.target.value)
      
    }
  }

  const handleFormSubmit = (event) => {
  
    event.preventDefault()
    
  }

  return(
  
    <div className="home-container d-flex direction-column justify-center align-center gap-lg">
    
      <h1 className="main-heading">Browser Extension</h1>
      
      <div className="user-details">

        <span className="heading-1">Hello, what's your Name?</span>
        
        <form onSubmit={handleFormSubmit}>
        
          <input required onKeyDown={handleNameChange} className="input" autoFocus/>
          
        </form>
        
      </div>
      
    </div>
    
  )
  
}

Task.jsx

This is the main in-use component after the user provides their name. It presents the core features of the extension.

Features:

-Displays current time and a time-of-day greeting.

-Prompts for the user's main focus/task if none exists.

-Allows the user to check-off or delete the current task.

-Shows a motivational quote picked randomly from a collection.

-Integrates a toggleable TODO list via the Todo component.

-Persists and restores task and checkbox state across sessions/days using localStorage.

import { Fragment, useEffect, useState } from "react";

import { useBrowser } from "../../context/browser-extension";

import {quotes} from "../../db/quotes.js"

import { Todo } from "../../components/Todo.jsx";


const index= Math.floor(Math.random() * quotes.length)

const quote = quotes[index].quote

export const Task = () => {
  const { name, time, message, task, browserDispatch } = useBrowser();
  
  const [isChecked, setIsChecked] = useState(false);
  
  const [isTodoOpen,setIsTodoOpen] = useState(false)

  useEffect(() => {
  
    const userTask = localStorage.getItem("task");
    
    browserDispatch({ type: "TASK", payload: userTask, });

    if(new Date().getDate() !== Number(localStorage.getItem("date"))){
      localStorage.removeItem("task")
      localStorage.removeItem("date")
      localStorage.removeItem("checkedStatus")
    }
  }, []);

  useEffect(() => {
  
    const checkedStatus = localStorage.getItem("checkedStatus");
    
    checkedStatus === "true" ? setIsChecked(true) : setIsChecked(false);
    
  }, []);

  useEffect(() => {
  
    getCurrentTime();
    
  }, [time]);

  const getCurrentTime = () => {
  
    const today = new Date();
    
    const hours = today.getHours();
    
    const minutes = today.getMinutes();
    
    const hour = hours < 10 ? `0${hours}` : hours;
    
    const minute = minutes < 10 ? `0${minutes}` : minutes;
    
    const currentTime = `${hour} : ${minute}`;
    
    setTimeout(getCurrentTime, 1000);
    
    browserDispatch({ type: "TIME", payload: currentTime, });
    
    browserDispatch({ type: "MESSAGE", payload: hours, });
    
  };

  const handleTaskChange = (event) => {
  
    if (event.key === "Enter" && event.target.value.length > 0) {
    
      browserDispatch({ type: "TASK", payload: event.target.value, });
      
      localStorage.setItem("task", event.target.value);
      
      localStorage.setItem("date", new Date().getDate());
      
    }
  };

  const handleFormSubmit = (event) => {
  
    event.preventDefault();
  };

  const handleCompleteTaskChange = (event) => {
  
    setIsChecked((isChecked) => !isChecked);
    
    localStorage.setItem("checkedStatus", !isChecked);
  };

  const handleDeleteClick = () => {
  
    browserDispatch({ type: "DELETE" })
    
    setIsChecked(false)
    
    localStorage.removeItem("task")
    
    localStorage.removeItem("checkedStatus")
    
  }

  const handleTodoClick = () => {
  
    setIsTodoOpen(isTodoOpen => !isTodoOpen)
    
  }

  return (
  
    <div className="task-contianer d-flex direction-column align-center gap">
    
      <span className="time">{time}</span>
      
      <span className="message"> {message},{name} </span>
      
      {name !== null && task === null ? (
      
        <Fragment>
        
          <span className="heading-3">what is your main focus today?</span>
          
          <form onSubmit={handleFormSubmit}>
          
            <input required className="input" onKeyDown={handleTaskChange} />
            
          </form>
          
        </Fragment>
        
      ) : (
        <div className="user-task-container d-flex direction-column align-center gap-sm">
        
          <span className="heading-2">Todays Focus</span>
          
          <div className="d-flex align-center gap ">
          
            <label className={`${ isChecked ? "strikethrough" : "" } heading-3 d-flex align-center gap-sm cursor`} >
            
              <input className="check cursor" type="checkbox" onChange={handleCompleteTaskChange} checked={isChecked} />
              {task}
            </label>
            
            <button className="button cursor" onClick={handleDeleteClick}>
            
              <span className="material-icons-outlined">delete</span>
              
            </button>
            
          </div>
          
        </div>
      
      )}
      
      <div className="quote-container">
      
        <span className="heading-3">{quote}</span>
        
      </div>
      
      {isTodoOpen && <Todo /> }
      
      <div className="todo-btn-container">
      
        <button className="button cursor todo-btn" onClick={handleTodoClick}>TODO</button>
        
      </div>
      
    </div>
    
  );
  
};
images.js

This file exports an array of scenic image URLs used for random background selection.

Usage:

- Every time the app loads, a random image is chosen for the background.

Example:
export const images = [

  { image: "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
  
  { image: "https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
  
  // ...many more
  
]

quotes.js

This file contains an array of motivational quotes used on FocusTab.

Usage:

A random quote is displayed on every new tab.

Example:
export const quotes = [

  { quote: "You must be the change you wish to see in the world. – Mahatma Gandhi" },
  
  { quote: "First they ignore you, then they laugh at you, then they fight you, then you win. – Mahatma Gandhi" },
  
  // ...many more
  
]
browser-extension.jsx

This file defines the custom React Context for sharing state across the app and implements the reducer logic.

Features:

-Exports BrwoserProvide, which wraps the app and provides global state.

-Exports useBrowser hook for easy context consumption.

-Uses the Reducer for handling state transitions.
import { createContext,useContext, useState,useReducer} from "react";
import { Reducer } from "../reducer/Reducer";

const initialValue = {
  name: "",
  time: "",
  message: "",
  task: ""
}

const BrowserContext = createContext(initialValue)

const BrwoserProvide = ({children}) => {

  const [{name ,time,message,task},browserDispatch] = useReducer(Reducer,initialValue)
  
  return (
  
    <BrowserContext.Provider value={{name,time,message,task,browserDispatch}} >
    
      {children}
      
    </BrowserContext.Provider>
    
  )
  
}

const useBrowser = () => useContext(BrowserContext)

export {useBrowser,BrwoserProvide}

Todo.jsx

This component implements a persistent, animated TODO list.


Features:

-Uses state and localStorage to keep todos across sessions.

-Supports add, complete, and delete actions for each todo item.

-Uses uuid for unique IDs and motion for animations.

-Provides keyboard interaction for fast entry.

import { useEffect, useState } from "react";

import { v4 as uuid } from "uuid";

import "../components/Todo.css";

import { motion, AnimatePresence} from "motion/react"


export const Todo = () => {

  const [todo, setTodo] = useState("");
  
  const [todoList, setTodoList] = useState([]);
  

  useEffect(() => {
  
    const userTodo = JSON.parse(localStorage.getItem("todo"))
    
    userTodo && setTodoList(userTodo)
    
  },[])

  const handleTodoChange = (event) => {
  
    setTodo(event.target.value);
    
  };

  const handleTodoEnterKey = (event) => {
  
    if (event.key === "Enter") {
    
      const updatedTodoList = [
      
        ...todoList,
        
        { _id: uuid(), todo, isCompleted: false },
        
      ];
      setTodoList(updatedTodoList);
      
      setTodo("");
      
      localStorage.setItem("todo", JSON.stringify(updatedTodoList));
      
    }
    
  };

  const handleTodoCheckChange = (todoId) => {
  
    const updatedTodoList = todoList.map(todo =>
    
      todoId === todo._id ? {...todo, isCompleted:!todo.isCompleted} : todo)
      
    setTodoList(updatedTodoList)
    
    localStorage.setItem("todo", JSON.stringify(updatedTodoList));
    
  }

  const handleTodoDelete = (todoId) => {
  
    const updatedTodoList = todoList.filter(({_id}) => _id !== todoId)
    
    setTodoList(updatedTodoList)
    
    localStorage.setItem("todo", JSON.stringify(updatedTodoList))
    
  }

  return (
  
    <motion.div className="todo-container absolute"
    
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      
      animate={{ opacity: 1, scale: 1, y: 0 }}
      
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      
      transition={{ duration: 0.3, ease: "easeOut" }}>
      
      <div className="todo-input-container">
      
        <input className="todo-input" value={todo}
        
          onChange={handleTodoChange}
          
          onKeyDown={handleTodoEnterKey} />
          
      </div>
      
      <div className="todo-list">
      
        <AnimatePresence>
        
          {todoList && todoList.map(({ todo, _id, isCompleted }) => {
          
            return (
            
              <motion.div key={_id} className="todo-items d-flex align-center gap-sm"
              
                initial={{ opacity: 0, x: -20 }}
                
                animate={{ opacity: 1, x: 0 }}
                
                exit={{ opacity: 0, x: 20, height: 0 }}
                
                transition={{ duration: 0.2 }}
                
                layout>
                
                <label className={`${isCompleted ? "strikethrough": ""} todo-label`}>
                
                  <input className="todo-check" type="checkbox"
                  
                    onChange={() => handleTodoCheckChange(_id)}
                    
                    checked={isCompleted}/>
                    
                  {todo}
                  
                </label>
                
                <motion.button className="button cursor todo-delete-btn"
                
                  onClick={() => handleTodoDelete(_id)}
                  
                  whileHover={{ scale: 1.1 }}
                  
                  whileTap={{ scale: 0.9 }}>
                  
                  <span className="material-icons-outlined">delete</span>
                  
                </motion.button>
                
              </motion.div>
              
            );
            
          })}
          
        </AnimatePresence>
        
      </div>
      
    </motion.div>
    
  );
  
};

Todo.css

This CSS file styles the TODO list modal.

Features:

-Styles for the floating TODO button, modal container, and list items.

-Responsive container width/height, with scroll for overflow.

-Input fields, strike-through for completed items, and delete button effects.

.todo-btn{
  font-size: 2rem;
  background-color: rgb(209, 206, 206);
  border-radius: 4px;
  padding: 5px;
  color: black;
  width: 70px;
}

.todo-btn:hover{
  background-color: rgb(255, 255, 255);
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.todo-container {
  position: absolute;
  width: 20vw;
  max-height: 70vh;
  padding: 10px;
  background-color: grey;
  opacity: .9;
  right: 2rem;
  top: 7.5rem;
  border-radius: 4px;
  overflow-y: auto;
}

.todo-input {
  background-color: transparent;
  border: none;
  color: var(--text-color-primary);
  border-bottom: 1px solid var(--text-color-primary);
  margin-bottom: 2px;
  font-size: 1rem;
  width: 18vw;
}

.todo-input:focus{
  outline: none;
}

.todo-items{
  padding: 2px 0;
  width: 16vw;
}

.todo-label {
  min-width: 100%;
  word-wrap: break-word;
  font-size: 1.25rem;
}

.todo-delete-btn{
  margin-left:5px;
  font-size: 1.25rem;
}

.todo-check{
  width: 1.25rem;
  height: 1.25rem;
}

.strikethrough{
  text-decoration: line-through;
}

![user experience flow](/userexpeirenceflow.png)

Persistence & Privacy

FocusTab only uses your browser's localStorage. No user data is ever sent to a server.

🚀 Try It Live

https://focus-tab-extension.netlify.app/

Browser APIs

LocalStorage API - Client-side storage

Date API - Time management

🤝 Contributing

Contributions are welcome! Please follow these steps:

-Fork the repository

-Create a feature branch (git checkout -b feature/AmazingFeature)

-Commit your changes (git commit -m 'Add some AmazingFeature')

-Push to the branch (git push origin feature/AmazingFeature)

-Open a Pull Request

📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

👤 Author
Sameeha Taha

GitHub: @sameehataha

🙏 Acknowledgments

Background images from Pexels

Quotes from Indian freedom fighters and leaders

Icons from Material Icons

Font from Google Fonts


📧 Contact

For questions or feedback, please open an issue on GitHub.
