import './Header.css';
import Button from '../Button/Button';

function Header() {
  return (
    <header>
      <div className="profile-icon">
        <img src="../../../profile-icon.png" alt="Profile" />
      </div>
      <div className="nav">
        <div className="title">Конструктор проектов</div>
      </div>
    </header>
  );
};

export default Header;