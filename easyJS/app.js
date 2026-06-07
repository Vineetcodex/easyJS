/* ═══════════════════════════════════════════════════
   easyJS — app.js
   All original functionality + JS Notes modal system
═══════════════════════════════════════════════════ */

// ── Topic data ──────────────────────────────────────
const topics = [
  {
    title: "HTML",
    summary: "HTML gives a page meaning and structure. Think headings, sections, links, forms, and content that assistive technologies can understand.",
    notes: ["Use semantic tags before generic divs.", "Keep heading levels in order.", "Add labels and alt text where they carry meaning."],
    code: "<article>\n  <h2>Lesson title</h2>\n  <p>Readable content belongs here.</p>\n</article>",
    demo: "html"
  },
  {
    title: "CSS",
    summary: "CSS controls layout, rhythm, color, motion, and responsive behavior. It turns structured content into a polished interface.",
    notes: ["Start with layout constraints.", "Use variables for repeated design values.", "Prefer fluid grids and flexible spacing."],
    code: ".card {\n  display: grid;\n  gap: 1rem;\n  border-radius: 8px;\n}",
    demo: "css"
  },
  {
    title: "JavaScript",
    summary: "JavaScript adds logic and interactivity to websites, from small UI states to full application behavior.",
    notes: ["Read the current state first.", "Update data and UI deliberately.", "Keep functions small and named clearly."],
    code: "const message = 'Learn one concept today';\nconsole.log(message);",
    demo: "js"
  },
  {
    title: "Variables",
    summary: "Variables store values so a program can remember, reuse, and transform information.",
    notes: ["Use const by default.", "Use let when the value must change.", "Choose names that explain intent."],
    code: "const topic = 'DOM';\nlet lessonsCompleted = 3;",
    demo: "variables"
  },
  {
    title: "Functions",
    summary: "Functions package reusable actions. They accept input, do a focused job, and can return output.",
    notes: ["Name functions with verbs.", "Keep each function focused.", "Return values instead of relying on hidden side effects."],
    code: "function greet(name) {\n  return `Hello, ${name}`;\n}",
    demo: "functions"
  },
  {
    title: "Arrays",
    summary: "Arrays store ordered lists. They are perfect for lessons, menu items, search results, and collections of data.",
    notes: ["Use map to transform lists.", "Use filter to narrow lists.", "Use find for one matching item."],
    code: "const topics = ['HTML', 'CSS', 'JavaScript'];\nconst count = topics.length;",
    demo: "arrays"
  },
  {
    title: "Objects",
    summary: "Objects group related values under named keys, making them useful for representing real things in code.",
    notes: ["Use objects for structured data.", "Keep key names predictable.", "Nest only when it improves clarity."],
    code: "const lesson = {\n  title: 'Events',\n  status: 'active'\n};",
    demo: "objects"
  },
  {
    title: "DOM",
    summary: "The DOM is the browser's live representation of the page. JavaScript can read and update it.",
    notes: ["Select the element you need.", "Change text, classes, or attributes.", "Batch UI updates when possible."],
    code: "const title = document.querySelector('h1');\ntitle.textContent = 'easyJS';",
    demo: "dom"
  },
  {
    title: "Events",
    summary: "Events let the page respond to user actions such as clicks, typing, scrolling, and form input.",
    notes: ["Listen on the right element.", "Keep handlers readable.", "Use event data when the interaction needs context."],
    code: "button.addEventListener('click', () => {\n  console.log('Clicked');\n});",
    demo: "events"
  }
];

const badges = [
  { count: 1, label: "First Concept" },
  { count: 3, label: "Momentum" },
  { count: 6, label: "Builder Mode" },
  { count: 9, label: "Web Foundation" }
];

// ── State ────────────────────────────────────────────
const state = {
  learned: new Set(JSON.parse(localStorage.getItem("easyjs-learned") || "[]"))
};

// ── DOM refs ─────────────────────────────────────────
const topicGrid       = document.querySelector("#topicGrid");
const template        = document.querySelector("#topicTemplate");
const searchInput     = document.querySelector("#topicSearch");
const badgeWrap       = document.querySelector("#achievementBadges");
const completedCount  = document.querySelector("#completedCount");
const overallProgress = document.querySelector("#overallProgress");
const progressRing    = document.querySelector("#progressRing");
const badgeCount      = document.querySelector("#badgeCount");
const scrollProgress  = document.querySelector("#scrollProgress");

// ── Render topics ────────────────────────────────────
function renderTopics() {
  topicGrid.innerHTML = "";
  topics.forEach((topic, index) => {
    const node     = template.content.firstElementChild.cloneNode(true);
    const button   = node.querySelector(".topic-trigger");
    const body     = node.querySelector(".topic-body");
    const checkbox = node.querySelector("input[type='checkbox']");

    node.dataset.topic                     = topic.title.toLowerCase();
    node.querySelector("small").textContent  = `Topic ${String(index + 1).padStart(2, "0")}`;
    node.querySelector("strong").textContent = topic.title;
    node.querySelector(".summary").textContent = topic.summary;
    node.querySelector("code").textContent    = topic.code;
    node.querySelector(".notes").innerHTML    = topic.notes.map((n) => `<li>${n}</li>`).join("");
    node.querySelector(".demo-content").appendChild(createDemo(topic.demo, topic.title));
    checkbox.checked = state.learned.has(topic.title);

    button.addEventListener("click", () => {
      const isOpen = node.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) state.learned.add(topic.title);
      else state.learned.delete(topic.title);
      persistProgress();
      updateProgress();
    });

    body.addEventListener("click", (e) => e.stopPropagation());
    topicGrid.appendChild(node);
  });
  observeReveals();
}

// ── Create demo widgets ──────────────────────────────
function createDemo(type, title) {
  const wrap = document.createElement("div");
  wrap.className = "demo-widget";

  if (type === "html") {
    wrap.innerHTML = `<strong>Semantic preview</strong><p class="demo-output">Header → Main → Article → Footer</p>`;
  }

  if (type === "css") {
    wrap.innerHTML = `<button type="button">Change accent</button><p class="demo-output">This text reacts to CSS variables.</p>`;
    const output = wrap.querySelector(".demo-output");
    wrap.querySelector("button").addEventListener("click", () => {
      output.style.color = output.style.color ? "" : "#00d4ff";
    });
  }

  if (type === "js") {
    wrap.innerHTML = `<button type="button">Run logic</button><p class="demo-output">Waiting for JavaScript...</p>`;
    wrap.querySelector("button").addEventListener("click", () => {
      wrap.querySelector(".demo-output").textContent = "JavaScript updated this message.";
    });
  }

  if (type === "variables") {
    wrap.innerHTML = `<button type="button">Add lesson</button><p class="demo-output">lessonsCompleted = 3</p>`;
    let count = 3;
    wrap.querySelector("button").addEventListener("click", () => {
      count += 1;
      wrap.querySelector(".demo-output").textContent = `lessonsCompleted = ${count}`;
    });
  }

  if (type === "functions") {
    wrap.innerHTML = `<input aria-label="Name" value="Learner"><button type="button">Greet</button><p class="demo-output"></p>`;
    wrap.querySelector("button").addEventListener("click", () => {
      const name = wrap.querySelector("input").value.trim() || "Learner";
      wrap.querySelector(".demo-output").textContent = `Hello, ${name}`;
    });
  }

  if (type === "arrays") {
    wrap.innerHTML = `<button type="button">Filter JS topics</button><p class="demo-output">HTML, CSS, JavaScript, DOM</p>`;
    wrap.querySelector("button").addEventListener("click", () => {
      wrap.querySelector(".demo-output").textContent =
        ["HTML", "CSS", "JavaScript", "DOM"].filter((item) => item.includes("S")).join(", ");
    });
  }

  if (type === "objects") {
    wrap.innerHTML = `<button type="button">Read object</button><p class="demo-output">{ title: "${title}" }</p>`;
    wrap.querySelector("button").addEventListener("click", () => {
      wrap.querySelector(".demo-output").textContent = `lesson.title = "${title}"`;
    });
  }

  if (type === "dom") {
    wrap.innerHTML = `<button type="button">Update node</button><p class="demo-output">Original DOM text</p>`;
    wrap.querySelector("button").addEventListener("click", () => {
      wrap.querySelector(".demo-output").textContent = "The DOM node changed.";
    });
  }

  if (type === "events") {
    wrap.innerHTML = `<button type="button">Click event</button><p class="demo-output">Clicks: 0</p>`;
    let clicks = 0;
    wrap.querySelector("button").addEventListener("click", () => {
      clicks += 1;
      wrap.querySelector(".demo-output").textContent = `Clicks: ${clicks}`;
    });
  }

  return wrap;
}

// ── Persist & update progress ────────────────────────
function persistProgress() {
  localStorage.setItem("easyjs-learned", JSON.stringify([...state.learned]));
}

function updateProgress() {
  const total    = topics.length;
  const done     = state.learned.size;
  const pct      = Math.round((done / total) * 100);
  const circumf  = 301.6;

  completedCount.textContent  = `${done}/${total}`;
  overallProgress.textContent = `${pct}%`;
  progressRing.style.strokeDashoffset = circumf - (circumf * pct) / 100;

  // Badges
  badgeWrap.querySelectorAll(".badge").forEach((badge) => {
    const needed = parseInt(badge.dataset.count, 10);
    badge.classList.toggle("earned", done >= needed);
  });

  const earned = badges.filter((b) => done >= b.count).length;
  badgeCount.textContent = `${earned} unlocked`;
}

function renderBadges() {
  badgeWrap.innerHTML = badges
    .map((b) => `<span class="badge${state.learned.size >= b.count ? " earned" : ""}" data-count="${b.count}">🏅 ${b.label}</span>`)
    .join("");
}

// ── Search ───────────────────────────────────────────
function initSearch() {
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    document.querySelectorAll(".topic-card").forEach((card) => {
      const match = !q || card.dataset.topic.includes(q) ||
        card.querySelector("strong").textContent.toLowerCase().includes(q);
      card.style.display = match ? "" : "none";
    });
  });
}

// ── Spotlight ────────────────────────────────────────
function initSpotlight() {
  const el = document.querySelector(".spotlight");
  if (!el) return;
  document.addEventListener("mousemove", (e) => {
    el.style.setProperty("--x", `${e.clientX}px`);
    el.style.setProperty("--y", `${e.clientY}px`);
  });
}

// ── Particle canvas ──────────────────────────────────
function initParticles() {
  const canvas = document.querySelector("#particleCanvas");
  if (!canvas) return;
  const ctx  = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      a:  Math.random() * 0.5 + 0.1
    };
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  resize();
  particles = Array.from({ length: 90 }, makeParticle);
  tick();
  window.addEventListener("resize", resize);
}

// ── Scroll progress bar ──────────────────────────────
function initScrollProgress() {
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const max      = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = max ? (scrolled / max) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${pct}%`;
  }, { passive: true });
}

// ── Active nav highlight ──────────────────────────────
function initNavHighlight() {
  const sections = ["web", "system", "security", "devops", "roadmap"];
  const navLinks = document.querySelectorAll(".top-nav a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) => {
            a.classList.toggle("nav-active", a.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((id) => {
    const el = document.querySelector(`#${id}`);
    if (el) observer.observe(el);
  });
}

// ── Typing animation ──────────────────────────────────
function initTyping() {
  const el   = document.querySelector("#typingText");
  const text = "Making Technology Easier, One Concept at a Time.";
  if (!el) return;
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, 36);
    }
  }
  setTimeout(type, 600);
}

// ── Reveal on scroll ─────────────────────────────────
function observeReveals() {
  const obs = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
    { threshold: 0.08 }
  );
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => obs.observe(el));
}

// ══════════════════════════════════════════════════════
//   JS NOTES MODAL
// ══════════════════════════════════════════════════════

function initJsNotes() {
  const modal      = document.getElementById("jsNotesModal");
  const openBtn    = document.getElementById("openJsNotes");
  const closeBtn   = document.getElementById("closeJsNotes");
  const backdrop   = document.getElementById("jsNotesBackdrop");
  const navItems   = document.querySelectorAll(".jsnotes-nav-item");
  const lectures   = document.querySelectorAll(".jsnotes-lecture");
  const content    = document.getElementById("jsNotesContent");
  const readBar    = document.getElementById("jsReadProgress");

  if (!modal || !openBtn) return;

  let currentLecture = 0;

  // Open
  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    // Focus the content pane for keyboard users
    setTimeout(() => content && content.focus(), 50);
    updateReadProgress();
  }

  // Close
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    openBtn.focus();
  }

  // Switch lecture
  function switchLecture(index) {
    currentLecture = index;

    navItems.forEach((item, i) => item.classList.toggle("is-active", i === index));
    lectures.forEach((lec, i) => {
      lec.hidden = i !== index;
    });

    // Scroll content pane to top
    if (content) content.scrollTop = 0;
    updateReadProgress();
  }

  // Read progress bar — based on scroll position within the content pane
  function updateReadProgress() {
    if (!content || !readBar) return;
    const { scrollTop, scrollHeight, clientHeight } = content;
    const max = scrollHeight - clientHeight;
    const pct = max > 0 ? Math.min(100, (scrollTop / max) * 100) : 100;
    readBar.style.width = `${pct}%`;
  }

  // Event listeners
  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  navItems.forEach((item, i) => {
    item.addEventListener("click", () => switchLecture(i));
  });

  content.addEventListener("scroll", updateReadProgress, { passive: true });

  // Keyboard: Escape to close, arrow keys to switch lectures
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeModal(); return; }
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      switchLecture(Math.min(currentLecture + 1, lectures.length - 1));
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      switchLecture(Math.max(currentLecture - 1, 0));
    }
  });

  // Also allow the main page JS topic card to open the modal
  // (triggered from the card's demo area)
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-jsnotes]")) openModal();
  });
}

// ══════════════════════════════════════════════════════
//   INIT
// ══════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  renderBadges();
  renderTopics();
  updateProgress();
  initSearch();
  initSpotlight();
  initParticles();
  initScrollProgress();
  initNavHighlight();
  initTyping();
  observeReveals();
  initJsNotes();
});
