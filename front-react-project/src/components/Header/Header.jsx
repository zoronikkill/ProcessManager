import style from "./Header.module.scss";
import profile_icon from"../../assets/cat.jpg"

function Header({ title }) {
  return (
    <header className={style.header}>
      <div className={style.app_name}>Конструктор проектов</div>
      
      <div className={style.window_title}>{title}</div>
      
      <div className={style.profile}>
        <img src={profile_icon} alt="Profile" />
      </div>
    </header>
  );
}

export default Header;
