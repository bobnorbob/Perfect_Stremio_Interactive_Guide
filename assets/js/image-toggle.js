// Handles image visibility toggling

function setupImageToggle() {
    document.querySelectorAll('.toggle-image').forEach(button => {
        button.addEventListener('click', function() {
            const imageId = this.getAttribute('data-target');
            const image = document.getElementById(imageId);
            if (image) {
                image.style.display = image.style.display === 'none' ? 'block' : 'none';
                this.textContent = image.style.display === 'none' ? 'Show Image' : 'Hide Image';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', setupImageToggle);