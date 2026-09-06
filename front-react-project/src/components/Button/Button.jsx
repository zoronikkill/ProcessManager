import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = ({ href, text, className = '', to, onClick }) => {
  const buttonClass = className ? `${className} button` : 'button';
  
  if (to) {
    return (
      <Link to={to} className={buttonClass}>
        {text}
      </Link>
    );
  }
  
  return (
    <button className={buttonClass} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;