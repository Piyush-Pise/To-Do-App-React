import "./ResultFooter.css";

function ResultFooter(prop) {
  return (
    <>
      <div
        className={
          "footer-container " + (prop.mode ? "footer-dark" : "footer-light")
        }
      >
        <div className="item-count">{prop.count} items left</div>
        <div className="status-buttons">
          <button
            className={
              "filter-buttons" +
              (prop.mode ? "-dark" : "-light") +
              (prop.activeFilterIndex === 0 ? " active" : "")
            }
            onClick={() => {
              prop.OnFilter(0);
            }}
          >
            All
          </button>
          <button
            className={
              "filter-buttons" +
              (prop.mode ? "-dark" : "-light") +
              (prop.activeFilterIndex === 1 ? " active" : "")
            }
            onClick={() => {
              prop.OnFilter(1);
            }}
          >
            Active
          </button>
          <button
            className={
              "filter-buttons" +
              (prop.mode ? "-dark" : "-light") +
              (prop.activeFilterIndex === 2 ? " active" : "")
            }
            onClick={() => {
              prop.OnFilter(2);
            }}
          >
            Completed
          </button>
        </div>
        <div className="clear-completed-container">
          <button
            className={"filter-buttons" + (prop.mode ? "-dark" : "-light")}
            onClick={()=>prop.HandleOnClearCompleted()}
          >
            Clear Completed
          </button>
        </div>
      </div>
    </>
  );
}

export default ResultFooter;
