$(function () {
  let todos = [];

  //Charge items saved
  if(localStorage.getItem("todos")){
    todos = JSON.parse(localStorage.getItem("todos"))
  }

  function saveTodos(){
    localStorage.setItem("todos",JSON.stringify(todos))
  }

  // Enter new task
  $(".input_todo").on("keypress", function (e) {
    if (e.which === 13 && $(this).val().trim() !== "") {
      const text = $(this).val().trim();
      const todo = { text, completed: false };
      todos.push(todo);
      $(this).val("");
      saveTodos();
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
        <li  draggable="true" data-index="${index}" class="${todo.completed ? 'done' : ''}">
          <label class="check-content">
            <input  type="checkbox" class="completed-btn" ${todo.completed ? "checked" : ""}>
            <span class="check-circle"></span>
           </label> 
          <span>${todo.text}</span>
          <button class="delete-btn"><img src="./images/icon-cross.svg" alt=""></button>
        </li>
      `);
      $list.append($item);
    });

    $(".items_left").text(`${todos.filter(t => !t.completed).length} items left`);
    saveTodos();
  }

  // Check completed task
  $(document).on("change", ".todos input[type='checkbox']", function () {
    const index = $(this).closest("li").data("index");
    todos[index].completed = this.checked;
    saveTodos();
    renderTodos();
  });

  // Delete completed task
  $(document).on("click", ".delete-btn", function () {
    const index = $(this).closest("li").data("index");
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  });

  // Filters
  $(".all-btn").on("click", () => renderTodos("all"));
  $(".active-btn").on("click", () => renderTodos("active"));
  $(".show-complete-btn").on("click", () => renderTodos("completed"));

  // Clear completed task
  $(".clear-btn").on("click", function () {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
  });

  let isLight = false;
  //Change theme
  $(".toggle_theme").on("click", function () {
    isLight = !isLight;

    $("body").toggleClass("dark-theme light-theme");

    const newIcon = isLight ? "./images/icon-moon.svg" : "./images/icon-sun.svg";
    $(this).attr("src", newIcon);

    setBackgroundImage();
  });

  $("body").addClass("dark-theme");


  let draggedItem = null;
  //Active the drag and drop on the list
  $(".show-btn").on("click", function () {
    $(".todos li").attr("draggable", true);

    $(".todos li").on("dragstart", function (e) {
      draggedItem = this;
      e.originalEvent.dataTransfer.setData("text/plain", $(this).data("id"));
    });

    $(".todos li").on("dragover", function (e) {
      e.preventDefault(); 
    });

    $(".todos li").on("drop", function (e) {
      e.preventDefault();
      if (draggedItem !== this) {
        if ($(this).index() < $(draggedItem).index()) {
          $(this).before(draggedItem);
        } else {
          $(this).after(draggedItem);
        }
      }
    });

    $(this).text("Drag and drop enabled");
  });

  //Change the backgroud image depends of the size and theme
  function setBackgroundImage() {
  const isLight = $("body").hasClass("light-theme");
  const isMobile = window.innerWidth <= 600;
  let bgImg = "";

  if (isMobile) {
    bgImg = isLight ? "./images/bg-mobile-light.jpg" : "./images/bg-mobile-dark.jpg";
  } else {
    bgImg = isLight ? "./images/bg-desktop-light.jpg" : "./images/bg-desktop-dark.jpg";
  }
  $(".image_background").attr("src", bgImg);
}

$(window).on("resize", setBackgroundImage);
$(document).ready(function(){
  setBackgroundImage();
  renderTodos();
});

});
