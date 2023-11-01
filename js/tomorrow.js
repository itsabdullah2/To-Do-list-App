const parentOfTaskHolder = document.querySelector(".tasks");
const addBtn = document.getElementById("add-btn");
const input = document.querySelector(".input-of-task");
const sideNav = document.querySelector(".side-nav");
const closeSideNav = document.querySelector(".close-icon");
const openSideNav = document.querySelector(".open-icon");
// get tasks from local storage
let tasks = JSON.parse(localStorage.getItem("tomorrow-tasks")) || [];
// Check to implement the tasks in local storage to page
if (localStorage.getItem("tomorrow-tasks")) {
  tasks.map((task) => {
    createTask(task);
  });
}
if (addBtn) {
  addBtn.addEventListener("click", () => addTaskToArray());
}
if (input) {
  input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      addTaskToArray();
    }
  });
}
if (closeSideNav) {
  // Events to open & close side nav
  closeSideNav.addEventListener("click", () => {
    sideNav.style.display = "none";
  });
  openSideNav.addEventListener("click", () => {
    sideNav.style.display = "flex";
  });
}
document.addEventListener("input", (e) => {
  const idOfTask = e.target.parentElement.id;
  updateTask(idOfTask, e.target);
  localStorage.setItem("tomorrow-tasks", JSON.stringify(tasks));
});
// Event to set the check style
document.addEventListener("click", (e) => {
  const span = e.target.nextSibling;
  // Task Element
  if (e.target.classList.contains("check")) {
    // Toggle Completed For The Task
    toggleStatusTaskWith(e.target.parentElement.id);
    // Toggle Done Class
    e.target.parentElement.classList.toggle("done");
    // Check to control in [contenteditable] attribute
    if (e.target.parentElement.classList.contains("done")) {
      span.removeAttribute("contenteditable");
    } else {
      span.setAttribute("contenteditable", "true");
    }
    localStorage.setItem("tomorrow-tasks", JSON.stringify(tasks));
  }
});
// Remove the
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-task")) {
    removeTask(e.target.parentElement.parentElement.id);
  }
});
function addTaskToArray() {
  const task = {
    id: Date.now(),
    name: input.value,
    isCompleted: false
  };

  tasks.push(task);
  localStorage.setItem("tomorrow-tasks", JSON.stringify(tasks));

  if (input.value !== "") {
    createTask(task);
  } else {
    alert("Please add a task");
    localStorage.removeItem("tomorrow-tasks");
  }
  // Clear Input
  input.value = "";
  input.focus();
}
function createTask(task) {
  // creating task holder
  const taskHolder = document.createElement("div");
  taskHolder.classList.add("task");
  taskHolder.setAttribute("id", task.id);
  // Check if task completed
  if (task.isCompleted) {
    taskHolder.classList.add("done");
  }
  const checkBox = document.createElement("input");
  checkBox.classList.add("check");
  checkBox.setAttribute("type", "checkbox");
  checkBox.setAttribute("id", task.id);
  // Check if task completed
  if (task.isCompleted) {
    checkBox.setAttribute("checked", "checked");
  }
  // creating the task
  const theTask = document.createElement("span");
  if (!task.isCompleted) {
    theTask.setAttribute("contenteditable", "true");
  }
  theTask.textContent = task.name;
  const options = document.createElement("i");
  options.classList.add("fa-solid", "fa-ellipsis");
  // creating menu
  const menuContainer = document.createElement("div");
  const delTask = document.createElement("span");
  const delTxt = document.createTextNode("Delete");
  delTask.appendChild(delTxt);
  // set classes
  menuContainer.classList.add("menu-container");
  delTask.classList.add("remove-task");
  // append element to menu container
  menuContainer.appendChild(delTask);
  // append menu container to task
  taskHolder.appendChild(checkBox);
  taskHolder.appendChild(theTask);
  taskHolder.appendChild(options);
  taskHolder.appendChild(menuContainer);
  if (parentOfTaskHolder) {
    parentOfTaskHolder.appendChild(taskHolder);
  }
  // open menu of options
  options.addEventListener("click", () => {
    // menuContainer.classList.toggle("show");
    handleFlex(menuContainer);
  });
}
// Handle style of display
function handleFlex(event) {
  event.classList.toggle("show");
  if (event.classList.contains("show")) {
    event.style.display = "flex";
  } else {
    event.style.display = "none";
  }
}
// Function to remove the task
function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));
  localStorage.setItem("tomorrow-tasks", JSON.stringify(tasks));
  if (document.getElementById(taskId)) {
    document.getElementById(taskId).remove();
  }
}
// Looping in array of tasks to check if the task is
// is completed or not
function toggleStatusTaskWith(taskId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == taskId) {
      tasks[i].isCompleted == false
        ? (tasks[i].isCompleted = true)
        : (tasks[i].isCompleted = false);
    }
  }
  localStorage.setItem("tomorrow-tasks", JSON.stringify(tasks));
}
// Update Task
function updateTask(taskId, el) {
  const task = tasks.find((task) => task.id === parseInt(taskId));

  if (el.hasAttribute("contenteditable")) {
    task.name = el.textContent;
  }
  localStorage.setItem("tomorrow-tasks", JSON.stringify(tasks));
}
