import style from "./Task.module.scss";
import TaskDescription from "../../shared/TaskDescription/TaskDescription";
import TaskHeader from "../../shared/TaskHeader/TaskHeader";
import TaskUI from "../../shared/TaskUI/TaskUI";

const Task = ({ taskData, onClose }) => {
  console.log("Task Component - Status:", taskData.status);
  return (
    <div>
      <div className={style.task__content}>
        <button onClick={onClose} className={style.backButton}>
          ← Назад к списку
        </button>
        <TaskHeader task_name={taskData.name} />
        <TaskDescription task_text={taskData.description} />
        <TaskUI 
          status={taskData.status}
          author={taskData.author}
          phone={taskData.phone}
          startDate={taskData.start_date}
          endDate={taskData.end_date}
        />
      </div>
    </div>
  );
};

export default Task;