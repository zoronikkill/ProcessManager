import style from "./Task.module.scss";
import TaskDescription from "../../shared/TaskDescription/TaskDescription";
import TaskStatus from "../../shared/TaskStatus/TaskStatus";

const Task = () => {
  return (
    <div className={style.task__content}>
      <div className={style["task__header"]}>Название задачи</div>
      <TaskDescription />
      <TaskStatus />
    </div>
  );
};

export default Task;
