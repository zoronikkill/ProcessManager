import React from 'react';
import styles from './TaskAuthor.module.scss';

const TaskAuthor = ({ task_author, phone }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.label}>Автор:</div>
        <div className={styles.authorName}>{task_author}</div>
        <div className={styles.authorPhone}>{phone}</div>
      </div>
    </div>
  );
};

export default TaskAuthor;