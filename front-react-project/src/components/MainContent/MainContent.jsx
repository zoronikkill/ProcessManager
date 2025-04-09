import React from 'react';
import './MainContent.module.scss';
import Button from '../Button/Button';
import ProjectConstructor from '../ProjectConstructor/ProjectConstructor';

const MainContent = () => {
  return (
    <main>
      <div className="div-button">
        <Button href="#" text="Все проекты" />
        <Button href="#" text="Поиск проекта" />
        <Button href="#" text="Справочники" />
      </div>
      <ProjectConstructor />
    </main>
  );
};

export default MainContent;