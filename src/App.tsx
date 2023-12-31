import { useState } from 'react';
import './App.css';
import { Todolist } from './Todolist';
import { v1 } from 'uuid';
import AddItemForm from './AddItemForm';
import {
  AppBar,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import { Menu } from '@mui/icons-material';

export type FilterValuesType = 'all' | 'completed' | 'active';
export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};
export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

function App() {
  // Redux:
  let todolistId1 = v1();
  let todolistId2 = v1();

  // todоlists:
  let [todolists, setTodolists] = useState<Array<TodolistType>>([
    { id: todolistId1, title: 'What to learn', filter: 'all' },
    { id: todolistId2, title: 'What to buy', filter: 'all' },
  ]);

  // Tasks for todolists:
  let [tasksObj, setTasksObj] = useState<TasksStateType>({
    [todolistId1]: [
      { id: v1(), title: 'CSS', isDone: true },
      { id: v1(), title: 'JS', isDone: true },
      { id: v1(), title: 'React', isDone: false },
      { id: v1(), title: 'Redux', isDone: false },
    ],
    [todolistId2]: [
      { id: v1(), title: 'Milk', isDone: true },
      { id: v1(), title: 'Eggs', isDone: false },
      { id: v1(), title: 'Nuts', isDone: false },
      { id: v1(), title: 'Meat', isDone: false },
    ],
  });

  // Dispatch:
  // Add new task
  function addTask(todolistId: string, title: string) {
    let task = { id: v1(), title: title, isDone: false };
    let tasks = tasksObj[todolistId];
    tasksObj[todolistId] = [task, ...tasks];
    setTasksObj({ ...tasksObj });
  }

  // Remove task
  function removeTask(todolistId: string, taskId: string) {
    let tasks = tasksObj[todolistId];
    let filteredTasks = tasks.filter((t) => t.id !== taskId);
    tasksObj[todolistId] = filteredTasks;
    setTasksObj({ ...tasksObj });
  }

  // Change task status
  function changeTaskStatus(todolistId: string, taskId: string, isDone: boolean) {
    let tasks = tasksObj[todolistId];

    let task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.isDone = isDone;
      setTasksObj({ ...tasksObj });
    }
  }

  // Change task title
  function changeTaskTitle(todolistId: string, taskId: string, title: string) {
    let tasks = tasksObj[todolistId];

    let task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.title = title;
      setTasksObj({ ...tasksObj });
    }
  }

  // Filter for todolist
  function changeFilter(todolistId: string, value: FilterValuesType) {
    let todolist = todolists.find((tl) => tl.id === todolistId);
    if (todolist) todolist.filter = value;
    setTodolists([...todolists]);
  }

  // Delete todolist
  function removeTodolist(todolistId: string) {
    setTodolists(todolists.filter((tl) => tl.id !== todolistId));
    delete tasksObj[todolistId];
    setTasksObj({ ...tasksObj });
  }

  // Add todolist
  function addTodolist(title: string) {
    let todolist: TodolistType = {
      id: v1(),
      title: title,
      filter: 'all',
    };
    setTasksObj({ ...tasksObj, [todolist.id]: [] });
    setTodolists([todolist, ...todolists]);
  }

  // Change todolist title
  function changeTodolistTitle(todolistId: string, title: string) {
    const todolist = todolists.find((tl) => tl.id === todolistId);
    if (todolist) {
      todolist.title = title;
      setTodolists([...todolists]);
    }
  }

  return (
    <div className='App'>
      <AppBar position='static'>
        <Toolbar>
          <IconButton edge='start' color='inherit' aria-label='menu'>
            <Menu />
          </IconButton>
          <Typography variant='h6'>News</Typography>
          <Button color='inherit'>Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid container style={{ padding: '20px 0px 20px 0px' }}>
          <AddItemForm addItem={addTodolist} />
        </Grid>
        <Grid container spacing={3}>
          {todolists.map((tl) => {
            let tasksForTodoList = tasksObj[tl.id];
            if (tl.filter === 'completed') {
              tasksForTodoList = tasksForTodoList.filter((t) => t.isDone === true);
            } else if (tl.filter === 'active') {
              tasksForTodoList = tasksForTodoList.filter((t) => t.isDone === false);
            }

            return (
              <Grid item>
                <Paper style={{ padding: '10px' }}>
                  <Todolist
                    key={tl.id}
                    id={tl.id}
                    title={tl.title}
                    filter={tl.filter}
                    tasks={tasksForTodoList}
                    removeTodolist={removeTodolist}
                    changeFilter={changeFilter}
                    changeTodolistTitle={changeTodolistTitle}
                    addTask={addTask}
                    removeTask={removeTask}
                    changeTaskStatus={changeTaskStatus}
                    changeTaskTitle={changeTaskTitle}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
