/**
 * Grupo Asmad - Core Application Logic
 */
document.addEventListener('DOMContentLoaded', () => {
  // =========================================
  // 1. DOM ELEMENTS CACHE
  // =========================================
  const root = document.documentElement;

  // Hero & Navigation
  const heroSection = document.querySelector('.hero');
  const heroContent = document.getElementById('hero-content');
  const bgIcon = document.getElementById('bg-icon');
  const logo = document.getElementById('logo');
  const services = document.querySelectorAll('.service');

  // Details Screen
  const fullDetailsScreen = document.getElementById('full-details');
  const closeFullDetailsBtn = document.getElementById('close-full-details');
  const detailsTextCol = document.getElementById('full-details-text');

  // Carousel
  const carouselTrack = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');

  // Hamburguesa
  const navMenu = document.querySelector('nav');
  const hamburgerBtn = document.getElementById('mobile-menu-btn');

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('menu-open');
      const icon = hamburgerBtn.querySelector('.material-symbols-outlined');
      icon.textContent = navMenu.classList.contains('menu-open') ? 'close' : 'menu';
    });
  }

  // =========================================
  // 2. STATE MANAGEMENT
  // =========================================
  const carouselState = {
    currentSlide: 0,
    totalSlides: 0
  };

  // =========================================
  // 3. DATA STORE
  // =========================================
  const serviceData = {
    default: {
      color: '#FF6B00',
      light: '#f3f5f7',
      title: 'INGENIERÍA QUE <span>TRANSFORMA</span> TUS ESPACIOS',
      desc: 'Soluciones eléctricas, estructurales y de diseño con ejecución profesional. Seguridad, estética y precisión en cada proyecto.',
      cta: 'Solicitar cotización',
      hasDetails: false,
      isDefault: true
    },
    bolt: {
      color: '#007BFF',
      light: '#E6F0FA',
      title: 'INSTALACIONES <span>ELÉCTRICAS</span>',
      desc: 'Proyectos integrales de cableado, tableros y sistemas eléctricos residenciales e industriales.',
      cta: 'Cotizar Instalaciones',
      hasDetails: true,
      extDesc: 'Realizamos estudios de carga, diseño de planos eléctricos y ejecución de obras garantizando seguridad al 100%. Cumplimos estrictamente con el Código Nacional de Electricidad para proteger tus activos y personal.',
      benefits: ['Instalación de tableros', 'Cableado estructurado', 'Mantenimiento preventivo'],
      images: ['./img/instalaciones-electricas/1.jpg', './img/instalaciones-electricas/2.jpg', './img/instalaciones-electricas/3.jpg']
    },
    tile_medium: {
      color: '#A0522D',
      light: '#F5EBE6',
      title: 'MUEBLES DE <span>MELAMINA</span>',
      desc: 'Fabricación de muebles a medida para oficinas, cocinas y closets, combinando funcionalidad y acabados premium.',
      cta: 'Cotizar Melamina',
      hasDetails: true,
      extDesc: 'Trabajamos con tableros de alta densidad y herrajes de marcas líderes. Diseñamos en 3D antes de fabricar para optimizar cada rincón de tu espacio.',
      benefits: ['Diseño 3D previo', 'Herrajes premium', 'Aprovechamiento de espacios'],
      images: ['./img/muebles-de-melamina/1.jpg', './img/muebles-de-melamina/2.jpg', './img/muebles-de-melamina/3.jpg']
    },
    construction: {
      color: '#4A5568',
      light: '#EDF2F7',
      title: 'ESTRUCTURAS <span>METÁLICAS</span>',
      desc: 'Diseño, fabricación y montaje de estructuras de acero para techos, naves industriales y refuerzos.',
      cta: 'Cotizar Estructuras',
      hasDetails: true,
      extDesc: 'Contamos con soldadores homologados y aplicamos recubrimientos anticorrosivos de grado industrial. Calculado bajo normas RNE.',
      benefits: ['Soldadura homologada', 'Recubrimientos industriales', 'Montaje seguro'],
      images: ['./img/estructuras-metalicas/1.jpg', './img/estructuras-metalicas/2.jpg', './img/estructuras-metalicas/3.jpg']
    },
    plumbing: {
      color: '#00A8E8',
      light: '#E6F7FF',
      title: 'INSTALACIONES <span>SANITARIAS</span>',
      desc: 'Redes de agua potable, desagüe y alcantarillado con pruebas de hermeticidad y calidad garantizada.',
      cta: 'Cotizar Sanitarias',
      hasDetails: true,
      extDesc: 'Garantizamos la estanqueidad mediante pruebas de presión hidrostática. Tuberías y conexiones certificadas.',
      benefits: ['Redes de agua y desagüe', 'Cisternas y bombas', 'Pruebas de hermeticidad'],
      images: ['./img/instalaciones-sanitarias/1.jpg', './img/instalaciones-sanitarias/2.jpg', './img/instalaciones-sanitarias/3.jpg']
    },
    local_fire_department: {
      color: '#DC143C',
      light: '#FAE6E8',
      title: 'SISTEMAS CONTRA <span>INCENDIOS</span>',
      desc: 'Instalación de rociadores, gabinetes y bombas contra incendio cumpliendo la normativa nacional.',
      cta: 'Cotizar Sistemas CI',
      hasDetails: true,
      extDesc: 'Diseño e instalación bajo normativa NFPA y RNE. Asegura la aprobación de inspecciones municipales.',
      benefits: ['Rociadores automáticos', 'Cuartos de bombas', 'Gabinetes y alarmas'],
      images: ['./img/sistemas-contra-incendios/1.jpg', './img/sistemas-contra-incendios/2.jpg', './img/sistemas-contra-incendios/3.jpg']
    },
    electrical_services: {
      color: '#2E8B57',
      light: '#E8F5EB',
      title: 'POZOS A <span>TIERRA</span>',
      desc: 'Construcción, mantenimiento y certificación de pozos a tierra para proteger tus equipos y personal.',
      cta: 'Cotizar Pozos',
      hasDetails: true,
      extDesc: 'Tratamiento químico especializado para alcanzar el ohmiaje requerido. Entrega de protocolo firmado.',
      benefits: ['Certificados para Defensa Civil', 'Tratamiento químico', 'Mantenimiento anual'],
      images: ['./img/pozos-a-tierra/1.jpg', './img/pozos-a-tierra/2.jpg', './img/pozos-a-tierra/3.jpg']
    }
  };

  // =========================================
  // 4. CAROUSEL LOGIC
  // =========================================
  const updateCarouselPosition = () => {
    if (!carouselTrack) return;
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === carouselState.currentSlide);
    });
  };

  const updateControlsState = () => {
    if (!prevBtn || !nextBtn || !dotsContainer) return;

    const { currentSlide, totalSlides } = carouselState;
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1 || totalSlides <= 1;

    const displayValue = totalSlides <= 1 ? 'none' : 'flex';
    prevBtn.style.display = displayValue;
    nextBtn.style.display = displayValue;
    dotsContainer.style.display = displayValue;
  };

  const updateDots = () => {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === carouselState.currentSlide);
      dot.setAttribute('aria-selected', index === carouselState.currentSlide);
    });
  };

  const createDots = () => {
    dotsContainer.innerHTML = '';
    const { totalSlides } = carouselState;
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.role = 'tab';
      dot.classList.add('carousel-dot');
      if (i === 0) { dot.classList.add('active'); dot.setAttribute('aria-selected', 'true'); }
      dot.addEventListener('click', () => {
        carouselState.currentSlide = i;
        updateCarouselPosition();
        updateControlsState();
        updateDots();
      });
      dotsContainer.appendChild(dot);
    }
  };

  const updateCarouselParams = () => {
    if (!carouselTrack) return;
    carouselState.totalSlides = carouselTrack.querySelectorAll('.carousel-slide').length;
    carouselState.currentSlide = 0;
    updateCarouselPosition();
    updateControlsState();
    updateDots();
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (carouselState.currentSlide < carouselState.totalSlides - 1) {
        carouselState.currentSlide++;
        updateCarouselPosition(); updateControlsState(); updateDots();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (carouselState.currentSlide > 0) {
        carouselState.currentSlide--;
        updateCarouselPosition(); updateControlsState(); updateDots();
      }
    });
  }

  // =========================================
  // 5. APPLICATION LOGIC
  // =========================================
  const closeFullDetails = () => {
    if (fullDetailsScreen) fullDetailsScreen.classList.remove('open');
    if (heroSection) heroSection.classList.remove('slide-out');

    setTimeout(() => {
      if (carouselTrack) carouselTrack.innerHTML = '';
      if (dotsContainer) dotsContainer.innerHTML = '';
    }, 600);
  };

  if (closeFullDetailsBtn) {
    closeFullDetailsBtn.addEventListener('click', closeFullDetails);
  }

  const updateScreen = (info) => {
    const { color, light, title, desc, cta, hasDetails, isDefault, extDesc, benefits, images } = info;
    closeFullDetails();

    // Actualización de colores
    root.style.setProperty('--primary-color', color);
    root.style.setProperty('--bg-gradient', `linear-gradient(to right, ${light} 0%, #f3f5f7 100%)`);


    // Inyectar contenido en Hero
    let buttonsHtml = '';
    if (isDefault) {
      buttonsHtml = `
        <div class="hero-action-container">
          <a href="https://wa.me/TUNUMERO" target="_blank" class="btn-main">${cta}</a>
        </div>
      `;
    } else {
      buttonsHtml = `
        <div class="hero-action-container">
          <a href="https://wa.me/TUNUMERO" target="_blank" class="btn-main">${cta}</a>
          ${hasDetails ? `<button type="button" id="btn-open-details" class="btn-ghost">Ver detalles</button>` : ''}
        </div>
      `;
    }

    heroContent.classList.remove('animate-slide');
    void heroContent.offsetWidth; // Trigger reflow

    heroContent.innerHTML = `
      <h1>${title}</h1>
      <p>${desc}</p>
      ${buttonsHtml}
    `;

    heroContent.classList.add('animate-slide');

    // Manejo de Detalles
    if (hasDetails) {
      const openBtn = document.getElementById('btn-open-details');
      if (openBtn) {
        openBtn.addEventListener('click', () => {
          const benefitsHtml = benefits
            .map(b => `<li><span class="material-symbols-outlined">check_circle</span> ${b}</li>`)
            .join('');

          detailsTextCol.innerHTML = `
            <h2 id="dialog-title">${title}</h2> 
            <p class="ext-desc">${extDesc}</p>
            <h3>Servicios incluidos:</h3>
            <ul class="ext-benefits-list">${benefitsHtml}</ul>
          `;

          carouselTrack.innerHTML = '';
          if (images && images.length > 0) {
            images.forEach((imgUrl, idx) => {
              const slide = document.createElement('div');
              slide.classList.add('carousel-slide');
              if (idx === 0) slide.classList.add('active');
              slide.innerHTML = `<img src="${imgUrl}" alt="Trabajo Realizado">`;
              carouselTrack.appendChild(slide);
            });
          }

          createDots();
          updateCarouselParams();
          heroSection.classList.add('slide-out');
          fullDetailsScreen.classList.add('open');
        });
      }
    }
  };

  // Eventos de Servicios (Protegidos)
  services.forEach(service => {
    service.addEventListener('click', () => {
      const iconElement = service.querySelector('.material-symbols-outlined');

      // Si no hay icono, no podemos obtener el nombre para serviceData
      if (!iconElement) return;

      const iconName = iconElement.textContent.trim();

      if (service.classList.contains('active')) {
        resetToDefault();
      } else {
        services.forEach(s => s.classList.remove('active'));
        service.classList.add('active');

        // Verifica que el dato existe en tu objeto serviceData
        if (serviceData[iconName]) {
          updateScreen(serviceData[iconName]);
          if (bgIcon) {
            bgIcon.textContent = iconName;
            bgIcon.classList.add('show');
          }
        }
      }
      service.blur();
    });
  });

  const resetToDefault = () => {
    services.forEach(s => s.classList.remove('active'));
    updateScreen(serviceData.default);
    bgIcon.classList.remove('show');
    closeFullDetails();
  };

  if (logo) {
    logo.addEventListener('click', resetToDefault);
  }
});