import './Button.css';

function Button({ href, text, className = '' }) {
  const buttonClass = className ? `${className} button` : 'button';
  
  return (
    <a href={href} className={buttonClass}>
      {text}
    </a>
  );
};

export default Button;