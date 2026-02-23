// Año footer
document.getElementById("year").textContent = new Date().getFullYear();

// Animación reveal al hacer scroll
const els = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("visible");
  });
}, { threshold: 0.12 });
els.forEach((el) => io.observe(el));

// Stagger chips cuando entren en viewport
const chipsWrap = document.querySelector("#chips");
if (chipsWrap) {
  const chips = [...chipsWrap.querySelectorAll(".chip")];
  chips.forEach((chip, i) => chip.style.setProperty("--d", `${i * 55}ms`));

  const ioChips = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) chipsWrap.classList.add("animate");
    });
  }, { threshold: 0.2 });

  ioChips.observe(chipsWrap);
}

// Testimonios
const TESTIMONIALS = [
  { text: "Creo que el trato, la distribución y la metodología de impartir las clases son muy buenas", by: "Formación Sr Angular" },
  { text: "Finalmente, conseguí un puesto decente en el sector gracias a tu formación", by: "Formación Spring" },
  { text: "Muchas gracias por tu video, me has ayudado mucho", by: "Youtube" },
  { text: "Un agradecimiento especial a mi profesor Valeriano, por su excelente guía y apoyo", by: "Formación Android" },
  { text: "Quiero agradecer especialmente a Valeriano, por su claridad, cercanía y enfoque práctico", by: "Formación Microservicios" },
  { text: "Este curso es una JOYA. ¡Muchas gracias!", by: "Youtube" },
  { text: "Echaré de menos tus clases. Me has permitido seguir creciendo y eso no pasa todos los días", by: "Formación Sr Java" },
];

const track = document.getElementById("t-track");
const dotsWrap = document.getElementById("t-dots");
const prevBtn = document.getElementById("t-prev");
const nextBtn = document.getElementById("t-next");

let idx = 0;
let timer = null;

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function renderSlides(){
  track.innerHTML = TESTIMONIALS.map(t => `
    <article class="testimonial-slide">
      <p class="testimonial-quote">${escapeHtml(t.text)}</p>
      ${t.by ? `<div class="testimonial-meta">— ${escapeHtml(t.by)}</div>` : ``}
    </article>
  `).join("");

  dotsWrap.innerHTML = TESTIMONIALS.map((_, i) =>
    `<button class="testimonial-dot ${i===0 ? "active" : ""}" aria-label="Ir a la opinión ${i+1}" data-i="${i}"></button>`
  ).join("");
}

function goTo(i){
  idx = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
  track.style.transform = `translateX(${-idx * 100}%)`;
  [...dotsWrap.querySelectorAll(".testimonial-dot")].forEach((d, di) =>
    d.classList.toggle("active", di === idx)
  );
}

function next(){ goTo(idx + 1); }
function prev(){ goTo(idx - 1); }

function startAuto(){
  stopAuto();
  timer = setInterval(next, 6500);
}
function stopAuto(){
  if (timer) clearInterval(timer);
  timer = null;
}

if (track && dotsWrap && prevBtn && nextBtn){
  renderSlides();
  goTo(0);
  startAuto();

  nextBtn.addEventListener("click", () => { next(); startAuto(); });
  prevBtn.addEventListener("click", () => { prev(); startAuto(); });

  dotsWrap.addEventListener("click", (e) => {
    const b = e.target.closest(".testimonial-dot");
    if (!b) return;
    goTo(Number(b.dataset.i));
    startAuto();
  });

  const wrap = track.closest(".testimonial");
  wrap?.addEventListener("mouseenter", stopAuto);
  wrap?.addEventListener("mouseleave", startAuto);
}

// Modal diplomas
const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("imgModalSrc");

// Guarda el “sitio original” por si lo quieres devolver al cerrar
let modalHome = modal?.parentNode || null;
let modalNextSibling = modal?.nextSibling || null;

function ensureModalInBody(){
  if (!modal) return;
  if (modal.parentNode !== document.body) {
    document.body.appendChild(modal); // ✅ lo saca de la sección/contenedor
  }
}

function openModal(src, alt){
  if (!modal || !modalImg) return;

  ensureModalInBody(); // ✅ CLAVE

  modalImg.src = src;
  modalImg.alt = alt || "Diploma";

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  modal.scrollTop = 0;
modal.querySelector(".img-modal__content")?.scrollTo(0, 0);

  // opcional: evita que el foco se quede “atrás”
  modal.focus?.();
}

function closeModal(){
  if (!modal || !modalImg) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalImg.src = "";
  modalImg.alt = "";
  document.body.classList.remove("modal-open");

  // opcional: devolverlo a su sitio original
  if (modalHome && modal.parentNode === document.body) {
    if (modalNextSibling && modalNextSibling.parentNode === modalHome) {
      modalHome.insertBefore(modal, modalNextSibling);
    } else {
      modalHome.appendChild(modal);
    }
  }
}

document.querySelectorAll(".js-open-diploma").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.full, btn.dataset.alt));
});

modal?.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
});