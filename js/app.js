$(function () {
  let todos = [];

  // Enter new task
  $(".input_todo").on("keypress", function (e) {
    if (e.which === 13 && $(this).val().trim() !== "") {
      const text = $(this).val().trim();
      const todo = { text, completed: false };
      todos.push(todo);
      $(this).val("");
      renderTodos();
    }
  });

  // Add new task
  function renderTodos(filter = "all") {
    const $list = $(".todos");
    $list.empty();

    const filtered = todos.filter(todo => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    });

    filtered.forEach((todo, index) => {
      const $item = $(`
        <li data-index="${index}" class="${todo.completed ? 'done' : ''}">
          <div class="check-content">
          <input  type="checkbox" class="completed-btn" ${todo.completed ? "checked" : ""}>
           </div> 
          <span>${todo.text}</span>
          <button class="delete-btn">✖</button>
        </li>
      `);
      $list.append($item);
    });

    $(".items_left").text(`${todos.filter(t => !t.completed).length} items left`);
  }

  // Check completed task
  $(document).on("change", ".todos input[type='checkbox']", function () {
    const index = $(this).closest("li").data("index");
    todos[index].completed = this.checked;
    renderTodos();
  });

  // Delete completed task
  $(document).on("click", ".delete-btn", function () {
    const index = $(this).closest("li").data("index");
    todos.splice(index, 1);
    renderTodos();
  });

  // Filters
  $(".all-btn").on("click", () => renderTodos("all"));
  $(".active-btn").on("click", () => renderTodos("active"));
  $(".completed-btn").on("click", () => renderTodos("completed"));

  // Clear completed task
  $(".cleat-btn").on("click", function () {
    todos = todos.filter(todo => !todo.completed);
    renderTodos();
  });

});
