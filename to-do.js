const addButton = document.getElementById("add-button");
const updateButton = document.getElementById("update-button");
const taskInput = document.getElementById("task");
const dueDateInput = document.getElementById("due-date");
const categoryInput = document.getElementById("category");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const taskList = document.getElementById("task-list");
const checkbox = document.getElementById('radio')

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingIndex = -1; 

addButton.addEventListener("click", addTask);
updateButton.addEventListener("click", updateTask);
searchInput.addEventListener("input", searchTasks);
categoryFilter.addEventListener("change", filterTasks);

renderTasks();

function addTask() {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const category = categoryInput.value;
    const completed = false;

    if (taskText === "") return;

    const task = { text: taskText, dueDate: dueDate, category: category, completed: completed };
    tasks.push(task);

    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    renderTasks();
    saveToLocalStorage();
    clearForm();
}

function updateTask() {
    if (editingIndex === -1) return;

    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const category = categoryInput.value;

    if (taskText === "") return;

    tasks[editingIndex].text = taskText;
    tasks[editingIndex].dueDate = dueDate;
    tasks[editingIndex].category = category;

    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    renderTasks();
    saveToLocalStorage();
    clearForm();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
    saveToLocalStorage();
}

function markComplete(index) {
    tasks[index].completed = true;
    saveToLocalStorage();
    renderTasks();
}


function editTask(index) {
    const task = tasks[index];
    taskInput.value = task.text;
    dueDateInput.value = task.dueDate;
    categoryInput.value = task.category;
    updateButton.style.display = "block";
    addButton.style.display = "none";
    editingIndex = index;
}

function searchTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchTerm));
    renderTasks(filteredTasks);
}

function filterTasks() {
    const selectedCategory = categoryFilter.value;
    if (selectedCategory === "all") {
        renderTasks();
    } else {
        const filteredTasks = tasks.filter(task => task.category === selectedCategory);
        renderTasks(filteredTasks);
    }
}

function clearForm() {
    taskInput.value = "";
    dueDateInput.value = "";
    categoryInput.value = "work";
    updateButton.style.display = "none";
    addButton.style.display = "block";
    editingIndex = -1;
}

function renderTasks(taskArray = tasks) {
    taskList.innerHTML = "";

    const currentDate = new Date();

    taskArray.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.className = "task-item " + task.category;

        const taskDetails = document.createElement("div");
        taskDetails.className = "task-details";

        const taskName = document.createElement("h3");
        taskName.textContent = task.text;

        const dueDate = document.createElement("div");
        dueDate.textContent = "Due Date: " + task.dueDate;

        const selectedCategory = document.createElement("div");
        selectedCategory.textContent = "Category: " + task.category;

        const status = document.createElement("div");
        status.textContent = "Status: " + (task.completed ? "Completed" : "Not Completed");

        taskDetails.appendChild(taskName);
        taskDetails.appendChild(dueDate);
        taskDetails.appendChild(selectedCategory);
        taskDetails.appendChild(status);

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "actions";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteTask(index));

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editTask(index));

        const completeButton = document.createElement("button");
        completeButton.textContent = "Mark Complete";
        completeButton.addEventListener("click", () => markComplete(index));

        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);
        if (!task.completed && new Date(task.dueDate) > currentDate) {
            actionsDiv.appendChild(completeButton);
        }

        listItem.appendChild(taskDetails);
        listItem.appendChild(actionsDiv);

        taskList.appendChild(listItem);
    });
}


function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// if (sessionStorage.getItem("mode") == "dark") {
//     darkmode(); //if dark mode was on, run this funtion
//   } else {
//     nodark(); //else run this funtion
//   }

//   checkbox.addEventListener("change", function() {
//     //check if the checkbox is checked or not
//     if (checkbox.checked) {
//       darkmode(); //if the checkbox is checked, run this funtion
//     } else {
//       nodark(); //else run this funtion
//     }
//   });
  
//   //function for checkbox when checkbox is checked
//   function darkmode() {
//     document.body.classList.add("dark-mode"); //add a class to the body tag
//     checkbox.checked = true; //set checkbox to be checked state
//     sessionStorage.setItem("mode", "dark"); //store a name & value to know that dark mode is on
//   }
  
//   //function for checkbox when checkbox is not checked
//   function nodark() {
//     document.body.classList.remove("dark-mode"); //remove added class from body tag
//     checkbox.checked = false; //set checkbox to be unchecked state
//     sessionStorage.setItem("mode", "light"); //store a name & value to know that dark mode is off or light mode is on
//   }
  