// General variables
const clock = document.querySelector(".clock");
const closeClock = document.querySelector(".clock i");
const btnToAddSegment = document.getElementById("btn-to-add-segment");
// Pomodoro variables
const workBtn = document.querySelector(".work");
const breakBtn = document.querySelector(".break");
const startBtn = document.querySelector(".start");
const resetBtn = document.querySelector(".reset");
const workInput = document.querySelector(".work-input");
const breakInput = document.querySelector(".break-input");
const editWorkBtn = document.querySelector(".edit-work");
const editBreakBtn = document.querySelector(".edit-break");
const pauseBtn = document.querySelector(".pause");

let pomodoroMins = document.querySelector(".minutes-of-pomodoro");
let pomodoroSecs = document.querySelector(".seconds-of-pomodoro");

// Start getting items from local storage
let addPomodoroToArray = []; // array to for new pomodoro
// Retrieve saved pomodoro from local storage
const savedPomodoro = JSON.parse(localStorage.getItem("new-pomodoro"));
if (savedPomodoro) {
  savedPomodoro.map((newEl) => {
    createPomodoroSection(newEl);
  });
}
// End getting items from local storage

let workTime = 0;
let breakTime = 0;
if (workInput) {
  workTime = parseInt(workInput.value);
}
if (breakInput) {
  breakTime = parseInt(breakInput.value);
}

let seconds = "00";
let timerInterval;
// display
window.onload = () => {
  if (pomodoroMins) {
    pomodoroMins.innerHTML = workTime;
  }
  if (pomodoroSecs) {
    pomodoroSecs.innerHTML = seconds;
  }

  if (workBtn) {
    workBtn.classList.add("active");
  }
};
// call the start function
if (startBtn) {
  startBtn.addEventListener("click", () => {
    start();
  });
}
// reset timer
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    workBtn.classList.add("active");
    breakBtn.classList.remove("active");
    pomodoroMins.innerHTML = workTime;
    pomodoroSecs.innerHTML = seconds;
    editWorkBtn.disabled = false;
    editBreakBtn.disabled = false;
    workInput.disabled = false;
    breakInput.disabled = false;
    timerInterval = undefined;
  });
}
// call the pause function
if (pauseBtn) {
  pauseBtn.addEventListener("click", function () {
    pause();
    timerInterval = undefined;
  });
}
// edit work time
if (editWorkBtn) {
  editWorkBtn.addEventListener("click", () => {
    workTime = parseInt(workInput.value);
    if (workTime > 0) {
      pomodoroMins.innerHTML = workTime;
      clearInterval(timerInterval);
    }
  });
}
// edit break time
if (editBreakBtn) {
  editBreakBtn.addEventListener("click", () => {
    breakTime = parseInt(breakInput.value);
    if (breakTime > 0) {
      clearInterval(timerInterval);
    }
  });
}
// open and close the clock
if (closeClock) {
  closeClock.addEventListener("click", () => {
    clock.classList.toggle("hide");
    if (clock.classList.contains("hide")) {
      closeClock.classList.toggle("fa-caret-left");
      closeClock.classList.toggle("fa-caret-right");
      clock.style.right = "-180px";
      closeClock.style.backgroundColor = "rgb(29, 78, 216)";
      closeClock.style.color = "#fff";
    } else {
      closeClock.classList.toggle("fa-caret-right");
      closeClock.classList.toggle("fa-caret-left");
      clock.style.right = "15px";
      closeClock.style.backgroundColor = "#eee";
      closeClock.style.color = "rgb(29, 78, 216)";
    }
  });
}
if (btnToAddSegment) {
  btnToAddSegment.addEventListener("click", createPomodoroSection);
}

//FUNCTIONS
// Function to create a clock
export function handleClock() {
  // call variable
  const innerHours = document.querySelector(".hours");
  const innerMinutes = document.querySelector(".minutes");
  const innerSeconds = document.querySelector(".seconds");
  // setting time
  const dateTime = new Date();
  let hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const seconds = dateTime.getSeconds();
  const session = document.querySelector(".session");

  if (hours >= 12) {
    if (session) {
      session.innerHTML = "PM";
    }
  } else {
    if (session) {
      session.innerHTML = "AM";
    }
  }

  if (hours > 12) {
    hours = hours - 12;
  }

  if (innerHours) {
    innerHours.innerHTML = hours < 10 ? `0${hours}` + " :" : hours + " :";
  }
  if (innerMinutes) {
    innerMinutes.innerHTML =
      minutes < 10 ? `0${minutes}` + " :" : minutes + " :";
  }
  if (innerSeconds) {
    innerSeconds.innerHTML = seconds < 10 ? `0${seconds}` : seconds;
  }
}
setInterval(handleClock, 100);
// start timer
function start() {
  // Disable edit buttons while the timer is running
  editWorkBtn.disabled = true;
  editBreakBtn.disabled = true;
  workInput.disabled = true;
  breakInput.disabled = true;

  // Initialize timer variables
  let seconds = 59;
  let workMinutes = workTime - 1;
  let breakMinutes = breakTime - 1;
  let breakCount = 0;

  // Timer function
  let timerFunction = () => {
    // Decrease seconds and update the display
    seconds--;
    pomodoroMins.innerHTML = workMinutes;
    pomodoroSecs.textContent = seconds;

    if (seconds === 0) {
      // Decrease minutes and update the display
      if (workMinutes > 0) {
        workMinutes--;
        pomodoroMins.textContent = workMinutes;
        pomodoroSecs.textContent = seconds;
      }
      if (workMinutes === 0) {
        if (breakCount % 2 === 0) {
          // Start break
          workMinutes = breakMinutes;
          breakCount++;
          // Change the panel
          workBtn.classList.remove("active");
          breakBtn.classList.add("active");
        } else {
          // Start work
          workMinutes = workTime - 1;
          breakCount++;
          // Change the panel
          breakBtn.classList.remove("active");
          workBtn.classList.add("active");
        }
      }
      seconds = 59;
    }
  };

  // Start countdown
  if (timerInterval === undefined) {
    timerInterval = setInterval(timerFunction, 1000);
  } else {
    alert("Timer is already running");
  }
}
// function to pause timer
function pause() {
  clearInterval(timerInterval);
}

// function to create a new segment
function createPomodoroSection(element) {
  let workTime = 0;
  let breakTime = 0;

  const pomodoroContainer = document.querySelector(".pomodoro-container");

  // Create the div element with class "pomodoro-segment"
  const pomodoroSegmentDiv = document.createElement("div");
  pomodoroSegmentDiv.classList.add("pomodoro-segment");
  // Create the inner elements
  const panelDiv = document.createElement("div");
  panelDiv.classList.add("panel");
  const workBtn = document.createElement("span");
  workBtn.classList.add("work", "active");
  workBtn.textContent = "Work";
  const breakBtn = document.createElement("span");
  breakBtn.classList.add("break");
  breakBtn.textContent = "Break";
  panelDiv.appendChild(workBtn);
  panelDiv.appendChild(breakBtn);

  const pomodoroTimerDiv = document.createElement("div");
  pomodoroTimerDiv.classList.add("pomodoro-timer");
  const circleDiv = document.createElement("div");
  circleDiv.classList.add("circle");
  const minutesSpan = document.createElement("span");
  minutesSpan.classList.add("minutes-of-pomodoro");
  minutesSpan.textContent = "25";
  const separatorSpan = document.createElement("span");
  separatorSpan.textContent = ":";
  const secondsSpan = document.createElement("span");
  secondsSpan.classList.add("seconds-of-pomodoro");
  secondsSpan.textContent = "00";
  circleDiv.appendChild(minutesSpan);
  circleDiv.appendChild(separatorSpan);
  circleDiv.appendChild(secondsSpan);
  pomodoroTimerDiv.appendChild(circleDiv);

  const buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add("buttons");
  const startBtn = document.createElement("button");
  startBtn.classList.add("start");
  const startIcon = document.createElement("i");
  startIcon.classList.add("fa-solid", "fa-play");
  startBtn.appendChild(startIcon);
  const resetBtn = document.createElement("button");
  resetBtn.classList.add("reset");
  const resetIcon = document.createElement("i");
  resetIcon.classList.add("fa-solid", "fa-arrow-rotate-left");
  resetBtn.appendChild(resetIcon);
  const pauseBtn = document.createElement("button");
  pauseBtn.classList.add("pause");
  const pauseIcon = document.createElement("i");
  pauseIcon.classList.add("fa-solid", "fa-pause");
  pauseBtn.appendChild(pauseIcon);
  buttonsDiv.appendChild(startBtn);
  buttonsDiv.appendChild(resetBtn);
  buttonsDiv.appendChild(pauseBtn);

  const editTimeDiv = document.createElement("div");
  editTimeDiv.classList.add("edit-time");
  const workFieldDiv = document.createElement("div");
  workFieldDiv.classList.add("field");
  const workInput = document.createElement("input");
  workInput.classList.add("input", "work-input");
  workInput.type = "number";
  workInput.value = "25";
  workInput.min = "1";
  const editWorkBtn = document.createElement("button");
  editWorkBtn.classList.add("btn", "edit-work");
  editWorkBtn.textContent = "Edit Work Time";
  workFieldDiv.appendChild(workInput);
  workFieldDiv.appendChild(editWorkBtn);

  const breakFieldDiv = document.createElement("div");
  breakFieldDiv.classList.add("field");
  const breakInput = document.createElement("input");
  breakInput.classList.add("input", "break-input");
  breakInput.type = "number";
  breakInput.value = "5";
  breakInput.min = "1";
  const editBreakBtn = document.createElement("button");
  editBreakBtn.classList.add("btn", "edit-break");
  editBreakBtn.textContent = "Edit Break Time";
  breakFieldDiv.appendChild(breakInput);
  breakFieldDiv.appendChild(editBreakBtn);

  editTimeDiv.appendChild(workFieldDiv);
  editTimeDiv.appendChild(breakFieldDiv);

  const delPomodoroIcon = document.createElement("i");
  delPomodoroIcon.classList.add("delete-pomodoro", "fa-solid", "fa-x");

  // Append all the elements to the container
  pomodoroSegmentDiv.appendChild(panelDiv);
  pomodoroSegmentDiv.appendChild(pomodoroTimerDiv);
  pomodoroSegmentDiv.appendChild(buttonsDiv);
  pomodoroSegmentDiv.appendChild(editTimeDiv);
  pomodoroSegmentDiv.appendChild(delPomodoroIcon);

  if (pomodoroContainer) {
    pomodoroContainer.appendChild(pomodoroSegmentDiv);
  }

  // Save new pomodoro to local storage
  addPomodoroToArray.push(pomodoroSegmentDiv.outerHTML);
  // Pomodoro Events and functions
  if (workInput) {
    workTime = parseInt(workInput.value);
  }
  if (breakInput) {
    breakTime = parseInt(breakInput.value);
  }

  let seconds = "00";
  let timerInterval;
  // display
  window.onload = () => {
    if (minutesSpan) {
      minutesSpan.innerHTML = workTime;
    }
    if (secondsSpan) {
      secondsSpan.innerHTML = seconds;
    }

    if (workBtn) {
      workBtn.classList.add("active");
    }
  };
  // Start function
  function startTwo() {
    // Disable edit buttons while the timer is running
    editWorkBtn.disabled = true;
    editBreakBtn.disabled = true;
    workInput.disabled = true;
    breakInput.disabled = true;

    // Initialize timer variables
    let seconds = 59;
    let workMinutes = workTime - 1;
    let breakMinutes = breakTime - 1;
    let breakCount = 0;

    // Timer function
    let timerFunction = () => {
      // Decrease seconds and update the display
      seconds--;
      minutesSpan.textContent = workMinutes;
      secondsSpan.textContent = seconds;

      if (seconds === 0) {
        // Decrease minutes and update the display
        if (workMinutes > 0) {
          workMinutes--;
          minutesSpan.textContent = workMinutes;
        }
        if (workMinutes === 0) {
          if (breakCount % 2 === 0) {
            // Start break
            workMinutes = breakMinutes;
            breakCount++;
            // Change the panel
            workBtn.classList.remove("active");
            breakBtn.classList.add("active");
          } else {
            // Start work
            workMinutes = workTime - 1;
            breakCount++;
            // Change the panel
            breakBtn.classList.remove("active");
            workBtn.classList.add("active");
          }
        }
        seconds = 59;
      }
    };

    // Start countdown
    if (timerInterval === undefined) {
      timerInterval = setInterval(timerFunction, 1000);
    } else {
      alert("Timer is already running");
    }
  }
  if (startBtn) {
    startBtn.addEventListener("click", startTwo);
  }
  // reset timer
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      clearInterval(timerInterval);
      workBtn.classList.add("active");
      breakBtn.classList.remove("active");
      minutesSpan.innerHTML = workTime;
      secondsSpan.innerHTML = seconds;
      editWorkBtn.disabled = false;
      editBreakBtn.disabled = false;
      workInput.disabled = false;
      breakInput.disabled = false;
      timerInterval = undefined;
    });
  }
  // call the pause function
  if (pauseBtn) {
    pauseBtn.addEventListener("click", function () {
      clearInterval(timerInterval);
      timerInterval = undefined;
    });
  }
  // edit work time
  if (editWorkBtn) {
    editWorkBtn.addEventListener("click", () => {
      workTime = parseInt(workInput.value);
      if (workTime > 0) {
        minutesSpan.innerHTML = workTime;
        clearInterval(timerInterval);
      }
    });
  }
  // edit break time
  if (editBreakBtn) {
    editBreakBtn.addEventListener("click", () => {
      breakTime = parseInt(breakInput.value);
      if (breakTime > 0) {
        clearInterval(timerInterval);
      }
    });
  }
  // Event to delete new pomodoro from local storage and page
  if (delPomodoroIcon) {
    delPomodoroIcon.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-pomodoro")) {
        const div = e.target.parentElement;
        const divIndex = Array.from(delPomodoroIcon.children).indexOf(div);
        addPomodoroToArray.splice(divIndex, 1);
        localStorage.setItem(
          "new-pomodoro",
          JSON.stringify(addPomodoroToArray)
        );
        div.remove();
      }
    });
  }
  // save new pomodoro to local storage
  localStorage.setItem("new-pomodoro", JSON.stringify(addPomodoroToArray));
}
