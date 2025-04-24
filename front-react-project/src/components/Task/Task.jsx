import style from "./Task.module.scss";
import TaskDescription from "../../shared/TaskDescription/TaskDescription";

const Task = () => {
  return (
    <div className={style.task__content}>
      <TaskDescription />
    </div>
  );
};

export default Task;