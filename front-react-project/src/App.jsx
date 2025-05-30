import React from 'react';
import style from './App.module.scss'
// import MainContent from './components/MainContent/MainContent';
// import CommentAdd from './Features/CommentAdd/CommentAdd';
// import FiltersBtn from './Features/FiltersBtn/FiltersBtn';
// import Accardion from './Features/Acardion/Acardion';
import Header from './components/header/Header';
import Task from './components/Task/Task';
import Footer from './components/Footer/Footer';
import TasksList from './components/TaskList/TaskList';


function App() {
  return (
    <div className={style.body}>
      {/* Описание задачи */}
      <Header title="Описание задачи" />
      {/* <Task /> */}
      <TasksList />
      <Footer />
    </div>
  );
}

export default App;