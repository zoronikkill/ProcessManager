import React from 'react';
import './Acardion.scss';

const Acardion = () => {
    return (
        <div class="equipment-item">
        <input type="checkbox" class="equipment-item__input" id="inputId" />
        <div class="equipment-item__content">
          <div class="equipment-item__content-image" alt="equipment" ></div>
          <p class='equipment-item__toggle-text'>
            Длиииииииииииииииииииииииииииииииииииииииииииииииииииииииииии
            ииииииииииииииииииииииииииииииииииииииииииииииииииииииииииииии
            нный текст
          </p>
        </div>
        <label htmlFor="inputId" class="equipment-item__toggle"
          ><p class="equipment-item__toggle-text">Подробнее</p>
        </label>
      </div>
    );
  };

export default Acardion;