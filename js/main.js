const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (navToggle && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (!prefersReducedMotion) {
  const revealItems = document.querySelectorAll(
    ".info-card, .audience-card, .program-card, .principle-card, .timeline-item, .faculty-card, .testimonial-card, .contact-form, .trust-strip__item"
  );

  revealItems.forEach((item) => item.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

if (sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = `#${entry.target.id}`;
        const link = navLinks.find((navLink) => navLink.getAttribute("href") === id);

        if (!link) {
          return;
        }

        if (entry.isIntersecting) {
          navLinks.forEach((navLink) => navLink.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: "-10% 0px -55% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const form = document.querySelector("[data-form]");
const formStatus = document.querySelector("[data-form-status]");
const submitButton = document.querySelector("[data-submit-button]");

const validators = {
  name: (value) => value.trim().length >= 2 || "Введите имя не короче 2 символов.",
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || "Введите корректный email.",
  track: (value) => value.trim() !== "" || "Выберите подходящий формат обучения.",
};

function setFieldState(field, result) {
  const errorNode = form?.querySelector(`[data-error-for="${field.name}"]`);
  const isValid = result === true;

  field.classList.toggle("is-invalid", !isValid);
  field.setAttribute("aria-invalid", String(!isValid));

  if (errorNode) {
    errorNode.textContent = isValid ? "" : result;
  }

  return isValid;
}

function validateField(field) {
  const validator = validators[field.name];

  if (!validator) {
    return true;
  }

  return setFieldState(field, validator(field.value));
}

if (form && formStatus && submitButton) {
  const controlledFields = Array.from(form.querySelectorAll("input, select"));

  controlledFields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = controlledFields.every((field) => validateField(field));

    if (!isValid) {
      formStatus.textContent = "Проверьте поля формы и исправьте ошибки.";
      formStatus.classList.remove("is-success");
      return;
    }

    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Отправляем...";

    window.setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      form.reset();
      controlledFields.forEach((field) => setFieldState(field, true));
      formStatus.textContent =
        "Заявка принята. Здесь можно подключить реальную отправку в CRM или backend.";
      formStatus.classList.add("is-success");
    }, 900);
  });
}
