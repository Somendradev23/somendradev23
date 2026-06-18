/* =============================================
   ADVANCED 3D PORTFOLIO JAVASCRIPT
   Somendra Kumar Yadav
   ============================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---- 1. CURSOR GLOW ---- */
  const cursorGlow = document.getElementById("cursorGlow");
  if (cursorGlow) {
    document.addEventListener("mousemove", (e) => {
      cursorGlow.style.left = e.clientX + "px";
      cursorGlow.style.top = e.clientY + "px";
    });
  }

  /* ---- 2. PARTICLE CANVAS ---- */
  const canvas = document.getElementById("particles-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        const colors = ["108, 99, 255", "0, 212, 255", "255, 107, 107", "0, 255, 136"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create particles
    const PARTICLE_COUNT = Math.min(120, Math.floor((canvas.width * canvas.height) / 8000));
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    // Connect nearby particles with lines
    const connectParticles = () => {
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(108, 99, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      connectParticles();
      animFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  /* ---- 3. TYPED TEXT EFFECT ---- */
  const typedEl = document.getElementById("typedText");
  if (typedEl) {
    const texts = [
      "Full Stack Developer",
      "Backend Engineer",
      "Node.js Expert",
      "React Developer",
      "API Architect",
    ];
    let textIdx = 0, charIdx = 0, isDeleting = false;

    const typeEffect = () => {
      const current = texts[textIdx];
      if (isDeleting) {
        typedEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typedEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
      }

      let delay = isDeleting ? 60 : 110;

      if (!isDeleting && charIdx === current.length) {
        delay = 1800;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        textIdx = (textIdx + 1) % texts.length;
        delay = 400;
      }
      setTimeout(typeEffect, delay);
    };
    setTimeout(typeEffect, 1000);
  }

  /* ---- 4. HEADER SCROLL BEHAVIOR ---- */
  const header = document.getElementById("header");
  const scrollTopBtn = document.getElementById("scrollTop");

  window.addEventListener("scroll", () => {
    // Header glass effect
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
    // Scroll-to-top button
    if (scrollTopBtn) {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    }
    // Active nav link
    updateActiveNav();
    // Reveal elements
    revealOnScroll();
    // Animate skill bars
    animateSkillBars();
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- 5. ACTIVE NAV LINK ON SCROLL ---- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const updateActiveNav = () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  /* ---- 6. MOBILE HAMBURGER MENU ---- */
  const hamburger = document.getElementById("hamburger");
  const navLinksEl = document.getElementById("navLinks");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinksEl.classList.toggle("active");
    });
  }

  document.querySelectorAll(".nav-links a").forEach(item => {
    item.addEventListener("click", () => {
      if (hamburger) hamburger.classList.remove("active");
      if (navLinksEl) navLinksEl.classList.remove("active");
    });
  });

  /* ---- 7. SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 75,
          behavior: "smooth",
        });
      }
    });
  });

  /* ---- 8. SCROLL REVEAL ANIMATIONS ---- */
  const revealOnScroll = () => {
    const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    reveals.forEach(el => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 100;
      if (elementTop < windowHeight - revealPoint) {
        el.classList.add("active");
      }
    });
  };
  revealOnScroll(); // Run on load too

  /* ---- 9. SKILL BAR ANIMATION ---- */
  let skillsAnimated = false;
  const animateSkillBars = () => {
    if (skillsAnimated) return;
    const skillsSection = document.getElementById("skills");
    if (!skillsSection) return;
    const sectionTop = skillsSection.getBoundingClientRect().top;
    if (sectionTop < window.innerHeight - 100) {
      skillsAnimated = true;
      document.querySelectorAll(".skill-progress[data-width]").forEach(bar => {
        const targetWidth = bar.getAttribute("data-width");
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, 200);
      });
    }
  };
  animateSkillBars();

  /* ---- 10. 3D CARD TILT EFFECT ---- */
  const cards = document.querySelectorAll(".project-card, .skill-item, .timeline-content, .about-card");

  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * 6;
      const tiltY = ((x - centerX) / centerX) * -6;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
      card.style.transition = "transform 0.1s ease";

      // Shine effect
      const shine = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.07) 0%, transparent 60%)`;
      card.style.backgroundImage = shine;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      card.style.backgroundImage = "";
    });
  });

  /* ---- 11. CONTACT FORM ---- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      const formData = new FormData(contactForm);
      const formDataObj = {};
      formData.forEach((value, key) => { formDataObj[key] = value; });

      fetch("https://corphash.net/contactus.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataObj),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          showToast("✅ Message sent! I'll get back to you soon.", "success");
          contactForm.reset();
        })
        .catch((error) => {
          console.error("Error:", error);
          showToast("❌ Oops! Something went wrong. Try emailing directly.", "error");
        })
        .finally(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        });
    });
  }

  /* ---- 12. TOAST NOTIFICATION ---- */
  const showToast = (message, type = "success") => {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    const color = type === "success" ? "#00ff88" : "#ff6b6b";
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "30px",
      left: "50%",
      transform: "translateX(-50%) translateY(20px)",
      background: "rgba(15, 15, 35, 0.95)",
      color: color,
      padding: "14px 28px",
      borderRadius: "12px",
      border: `1px solid ${color}40`,
      boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 20px ${color}20`,
      zIndex: "9999",
      fontFamily: "'Outfit', sans-serif",
      fontWeight: "600",
      fontSize: "0.95rem",
      backdropFilter: "blur(20px)",
      transition: "all 0.4s ease",
    });

    document.body.appendChild(toast);
    setTimeout(() => { toast.style.transform = "translateX(-50%) translateY(0)"; toast.style.opacity = "1"; }, 10);
    setTimeout(() => {
      toast.style.transform = "translateX(-50%) translateY(20px)";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  };

  /* ---- 13. INITIAL ANIMATIONS ---- */
  // Trigger hero animations after slight delay
  setTimeout(() => {
    document.querySelectorAll(".hero .reveal-left, .hero .reveal-right").forEach((el, i) => {
      setTimeout(() => el.classList.add("active"), i * 200);
    });
  }, 300);

}); // END DOMContentLoaded
