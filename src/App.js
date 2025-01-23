import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Cookies from 'js-cookie'; // Import the cookies library

function App() {
  const [tasks, setTasks] = useState({
    ToDo: [],
    InProgress: [],
    Done: [],
  });
  useEffect(() => {
    if (Object.keys(tasks).length > 0) {
      Cookies.set('tasks', JSON.stringify(tasks), { expires: 7 });
      console.log('Tasks saved');
    }
  }, [tasks]);
  useEffect(() => {
    // Try loading tasks from cookies
    const savedTasks = Cookies.get('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: `task-${Date.now()}`,
      title: e.target.taskTitle.value,
      description: e.target.taskDescription.value,
    };
    setTasks((prev) => ({
      ...prev,
      ToDo: [...prev.ToDo, newTask],
    }));
    e.target.reset();
  };

  const deleteTask = (taskId) => {
    const updatedTasks = { ...tasks };
    // Find the column that the task belongs to and remove it
    for (const status in updatedTasks) {
      updatedTasks[status] = updatedTasks[status].filter((task) => task.id !== taskId);
    }
    setTasks(updatedTasks);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside any column, do nothing
    if (!destination) return;

    // Moving tasks between columns or within the same column
    const sourceColumn = [...tasks[source.droppableId]];
    const destColumn = [...tasks[destination.droppableId]];
    const [removedTask] = sourceColumn.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      sourceColumn.splice(destination.index, 0, removedTask);
      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceColumn,
      }));
    } else {
      // Moving to a different column
      destColumn.splice(destination.index, 0, removedTask);
      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      }));
    }
  };

  return (
    <div className="container">
      <h4>Create New Task</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="taskTitle" className="form-label">
            Task Title
          </label>
          <input type="text" className="form-control" id="taskTitle" required />
        </div>
        <div className="mb-3">
          <label htmlFor="taskDescription" className="form-label">
            Task Description
          </label>
          <textarea
            className="form-control"
            id="taskDescription"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </form>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="row mt-4">
          {Object.keys(tasks).map((status) => (
            <div key={status} className="col-md-4">
              <h3>{status}</h3>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      minHeight: '200px',
                      background: '#f8f9fa',
                      padding: '10px',
                      borderRadius: '4px',
                    }}
                  >
                    {tasks[status].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="card mb-2"
                          >
                            <div className="card-body">
                              <h5 className="card-title">{task.title}</h5>
                              <p className="card-text">{task.description}</p>
                              <button
                                className="btn btn-danger"
                                onClick={() => deleteTask(task.id)}
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
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
