(() => {
  "use strict";

  const config = window.SITE_CONFIG;
  if (!config) return;

  const html = document.documentElement;
  const body = document.body;
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

  html.classList.add("enhanced");

  const storage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch { /* Storage may be unavailable. */ }
    }
  };

  const toLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const addDays = (date, days) => {
    const copy = new Date(date.getTime());
    copy.setDate(copy.getDate() + days);
    return copy;
  };

  const createLeadId = () => {
    const stamp = toLocalDate(new Date()).replaceAll("-", "");
    const random = Math.random().toString(36).slice(2, 7).toUpperCase().padEnd(5, "X");
    return `VC-${stamp}-${random}`;
  };

  let leadId = storage.get("calypsoLeadId");
  if (!leadId || !/^VC-\d{8}-[A-Z0-9]{5}$/.test(leadId)) {
    leadId = createLeadId();
    storage.set("calypsoLeadId", leadId);
  }

  const captureUtm = () => {
    const params = new URLSearchParams(window.location.search);
    const current = {};
    utmKeys.forEach((key) => {
      const value = params.get(key);
      if (value) current[key] = value.slice(0, 160);
    });

    if (Object.keys(current).length) {
      storage.set("calypsoUtm", JSON.stringify(current));
      return current;
    }

    try {
      const saved = JSON.parse(storage.get("calypsoUtm") || "{}");
      return saved && typeof saved === "object" ? saved : {};
    } catch {
      return {};
    }
  };

  const utm = captureUtm();
  const utmSummary = () => {
    const values = utmKeys.filter((key) => utm[key]).map((key) => `${key}: ${utm[key]}`);
    return values.length ? values.join(" | ") : "directo";
  };

  const whatsappMessage = (intent = "una consulta general", extra = "") => {
    const details = extra ? `\n\n${extra.trim()}` : "";
    return `Hola, vengo del sitio oficial de Villa Calypso y me interesa ${intent}.${details}\n\nOrigen: Sitio web Villa Calypso\nReferencia comercial: ${config.referralCode}\nFolio web: ${leadId}\nCampaña: ${utmSummary()}`;
  };

  const whatsappUrl = (intent, extra = "") => {
    const url = new URL(`https://wa.me/${config.whatsappNumber}`);
    url.searchParams.set("text", whatsappMessage(intent, extra));
    return url.toString();
  };

  const airbnbUrl = ({ checkin = "", checkout = "", guests = "" } = {}) => {
    const url = new URL(config.airbnbUrl);
    if (checkin) url.searchParams.set("check_in", checkin);
    if (checkout) url.searchParams.set("check_out", checkout);
    if (guests) url.searchParams.set("adults", guests);
    utmKeys.forEach((key) => {
      if (utm[key]) url.searchParams.set(key, utm[key]);
    });
    return url.toString();
  };

  let toastTimer;
  const showToast = (message) => {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  };

  const openExternal = (url, message) => {
    if (message) showToast(message);
    const popup = window.open(url, "_blank", "noopener,noreferrer");
    if (!popup) window.location.assign(url);
  };

  $$(".js-airbnb").forEach((link) => {
    link.href = airbnbUrl();
  });

  $$(".js-whatsapp").forEach((link) => {
    link.href = whatsappUrl(link.dataset.intent || "una consulta general");
    link.addEventListener("click", () => showToast("Abriendo WhatsApp con tu folio de seguimiento…"));
  });

  const catalogLink = $("#catalogLink");
  if (catalogLink) catalogLink.href = config.whatsappCatalogUrl;

  const socialConfig = [
    ["socialInstagram", config.instagramUrl],
    ["socialFacebook", config.facebookUrl],
    ["socialTiktok", config.tiktokUrl]
  ];
  socialConfig.forEach(([id, url]) => {
    const link = $(`#${id}`);
    if (!link || !url) return;
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.hidden = false;
  });

  const header = $("#siteHeader");
  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 36);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const siteIntro = $("#siteIntro");
  const introExplore = $("#introExplore");
  if (siteIntro && introExplore) {
    const backgroundElements = Array.from(body.children).filter((element) => (
      element !== siteIntro && element.tagName !== "SCRIPT"
    ));
    let introIsOpen = true;

    const setBackgroundInert = (isInert) => {
      backgroundElements.forEach((element) => { element.inert = isInert; });
    };

    const enterSite = () => {
      if (!introIsOpen) return;
      introIsOpen = false;
      siteIntro.classList.add("is-leaving");
      const delay = reducedMotion.matches ? 0 : 760;
      window.setTimeout(() => {
        siteIntro.hidden = true;
        body.classList.remove("intro-active");
        setBackgroundInert(false);
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        $("#heroTitle")?.focus({ preventScroll: true });
      }, delay);
    };

    body.classList.add("intro-active");
    setBackgroundInert(true);
    window.requestAnimationFrame(() => introExplore.focus({ preventScroll: true }));

    introExplore.addEventListener("click", enterSite);
    siteIntro.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        enterSite();
      } else if (event.key === "Tab") {
        event.preventDefault();
        introExplore.focus();
      }
    });

  }

  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -6%", threshold: 0.08 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const journeyTabs = $$("[data-journey-index]");
  const journeySlides = $$("[data-journey-slide]");
  const journeyCopy = $("#journeyCopy");

  const activateJourney = (index, moveFocus = false) => {
    const nextTab = journeyTabs[index];
    const nextSlide = journeySlides[index];
    if (!nextTab || !nextSlide) return;

    journeyTabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === index;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
    journeySlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });
    if (journeyCopy) journeyCopy.textContent = nextTab.dataset.journeyCopy || "";
    if (moveFocus) nextTab.focus();
  };

  journeyTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateJourney(index));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (index + 1) % journeyTabs.length;
      else if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = (index - 1 + journeyTabs.length) % journeyTabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = journeyTabs.length - 1;
      else return;
      event.preventDefault();
      activateJourney(nextIndex, true);
    });
  });
  if (journeyTabs.length) activateJourney(0);

  const focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
  const trapFocus = (event, container) => {
    if (event.key !== "Tab") return;
    const focusable = $$(focusableSelector, container).filter((element) => !element.hidden);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const menuShell = $("#menuShell");
  const mobileMenu = $("#mobileMenu");
  const menuOpen = $("#menuOpen");
  const menuClose = $("#menuClose");
  let menuReturnFocus = null;

  const openMenu = () => {
    if (!menuShell || !mobileMenu || !menuOpen) return;
    menuReturnFocus = document.activeElement;
    menuShell.hidden = false;
    body.classList.add("is-locked");
    menuOpen.setAttribute("aria-expanded", "true");
    menuClose?.focus();
  };

  const closeMenu = () => {
    if (!menuShell || menuShell.hidden) return;
    menuShell.hidden = true;
    body.classList.remove("is-locked");
    menuOpen?.setAttribute("aria-expanded", "false");
    if (menuReturnFocus instanceof HTMLElement) menuReturnFocus.focus();
  };

  menuOpen?.addEventListener("click", openMenu);
  menuClose?.addEventListener("click", closeMenu);
  $(".menu-backdrop")?.addEventListener("click", closeMenu);
  $$("a[href^='#']", mobileMenu || document).forEach((link) => link.addEventListener("click", closeMenu));
  mobileMenu?.addEventListener("keydown", (event) => trapFocus(event, mobileMenu));

  const galleryItems = [
    {
      src: "./assets/images/optimized/villa-pool-wide-1920.webp",
      alt: "Alberca infinita de Villa Calypso frente al Pacífico durante la hora dorada",
      caption: "Alberca infinita · vista al Pacífico"
    },
    {
      src: "./assets/images/optimized/villa-lounge-wide-1920.webp",
      alt: "Sala panorámica de Villa Calypso con vista al mar",
      caption: "Sala panorámica · Villa Calypso"
    },
    {
      src: "./assets/images/optimized/villa-interior-wide-1920.webp",
      alt: "Interior de Villa Calypso abierto hacia el Pacífico",
      caption: "Interiores abiertos · Villa Calypso"
    },
    {
      src: "./assets/images/optimized/villa-sunset-wide-1920.webp",
      alt: "Atardecer reflejado en la alberca de Villa Calypso",
      caption: "Atardecer · Villa Calypso"
    }
  ];

  const lightbox = $("#lightbox");
  const lightboxDialog = $(".lightbox__dialog");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");
  const lightboxCounter = $("#lightboxCounter");
  const lightboxClose = $("#lightboxClose");
  let lightboxIndex = 0;
  let lightboxReturnFocus = null;

  const renderLightbox = () => {
    const item = galleryItems[lightboxIndex];
    if (!item || !lightboxImage || !lightboxCaption || !lightboxCounter) return;
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxCaption.textContent = item.caption;
    lightboxCounter.textContent = `${lightboxIndex + 1} de ${galleryItems.length}`;
  };

  const openLightbox = (index, trigger) => {
    if (!lightbox) return;
    lightboxReturnFocus = trigger;
    lightboxIndex = index;
    renderLightbox();
    lightbox.hidden = false;
    body.classList.add("is-locked");
    lightboxClose?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    body.classList.remove("is-locked");
    if (lightboxReturnFocus instanceof HTMLElement) lightboxReturnFocus.focus();
  };

  const moveLightbox = (direction) => {
    lightboxIndex = (lightboxIndex + direction + galleryItems.length) % galleryItems.length;
    renderLightbox();
  };

  $$("[data-gallery-index]").forEach((button) => {
    button.addEventListener("click", () => openLightbox(Number(button.dataset.galleryIndex), button));
  });
  lightboxClose?.addEventListener("click", closeLightbox);
  $(".lightbox__backdrop")?.addEventListener("click", closeLightbox);
  $("#lightboxPrev")?.addEventListener("click", () => moveLightbox(-1));
  $("#lightboxNext")?.addEventListener("click", () => moveLightbox(1));
  lightboxDialog?.addEventListener("keydown", (event) => trapFocus(event, lightboxDialog));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (lightbox && !lightbox.hidden) closeLightbox();
      else closeMenu();
    }
    if (lightbox && !lightbox.hidden && event.key === "ArrowLeft") moveLightbox(-1);
    if (lightbox && !lightbox.hidden && event.key === "ArrowRight") moveLightbox(1);
  });

  $$('img').forEach((image) => {
    image.addEventListener("error", () => {
      image.closest(".gallery-card")?.classList.add("media-unavailable");
      image.hidden = true;
    }, { once: true });
  });

  const checkin = $("#checkin");
  const checkout = $("#checkout");
  const formStatus = $("#formStatus");
  const tomorrow = addDays(new Date(), 1);
  const dayAfterTomorrow = addDays(new Date(), 2);

  if (checkin && checkout) {
    checkin.min = toLocalDate(tomorrow);
    checkout.min = toLocalDate(dayAfterTomorrow);
    checkin.addEventListener("change", () => {
      checkin.removeAttribute("aria-invalid");
      if (!checkin.value) return;
      const earliestCheckout = addDays(new Date(`${checkin.value}T12:00:00`), 1);
      checkout.min = toLocalDate(earliestCheckout);
      if (checkout.value && checkout.value <= checkin.value) checkout.value = "";
    });
    checkout.addEventListener("change", () => checkout.removeAttribute("aria-invalid"));
  }

  const validateDates = () => {
    if (!checkin || !checkout || !formStatus) return true;
    checkin.removeAttribute("aria-invalid");
    checkout.removeAttribute("aria-invalid");
    formStatus.textContent = "";

    if (!checkin.value && !checkout.value) return true;
    if (!checkin.value || !checkout.value) {
      const missing = checkin.value ? checkout : checkin;
      missing.setAttribute("aria-invalid", "true");
      formStatus.textContent = "Selecciona tanto la fecha de llegada como la de salida, o deja ambas por definir.";
      missing.focus();
      return false;
    }
    if (checkout.value <= checkin.value) {
      checkout.setAttribute("aria-invalid", "true");
      formStatus.textContent = "La fecha de salida debe ser posterior a la fecha de llegada.";
      checkout.focus();
      return false;
    }
    return true;
  };

  const getFormData = () => ({
    checkin: checkin?.value || "por definir",
    checkout: checkout?.value || "por definir",
    guests: $("#guests")?.value || "por definir",
    name: $("#guestName")?.value.trim() || "por definir",
    occasion: $("#occasion")?.value || "por definir",
    service: $("#optionalService")?.value || "Ninguno",
    message: $("#message")?.value.trim() || "Sin mensaje adicional"
  });

  $("#bookingAirbnb")?.addEventListener("click", () => {
    if (!validateDates()) return;
    const data = getFormData();
    openExternal(airbnbUrl({
      checkin: data.checkin === "por definir" ? "" : data.checkin,
      checkout: data.checkout === "por definir" ? "" : data.checkout,
      guests: data.guests
    }), "Abriendo el anuncio oficial en Airbnb…");
  });

  $("#bookingWhatsApp")?.addEventListener("click", () => {
    if (!validateDates()) return;
    const data = getFormData();
    const details = `Nombre: ${data.name}\nLlegada: ${data.checkin}\nSalida: ${data.checkout}\nHuéspedes: ${data.guests}\nTipo de estancia: ${data.occasion}\nServicio opcional: ${data.service}\nMensaje: ${data.message}`;
    openExternal(whatsappUrl("solicitar una estancia personalizada", details), "Abriendo WhatsApp con tu solicitud…");
  });

  const year = $("#currentYear");
  if (year) year.textContent = String(new Date().getFullYear());
})();
