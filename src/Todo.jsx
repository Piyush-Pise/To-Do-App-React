function Todo(prop) {
  return (
    <>
      <div
        className={
          "todo-container " +
          (prop.mode ? "todo-dark" : "todo-light") +
          (prop.index === 0 ? " first" : "")
        }
      >
        <div
          onClick={() => {
            prop.UpdateStatus(prop.index);
          }}
          className={
            "todo-circle-on-left" + (prop.completed ? " complete" : "")
          }
        >
          {prop.completed && <div className="check-sign"></div>}
        </div>
        <div className={"todo-content" + (prop.completed ? " complete" : "")}>
          {prop.content}
        </div>
        <div
          onClick={() => {
            prop.DeleteTodo(prop.index);
          }}
          className="delete-todo-button"
        ></div>
      </div>
    </>
  );
}

export default Todo;
