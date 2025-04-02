import React from 'react';
import style from'./ModalPopOutRoot.module.scss';

const ModalPopOutRoot = ({ children }) => {
    return (
      <div className={style.modal_popout_root}>
        {children}
      </div>
    );
  };

export default ModalPopOutRoot;