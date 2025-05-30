import style from "./Task.module.scss";
import TaskDescription from "../../shared/TaskDescription/TaskDescription";
import TaskHeader from "../../shared/TaskHeader/TaskHeader";
import TaskUI from "../../shared/TaskUI/TaskUI";



const Task = () => {
  return (
    <div>
      <div className={style.task__content}>
        <TaskHeader task_name="Название задачи" />
        <TaskDescription task_text="text" />
        <TaskUI />
      </div>
    </div>
  );
};

export default Task;
