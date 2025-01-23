import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function App() {
  const [tasks, setTasks] = useState({
    ToDo: [],
    InProgress: [],
    Done: [],
  });

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: `task-${Date.now()}`,
      title: e.target.taskTitle.value,
      description: e.target.taskDescription.value,
      deadline: e.target.taskDeadline.value,
      tags: e.target.taskTags.value.split(","),
      difficulty: e.target.taskDifficulty.value,
    };
    setTasks((prev) => ({
      ...prev,
      ToDo: [...prev.ToDo, newTask],
    }));
    e.target.reset();
  };

  const onDragEnd = (result) => {
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
  };

  const deleteTask = (column, index) => {
    const updatedColumn = tasks[column].filter((_, i) => i !== index);
    setTasks((prev) => ({
      ...prev,
      [column]: updatedColumn,
    }));
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <span className="navbar-brand">Task Manager</span>
        </div>
      </nav>

      <h4>Create New Task</h4>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="taskTitle" className="form-label">Task Title</label>
            <input type="text" className="form-control" id="taskTitle" required />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="taskDeadline" className="form-label">Deadline</label>
            <input type="date" className="form-control" id="taskDeadline" required />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="taskDescription" className="form-label">Task Description</label>
          <textarea className="form-control" id="taskDescription" required></textarea>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="taskTags" className="form-label">Tags (comma-separated)</label>
            <input type="text" className="form-control" id="taskTags" />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="taskDifficulty" className="form-label">Difficulty</label>
            <select className="form-select" id="taskDifficulty">
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Add Task</button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="row">
          {Object.keys(tasks).map((status) => (
            <div key={status} className="col-md-4">
              <div className="card">
                <div className="card-header text-center bg-primary text-white">
                  {status}
                </div>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="card-body"
                      style={{ minHeight: '200px', backgroundColor: '#f8f9fa' }}
                    >
                      {tasks[status].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`card mb-2 border-${
                                task.difficulty === 'Easy'
                                  ? 'success'
                                  : task.difficulty === 'Medium'
                                  ? 'warning'
                                  : 'danger'
                              }`}
                            >
                              <div className="card-body">
                                <h5 className="card-title">{task.title}</h5>
                                <p className="card-text">{task.description}</p>
                                <p className="card-text">
                                  <strong>Deadline:</strong> {task.deadline}
                                </p>
                                {task.tags.length > 0 && (
                                  <p className="card-text">
                                    <strong>Tags:</strong> {task.tags.join(', ')}
                                  </p>
                                )}
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => deleteTask(status, index)}
                                >
                                  Delete
                                </button>
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
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
