import React from 'react';
import styles from './TaskFiles.module.scss';

const TaskFiles = () => {
  const files = [
    { name: 'Файл 1', url: 'https://example.com/file1.pdf' },
    { name: 'Файл 2', url: 'https://example.com/file2.pdf' }
  ];

  const handleOpenFile = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Прикрепленные файлы:</h3>
      <ul className={styles.list}>
        {files.map((file, index) => (
          <li key={index} className={styles.item}>
            <button 
              className={styles.fileButton}
              onClick={() => handleOpenFile(file.url)}
            >
              {file.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskFiles;