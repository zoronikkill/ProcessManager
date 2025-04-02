import style from './Button.module.scss';

function Button({ href, text, className = '' }) {
  const buttonClass =` className ? ${className} ${style.button} : ${style.button}`;

  const onAlert = () => {
    alert("test")
  } 

  return (
    <a onClick={onAlert} href={href} className={buttonClass}>
      {text}
    </a>
  );
}

export default Button;
