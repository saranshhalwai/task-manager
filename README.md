# Kanban Task Manager

## Overview

This React application is a Kanban-style task manager. It allows users to create, manage, and organize tasks into different columns such as "ToDo", "InProgress", and "Done". The application supports drag-and-drop functionality for moving tasks between columns and uses localStorage to persist tasks and dark mode preference across sessions.

## Features

- **Task Creation**: Easily create new tasks with a title, description, deadline, tag, and priority.
- **Drag and Drop**: Seamlessly move tasks between different columns.
- **Task Management**: Edit and delete tasks as needed.
- **Persistent Storage**: Tasks and dark mode preference are saved in localStorage and reloaded on page refresh.
- **Dark Mode**: Toggle between light and dark mode for better accessibility.

This React application is a Kanban-style task manager. It allows users to create, manage, and organize tasks into different columns such as "ToDo", "InProgress", and "Done". The application supports drag-and-drop functionality for moving tasks between columns and uses cookies to persist tasks across sessions.

## Installation

To get started with this project, clone the repository and install the dependencies:

```sh
git clone https://github.com/saranshhalwai/task-manager
cd task-manager
npm install 
```

## Running the Application

To start the appliction, use the following command:

```sh
npm start
```

This will run the app in development mode. Open <http://localhost:3000> to view it in the browser.

## Project Structure

The project has the following structure:

```sh
.gitignore
package.json
public/
  index.html
README.md
src/
  App.js
  index.css
  index.js
package-lock.json
package.json
LICENSE.md
```

- `index.html`: The main HTML file.
- `index.js` : The entry point for the react application.
- `App.js` : The main component containing the Kanban board logic.
- `index.css` : Optional CSS for styling.

## Dependencies

- `react`: A JavaScript library for building user interfaces.
- `react-dom`: Provides DOM-specific methods for React.
- `@hello-pangea/dnd`: A drag-and-drop library for react.
- `js-cookie` : A simple, lightweight JavaScript API for handling cookies.
- `bootstrap` : A CSS framework for styling.

## License

This project is licensed under the ISC License.
