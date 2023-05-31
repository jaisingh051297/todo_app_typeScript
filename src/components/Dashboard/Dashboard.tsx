import React, { useState, useContext } from "react";
import { AuthContext, Todo } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import "../Dashboard/dashboard.css";
import Avatar from "../../data/avatar.png";

const Dashboard: React.FC = () => {
  const { state, dispatch } = useContext(AuthContext);
  const { user } = state;

  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [error, setError] = useState("");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleAddTodo = () => {
    if (newTodoTitle.trim() === "") {
      setError("Todo title cannot be empty");
      return;
    }

    const newTodo: Todo = {
      id: Math.random(),
      title: sanitizeInput(newTodoTitle),
      subTasks: [],
    };

    dispatch({ type: "ADD_TODO", payload: newTodo });
    setNewTodoTitle("");
    setError("");
  };

  const handleAddSubTask = () => {
    if (newSubTaskTitle.trim() === "" || selectedTodoId === null) {
      setError("Subtask title or selected Todo ID is invalid");
      return;
    }

    const newSubTask: Todo = {
      id: Math.random(),
      title: sanitizeInput(newSubTaskTitle),
    };

    const updatedTodos = user?.todos.map((todo) => {
      if (todo.id === selectedTodoId) {
        return {
          ...todo,
          subTasks: [...(todo.subTasks || []), newSubTask],
        };
      }
      return todo;
    });

    if (updatedTodos) {
      dispatch({ type: "UPDATE_TODOS", payload: updatedTodos });
    }

    setNewSubTaskTitle("");
    setSelectedTodoId(null);
    setError("");
  };

  const handleRemoveTodo = (todoId: number) => {
    const updatedTodos = user?.todos.filter((todo) => todo.id !== todoId);

    if (updatedTodos) {
      dispatch({ type: "UPDATE_TODOS", payload: updatedTodos });
    }
  };

  const handleSelectTodo = (todoId: number) => {
    setSelectedTodoId(todoId);
  };
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const sanitizeInput = (input: string): string => {
    // Sanitize input here (e.g., remove special characters, HTML tags, etc.)
    return input;
  };

  return (
    <div className="Dashboard">
      <div
        style={{
          border: "1px solid black",
          width: "550px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <h1>Welcome, {user?.profile.name}</h1>
        <div style={{ display: "flex", margin: "5px" }}>
          <img src={Avatar} className="avatar" alt="userprofile" />
          <h3>{user?.profile.email}</h3>
        </div>
        <button className="button_style" onClick={logout}>
          LOG OUT
        </button>
      </div>
      <h2 style={{ color: "#0743f5" }}>Your Todos:</h2>
      {error && (
        <p style={{ color: "red", fontWeight: "bold", fontSize: "20px" }}>
          {error}
        </p>
      )}
      <ul>
        <div>
          <input
            type="text"
            value={newTodoTitle}
            className="input"
            placeholder="Todo New Title"
            onChange={(e) => setNewTodoTitle(e.target.value)}
          />
          <button onClick={handleAddTodo} className="Add__todo">
            Add Todo
          </button>
        </div>
        {user?.todos.map((todo) => (
          <li
            key={todo.id}
            style={{ fontSize: "22px", fontWeight: "bold", margin: "20px" }}
          >
            {todo.title}
            <button
              className="Remove__subTodo"
              onClick={() => handleRemoveTodo(todo.id)}
            >
              Remove
            </button>
            <button
              className="Add__subTodo"
              onClick={() => handleSelectTodo(todo.id)}
            >
              Add Sub Task
            </button>
            {selectedTodoId === todo.id && (
              <div>
                <input
                  type="text"
                  value={newSubTaskTitle}
                  className="input"
                  placeholder="Sub Todo"
                  onChange={(e) => setNewSubTaskTitle(e.target.value)}
                />
                <button style={{background:'green'}} onClick={handleAddSubTask} className="Add__subTodo">
                  Add
                </button>
              </div>
            )}
            {todo.subTasks && (
              <ul style={{ fontSize: "16px",color:'blue' }}>
                {todo.subTasks.map((subTask) => (
                  <li key={subTask.id}>{subTask.title}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
