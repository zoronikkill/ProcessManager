import React from 'react';
import { Link } from 'react-router-dom';
import './Button.module.scss';

const Button = ({ href, text, className = '', to }) => {
  const buttonClass = className ? `${className} button` : 'button';
  
  if (to) {
    return (
      <Link to={to} className={buttonClass}>
        {text}
      </Link>
    );
  }
  
  return (
    <a href={href} className={buttonClass}>
      {text}
    </a>
  );
};

export default Button;