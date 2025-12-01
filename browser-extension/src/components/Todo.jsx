import { use, useEffect, useState } from "react";
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
       const updatedTodoList = todoList.map(todo => todoId === todo._id ? {...todo, isCompleted:!todo.isCompleted} : todo)
       setTodoList(updatedTodoList)
       localStorage.setItem("todo", JSON.stringify(updatedTodoList));
  }
  console.log("todoList-", todoList);
  const handleTodoDelete = (todoId) => {
      const updatedTodoList = todoList.filter(({_id}) => _id !== todoId)
      setTodoList(updatedTodoList)
      localStorage.setItem("todo", JSON.stringify(updatedTodoList))
  }
  return (
    <motion.div className="todo-container absolute" initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}>
      <div className="todo-input-container">
        <input
          className="todo-input"
          value={todo}
          onChange={handleTodoChange}
          onKeyDown={handleTodoEnterKey}
        />
      </div>
      <div className="todo-list">
         <AnimatePresence>
        {todoList &&
          todoList.map(({ todo, _id, isCompleted }) => {
            return (
              <motion.div key={_id} className="todo-items d-flex align-center gap-sm"  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.2 }}
                  layout >
                <label className={`${isCompleted  ? "strikethrough": ""} todo-label`}>
                  <input className="todo-check" type="checkbox" onChange={() => handleTodoCheckChange(_id)} checked={isCompleted}/>
                  {todo}
                </label>
                <motion.button className="button cursor todo-delete-btn" onClick={() => handleTodoDelete(_id)}  whileHover={{ scale: 1.1 }}
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
