// Importing a function
import { handleClock } from "./timer.js";
setInterval(handleClock, 100);
// General Variables
const parentOfTaskHolder = document.querySelector(".tasks");
const taskTitle = document.getElementById("task-title");
const titleField = document.getElementById("title-field");
const userNameSpan = document.querySelector(".nav-bar .user-name");
// Side Nav Variables
const sideNav = document.querySelector(".side-nav");
const closeSideNav = document.querySelector(".close-icon");
const openSideNav = document.querySelector(".open-icon");
const lis = document.querySelectorAll(".sections li");
const changeName = document.querySelector(".change-name input");
// Page Content Variables
const addTask = document.querySelector(".add-task");
const calender = document.querySelector(".calender");
const calendarHolder = document.querySelector(".calendar-holder");
const currentDate = document.querySelector(".current-date");
const changeMonthBtn = document.querySelectorAll(".icons button");
const days = document.querySelector(".days");

// get title from local storage
let savedTitle = localStorage.getItem("title");
// check if the title exist
if (savedTitle) {
  if (titleField) {
    titleField.value = savedTitle;
  }
}
// get title from local storage
let savedName = localStorage.getItem("name");
// check if the title exist
if (savedName) {
  if (userNameSpan) {
    userNameSpan.innerHTML = savedName;
  }
}
// get tasks from local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// Check to implement the tasks in local storage to page
if (localStorage.getItem("tasks")) {
  tasks.map((task) => {
    createTask(task);
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
// Change the current text => (page title, user name)
// and save the value in local storage
if (titleField) {
  // changeCurrent(taskTitle, titleField, "title", "Home page");
  titleField.addEventListener("input", () => {
    localStorage.setItem("title", titleField.value);
  });
}
if (changeName) {
  changeCurrent(userNameSpan, changeName, "name", "User name");
}
// Creating Popup to add task [ with DOM ]
if (addTask) {
  addTask.addEventListener("click", () => {
    // Create Div
    const popupDiv = document.createElement("div");
    popupDiv.classList.add("popup");
    // Create box for input & btn
    const boxHolder = document.createElement("div");
    boxHolder.classList.add("box-holder");
    // Create Input of tasks
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.name = "popup-task-input";
    input.setAttribute("placeholder", "Enter Task");
    input.classList.add("input-of-task");
    // Create Button
    const btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.classList.add("btn");
    btn.innerHTML = "Add Task";
    boxHolder.appendChild(input);
    boxHolder.appendChild(btn);
    popupDiv.appendChild(boxHolder);
    // Create X mark
    const span = document.createElement("span");
    const spanTxt = document.createTextNode("X");
    span.classList.add("exit");
    span.appendChild(spanTxt);
    // Append span to div
    popupDiv.appendChild(span);
    // Append div to body
    document.body.appendChild(popupDiv);
    // send the task on click
    btn.addEventListener("click", addTaskToArray);
    // send the task on Enter
    input.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        addTaskToArray();
      }
    });
    // Calling Functions => [overlay, closePopup, closePopupOnEsc]
    overlayEl();
    closePopup(popupDiv);
    closePopupOnEsc(popupDiv);
  });
}
// open the calendar on click
if (calender) {
  calender.addEventListener("click", () => {
    calendarHolder.classList.toggle("show");
    if (calendarHolder.classList.contains("show")) {
      calendarHolder.style.display = "block";
    } else {
      calendarHolder.style.display = "none";
    }
    handleCalendar();
  });
}
// Remove the
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-task")) {
    removeTask(e.target.parentElement.parentElement.id);
  }
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
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});
document.addEventListener("input", (e) => {
  const idOfTask = e.target.parentElement.id;
  updateTask(idOfTask, e.target);
  localStorage.setItem("tasks", JSON.stringify(tasks));
});
// FUNCTIONS
// changing the current text and save the value in local storage
function changeCurrent(current, itsValue, key, currentText) {
  itsValue.addEventListener("input", () => {
    current.innerHTML = itsValue.value;

    localStorage.setItem(key, itsValue.value);

    if (itsValue.value === "") {
      current.innerHTML = currentText;
      localStorage.removeItem(key);
    }
  });
}
// Add task to array
function addTaskToArray() {
  const input = document.querySelector(".input-of-task");

  const task = {
    id: Date.now(),
    name: input.value,
    isCompleted: false
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  if (input.value !== "") {
    createTask(task);
  } else {
    alert("Please add a task");
    localStorage.removeItem("tasks");
  }
  // Clear Input
  input.value = "";
  input.focus();
}
// Creating the task
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
  // creating menu that has two options
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
    handleFlex(menuContainer);
  });
}
// Creating the calendar
function handleCalendar() {
  // Getting new date, Current year and month
  let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();
  const arrOfMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const renderCalendar = () => {
    let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay(), //getting first day of month
      lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(), //getting last date of month
      lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay(), //getting last day of month
      lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate(); //getting last date of previous month
    let liTag = "";
    for (let i = firstDayOfMonth; i > 0; i--) {
      // creating li of previous month last days
      liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
    }
    for (let i = 1; i <= lastDateOfMonth; i++) {
      // creating li of all days of current month
      let isToday =
        i === date.getDate() &&
        currMonth === new Date().getMonth() &&
        currYear === new Date().getFullYear()
          ? "active-date"
          : "";
      liTag += `<li class="${isToday}">${i}</li>`;
    }
    for (let i = lastDayOfMonth; i < 6; i++) {
      // creating li of next month first day
      liTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`;
    }
    currentDate.innerHTML = `${arrOfMonths[currMonth]} ${currYear}`;
    days.innerHTML = liTag;
  };
  renderCalendar();
  changeMonthBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      // adding click event on both icons
      // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
      currMonth = btn.id === "prev" ? currMonth - 1 : currMonth + 1;

      // if current month is less than 0 or greater that 11
      if (currMonth < 0 || currMonth > 11) {
        // creating a new date of current year & month and pass it as date value
        date = new Date(currYear, currMonth);
        currYear = date.getFullYear(); // updating current year with new date year
        currMonth = date.getMonth(); // updating current month with new date year
      } else {
        // else pass new date as date value
        date = new Date();
      }
      renderCalendar();
    });
  });
}
// Create Overlay element
function overlayEl() {
  let overlay = document.createElement("div");
  overlay.classList.add("overlay");
  // Append overlay to body
  document.body.appendChild(overlay);
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
// close popup and overlay
function closePopup(current) {
  function currentEl() {
    current.remove();
    document.querySelector(".overlay").remove();
  }
  document.querySelector(".exit").addEventListener("click", currentEl);
}
// close popup and overlay on Escape
function closePopupOnEsc(current) {
  function escapeButton(e) {
    if (e.key === "Escape" || e.key === "Esc") {
      let overlayElement = document.querySelector(".overlay");
      if (current) {
        current.remove();
      }
      if (overlayElement) {
        overlayElement.remove();
      }
    }
  }
  document.addEventListener("keydown", escapeButton);
}
// Remove task
function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById(taskId).remove();
}
// Looping in array of tasks to check if the task is completed or not
function toggleStatusTaskWith(taskId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == taskId) {
      tasks[i].isCompleted == false
        ? (tasks[i].isCompleted = true)
        : (tasks[i].isCompleted = false);
    }
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
// Update Task
function updateTask(taskId, el) {
  const task = tasks.find((task) => task.id === parseInt(taskId));

  if (el.hasAttribute("contenteditable")) {
    task.name = el.textContent;
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
