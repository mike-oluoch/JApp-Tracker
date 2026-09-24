const applicationsKey = "jobApplications";
let applications = JSON.parse(localStorage.getItem(applicationsKey)) || [];
let editingIndex = null;

document.addEventListener("DOMContentLoaded", () => {
    const addApplicationBtn = document.getElementById("addApplicationBtn");
    const applicationForm = document.getElementById("applicationForm");
    const cancelBtn = document.getElementById("cancelBtn");
    const searchInput = document.getElementById("search");

    addApplicationBtn.addEventListener("click", () => openForm(false));
    cancelBtn.addEventListener("click", closeForm);
    applicationForm.addEventListener("submit", saveApplication);
    searchInput.addEventListener("input", searchApplications);

    closeForm();
    loadApplications();
});

function setFormMode(isEditing) {
    const formTitle = document.getElementById("formTitle");
    const saveBtn = document.getElementById("saveBtn");

    formTitle.textContent = isEditing ? "Edit Application" : "Add Application";
    saveBtn.textContent = isEditing ? "Update" : "Save";
}

function loadApplications() {
    renderApplications();
    updateStats();
}

function saveApplications() {
    localStorage.setItem(applicationsKey, JSON.stringify(applications));
}

function renderApplications(filteredApps = applications) {
    const table = document.getElementById("applicationsTable");
    const tbody = table.querySelector("tbody");
    const emptyState = document.getElementById("emptyState");

    tbody.innerHTML = "";

    if (filteredApps.length === 0) {
        table.classList.add("hidden");
        emptyState.classList.remove("hidden");
        return;
    }

    table.classList.remove("hidden");
    emptyState.classList.add("hidden");

    filteredApps.forEach((app, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${app.company}</td>
            <td>${app.jobTitle}</td>
            <td>${app.location || "N/A"}</td>
            <td><span class="status-badge ${app.status.toLowerCase()}">${app.status}</span></td>
            <td>${app.dateApplied}</td>
            <td class="action-cell">
                <button class="secondary" onclick="editApplication(${index})">Edit</button>
                <button class="danger" onclick="deleteApplication(${index})">Delete</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function updateStats() {
    const total = applications.length;
    const applied = applications.filter(app => app.status === "Applied").length;
    const interviews = applications.filter(app => app.status === "Interview").length;
    const offers = applications.filter(app => app.status === "Offer").length;

    document.getElementById("total").textContent = total;
    document.getElementById("applied").textContent = applied;
    document.getElementById("interviews").textContent = interviews;
    document.getElementById("offers").textContent = offers;
}

function openForm(isEditing = false) {
    const modal = document.getElementById("formModal");
    const form = document.getElementById("applicationForm");

    form.reset();
    setFormMode(isEditing);
    modal.classList.remove("hidden");
}

function closeForm() {
    const modal = document.getElementById("formModal");
    const form = document.getElementById("applicationForm");

    form.reset();
    modal.classList.add("hidden");
    editingIndex = null;
    setFormMode(false);
}

function saveApplication(event) {
    event.preventDefault();

    const company = document.getElementById("company").value.trim();
    const jobTitle = document.getElementById("jobTitle").value.trim();
    const location = document.getElementById("location").value.trim();
    const dateApplied = document.getElementById("dateApplied").value;
    const status = document.getElementById("status").value;
    const notes = document.getElementById("notes").value.trim();

    if (!company || !jobTitle || !dateApplied) {
        return;
    }

    const application = { company, jobTitle, location, dateApplied, status, notes };

    if (editingIndex !== null) {
        applications[editingIndex] = application;
    } else {
        applications.push(application);
    }

    saveApplications();
    loadApplications();
    closeForm();
}

function editApplication(index) {
    const app = applications[index];

    document.getElementById("company").value = app.company;
    document.getElementById("jobTitle").value = app.jobTitle;
    document.getElementById("location").value = app.location;
    document.getElementById("dateApplied").value = app.dateApplied;
    document.getElementById("status").value = app.status;
    document.getElementById("notes").value = app.notes;

    editingIndex = index;
    openForm(true);
}

function deleteApplication(index) {
    if (confirm("Are you sure you want to delete this application?")) {
        applications.splice(index, 1);
        saveApplications();
        loadApplications();
    }
}

function searchApplications(event) {
    const query = event.target.value.toLowerCase();
    const filteredApps = applications.filter(app =>
        app.company.toLowerCase().includes(query) ||
        app.jobTitle.toLowerCase().includes(query) ||
        (app.location && app.location.toLowerCase().includes(query))
    );

    renderApplications(filteredApps);
}