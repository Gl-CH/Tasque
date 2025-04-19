// Global variables
let csrfToken, listId, userId;

// Helper function to create a new element with classes and attributes
function createElement(tag, classes = [], attributes = {}) {
    const element = document.createElement(tag);
    element.classList.add(...classes);
    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));
    return element;
}

// Add a new task to a section
function addTask(sectionId, id, title, subtitle) {
    const newTask = createElement("li", ["task"], { draggable: true, "data-id": id });
    const taskBoundary = createElement("div", ["task-boundry"]);
    const taskTitle = createElement("h1", ["task-title"], { contenteditable: true });
    const taskSubtitle = createElement("h6", ["task-subtitle"], { contenteditable: true });
    const checkbox = createElement("input", ["checkbox"], { type: "checkbox"});
    const sectionWrapper = document.querySelector(`.task-section-list[data-id="${sectionId}"]`);
    const section = sectionWrapper.querySelector(".task-section");
    const addTaskButton = section.querySelector(".add-task-button");

    taskTitle.innerHTML = title;
    taskSubtitle.innerHTML = subtitle;

    taskBoundary.append(taskTitle, taskSubtitle, checkbox);
    newTask.appendChild(taskBoundary);

    checkbox.addEventListener("change", () => removeTask(checkbox));
    newTask.addEventListener("dragstart", () => newTask.classList.add("dragging"));
    newTask.addEventListener("dragend", () => newTask.classList.remove("dragging"));

    taskTitle.addEventListener("blur", (event) => updateTaskDetails(id, { title: event.target.innerHTML }));
    taskSubtitle.addEventListener("blur", (event) => updateTaskDetails(id, { subtitle: event.target.innerHTML }));

    section.insertBefore(newTask, addTaskButton);
}

function addSection(title, id) {
    const sectionsContainer = document.querySelector("#sections-container");
    const sectionList = createElement("li", ["task-section-list"], { draggable: true, "data-id": id });
    const sectionSubList = createElement("ul", ["task-section"]);
    const sectionTitle = createElement("h1", ["task-section-title"], { contenteditable: true });
    const addTaskButton = createElement("button", ["add-task-button"]);
    const deleteCheckbox = createElement("input", ["checkbox","section-checkbox"], { type: "checkbox" });
    const titleContainer = createElement("div", ["task_section-title-container"]);
    const addSectionButton = document.querySelector(".add-section-button");

    sectionTitle.innerHTML = title;
    addTaskButton.innerHTML = "Add Task";

    titleContainer.append(sectionTitle, deleteCheckbox);
    sectionSubList.append(titleContainer, addTaskButton);
    sectionList.appendChild(sectionSubList);

    addTaskButton.addEventListener("click", () => createNewTask(id));
    deleteCheckbox.addEventListener("change", () => removeSection(deleteCheckbox));
    sectionSubList.addEventListener("dragover", (event) => handleDragOver(event, sectionSubList));
    sectionSubList.addEventListener("drop", (event) => handleDrop(event, sectionSubList));
    sectionTitle.addEventListener("blur", (event) => updateSectionDetails(id, { title: event.target.innerText }));

    sectionsContainer.insertBefore(sectionList, addSectionButton);
}

function addList(id,name) {
    const listContainer = document.querySelector(".list-container");
    const div = createElement("div", ["list-item-container"]);
    const listItem = createElement("li", ["list-item"]);
    const linkItem = createElement("text", ["link-item"], { "data-id": id });
    const icon = createElement("i", ["fa-solid", "fa-x"]);
    const deleteButton = createElement("button", ["list-delete-button"]);

    linkItem.innerText = name;
    linkItem.setAttribute("contenteditable", true);
    deleteButton.appendChild(icon);
    div.appendChild(linkItem);
    div.appendChild(deleteButton);

    deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        removeList(event.target);
    });

    div.addEventListener("click", () => {
        window.location.href = `/lists/${id}`;
    });

    linkItem.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    linkItem.addEventListener("blur", (event) => {
        updateListDetails(event.target.dataset.id, { name: linkItem.innerText });
    });

    listItem.appendChild(div);
    listContainer.appendChild(listItem);
}


function createNewTask(sectionId) {
    fetch("/lists/create/tasks/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ title: "New Task", subtitle: "New Subtitle", section: sectionId, order: 0 })
    })
    .then(response => response.json())
    .then(data => addTask(sectionId, data.id, data.title, data.subtitle));
}

function handleDragOver(event, container) {
    event.preventDefault();
    const task = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(container, event.clientY);
    if (task) {
        container.insertBefore(task, afterElement || container.querySelector(".add-task-button"));
    }
}

let dropTimeout = null;
function handleDrop(event, container) {
    event.preventDefault();
    const task = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(container, event.clientY);
    if (task) {
        const sectionId = container.closest(".task-section-list").dataset.id;
        container.insertBefore(task, afterElement || container.querySelector(".add-task-button"));
        if (dropTimeout) clearTimeout(dropTimeout);
        dropTimeout = setTimeout(() => {
            updateTaskDetails(task.dataset.id, { section: sectionId });
            updateOrder(sectionId);
        }, 3000);
    }
}

function updateOrder(sectionId) {
    const section = document.querySelector(`.task-section-list[data-id="${sectionId}"] > .task-section`);
    const children = Array.from(section.querySelectorAll(".task"));
    const updates = children.map((child, i) => ({ id: child.dataset.id, order: i * 10 }));

    fetch("/lists/get/tasks/bulk", {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(updates)
    });
    console.log(JSON.stringify(updates));
}

function updateSectionDetails(id, details) {
    fetch(`/lists/get/sections/${id}/`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(details)
    });
}

function updateTaskDetails(id, details) {
    fetch(`/lists/get/tasks/${id}/`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(details)
    });
}

function removeTask(checkbox) {
    const task = checkbox.closest(".task");
    task.classList.add("shrink")
    setTimeout(() => {
        task.remove();
        fetch(`/lists/get/tasks/${task.dataset.id}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            }
        });
    }, 450);
}

function removeSection(checkbox) {
    const section = checkbox.closest(".task-section-list");
    section.classList.add("shrink")
    setTimeout(() => {
        section.remove();
        fetch(`/lists/get/sections/${section.dataset.id}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            }
        });
    }, 450);
}

function removeList(button) {
    const list = button.closest(".list-item");
    const link = list.querySelector(".link-item");
    list.classList.add("shrink")
    setTimeout(() => {
        fetch(`/lists/get/lists/${link.dataset.id}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            }
        });
        list.remove();
    }, 450);
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".task:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function initializeSidebar() {

    fetch("/lists/get/lists/")
        .then(response => response.json())
        .then(data => {
            data.forEach(list => {
                addList(list.id,list.name);
            });
        });

    }

function initializeSidebarResizer() {
    const sidebar = document.querySelector(".sidebar");
    const resizer = document.querySelector(".sidebar-resizer");
    const display = document.querySelector(".display-area");

    let isResizing = false;

    function startResize(e) {
        isResizing = true;
        document.body.style.cursor = 'ew-resize';
        e.preventDefault();
    }

    function stopResize() {
        isResizing = false;
        document.body.style.cursor = '';
    }

    function resizeSidebar(e) {
        if (!isResizing) return;

        const isMobile = window.innerWidth <= 768;
        let clientX = e.clientX;
        if (e.type.startsWith("touch")) {
            clientX = e.touches[0].clientX;
        }

        if (isMobile) {
            sidebar.style.width = "70vw";
        } else {
            const minWidth = 150;
            const maxWidth = 400;
            let newWidth = Math.min(Math.max(clientX, minWidth), maxWidth);
            sidebar.style.width = `${newWidth}px`;
            display.style.marginLeft = `${newWidth}px`;
        }
    }

    // Mouse events
    resizer.addEventListener("mousedown", startResize);
    document.addEventListener("mousemove", resizeSidebar);
    document.addEventListener("mouseup", stopResize);

    // Touch events
    resizer.addEventListener("touchstart", startResize, { passive: false });
    document.addEventListener("touchmove", resizeSidebar, { passive: false });
    document.addEventListener("touchend", stopResize);

    // Swipe detection to show sidebar on mobile
    let touchStartX = 0;
    document.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener("touchend", (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const swipeDistanceX = touchEndX - touchStartX; // Horizontal distance moved
        const swipeDistanceY = touchEndY - touchStartY; // Vertical distance moved
    
        // Only show the sidebar if the horizontal swipe is significant and vertical movement is small
        if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY) && swipeDistanceX > 50 && touchStartX < touchEndX) {
            sidebar.classList.add("shown")}
    });

    // Tap outside to close on mobile
    document.addEventListener("click", (e) => {
        if (window.innerWidth <= 768 &&
            !sidebar.contains(e.target) &&
            !resizer.contains(e.target)
        ) {
            sidebar.classList.remove("shown");
        }
    });
}

function createList() {
    fetch("/lists/create/list/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ name: "New_List", user: userId })
    })
    .then(response => response.json())
    .then(data => {
        addList(data.id,data.name)
    })
    .then();
}

function updateListDetails(id, details) {
    fetch(`/lists/get/lists/${id}/`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(details)
    });
}

function initializePage(currentListId) {
    fetch(`/lists/get/all/${currentListId}`)
        .then(response => response.json())
        .then(data => {
            data.sections.forEach(section => {
                addSection(section.title, section.id);
                section.tasks.forEach(task => {
                    addTask(section.id, task.id, task.title, task.subtitle);
                });
            });
        });
}

document.addEventListener("DOMContentLoaded", () => {
    csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    listId = document.querySelector('meta[name="list-id"]')?.content;
    userId = document.querySelector('meta[name="user-id"]')?.content;
    const add_section_button = document.querySelector(".add-section-button");

    initializePage(listId);
    initializeSidebar();
    initializeSidebarResizer();

    document.querySelector(".add-list-button").addEventListener("click", createList);

    add_section_button.addEventListener("click", () => {
        fetch("/lists/create/section/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ title: 'New Section', list: listId})
        })
        .then(response => response.json())
        .then(data => addSection(data.title, data.id));
});
});