import React, { useState } from 'react';
import style from'./FiltersBtn.module.scss';
import Button from '../Button/Button';
import ModalPopOutRoot from '../../shared/ModalPopOutRoot/ModalPopOutRoot';

const FiltersBtn = () => {
    const [modalPopOutRootIsOpen,setModalPopOutRootIsOpen] = useState(false)
    const onOpenOrCloseModalPopOutRoot = () =>{
        setModalPopOutRootIsOpen(!modalPopOutRootIsOpen)
    }
    return (
        <div>
            <button onClick={onOpenOrCloseModalPopOutRoot} className={style.filter}>я открываю модалку</button>
            {
                modalPopOutRootIsOpen ?
                    <ModalPopOutRoot>
                        <Button text={"я ModalPopOutRoot"} className="main-button"/>
                        <Button text={"я ModalPopOutRoot"} className="main-button"/>
                    </ModalPopOutRoot>
                :null
            }
        </div>
    );
  };

export default FiltersBtn;