import React, { useState } from 'react';
import style from'./CommentAdd.module.scss';
import { useUnit } from "effector-react";
import { comment, $commentStore } from '../../store/commentsStore';

function CommentAdd() {

    const [newComment, setNewCommet] = useState('')
    const comments = useUnit($commentStore)
    
    const onAddComment = ()=>{
        if(newComment.trim()){
            comment(newComment);
            setNewCommet('');
        }
    }
  return (
    <div className={style.comment__container}>
        <h1>Комментарии</h1>
        <input type="text" value={newComment} 
        onChange={(e)=> setNewCommet(e.target.value)}
        placeholder='Написать комментарий' className={style.comment_panel}/>
        <button onClick={onAddComment} className={style.comment_button}>
            Добавить коментарий
        </button>
        <div className="coments">
            {comments.map((coment, index)=>(
                <div className="coment" key={index}>Имя поьзователя:{coment}</div>
            ))}
        </div>
    </div>
  );
};

export default CommentAdd;