// script.js

// Step 1: Define a Job class
class Job {
    constructor({ Title, Posted, Type, Level, Skill, Detail, "Job Page Link": link }) {
        this.title = Title || "Unknown Title";
        this.posted = this.normalizePostedTime(Posted || "Unknown Time");
        this.type = Type || "Unknown Type";
        this.level = Level || "Unknown Level";
        this.skill = Skill || "Unknown Skill";
        this.detail = Detail || "No Details Available";
        this.link = link || "#";
    }

    normalizePostedTime(posted) {
        const match = posted.match(/(\d+)\s(\w+)/);
        if (!match) return 0;
        const [_, value, unit] = match;
        const multiplier = { minute: 1, hour: 60, day: 1440 }[unit.toLowerCase()] || 1;
        return parseInt(value, 10) * multiplier;
    }

    getFormattedPostedTime() {
        return `${this.posted} minutes ago`;
    }

    getDetails() {
        return `
            <div class="job">
                <h2>${this.title}</h2>
                <p><strong>Posted:</strong> ${this.getFormattedPostedTime()}</p>
                <p><strong>Type:</strong> ${this.type}</p>
                <p><strong>Level:</strong> ${this.level}</p>
                <p><strong>Skill:</strong> ${this.skill}</p>
                <p>${this.detail}</p>
                <a href="${this.link}" target="_blank">View Job</a>
            </div>`;
    }
}

let jobs = []; // Array to hold all Job objects
const jobListings = document.getElementById("job-listings");

// Step 2: File Input Handling and Data Loading
document.getElementById("file-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const jsonData = JSON.parse(reader.result);
            jobs = jsonData.map((data) => new Job(data));
            populateFilters();
            displayJobs(jobs);
        } catch (error) {
            alert("Invalid JSON file format.");
        }
    };
    reader.readAsText(file);
});

// Step 3: Populate Filters Dynamically
function populateFilters() {
    const levels = new Set(jobs.map((job) => job.level));
    const types = new Set(jobs.map((job) => job.type));
    const skills = new Set(jobs.map((job) => job.skill));

    populateDropdown("filter-level", levels);
    populateDropdown("filter-type", types);
    populateDropdown("filter-skill", skills);
}

function populateDropdown(id, items) {
    const dropdown = document.getElementById(id);
    dropdown.innerHTML = '<option value="">All</option>';
    items.forEach((item) => {
        dropdown.innerHTML += `<option value="${item}">${item}</option>`;
    });
}

// Step 4: Display Jobs
function displayJobs(filteredJobs) {
    jobListings.innerHTML = filteredJobs.map((job) => job.getDetails()).join("");
}

// Step 5: Filtering
["filter-level", "filter-type", "filter-skill"].forEach((id) => {
    document.getElementById(id).addEventListener("change", applyFiltersAndSort);
});

function applyFiltersAndSort() {
    const level = document.getElementById("filter-level").value;
    const type = document.getElementById("filter-type").value;
    const skill = document.getElementById("filter-skill").value;
    const sortBy = document.getElementById("sort-options").value;

    let filteredJobs = jobs.filter(
        (job) =>
            (!level || job.level === level) &&
            (!type || job.type === type) &&
            (!skill || job.skill === skill)
    );

    filteredJobs = sortJobs(filteredJobs, sortBy);
    displayJobs(filteredJobs);
}

// Step 6: Sorting
// Sorting functionality
function sortJobs(jobs, sortBy) {
    switch (sortBy) {
        case "title-asc":
            return jobs.sort((a, b) => a.title.localeCompare(b.title));
        case "title-desc":
            return jobs.sort((a, b) => b.title.localeCompare(a.title));
        case "posted-asc":
            return jobs.sort((a, b) => a.posted - b.posted);
        case "posted-desc":
            return jobs.sort((a, b) => b.posted - a.posted);
        default:
            return jobs; // Return unsorted if no valid option is selected
    }
}

// Listen for changes in the sorting dropdown
document.getElementById("sort-options").addEventListener("change", applyFiltersAndSort);

// Apply filtering and sorting
function applyFiltersAndSort() {
    const level = document.getElementById("filter-level").value;
    const type = document.getElementById("filter-type").value;
    const skill = document.getElementById("filter-skill").value;
    const sortBy = document.getElementById("sort-options").value;

    // Filter jobs based on criteria
    let filteredJobs = jobs.filter(
        (job) =>
            (!level || job.level === level) &&
            (!type || job.type === type) &&
            (!skill || job.skill === skill)
    );

    // Sort filtered jobs
    filteredJobs = sortJobs(filteredJobs, sortBy);

    // Display the sorted and filtered jobs
    displayJobs(filteredJobs);
}


// Step 7: Error Handling and Edge Cases
// Error handling is implemented in file parsing, job normalization, and filtering logic
