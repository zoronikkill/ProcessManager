import TaskStatus from "../TaskStatus/TaskStatus";
import TaskFiles from "../TaskFiles/TaskFiles";
import TaskAuthor from "../TaskAuthor/TaskAuthor";
import TaskDate from "../TaskDate/TaskDate";
import CommentAdd from "../../Features/CommentAdd/CommentAdd";
import style from "./TaskUI.module.scss";

const TaskUI = () => {
  return (
    <div className={style["task_ui_container"]}>
      <div className={style["first_row_container"]}>
        <div className={style["files_and_author"]}>
          <TaskFiles />
          <TaskAuthor author="Иванов Иван Иванович" phone="+7(999)-999-99-99" />
        </div>
        <TaskStatus />
      </div>
      <div className={style["second_row_container"]}>
        <TaskDate startDate="01 / 01 / 25 " plannedDate="01 / 02 / 25" />
      </div>
      <div className={style["third_row_container"]}>
        <CommentAdd />
      </div>
    </div>
  );
};

export default TaskUI;
