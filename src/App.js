import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrash, FaClock, FaTag } from 'react-icons/fa'; // Removed FaLightbulb

function App() {
  const [tasks, setTasks] = useState({
    ToDo: [],
    InProgress: [],
    Done: [],
  });

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) setTasks(savedTasks);
    const savedMode = JSON.parse(localStorage.getItem('darkMode'));
    if (savedMode) setDarkMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [tasks, darkMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: `task-${Date.now()}`,
      title: e.target.taskTitle.value,
      description: e.target.taskDescription.value,
      deadline: e.target.taskDeadline.value,
      tag: e.target.taskTag.value,
      difficulty: e.target.taskDifficulty.value,
    };
    setTasks((prev) => ({
      ...prev,
      ToDo: [...prev.ToDo, newTask],
    }));
    e.target.reset();
  };

  const onDragStart = () => {
    document.body.style.userSelect = 'none';
  };

  const onDragEnd = (result) => {
    console.log("Drag result:", result); // Log the drag result
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = [...tasks[source.droppableId]];
    const destColumn = [...tasks[destination.droppableId]];
    const [removedTask] = sourceColumn.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceColumn.splice(destination.index, 0, removedTask);
      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceColumn,
      }));
    } else {
      destColumn.splice(destination.index, 0, removedTask);
      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      }));
    }
    document.body.style.userSelect = 'auto';
  };

  const deleteTask = (column, index) => {
    setTasks((prev) => {
      const updatedColumn = [...prev[column]];
      updatedColumn.splice(index, 1);
      return {
        ...prev,
        [column]: updatedColumn,
      };
    });
  };

  return (
    <div className={darkMode ? 'bg-dark text-white min-vh-100' : 'bg-light text-dark min-vh-100'}>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Task Manager</h1>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                id="taskTitle"
                placeholder="Task Title"
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                id="taskDescription"
                placeholder="Task Description"
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                id="taskDeadline"
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                id="taskTag"
                placeholder="Tag"
              />
            </div>
            <div className="col-md-2">
              <select className="form-select" id="taskDifficulty" required>
                <option value="Easy" style={{ color: 'green' }}>Easy</option>
                <option value="Medium" style={{ color: 'orange' }}>Medium</option>
                <option value="Hard" style={{ color: 'red' }}>Hard</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3">Add Task</button>
        </form>

        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <div className="row">
            {Object.keys(tasks).map((status) => (
              <div key={status} className="col-md-4">
                <h3 className="text-center">{status}</h3>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="p-3 rounded"
                      style={{
                        minHeight: '300px',
                        background: darkMode ? '#343a40' : '#f8f9fa',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      }}
                    >
                      {tasks[status].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="card mb-3 task-card"
                              style={{
                                borderLeft: `5px solid ${
                                  task.difficulty === 'Easy'
                                    ? 'green'
                                    : task.difficulty === 'Medium'
                                    ? 'orange'
                                    : 'red'
                                }`,
                                ...provided.draggableProps.style
                              }}
                            >
                              <div className="card-body">
                                <h5 className="card-title d-flex justify-content-between">
                                  {task.title}
                                  <FaTrash
                                    className="text-danger"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => deleteTask(status, index)}
                                  />
                                </h5>
                                <p className="card-text">{task.description}</p>
                                {task.deadline && (
                                  <div className="badge bg-warning text-dark">
                                    <FaClock /> {task.deadline}
                                  </div>
                                )}
                                {task.tag && (
                                  <div className="badge bg-info text-dark ms-2">
                                    <FaTag /> {task.tag}
                                  </div>
                                )}
                                <div className="mt-2">
                                  <span className={`badge ${
                                    task.difficulty === 'Easy'
                                      ? 'bg-success'
                                      : task.difficulty === 'Medium'
                                      ? 'bg-warning'
                                      : 'bg-danger'
                                  }`}>{task.difficulty}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
