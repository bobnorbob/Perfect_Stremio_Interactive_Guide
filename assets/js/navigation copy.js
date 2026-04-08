// Handles navigation and sidebar generation

// Define your guide files (update paths as needed)
const guideFiles = [
    {
        title: "Getting Started",
        children: [
            { title: '🏠 Home', file: '/index.html' },
            { title: '🔰 Beginner Concepts', file: '/0-Beginner-Concepts.html' }
        ]
    },
    {
        title: "Setup Guides",
        children: [
            { title: '📝 1. Accounts Preparation', file: '/1-Accounts-Preparation.html' },
            { title: '⚙️ 2. Stremio Initialization', file: '/2-Stremio-Initialization.html' },
            { title: '📚 3. AIOStreams Setup', file: '/3-AIOStreams-Setup.html' },
            { title: '🔎 4. AIOMetadata Setup', file: '/4-AIOMetadata-Setup.html' }
        ]
    },
    {
        title: "Advanced Topics",
        children: [
            { title: '🧹 5. Cinebye Cleanup', file: '/5-Cinebye-Cleanup.html' },
            { title: '🤖 6. Personalized Lists', file: '/6-Personalized-Lists.html' },
            { title: '🛠️ Additional Stuff', file: '/7-Additional-Stuff.html' }
        ]
    },
    {
        title: "Support",
        children: [
            { title: '❓ Configuration Q&A', file: '/8-Configuration-QA.html' },
            { title: '🎛️ AIOManager Setup', file: '/AIOManager-Setup.html' },
            { title: '🔔 Updates', file: '/Updates.html' }
        ]
    }
];

function buildTree(guideFiles) {
    const root = { children: {}, order: [] };

    guideFiles.forEach(section => {
        const sectionNode = { key: section.title, children: {}, order: [], page: null };
        root.children[section.title] = sectionNode;
        root.order.push(section.title);

        section.children.forEach(guide => {
            const guideNode = { key: guide.title, children: {}, order: [], page: guide };
            sectionNode.children[guide.title] = guideNode;
            sectionNode.order.push(guide.title);
        });
    });

    return root;
}

function renderNode(node, list, level) {
    const keys = node.order;

    keys.forEach(key => {
        const child = node.children[key];
        const li = document.createElement("li");

        if (child.order.length > 0) {
            // This is a section with children
            const details = document.createElement("details");
            const summary = document.createElement("summary");
            summary.className = "nav-summary";
            summary.textContent = child.key;
            details.appendChild(summary);

            const sub = document.createElement("ul");
            sub.className = "nav-children";
            renderNode(child, sub, level + 1);
            details.appendChild(sub);
            li.appendChild(details);
        } else if (child.page) {
            // This is a guide link
            const a = document.createElement("a");
            a.className = "nav-link";
            a.href = child.page.file;
            a.textContent = child.key;

            // Highlight the current page
            if (window.location.pathname.endsWith(child.page.file.split('/').pop())) {
                a.setAttribute("aria-current", "page");
            }

            li.appendChild(a);
        }

        if (li.childNodes.length > 0) {
            list.appendChild(li);
        }
    });
}

// Navigate to a new HTML page
function navigateToPage(filePath) {
    window.location.href = filePath;
}

// Generate the sidebar navigation
function renderSidebar() {
    const mount = document.getElementById("sidebar-nav");
    if (!mount) return;

    const home = document.createElement("a");
    home.className = "nav-link";
    home.href = "/index.html";
    home.textContent = "🎬 Home";

    if (window.location.pathname.endsWith("index.html")) {
        home.setAttribute("aria-current", "page");
    }

    const ul = document.createElement("ul");
    renderNode(buildTree(guideFiles), ul, 0);

    mount.innerHTML = "";
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

// Render quick navigation within the page
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