import React from 'react';
import styles from './TaskAuthor.module.scss';

const TaskAuthor = ({ author, phone }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.label}>Автор:</div>
        <div className={styles.authorName}>{author}</div>
        <div className={styles.authorPhone}>{phone}</div>
      </div>
    </div>
  );
};

export default TaskAuthor;