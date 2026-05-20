const loader = document.querySelector("[data-loader]");
const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
const cursor = document.querySelector("[data-cursor]");
const canvas = document.querySelector("[data-particles]");
const ctx = canvas.getContext("2d");
const typingTarget = document.querySelector("[data-typing]");
const revealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll("[data-tilt]");
const counters = document.querySelectorAll("[data-counter]");
const form = document.querySelector("[data-form]");
const statusText = document.querySelector("[data-status]");
const themeButton = document.querySelector("[data-theme]");
const parallax = document.querySelector("[data-parallax]");
const submitButton = document.querySelector("[data-submit]");
const nameCopy = document.querySelector("[data-name-copy]");
const emailCopy = document.querySelector("[data-email-copy]");

let particles = [];

const emailConfig = {
  serviceId: "service_wj479ig",
  templateId: "template_6isld9p",
  publicKey: "eBUJLLgCXjQH5bf6p"
};

const isEmailConfigured = () => (
  emailConfig.serviceId !== "YOUR_EMAILJS_SERVICE_ID" &&
  emailConfig.templateId !== "YOUR_EMAILJS_TEMPLATE_ID" &&
  emailConfig.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY"
);

const getEmailErrorMessage = (error) => (
  error?.text || error?.message || "Unknown EmailJS error"
);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("is-hidden"), 550);
});

const syncScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${percent}%`;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

window.addEventListener("scroll", syncScroll, { passive: true });
syncScroll();

const typeName = async () => {
  const value = typingTarget.dataset.typing;
  const delay = reduceMotion ? 0 : 120;
  typingTarget.textContent = "";

  for (let index = 0; index <= value.length; index += 1) {
    typingTarget.textContent = value.slice(0, index);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  typingTarget.textContent = value;
};

typeName();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      if (entry.target.classList.contains("skill-card")) {
        entry.target.classList.add("is-visible");
      }
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
  revealObserver.observe(item);
});

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = Number(entry.target.dataset.counter);
      const decimal = entry.target.hasAttribute("data-decimal");
      const start = performance.now();

      const tick = (now) => {
        const progressAmount = Math.min((now - start) / 1100, 1);
        const value = target * progressAmount;
        entry.target.textContent = decimal ? value.toFixed(2) : Math.round(value);
        if (progressAmount < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));

window.addEventListener("pointermove", (event) => {
  document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
  document.documentElement.style.setProperty("--my", `${event.clientY}px`);
  if (cursor) {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  }
  if (parallax && window.innerWidth > 860) {
    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 18;
    parallax.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }
});

document.querySelectorAll("a, button, input, textarea").forEach((item) => {
  item.addEventListener("pointerenter", () => cursor?.classList.add("is-active"));
  item.addEventListener("pointerleave", () => cursor?.classList.remove("is-active"));
});

document.addEventListener("click", (event) => {
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.left = `${event.clientX}px`;
  ripple.style.top = `${event.clientY}px`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
});

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (window.innerWidth < 860) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

const resizeCanvas = () => {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  const count = Math.min(Math.floor(window.innerWidth / 12), 120);
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    radius: Math.random() * 1.8 + 0.8
  }));
};

const drawParticles = () => {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = "rgba(0, 245, 255, 0.72)";
  ctx.strokeStyle = "rgba(99, 102, 241, 0.16)";

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();

    for (let i = index + 1; i < particles.length; i += 1) {
      const other = particles[i];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 115) {
        ctx.globalAlpha = 1 - distance / 115;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  });

  if (!reduceMotion) requestAnimationFrame(drawParticles);
};

resizeCanvas();
drawParticles();
window.addEventListener("resize", resizeCanvas);

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  statusText.classList.remove("is-error", "is-success");

  if (!window.emailjs || !isEmailConfigured()) {
    statusText.classList.add("is-error");
    statusText.textContent = "Email service is not configured yet. Please add EmailJS service ID, template ID, and public key.";
    return;
  }

  emailjs.init({ publicKey: emailConfig.publicKey });
  nameCopy.value = form.elements.from_name.value;
  emailCopy.value = form.elements.reply_to.value;

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  statusText.textContent = "Sending your message...";

  try {
    await emailjs.sendForm(
      emailConfig.serviceId,
      emailConfig.templateId,
      form,
      { publicKey: emailConfig.publicKey }
    );

    statusText.classList.add("is-success");
    statusText.textContent = "Message sent successfully. Thank you!";
    form.reset();
  } catch (error) {
    console.error("EmailJS send failed:", error);
    statusText.classList.add("is-error");
    statusText.textContent = `Message could not be sent: ${getEmailErrorMessage(error)}`;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send Message";
  }
});
