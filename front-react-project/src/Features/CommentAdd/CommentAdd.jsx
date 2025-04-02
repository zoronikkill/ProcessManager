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
        <h1>клёвые комменты</h1>
        <input type="text" value={newComment} 
        onChange={(e)=> setNewCommet(e.target.value)}
        placeholder='go comment'/>
        <button onClick={onAddComment}>
            добавить комент
        </button>
        <div className="coments">
            {comments.map((coment, index)=>(
                <div className="coment" key={index}>{coment}</div>
            ))}
        </div>
    </div>
  );
};

export default CommentAdd;