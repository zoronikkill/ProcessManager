import style from "./Footer.module.scss";
function Footer() {
  return (
    <footer className={style.footer}>
        <a href="tel:+1234567890" className={style.support_phone}>
          Техническая поддержка: +1234567890
        </a>
        <a href="mailto:support@example.com" className={style.support_email}>
          Email: support@example.com
        </a>
    </footer>
  );
}

export default Footer;
