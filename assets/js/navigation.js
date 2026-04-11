// Handles navigation and sidebar generation

// Define your guide files (update paths as needed)
const guideFiles = [
    { title: '🔰 Beginner Concepts', file: '/0-Beginner-Concepts.html' },
    { title: '📝 1. Accounts Preparation', file: '/1-Accounts-Preparation.html' },
    { title: '⚙️ 2. Stremio Account Initialization', file: '/2-Stremio-Initialization.html' },
    { title: '📚 3. AIOStreams [Find Streams]', file: '/3-AIOStreams-Setup.html' },
    { title: '🔎 4. AIOMetadata [Metadata & Catalogs]', file: '/4-AIOMetadata-Setup.html' },
    { title: '🧹 5. Cinebye [Clean Up]', file: '/5-Cinebye-Cleanup.html' },
    { title: '🤖 6. Personalized & Automated Lists', file: '/6-Personalized-Lists.html' },
    { title: '🛠️ Additional Stuff', file: '/7-Additional-Stuff.html' },
    { title: '❓ Configuration Q&A', file: '/8-Configuration-QA.html' },
    { title: '🎛️ AIOManager [Power Users]', file: '/AIOManager-Setup.html' },
    { title: '📜 Changelog', file: '/Changelog.html' },
    { title: '🔔 Updates', file: '/Updates.html' },
];

// Navigate to a new HTML page
function navigateToPage(filePath) {
    window.location.href = filePath;
}

function renderSidebar() {
    const mount = document.getElementById("sidebar-nav");
    if (!mount) return;

    // Create the Home link
    const home = document.createElement("a");
    home.className = "nav-link";
    home.href = "/index.html"; // Update this path if needed
    home.textContent = "🎬 Home";

    // Highlight the current page if it's the home page
    if (window.location.pathname.endsWith("index.html")) {
        home.setAttribute("aria-current", "page");
    }

    // Create the <ul> for the rest of the guide files
    const ul = document.createElement("ul");

    // Add the guide files to the <ul>
    guideFiles.forEach(guide => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "nav-link";
        a.href = guide.file;
        a.textContent = guide.title;

        // Highlight the current page
        if (window.location.pathname.endsWith(guide.file.split('/').pop())) {
            a.setAttribute("aria-current", "page");
        }

        li.appendChild(a);
        ul.appendChild(li);
    });

    // Clear the sidebar
    mount.innerHTML = "";

    // Append the Home link and the <ul> to the sidebar
    mount.appendChild(home);
    mount.appendChild(ul);

    // Add click handlers to sidebar links
    mount.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetFile = this.getAttribute('href');
            navigateToPage(targetFile);
        });
    });
}

function renderQuickNav() {
    const quick = document.getElementById("quick-nav");
    const list = document.getElementById("quick-nav-list");
    const article = document.querySelector(".doc-card");
    if (!quick || !list || !article) return;

    list.innerHTML = "";
    const headers = Array.from(article.querySelectorAll("h2, h3, h4")).filter(h => !h.closest("#quick-nav"));
    if (headers.length === 0) {
        quick.hidden = true;
        return;
    }

    headers.forEach(h => {
        if (!h.id) return;
        const li = document.createElement("li");
        li.style.marginLeft = h.tagName === "H2" ? "0" : h.tagName === "H3" ? "0.6rem" : "1.1rem";
        const a = document.createElement("a");
        a.href = "#" + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        list.appendChild(li);
    });

    if (list.children.length > 0) {
        const h1 = article.querySelector("h1");
        if (h1 && h1.nextSibling) {
            article.insertBefore(quick, h1.nextSibling); // Insert quick-nav after the <h1>
        }
        quick.hidden = false;
    }
}

// Render pager navigation
function renderPager() {
    const pager = document.getElementById("pager");
    if (!pager) return;

    const currentFile = window.location.pathname.split('/').pop();
    const index = guideFiles.findIndex(guide => currentFile === guide.file.split('/').pop());

    if (index === -1) {
        pager.hidden = true;
        return;
    }

    const prev = guideFiles[index - 1];
    const next = guideFiles[index + 1];

    pager.innerHTML = "";
    if (prev) {
        const prevLink = document.createElement("a");
        prevLink.href = prev.file;
        prevLink.className = "pager__prev";
        prevLink.innerHTML = "<span>Previous</span><strong>" + prev.title + "</strong>";
        pager.appendChild(prevLink);
    }

    if (next) {
        const nextLink = document.createElement("a");
        nextLink.href = next.file;
        nextLink.className = "pager__next";
        nextLink.innerHTML = "<span>Next</span><strong>" + next.title + "</strong>";
        pager.appendChild(nextLink);
    }

    pager.hidden = pager.children.length === 0;
}

// Setup mobile navigation
function setupMobileNav() {
    const body = document.body;
    const toggle = document.getElementById("nav-toggle");
    const backdrop = document.getElementById("nav-backdrop");

    if (!toggle || !backdrop) return;

    function closeNav() {
        body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
        const next = !body.classList.contains("nav-open");
        body.classList.toggle("nav-open", next);
        toggle.setAttribute("aria-expanded", next ? "true" : "false");
    });

    backdrop.addEventListener("click", closeNav);
    window.addEventListener("resize", function () {
        if (window.innerWidth > 1040) {
            closeNav();
        }
    });
}

// Initialize the sidebar on page load
document.addEventListener('DOMContentLoaded', function() {
    renderSidebar();
    renderQuickNav();
    renderPager();
    setupMobileNav();
});