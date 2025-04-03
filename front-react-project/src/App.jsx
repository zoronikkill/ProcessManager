import React from 'react';
import './App.css';
import Header from './components/Header/Header';
// import MainContent from './components/MainContent/MainContent';
import Footer from './components/Footer/Footer';
import CommentAdd from './Features/CommentAdd/CommentAdd';
import FiltersBtn from './Features/FiltersBtn/FiltersBtn';
import Accardion from './Features/Acardion/Acardion';

function App() {
  return (
    <div>
      <Header />
      <div className="container">
        <Accardion />
        <FiltersBtn />
        <CommentAdd />
      </div>
      <Footer />
    </div>
  );
}

export default App;