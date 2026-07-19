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
    const now = new Date();
    const stamp = toLocalDate(now).replaceAll("-", "");
    const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map((value) => String(value).padStart(2, "0"))
      .join("");
    const sequenceKey = `calypsoLeadSequence:${stamp}`;
    const savedSequence = Number.parseInt(storage.get(sequenceKey) || "0", 10);
    const sequence = Number.isFinite(savedSequence) && savedSequence >= 0 ? savedSequence + 1 : 1;
    storage.set(sequenceKey, String(sequence));
    return `VC-${stamp}-${time}-${String(sequence).padStart(2, "0")}`;
  };

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
    const leadId = createLeadId();
    return `Hola, vengo del sitio oficial de Villa Calypso y me interesa ${intent}.${details}\n\nOrigen: Sitio web Villa Calypso\nCampaña comercial: ${config.campaignCode}\nReferencia comercial: ${config.referralCode}\nCódigo promocional: ${config.promotionCode}\nBeneficio web: ${config.promotionDiscount} de descuento\nFolio web: ${leadId}\nAtribución digital: ${utmSummary()}`;
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
    link.href = `https://wa.me/${config.whatsappNumber}`;
    link.addEventListener("click", () => {
      link.href = whatsappUrl(link.dataset.intent || "una consulta general");
      showToast("Abriendo WhatsApp con tu folio y código MCZ10…");
    });
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
  const flexibleDates = $("#flexibleDates");
  const guestName = $("#guestName");
  const adults = $("#adults");
  const children = $("#children");
  const infants = $("#infants");
  const formStatus = $("#formStatus");
  const tomorrow = addDays(new Date(), 1);
  const dayAfterTomorrow = addDays(new Date(), 2);

  const pluralize = (amount, singular, plural = `${singular}s`) => `${amount} ${amount === 1 ? singular : plural}`;

  const formatDate = (value) => {
    if (!value) return "por definir";
    return new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(`${value}T12:00:00`));
  };

  const calculateNights = () => {
    if (!checkin?.value || !checkout?.value || checkout.value <= checkin.value) return 0;
    const start = new Date(`${checkin.value}T12:00:00`);
    const end = new Date(`${checkout.value}T12:00:00`);
    return Math.round((end - start) / 86400000);
  };

  const selectedServices = () => $$('#bookingForm input[name="services"]:checked')
    .map((input) => input.value);

  const getGuestCount = () => ({
    adults: Number.parseInt(adults?.value || "0", 10),
    children: Number.parseInt(children?.value || "0", 10),
    infants: Number.parseInt(infants?.value || "0", 10)
  });

  const updateQuoteSummary = () => {
    const counts = getGuestCount();
    const occupancy = counts.adults + counts.children + counts.infants;
    const remaining = Math.max(0, 15 - occupancy);
    const guestTotal = $("#guestTotal");
    const summary = $("#quoteSummary strong");
    const services = selectedServices();
    const nights = calculateNights();

    if (guestTotal) {
      guestTotal.textContent = occupancy > 15
        ? `${occupancy} huéspedes · excede la capacidad por ${occupancy - 15}`
        : `${pluralize(occupancy, "huésped", "huéspedes")} · ${remaining ? `capacidad disponible para ${remaining} más` : "capacidad completa"}`;
      guestTotal.classList.toggle("is-over-limit", occupancy > 15);
    }

    if (summary) {
      const dates = nights
        ? `${pluralize(nights, "noche")} · ${formatDate(checkin.value)} a ${formatDate(checkout.value)}`
        : (flexibleDates?.checked ? "fechas flexibles" : "fechas por elegir");
      summary.textContent = `${pluralize(occupancy, "huésped", "huéspedes")} (${counts.adults} adultos, ${counts.children} menores, ${counts.infants} bebés) · ${dates} · ${services.length ? services.join(", ") : "solo hospedaje"}`;
    }
  };

  if (checkin && checkout) {
    checkin.min = toLocalDate(tomorrow);
    checkout.min = toLocalDate(dayAfterTomorrow);
    checkin.addEventListener("change", () => {
      checkin.removeAttribute("aria-invalid");
      if (!checkin.value) {
        updateQuoteSummary();
        return;
      }
      const earliestCheckout = addDays(new Date(`${checkin.value}T12:00:00`), 1);
      checkout.min = toLocalDate(earliestCheckout);
      if (checkout.value && checkout.value <= checkin.value) checkout.value = "";
      updateQuoteSummary();
    });
    checkout.addEventListener("change", () => {
      checkout.removeAttribute("aria-invalid");
      updateQuoteSummary();
    });
  }

  const validateQuote = ({ requireName = true } = {}) => {
    if (!checkin || !checkout || !formStatus) return true;
    checkin.removeAttribute("aria-invalid");
    checkout.removeAttribute("aria-invalid");
    guestName?.removeAttribute("aria-invalid");
    adults?.removeAttribute("aria-invalid");
    children?.removeAttribute("aria-invalid");
    infants?.removeAttribute("aria-invalid");
    formStatus.textContent = "";

    if (requireName && (!guestName?.value.trim() || guestName.value.trim().length < 2)) {
      guestName?.setAttribute("aria-invalid", "true");
      formStatus.textContent = "Escribe tu nombre para identificar la cotización.";
      guestName?.focus();
      return false;
    }

    if (!checkin.value && !checkout.value && !flexibleDates?.checked) {
      checkin.setAttribute("aria-invalid", "true");
      checkout.setAttribute("aria-invalid", "true");
      formStatus.textContent = "Selecciona llegada y salida, o marca que tus fechas son flexibles.";
      checkin.focus();
      return false;
    } else if (!checkin.value || !checkout.value) {
      if (checkin.value || checkout.value || !flexibleDates?.checked) {
        const missing = checkin.value ? checkout : checkin;
        missing.setAttribute("aria-invalid", "true");
        formStatus.textContent = "Selecciona tanto la fecha de llegada como la de salida, o deja ambas vacías si son flexibles.";
        missing.focus();
        return false;
      }
    } else if (checkout.value <= checkin.value) {
      checkout.setAttribute("aria-invalid", "true");
      formStatus.textContent = "La fecha de salida debe ser posterior a la fecha de llegada.";
      checkout.focus();
      return false;
    }

    const counts = getGuestCount();
    if (counts.adults + counts.children + counts.infants > 15) {
      adults?.setAttribute("aria-invalid", "true");
      children?.setAttribute("aria-invalid", "true");
      infants?.setAttribute("aria-invalid", "true");
      formStatus.textContent = "Villa Calypso recibe un máximo de 15 huéspedes. Ajusta adultos, menores o bebés.";
      adults?.focus();
      return false;
    }
    return true;
  };

  const getFormData = () => {
    const counts = getGuestCount();
    return {
      checkin: checkin?.value || "",
      checkout: checkout?.value || "",
      dates: checkin?.value && checkout?.value
        ? `${formatDate(checkin.value)} al ${formatDate(checkout.value)}`
        : "Flexibles / por definir",
      nights: calculateNights(),
      guests: counts.adults + counts.children + counts.infants,
      adults: counts.adults,
      children: counts.children,
      infants: counts.infants,
      name: guestName?.value.trim() || "por definir",
      occasion: $("#occasion")?.value || "por definir",
      pets: $("#pets")?.value || "No",
      services: selectedServices(),
      message: $("#message")?.value.trim() || "Sin comentarios adicionales"
    };
  };

  [adults, children, infants, flexibleDates, $("#pets"), $("#occasion"), ...$$('#bookingForm input[name="services"]')]
    .filter(Boolean)
    .forEach((control) => control.addEventListener("change", updateQuoteSummary));

  guestName?.addEventListener("input", () => guestName.removeAttribute("aria-invalid"));
  updateQuoteSummary();

  $("#bookingAirbnb")?.addEventListener("click", () => {
    if (!validateQuote({ requireName: false })) return;
    const data = getFormData();
    openExternal(airbnbUrl({
      checkin: data.checkin,
      checkout: data.checkout,
      guests: data.guests
    }), "Abriendo el anuncio oficial en Airbnb…");
  });

  $("#bookingForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateQuote()) return;
    const data = getFormData();
    const group = [
      pluralize(data.adults, "adulto"),
      pluralize(data.children, "menor", "menores"),
      pluralize(data.infants, "bebé", "bebés")
    ].join(", ");
    const details = `*SOLICITUD DE COTIZACIÓN · VILLA CALYPSO*\n\nNombre: ${data.name}\nFechas: ${data.dates}${data.nights ? ` (${pluralize(data.nights, "noche")})` : ""}\nGrupo: ${group}\nOcupación total: ${pluralize(data.guests, "huésped", "huéspedes")}\nMascotas: ${data.pets}\nMotivo del viaje: ${data.occasion}\nServicios a cotizar: ${data.services.length ? data.services.join(", ") : "Solo hospedaje"}\nComentarios: ${data.message}\n\nPropiedad solicitada: Villa completa · 6 habitaciones · capacidad máxima de 15 huéspedes`;
    openExternal(whatsappUrl("recibir una cotización de estancia", details), "Abriendo WhatsApp con tu solicitud filtrada…");
  });

  const year = $("#currentYear");
  if (year) year.textContent = String(new Date().getFullYear());
})();
