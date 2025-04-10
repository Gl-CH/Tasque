// Helper function to get CSRF token from meta tag
function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

function getListId(){
    return document.querySelector('meta[name="list_id"]').content;
}
// Helper function to create a new element with classes and attributes
function createElement(tag, classes = [], attributes = {}) {
    const element = document.createElement(tag);
    element.classList.add(...classes);
    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));
    return element;
}

// Add a new task to a section
function add_task(section_id, id, title, subtitle,order) {
    const new_task = createElement("li", ["task"], { "draggable": true, "data-id": id ,"data-order": order});
    const new_task_boundry = createElement("div", ["task-boundry"]);
    const new_task_title = createElement("h1", ["task-title"], { "contenteditable": true });
    const new_task_subtitle = createElement("h6", ["task-subtitle"], { "contenteditable": true });
    const new_task_checkbox = createElement("input", ["checkbox"], { "type": "checkbox", "id": "dynamicCheckbox" });
	const section_wrapper = document.querySelector(`.task-section-list[data-id="${section_id}"]`);
	const section = section_wrapper.querySelector(".task-section");
	const addTaskButton = section.querySelector(".add-task-button");

    new_task_title.innerHTML = title;
    new_task_subtitle.innerHTML = subtitle;

    new_task_boundry.append(new_task_title, new_task_subtitle, new_task_checkbox);
    new_task.appendChild(new_task_boundry);

    // Event Listeners
    new_task_checkbox.addEventListener("change", () => remove_task(new_task_checkbox));
    new_task.addEventListener("dragstart", () => new_task.classList.add("dragging"));
    new_task.addEventListener("dragend", () => new_task.classList.remove("dragging"));
	new_task_title.addEventListener("blur",() => updateTaskDetails(section_id,id,new_task_title.innerText,new_task_subtitle.innerHTML))
	new_task_subtitle.addEventListener("blur",() => updateTaskDetails(section_id,id,new_task_title.innerText,new_task_subtitle.innerHTML))


    section.insertBefore(new_task, addTaskButton);
}

// Add a new section to the page
function add_section(title, id) {
    const sections_container = document.querySelector("#sections-container");
    const section_list = createElement("li", ["task-section-list"], { "draggable": true, "data-id": id });
    const section_sub_list = createElement("ul", ["task-section"]);
    const section_title = createElement("h1", ["task-section-title"], { "contenteditable": true });
    const section_add_task_button = createElement("button", ["add-task-button"]);
    const section_delete_button = createElement("input", ["section-checkbox"], { "type": "checkbox" });
    const section_title_div = createElement("div", ["task_section-title-container"]);
	

    section_title.innerHTML = title;
    section_add_task_button.innerHTML = "Add Task";

    section_title_div.append(section_title, section_delete_button);
    section_sub_list.append(section_title_div, section_add_task_button);
    section_list.appendChild(section_sub_list);

    // Event Listeners
    section_add_task_button.addEventListener("click", () => createNewTask(id));
    section_delete_button.addEventListener("change", () => remove_section(section_delete_button));
    section_sub_list.addEventListener("dragover", (event) => handleDragOver(event, section_sub_list));
    section_sub_list.addEventListener("drop", (event) => handleDrop(event, section_sub_list));

    section_title.addEventListener("blur", () => updateSectionTitle(id,section_title.innerText));

    sections_container.insertBefore(section_list, document.querySelector(".add-section-button"));
}

// Create a new task via API and add it to the section
function createNewTask(sectionId) {
    const csrfToken = getCSRFToken();
    fetch("http://localhost:8000/lists/create/tasks/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            title: "New Task",
            subtitle: "New Subtitle",
            section: sectionId,
            order: 0
        })
    })
    .then(response => response.json())
    .then(data => {
		add_task(sectionId, data.id, data.title, data.subtitle)});
}

// Handle drag over for task reordering
function handleDragOver(event, container) {
    event.preventDefault();
    const task = document.querySelector(".dragging");
    const after_element = get_drag_afterelement(container, event.clientY);
    if (task) {
        container.insertBefore(task, after_element || container.querySelector(".add-task-button"));
    }
}

// Handle drop event for task reordering
function handleDrop(event, container) {
    event.preventDefault();
    const task = document.querySelector(".dragging");
    const after_element = get_drag_afterelement(container, event.clientY);
    if (task) {
        const task_title = task.querySelector(".task-title").innerText
        const task_subtitle = task.querySelector(".task-subtitle").innerText
        const section_id = container.closest(".task-section-list").dataset.id 
        container.insertBefore(task, after_element || container.querySelector(".add-task-button"));
        updateTaskDetails(section_id,task.dataset.id,task_title,task_subtitle)
    }
    
}

// Update section title on blur
function updateSectionTitle(id, newTitle) {
    const csrfToken = getCSRFToken();
    fetch(`http://localhost:8000/lists/get/sections/${id}/`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ title: newTitle, list: getListId() })
    });
}



function updateTaskDetails(section_id,id,new_title,new_subtitle){
	const csrfToken = getCSRFToken();

	fetch(`http://localhost:8000/lists/get/tasks/${id}/`, {
		method: "PUT",
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
		},
		body: JSON.stringify({ 
			title: new_title,
			subtitle: new_subtitle,
			section: section_id
			})
	});
	}

// Remove task from the list
function remove_task(button) {
	const csrfToken = getCSRFToken();
	const task = button.closest(".task");
    setTimeout(() => {
		task.remove();
		fetch(`http://localhost:8000/lists/get/tasks/${task.dataset.id}/`,{
            method: "DELETE",
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken}
        })},450);
}

// Remove section and delete it via API
function remove_section(button) {
    const csrfToken = getCSRFToken();
    const task_section = button.closest(".task-section-list");
    setTimeout(() => {
        task_section.remove();
        fetch(`http://localhost:8000/lists/get/sections/${task_section.dataset.id}/`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken }
        });
    },450);
}

// Drag and drop utility function
function get_drag_afterelement(container, y) {
    const draggable_elements = [...container.querySelectorAll(".task:not(.dragging)")];
    return draggable_elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Initialize the page by fetching existing data
function initialize_page(list_id) {
    fetch(`http://localhost:8000/lists/get/all/${list_id}`)
        .then(response => response.json())
        .then(data => {
            data.sections.forEach(section => {
                add_section(section.title, section.id);
                section.tasks.forEach(task => add_task(section.id, task.id, task.title, task.subtitle,task.order));
            });
        });
}

// Initialize event listeners on document ready
document.addEventListener("DOMContentLoaded", () => {
    const add_section_button = document.querySelector(".add-section-button");
    initialize_page(getListId());

    add_section_button.addEventListener("click", () => {
        const csrfToken = getCSRFToken();
        fetch("http://localhost:8000/lists/create/section/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ title: 'New Section', list: getListId()})
        })
        .then(response => response.json())
        .then(data => add_section(data.title, data.id));
    });
});
