import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <div className="profile-icon">
        <img src="profile-icon.png" alt="Profile" />
      </div>
      <div className="nav">
        <Link to="/" className="title">Конструктор проектов</Link>
        <Link to="/employees" className="nav-link">Сотрудники</Link>
      </div>
    </header>
  );
}

export default Header;