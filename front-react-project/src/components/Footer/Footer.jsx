import { useLocation } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Показываем футер только на главной странице
  if (!isHomePage) {
    return null;
  }

  return (
    <footer>
      <div className="footer-content">
        <a href="tel:+1234567890" className="support-phone">Техническая поддержка</a>
        <a href="mailto:support@example.com" className="support-email">Email</a>
      </div>
    </footer>
  );
}

export default Footer;