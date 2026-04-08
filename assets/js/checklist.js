// Handles interactive checklist and progress tracking

function initChecklist() {
    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem('setupProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        Object.keys(progress).forEach(key => {
            const element = document.getElementById(key);
            if (element && element.type === 'checkbox') {
                element.checked = progress[key];
                updateChecklistItem(element);
            }
        });
    }

    // Add event listeners to all checkboxes
    document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateChecklistItem(this);
            saveProgress();
            checkSubsectionCompletion(this.closest('.subsection-body'));
            checkMainSectionCompletion(this.closest('.main-section'));
        });
    });

    // Initialize all sections as collapsed on page load
    document.querySelectorAll('details').forEach(details => {
        details.open = false;
        const summary = details.querySelector('summary');
        summary.style.setProperty('--toggle-icon-transform', 'rotate(0deg)');

        // Remove native toggle behavior and replace with custom handler
        summary.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSection(details);
        });
    });
}

function toggleSection(details) {
    // Custom toggle function with proper animation handling
    const isOpen = details.open;
    details.open = !isOpen;
    const summary = details.querySelector('summary');
    summary.style.setProperty('--toggle-icon-transform', isOpen ? 'rotate(0deg)' : 'rotate(90deg)');
}

function updateChecklistItem(checkbox) {
    // Update visual state of checklist item
    const item = checkbox.closest('.checklist-item');
    if (checkbox.checked) {
        item.classList.add('completed');
    } else {
        item.classList.remove('completed');
    }
}

function saveProgress() {
    // Save progress to localStorage
    const progress = {};
    document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(checkbox => {
        progress[checkbox.id] = checkbox.checked;
    });
    localStorage.setItem('setupProgress', JSON.stringify(progress));
}

function checkSubsectionCompletion(subsection) {
    // Check if all items in a subsection are completed
    const checkboxes = subsection.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    const subsectionTitle = subsection.querySelector('.subsection-title');
    if (allChecked && subsectionTitle) {
        subsectionTitle.classList.add('completed');
    } else if (subsectionTitle) {
        subsectionTitle.classList.remove('completed');
    }
}

function checkMainSectionCompletion(section) {
    // Check if all subsections in a main section are completed
    const subsections = section.querySelectorAll('.subsection-title');
    const allCompleted = Array.from(subsections).every(subsection => {
        return subsection.classList.contains('completed');
    });
    const sectionTitle = section.querySelector('.main-section-title');
    if (allCompleted && sectionTitle) {
        sectionTitle.classList.add('completed');
    } else if (sectionTitle) {
        sectionTitle.classList.remove('completed');
    }
}

document.addEventListener('DOMContentLoaded', initChecklist);