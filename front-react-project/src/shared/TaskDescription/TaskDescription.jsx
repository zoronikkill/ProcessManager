import style from "./TaskDescription.module.scss";

const TaskDescription = ({ task_text }) => {
  return(
    <div className={style.task_description}>
      {task_text}
    </div>
  );
};

export default TaskDescription;