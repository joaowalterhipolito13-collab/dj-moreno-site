const footerYear = document.getElementById("footerYear");
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

const preloader = document.getElementById("preloader");

if (preloader) {
  const minDisplay = 1100;
  const startTime = Date.now();

  const hidePreloader = () => {
    const elapsed = Date.now() - startTime;
    const wait = Math.max(0, minDisplay - elapsed);
    setTimeout(() => {
      preloader.classList.add("is-hidden");
      document.body.classList.remove("preloading");
      setTimeout(() => preloader.remove(), 700);
    }, wait);
  };

  if (document.readyState === "complete") {
    hidePreloader();
  } else {
    window.addEventListener("load", hidePreloader);
  }
}

const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
      openItem.classList.remove("is-open");
      openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      question.setAttribute("aria-expanded", "true");
    }
  });
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealEls = document.querySelectorAll("[data-reveal]");

if (revealEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
}

const testimonialPile = document.getElementById("testimonialPile");

if (testimonialPile) {
  const pileObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          testimonialPile.classList.add("is-visible");
          pileObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
  );

  pileObserver.observe(testimonialPile);
}

const heroCanvas = document.getElementById("heroParticles");

if (heroCanvas && !reduceMotion) {
  const ctx = heroCanvas.getContext("2d");
  const heroSection = heroCanvas.closest(".hero");
  let particles = [];
  let width = 0;
  let height = 0;
  let rafId = null;

  function resizeCanvas() {
    const rect = heroSection.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    heroCanvas.width = width * devicePixelRatio;
    heroCanvas.height = height * devicePixelRatio;
    heroCanvas.style.width = `${width}px`;
    heroCanvas.style.height = `${height}px`;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    const count = Math.max(18, Math.min(46, Math.round((width * height) / 26000)));
    particles = Array.from({ length: count }, createParticle);
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: height + Math.random() * height * 0.4,
      r: 0.8 + Math.random() * 2.2,
      speed: 0.25 + Math.random() * 0.6,
      drift: (Math.random() - 0.5) * 0.4,
      alpha: 0.15 + Math.random() * 0.5,
      flicker: Math.random() * Math.PI * 2,
    };
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y -= p.speed;
      p.x += p.drift;
      p.flicker += 0.05;

      if (p.y < -10) {
        Object.assign(p, createParticle(), { y: height + 10 });
      }

      const twinkle = 0.6 + Math.sin(p.flicker) * 0.4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242, 194, 48, ${p.alpha * twinkle})`;
      ctx.fill();
    });

    rafId = requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!rafId) step();
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
  });

  resizeCanvas();
  io.observe(heroSection);

  let particleResizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(particleResizeTimer);
    particleResizeTimer = setTimeout(resizeCanvas, 200);
  });
}
