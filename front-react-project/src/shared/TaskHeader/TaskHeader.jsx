import style from "./TaskHeader.module.scss"


const TaskHeader = ({ task_name }) => {
  return(
    <div className={style["task__header"]}>
      {task_name}
    </div>
  );
};

export default TaskHeader;