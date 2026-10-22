(() => {
  "use strict";

  // Configuração: número fictício (DDI + DDD + número, só dígitos).
  const WHATSAPP_NUMBER = "5512992178744";
  const DEFAULT_MESSAGE = "Olá! Gostaria de conhecer a coleção AUREN.";

  document.documentElement.classList.add("js");

  const header = document.querySelector(".site-header");
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");
  const whatsappBtn = document.getElementById("whatsappBtn");

  const whatsappLink = (text) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  /* Menu mobile */
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  menu
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => setMenu(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  window
    .matchMedia("(min-width: 761px)")
    .addEventListener("change", () => setMenu(false));

  /* Cabeçalho ao rolar */
  const onScroll = () =>
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Link ativo no menu */
  const links = [...menu.querySelectorAll("a")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((a) =>
              a.classList.toggle(
                "is-current",
                a.getAttribute("href") === `#${entry.target.id}`,
              ),
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => spy.observe(s));

    /* Revelar ao rolar */
    const reveal = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));
  } else {
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("is-visible"));
  }

  /* Filtro do catálogo */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".product");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterButtons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      products.forEach((item) => {
        const show = filter === "todos" || item.dataset.category === filter;
        item.classList.toggle("is-hidden", !show);
        if (show) item.classList.add("is-visible");
      });
    });
  });

  /* Botões de consulta e WhatsApp */
  document.querySelectorAll("[data-product]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const message = `Olá! Tenho interesse em: ${btn.dataset.product}.`;
      window.open(whatsappLink(message), "_blank", "noopener");
    });
  });

  whatsappBtn.href = whatsappLink(DEFAULT_MESSAGE);

  /* Fallback para imagens que não carregarem */
  document
    .querySelectorAll(
      ".product-media img, .about-media img, .hero-media img, .feature-media img",
    )
    .forEach((img) => {
      const fail = () => img.parentElement.classList.add("img-fail");
      img.addEventListener("error", fail);
      if (img.complete && img.naturalWidth === 0) fail();
    });

  /* Ano no rodapé */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
