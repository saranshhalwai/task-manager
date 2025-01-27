import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrash, FaClock, FaTag, FaEdit } from 'react-icons/fa';

/**
 * The main component of the Task Manager application.
 * 
 * @component
 * @returns {JSX.Element} The rendered component.
 * 
 * @description
 * This component manages the state and behavior of the task manager application. It includes features such as:
 * - Adding, editing, and deleting tasks.
 * - Drag-and-drop functionality to move tasks between columns.
 * - Filtering and sorting tasks based on search query and sort options.
 * - Dark mode toggle.
 * - Persisting tasks and dark mode preference in localStorage.
 * 
 * @example
 * <App />
 * 
 * @function
 * @name App
 * 
 * @property {Object} tasks - The state object containing tasks categorized by their status.
 * @property {Array} tasks.ToDo - Array of tasks in the "To Do" column.
 * @property {Array} tasks.InProgress - Array of tasks in the "In Progress" column.
 * @property {Array} tasks.Done - Array of tasks in the "Done" column.
 * 
 * @property {boolean} darkMode - The state boolean indicating whether dark mode is enabled.
 * @property {string} searchQuery - The state string for the search query to filter tasks.
 * @property {string} sortOption - The state string for the selected sort option.
 * @property {Object|null} editingTask - The state object for the task being edited, or null if no task is being edited.
 * 
 * @property {function} handleSubmit - Handles form submission to add a new task.
 * @property {function} onDragEnd - Handles the end of a drag-and-drop action.
 * @property {function} deleteTask - Deletes a task from a specified column.
 * @property {function} editTask - Sets the task to be edited.
 * @property {function} saveTaskEdit - Saves the edited task.
 * @property {function} filteredAndSortedTasks - Filters and sorts tasks based on search query and sort option.
 */
function App() {
  const [tasks, setTasks] = useState({
    ToDo: [],
    InProgress: [],
    Done: [],
  });

  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  /**
   * Load tasks and dark mode preference from localStorage on component mount.
   */
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) setTasks(savedTasks);
    const savedMode = JSON.parse(localStorage.getItem('darkMode'));
    if (savedMode) setDarkMode(savedMode);
  }, []);

  /**
   * Save tasks and dark mode preference to localStorage whenever they change.
   */
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [tasks, darkMode]);

  /**
   * Handle form submission to add a new task.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: `task-${Date.now()}`,
      title: e.target.taskTitle.value,
      description: e.target.taskDescription.value,
      deadline: e.target.taskDeadline.value,
      tag: e.target.taskTag.value,
      priority: e.target.taskPriority.value,
    };
    setTasks((prev) => ({
      ...prev,
      ToDo: [...prev.ToDo, newTask],
    }));
    e.target.reset();
  };

  const onDragEnd = (result) => {
    document.body.style.userSelect = 'auto';
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
    setTasks((prev) => {
      const updatedColumn = [...prev[column]];
      updatedColumn.splice(index, 1);
      return {
        ...prev,
        [column]: updatedColumn,
      };
    });
  };

  const editTask = (column, index) => {
    const taskToEdit = tasks[column][index];
    setEditingTask({ ...taskToEdit, column, index });
  };

  const saveTaskEdit = (e) => {
    e.preventDefault();
    const updatedTask = {
      ...editingTask,
      title: e.target.taskTitle.value,
      description: e.target.taskDescription.value,
      deadline: e.target.taskDeadline.value,
      tag: e.target.taskTag.value,
      priority: e.target.taskPriority.value,
    };

    setTasks((prev) => {
      const updatedColumn = [...prev[editingTask.column]];
      updatedColumn[editingTask.index] = updatedTask;
      return {
        ...prev,
        [editingTask.column]: updatedColumn,
      };
    });
    setEditingTask(null);
  };

  const filteredAndSortedTasks = (columnTasks) => {
    let filteredTasks = columnTasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOption === 'title') {
      filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'deadline') {
      filteredTasks.sort((a, b) =>
        a.deadline && b.deadline ? new Date(a.deadline) - new Date(b.deadline) : 0
      );
    } else if (sortOption === 'priority') {
      const priorityOrder = { Low: 1, Medium: 2, High: 3 };
      filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    return filteredTasks;
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

        <div className="d-flex mb-4">
          <input
            type="text"
            className="form-control me-3"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="form-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="title">Title</option>
            <option value="deadline">Deadline</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <form onSubmit={editingTask ? saveTaskEdit : handleSubmit} className="mb-4">
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                id="taskTitle"
                placeholder="Task Title"
                defaultValue={editingTask?.title || ''}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                id="taskDescription"
                placeholder="Task Description"
                defaultValue={editingTask?.description || ''}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                id="taskDeadline"
                defaultValue={editingTask?.deadline || ''}
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                id="taskTag"
                placeholder="Tag"
                defaultValue={editingTask?.tag || ''}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                id="taskPriority"
                defaultValue={editingTask?.priority || ''}
                required
              >
                <option value="Low" style={{ color: 'green' }}>Low</option>
                <option value="Medium" style={{ color: 'orange' }}>Medium</option>
                <option value="High" style={{ color: 'red' }}>High</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            {editingTask ? 'Save Changes' : 'Add Task'}
          </button>
        </form>

        <DragDropContext onDragEnd={onDragEnd} onDragStart={() => document.body.style.userSelect = 'none'}>
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
                      {filteredAndSortedTasks(tasks[status]).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="card mb-3 task-card"
                              style={{
                                borderLeft: `5px solid ${
                                  task.priority === 'Low'
                                    ? 'green'
                                    : task.priority === 'Medium'
                                    ? 'orange'
                                    : 'red'
                                }`,
                              }}
                            >
                              <div className="card-body">
                                <h5 className="card-title d-flex justify-content-between">
                                  {task.title}
                                  <span>
                                    <FaEdit
                                      className="text-primary me-3"
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => editTask(status, index)}
                                    />
                                    <FaTrash
                                      className="text-danger"
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => deleteTask(status, index)}
                                    />
                                  </span>
                                </h5>
                                <p className="card-text">{task.description}</p>
                                {task.deadline && (
                                  <div
                                    className={`badge ${
                                      new Date(task.deadline) < new Date()
                                        ? 'bg-danger'
                                        : 'bg-warning'
                                    } text-dark`}
                                  >
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
                                    task.priority === 'Low'
                                      ? 'bg-success'
                                      : task.priority === 'Medium'
                                      ? 'bg-warning'
                                      : 'bg-danger'
                                  }`}>{task.priority}</span>
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
