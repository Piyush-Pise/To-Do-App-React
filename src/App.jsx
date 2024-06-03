import { useState, useEffect } from "react";
import axios from "axios";

import ConnectingComponent from "./ConnectingComponent";
import Todo from "./Todo";
import ResultFooter from "./ResultFooter";
import "./App.css";

const baseURI = "https://react-todo-app-backend-sw25.onrender.com" + "/api";
let userId = localStorage.getItem("userId") || "";

function App() {
  const [mode, setMode] = useState(false);
  const [todo, setTodo] = useState("");
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);

  const [todoList, setTodoList] = useState([]);
  const [isConnecting, setIsConnecting] = useState(true);
  
  useEffect(() => {
    axios
      .get(`${baseURI}/get?userId=${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setIsConnecting(false);
        console.log("resopnse is :", res.data.todos);
        if (res === null || res.data === null) {
          return;
        }
        if (res.data.userId !== null) {
          localStorage.setItem("userId", res.data.userId);
          userId = localStorage.getItem("userId");
        }
        if (res.data.todos !== null && res.data.todos.length !== 0) {
          let newTodoList = [];
          for (let i = res.data.todos.length - 1; i >= 0; i--) {
            newTodoList.push({
              description: res.data.todos[i].description,
              status: res.data.todos[i].status,
            });
          }
          setTodoList(newTodoList);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  
  async function postData(jsonData) {
    try {
      const apiUrl = baseURI + "/add";
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const res = await axios.post(apiUrl, jsonData, config);
      if (res !== null && res.data !== null && res.data.userId !== null) {
        console.log(res);
        localStorage.setItem("userId", res.data.userId);
        userId = localStorage.getItem("userId");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error making POST request:", error);
      return false;
    }
  }

  async function updateStatusData(jsonData) {
    try {
      const apiUrl = baseURI + "/update";
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const res = await axios.post(apiUrl, jsonData, config);
      if (res !== null && res.data !== null && res.data.userId !== null) {
        localStorage.setItem("userId", res.data.userId);
        userId = localStorage.getItem("userId");
      }
      return res.status === 201;
    } catch (error) {
      console.error("Error making POST request:", error);
      console.error("Error making POST request:", error.response);
      return false;
    }
  }

  async function deleteTodo(jsonData) {
    try {
      const apiUrl = baseURI + "/delete";
      const config = {
        headers: { "Content-Type": "application/json" },
        data: jsonData,
      };

      const res = await axios.delete(apiUrl, config);
      if (res !== null && res.data !== null && res.data.userId !== null) {
        localStorage.setItem("userId", res.data.userId);
        userId = localStorage.getItem("userId");
      }
      return res.status === 201;
    } catch (error) {
      console.error("Error making DELETE request:", error);
      return false;
    }
  }

  async function UpdateStatus(TodoIndex) {
    const todoListCopy = [...todoList];
    todoListCopy[TodoIndex].status = !todoListCopy[TodoIndex].status;
    setTodoList(todoListCopy);

    const requestSuccess = await updateStatusData({
      userId: userId,
      index: todoList.length - 1 - TodoIndex,
    });

    if (requestSuccess) {
      console.log("Todo Status Updated: Success !!!");
    } else {
      console.log("Todo Status Update: Failed !!!");
    }
  }

  async function DeleteTodo(TodoIndex) {
    const todoListCopy = [...todoList];
    todoListCopy.splice(TodoIndex, 1);
    setTodoList(todoListCopy);

    const requestSuccess = await deleteTodo({
      userId: userId,
      indexes: [todoList.length - 1 - TodoIndex],
    });
    if (requestSuccess) {
      console.log("Todo Deletion Status: Success !!!");
    } else {
      console.log("Todo Deletion Status: Failed !!!");
    }
  }

  async function HandleOnClearCompleted() {
    const indexArray = [];
    for (let i = 0; i < todoList.length; i++) {
      if (todoList[i].status) {
        indexArray.push(todoList.length - 1 - i);
      }
    }
    if (!indexArray.length) {
      return;
    }

    const listOfActiveTodos = todoList.filter((item) => !item.status);
    setTodoList(listOfActiveTodos);

    const requestSuccess = await deleteTodo({
      userId: userId,
      indexes: indexArray,
    });
    if (requestSuccess) {
      console.log("Bulk Todo Deletion Status: Success !!!", indexArray);
    } else {
      console.log("Bulk Todo Deletion Status: Failed !!!");
    }
  }

  function HandleOnChange(event) {
    setTodo(event.target.value);
  }

  async function OnEnter(event) {
    if (event.key !== "Enter" || todo.length === 0) {
      return;
    }
    const todoListCopy = [{ description: todo, status: false }, ...todoList];
    setTodoList(todoListCopy);
    setTodo("");
    const requestSuccess = await postData({
      userId: userId,
      description: todo,
      status: false,
    });
    if (requestSuccess) {
      console.log("Todo Added Successfully !!!");
    } else {
      console.log("failed adding Todo !!!");
    }
  }

  function OnFilter(index) {
    setActiveFilterIndex(index);
  }

  const allListTodos = todoList.map((todo, index) => (
    <li key={index}>
      {
        <Todo
          mode={mode}
          index={index}
          content={todo.description}
          completed={todo.status}
          UpdateStatus={UpdateStatus}
          DeleteTodo={DeleteTodo}
        />
      }
    </li>
  ));

  const listOfActiveTodos = todoList.filter((item) => !item.status);
  const listOfCompletedTodos = todoList.filter((item) => item.status);

  const activeTodos = listOfActiveTodos.map((todo, index) => (
    <li key={index}>
      {
        <Todo
          mode={mode}
          index={todoList.indexOf(todo)}
          content={todo.description}
          completed={todo.status}
          UpdateStatus={UpdateStatus}
          DeleteTodo={DeleteTodo}
        />
      }
    </li>
  ));

  const completedTodos = listOfCompletedTodos.map((todo, index) => (
    <li key={index}>
      {
        <Todo
          mode={mode}
          index={todoList.indexOf(todo)}
          content={todo.description}
          completed={todo.status}
          UpdateStatus={UpdateStatus}
          DeleteTodo={DeleteTodo}
        />
      }
    </li>
  ));

  return (
    <>
      <div className={"bg-" + (mode ? "dark-mode" : "light-mode")}>
        <ConnectingComponent isConnecting={isConnecting} />
        <div className={"bg-image " + (mode ? "bg-dark" : "bg-light")}></div>
        <div className="main-container">
          <div className="title-and-toggle-button-container">
            <h1>T O D O</h1>
            <div
              className={
                "toggle-button " + (mode ? "toggle-dark" : "toggle-light")
              }
              onClick={() => {
                setMode(!mode);
              }}
            ></div>
          </div>
          <div className={"input-container " + (mode ? "dark" : "light")}>
            <div className="circle-on-left"></div>
            <input
              className={mode ? "input-dark" : "input-light"}
              value={todo}
              onChange={(e) => {
                HandleOnChange(e);
              }}
              onKeyDown={(e) => {
                OnEnter(e);
              }}
              type="text"
              placeholder="Create a new todo..."
            />
          </div>
          <div className="result-section">
            <ul>
              {activeFilterIndex === 1
                ? activeTodos
                : activeFilterIndex === 2
                ? completedTodos
                : allListTodos}
            </ul>
            {todoList.length !== 0 ? (
              <ResultFooter
                mode={mode}
                count={allListTodos.length}
                activeFilterIndex={activeFilterIndex}
                OnFilter={OnFilter}
                HandleOnClearCompleted={HandleOnClearCompleted}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
