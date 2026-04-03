/**
 * Grupo Asmad - Core Application Logic
 * Refactored for maintainability, performance, and accessibility.
 */
document.addEventListener('DOMContentLoaded', () => {
  // =========================================
  // 1. DOM ELEMENTS CACHE
  // Caching DOM selections avoids unnecessary reflows/repaints and improves performance.
  // =========================================
  const root = document.documentElement;
  
  // Hero & Navigation
  const heroSection = document.querySelector('.hero');
  const heroContent = document.getElementById('hero-content');
  const bgIcon = document.getElementById('bg-icon');
  const logo = document.getElementById('logo');
  const ctaText = document.getElementById('cta-text');
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

  // =========================================
  // 2. STATE MANAGEMENT
  // =========================================
  const carouselState = {
    currentSlide: 0,
    totalSlides: 0
  };

  // =========================================
  // 3. DATA STORE
  // Contains text, properties, and image locations for each service.
  // =========================================
  const serviceData = {
    default: {
      color: '#FF6B00', 
      light: '#f3f5f7',
      title: 'INGENIERÍA QUE <br><span>TRANSFORMA</span><br> TUS ESPACIOS',
      desc: 'Soluciones eléctricas, estructurales y de diseño con ejecución profesional. Seguridad, estética y precisión en cada proyecto.',
      cta: 'Solicitar cotización',
      hasDetails: false
    },
    bolt: {
      color: '#007BFF', 
      light: '#E6F0FA',
      title: 'INSTALACIONES <br><span>ELÉCTRICAS</span>',
      desc: 'Proyectos integrales de cableado, tableros y sistemas eléctricos residenciales e industriales.',
      cta: 'Cotizar Instalaciones',
      hasDetails: true,
      extDesc: 'Realizamos estudios de carga, diseño de planos eléctricos y ejecución de obras garantizando seguridad al 100%. Cumplimos estrictamente con el Código Nacional de Electricidad para proteger tus activos y personal.',
      benefits: ['Instalación de tableros', 'Cableado estructurado', 'Mantenimiento preventivo'],
      images: [
        'https://images.unsplash.com/photo-1621905235294-1b3293889b7b?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558223611-306d1a1b553e?q=80&w=800&auto=format&fit=crop'
      ]
    },
    chair: {
      color: '#A0522D', 
      light: '#F5EBE6',
      title: 'MUEBLES DE <br><span>MELAMINA</span>',
      desc: 'Fabricación de muebles a medida para oficinas, cocinas y closets, combinando funcionalidad y acabados premium.',
      cta: 'Cotizar Melamina',
      hasDetails: true,
      extDesc: 'Trabajamos con tableros de alta densidad y herrajes de marcas líderes. Diseñamos en 3D antes de fabricar para optimizar cada rincón de tu espacio según tus necesidades.',
      benefits: ['Diseño 3D previo', 'Herrajes premium', 'Aprovechamiento de espacios'],
      images: [] 
    },
    construction: {
      color: '#4A5568', 
      light: '#EDF2F7',
      title: 'ESTRUCTURAS <br><span>METÁLICAS</span>',
      desc: 'Diseño, fabricación y montaje de estructuras de acero para techos, naves industriales y refuerzos.',
      cta: 'Cotizar Estructuras',
      hasDetails: true,
      extDesc: 'Contamos con soldadores homologados y aplicamos recubrimientos anticorrosivos de grado industrial. Estructuras calculadas bajo normas RNE para soportar cargas y sismos.',
      benefits: ['Soldadura homologada', 'Recubrimientos industriales', 'Montaje seguro'],
      images: [] 
    },
    plumbing: {
      color: '#00A8E8', 
      light: '#E6F7FF',
      title: 'INSTALACIONES <br><span>SANITARIAS</span>',
      desc: 'Redes de agua potable, desagüe y alcantarillado con pruebas de hermeticidad y calidad garantizada.',
      cta: 'Cotizar Sanitarias',
      hasDetails: true,
      extDesc: 'Garantizamos la estanqueidad de las redes mediante pruebas de presión hidrostática. Utilizamos tuberías y conexiones certificadas para larga duración.',
      benefits: ['Redes de agua y desagüe', 'Cisternas y bombas', 'Pruebas de hermeticidad'],
      images: [] 
    },
    local_fire_department: {
      color: '#DC143C', 
      light: '#FAE6E8',
      title: 'SISTEMAS CONTRA <br><span>INCENDIOS</span>',
      desc: 'Instalación de rociadores, gabinetes y bombas contra incendio cumpliendo la normativa nacional.',
      cta: 'Cotizar Sistemas CI',
      hasDetails: true,
      extDesc: 'Diseño e instalación bajo normativa NFPA y RNE. Asegura la aprobación de inspecciones municipales y protege vidas y propiedades efectivamente.',
      benefits: ['Rociadores automáticos', 'Cuartos de bombas', 'Gabinetes y alarmas'],
      images: [] 
    },
    electrical_services: {
      color: '#2E8B57', 
      light: '#E8F5EB',
      title: 'POZOS A <br><span>TIERRA</span>',
      desc: 'Construcción, mantenimiento y certificación de pozos a tierra para proteger tus equipos y personal.',
      cta: 'Cotizar Pozos',
      hasDetails: true,
      extDesc: 'Tratamiento químico especializado para alcanzar el ohmiaje requerido por Defensa Civil. Entregamos protocolo de pruebas firmado por ingeniero colegiado.',
      benefits: ['Certificados para Defensa Civil', 'Tratamiento químico', 'Mantenimiento anual'],
      images: []
    }
  };

  // =========================================
  // 4. CAROUSEL LOGIC
  // =========================================
  
  /**
   * Updates the visual position of the carousel track based on currentSlide.
   */
  const updateCarouselPosition = () => {
    carouselTrack.style.transform = `translateX(-${carouselState.currentSlide * 100}%)`;
  };

  /**
   * Disables/Enables arrows depending on start/end positions to improve UX.
   */
  const updateControlsState = () => {
    const { currentSlide, totalSlides } = carouselState;
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1 || totalSlides <= 1;

    // Hide controls completely if there's strictly 1 or fewer images
    const displayValue = totalSlides <= 1 ? 'none' : 'flex';
    prevBtn.style.display = displayValue;
    nextBtn.style.display = displayValue;
    dotsContainer.style.display = displayValue;
  };

  /**
   * Refreshes the active visual state of the pagination dots.
   */
  const updateDots = () => {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === carouselState.currentSlide);
      dot.setAttribute('aria-selected', index === carouselState.currentSlide);
    });
  };

  /**
   * Generates pagination dots based on the amount of slides present.
   */
  const createDots = () => {
    dotsContainer.innerHTML = ''; 
    const { totalSlides } = carouselState;

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.role = 'tab';
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);

      if (i === 0) {
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
      }

      dot.addEventListener('click', () => {
        carouselState.currentSlide = i;
        updateCarouselPosition();
        updateControlsState();
        updateDots();
      });
      dotsContainer.appendChild(dot);
    }
  };

  /**
   * Initializes or re-initializes the carousel state params.
   */
  const updateCarouselParams = () => {
    carouselState.totalSlides = carouselTrack.querySelectorAll('.carousel-slide').length;
    carouselState.currentSlide = 0; // Reset to start when changing service
    updateCarouselPosition();
    updateControlsState();
    updateDots();
  };

  // Navigation events for carousel arrows
  nextBtn.addEventListener('click', () => {
    if (carouselState.currentSlide < carouselState.totalSlides - 1) {
      carouselState.currentSlide++;
      updateCarouselPosition();
      updateControlsState();
      updateDots();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (carouselState.currentSlide > 0) {
      carouselState.currentSlide--;
      updateCarouselPosition();
      updateControlsState();
      updateDots();
    }
  });

  // =========================================
  // 5. APPLICATION LOGIC & NAVIGATION
  // =========================================

  /**
   * Closes the detailed view and resets the animation state.
   */
  const closeFullDetails = () => {
    fullDetailsScreen.classList.remove('open');
    heroSection.classList.remove('slide-out');
    
    // We delay the innerHTML reset to prevent content flashing while animating out
    setTimeout(() => {
      carouselTrack.innerHTML = '';
      dotsContainer.innerHTML = '';
    }, 600);
  };

  closeFullDetailsBtn.addEventListener('click', closeFullDetails);

  /**
   * Core function to update the Hero screen and prepare the Dynamic view mapping.
   * Utilizes ES6 destructuring for cleaner data access.
   */
  const updateScreen = (info) => {
    // 1. Destructure necessary fields and prep state
    const { color, light, title, desc, cta, hasDetails, extDesc, benefits, images } = info;
    closeFullDetails();

    // 2. Theming setup
    root.style.setProperty('--primary-color', color);
    root.style.setProperty('--bg-gradient', `linear-gradient(to right, ${light} 0%, #f3f5f7 100%)`);
    ctaText.textContent = cta;

    // 3. Build dynamic hero layout
    const detailsBtnHtml = hasDetails
      ? `<button type="button" id="btn-open-details" class="btn-details">Ver más detalles <span class="material-symbols-outlined" style="font-size:18px;" aria-hidden="true">arrow_forward</span></button>`
      : '';

    // Why we do this: Toggling 'animate-slide' class re-triggers the CSS fade-in animation.
    // 'void heroContent.offsetWidth' forces a browser layout calculation (reflow), confirming the removal before re-adding.
    heroContent.classList.remove('animate-slide');
    void heroContent.offsetWidth; 

    heroContent.innerHTML = `
      <h1>${title}</h1>
      <p>${desc}</p>
      ${detailsBtnHtml}
    `;

    heroContent.classList.add('animate-slide');

    // 4. Attach event listener if Details view is applicable
    if (hasDetails) {
      const openBtn = document.getElementById('btn-open-details');
      openBtn.addEventListener('click', () => {
        
        // Inject textual content
        const benefitsHtml = benefits
          .map(b => `<li><span class="material-symbols-outlined" aria-hidden="true">check_circle</span> ${b}</li>`)
          .join('');

        detailsTextCol.innerHTML = `
          <h2 id="dialog-title">${title}</h2> 
          <p class="ext-desc">${extDesc}</p>
          <h3>Servicios incluidos:</h3>
          <ul class="ext-benefits-list">
            ${benefitsHtml}
          </ul>
        `;
        fullDetailsScreen.setAttribute('aria-labelledby', 'dialog-title');

        // Inject carousel media
        carouselTrack.innerHTML = '';
        if (images && images.length > 0) {
          images.forEach((imgUrl, idx) => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');
            slide.role = 'group';
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `Imagen ${idx + 1} de ${images.length}`);
            slide.innerHTML = `<img src="${imgUrl}" alt="Ejemplo de trabajo de ${title.replace(/<[^>]*>?/gm, ' ')}">`;
            carouselTrack.appendChild(slide);
          });
        } else {
          // Fallback image handling if no images are provided
          carouselTrack.innerHTML = `
            <div class="carousel-slide" role="group" aria-roledescription="slide" aria-label="Imagen 1 de 1">
              <img src="https://via.placeholder.com/800x600?text=Grupo+Asmad" alt="Grupo Asmad">
            </div>`;
        }

        // Boot the Carousel visually
        createDots();
        updateCarouselParams();

        // Reveal view
        heroSection.classList.add('slide-out');
        fullDetailsScreen.classList.add('open');
      });
    }
  };

  /**
   * Binds interaction logic to bottom service buttons.
   */
  services.forEach(service => {
    // Accessibility: Support keyboard actions (Enter or Space) since role="button" is on div
    service.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        service.click();
      }
    });

    service.addEventListener('click', () => {
      const iconSpan = service.querySelector('.material-symbols-outlined');
      const iconName = iconSpan.textContent.trim();

      if (service.classList.contains('active')) {
        // Toggle off if currently active
        service.classList.remove('active');
        service.setAttribute('aria-expanded', 'false');
        updateScreen(serviceData.default);
        bgIcon.classList.remove('show');
      } else if (serviceData[iconName]) {
        // Reset previously active service states
        services.forEach(s => {
           s.classList.remove('active');
           s.removeAttribute('aria-expanded');
        });
        
        // Mark new service active
        service.classList.add('active');
        service.setAttribute('aria-expanded', 'true');
        
        updateScreen(serviceData[iconName]);
        
        // Update background visual flair
        bgIcon.textContent = iconName;
        bgIcon.classList.add('show');
      }
    });
  });

  // Global reset interaction via primary logo
  logo.addEventListener('click', () => resetToDefault());
  logo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      resetToDefault();
    }
  });

  const resetToDefault = () => {
    services.forEach(s => {
       s.classList.remove('active');
       s.removeAttribute('aria-expanded');
    });
    updateScreen(serviceData.default);
    bgIcon.classList.remove('show');
    closeFullDetails();
  };
});