import TaskStatus from "../TaskStatus/TaskStatus";
import TaskFiles from "../TaskFiles/TaskFiles";
import TaskAuthor from "../TaskAuthor/TaskAuthor";
import TaskDate from "../TaskDate/TaskDate";
import CommentAdd from "../../Features/CommentAdd/CommentAdd";
import style from "./TaskUI.module.scss";

const TaskUI = ({ status,  author,  phone, startDate, endDate }) => {
  return (
    <div className={style["task_ui_container"]}>
      <div className={style["first_row_container"]}>
        <div className={style["files_and_author"]}>
          <TaskFiles />
          <TaskAuthor task_author={author} phone={phone} />
        </div>
        <TaskStatus task_status={status} />
      </div>
      <div className={style["second_row_container"]}>
        <TaskDate startDate={startDate} plannedDate={endDate} />
      </div>
      <div className={style["third_row_container"]}>
        <CommentAdd />
      </div>
    </div>
  );
};

export default TaskUI;
