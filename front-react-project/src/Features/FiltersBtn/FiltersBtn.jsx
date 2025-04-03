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
            <button onClick={onOpenOrCloseModalPopOutRoot} className={style.filter}>фильтр</button>
            {
                modalPopOutRootIsOpen ?
                    <ModalPopOutRoot>
                        <Button text={"сортировка 1"} className="main-button"/>
                        <Button text={"сортировка 2"} className="main-button"/>
                    </ModalPopOutRoot>
                :null
            }
        </div>
    );
  };

export default FiltersBtn;