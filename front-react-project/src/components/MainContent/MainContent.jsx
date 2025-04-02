import style from'./MainContent.module.scss';
import Button from '../../Features/Button/Button';

function MainContent() {
  return (
    <main>
      <div className={style.div__button}>
        <Button href="#" text="Все проекты" />
        <Button href="#" text="Поиск проекта" />
        <Button href="#" text="Справочники" />
      
      </div>
      <div className={style.button__container}>
        <Button href="#" text="Создать проект" className="main-button" />
        <Button href="#" text="Проекты в работе" className="main-button" />
        <Button href="#" text="Архив проектов" className="main-button" />
      </div>
    </main>
  );
};

export default MainContent;