import React from 'react';
import style from './App.module.scss'
// import MainContent from './components/MainContent/MainContent';
// import CommentAdd from './Features/CommentAdd/CommentAdd';
// import FiltersBtn from './Features/FiltersBtn/FiltersBtn';
// import Accardion from './Features/Acardion/Acardion';
import Header from './components/header/Header';
import Task from './components/Task/Task';
import Footer from './components/Footer/Footer';


function App() {
  return (
    <div className={style.body}>
      <Header title="Описание задачи" />
      <Task />
      <Footer />
    </div>
  );
}

export default App;