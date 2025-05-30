import React from 'react';
import styles from './TaskDate.module.scss';

const TaskDate = ({ startDate, plannedDate }) => {
  return (
    <div className={styles.container}>
      <div className={styles.dateItem}>
        <span className={styles.dateLabel}>Дата начала:</span>
        <span className={styles.dateValue}>{startDate}</span>
      </div>
      <div className={styles.dateItem}>
        <span className={styles.dateLabel}>Плановая дата:</span>
        <span className={styles.dateValue}>{plannedDate}</span>
      </div>
    </div>
  );
};

export default TaskDate;