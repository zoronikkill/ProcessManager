import './MainContent.css';
import Button from '../Button/Button';

function MainContent() {
  return (
    <main>
      <div className="div-button">
        <Button href="#" text="Все проекты" />
        <Button href="#" text="Поиск проекта" />
        <Button href="#" text="Справочники" />
      </div>
      <div className="button-container">
        <Button href="#" text="Создать проект" className="main-button" />
        <Button href="#" text="Проекты в работе" className="main-button" />
        <Button href="#" text="Архив проектов" className="main-button" />
      </div>
    </main>
  );
};

export default MainContent;