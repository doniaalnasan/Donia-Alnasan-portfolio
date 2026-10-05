// Initialize Lucide Icons
        lucide.createIcons();

        // Update copyright year dynamically
        document.getElementById('copyright-year').textContent = new Date().getFullYear();

        // Mobile Menu Toggle Logic
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });

        // Close mobile menu when a nav link is clicked
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });

        // ===================================================================
        // Entrance & Scroll Reveal (motion states are classes on <html>;
        // the start state is set by the inline script in <head>, styles live
        // under "Motion System" in css/style_donia_portfolio.css)
        // ===================================================================
        const root = document.documentElement;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        root.classList.add('motion-ready');   // tells the <head> failsafe that this script is running

        const INTRO_FULL_MS = 1650;           // longest entrance animation (CTA/social row) ends at ~1.55s
        const INTRO_SHORT_MS = 800;

        function finishIntro() {
            root.classList.remove('intro', 'intro-short', 'intro-play', 'intro-landed');
            const mark = document.getElementById('intro-mark');
            if (mark) mark.remove();
            try { sessionStorage.setItem('donia-intro-seen', '1'); } catch (e) { /* storage unavailable */ }
        }

        // Monogram: appears centered, then glides into the navbar logo position.
        // Resolves when the monogram has landed (or immediately if it cannot fly).
        function flyMonogramToNavbar() {
            return new Promise(resolve => {
                const mark = document.getElementById('intro-mark');
                const target = document.querySelector('#brand-mark img');
                if (!mark || !target || !mark.animate) { resolve(); return; }

                setTimeout(() => {
                    if (!root.classList.contains('intro')) { resolve(); return; }

                    const from = mark.getBoundingClientRect();
                    const to = target.getBoundingClientRect();
                    if (!to.width) { resolve(); return; }

                    const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
                    const dy = (to.top + to.height / 2) - (from.top + from.height / 2);
                    const scale = to.width / from.width;
                    const easing = 'cubic-bezier(0.65, 0, 0.35, 1)';

                    const flight = mark.animate(
                        [{ transform: 'translate3d(0, 0, 0) scale(1)' }, { transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})` }],
                        { duration: 560, easing, fill: 'forwards' }
                    );
                    mark.querySelectorAll('.intro-mark-glow, .intro-mark-ring').forEach(el =>
                        el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing, fill: 'forwards' })
                    );
                    flight.finished.then(() => {
                        if (root.classList.contains('intro')) {
                            root.classList.add('intro-landed');   // show the real logo exactly where the monogram stopped
                            mark.remove();
                        }
                        resolve();
                    }, resolve);
                }, 480);
            });
        }

        function playIntro() {
            const full = root.classList.contains('intro');
            const short = root.classList.contains('intro-short');
            if (!full && !short) return;

            // Opened scrolled down (refresh mid-page / restored scroll): skip the entrance
            if (window.scrollY > window.innerHeight * 0.5) { finishIntro(); return; }

            root.classList.add('intro-play');
            const timer = new Promise(resolve => setTimeout(resolve, full ? INTRO_FULL_MS : INTRO_SHORT_MS));
            // Settle when both the timeline and the monogram flight are complete
            // (capped, in case animations are paused, e.g. in a background tab)
            const flight = full
                ? Promise.race([flyMonogramToNavbar(), new Promise(resolve => setTimeout(resolve, 2500))])
                : null;
            Promise.all([timer, flight]).then(finishIntro);
        }

        // Start on the next frame: the monogram is already animating from the first paint
        requestAnimationFrame(() => requestAnimationFrame(playIntro));

        // Scroll reveal: [data-reveal] reveals as a group; children of [data-reveal-stagger] reveal in sequence
        function initScrollReveal() {
            if (!root.classList.contains('reveal')) return;

            const targets = [
                ...document.querySelectorAll('[data-reveal]'),
                ...document.querySelectorAll('[data-reveal-stagger] > *')
            ];

            if (!('IntersectionObserver' in window)) {
                targets.forEach(el => el.classList.add('is-revealed', 'reveal-done'));
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                // Elements entering together are staggered in document order
                const visible = entries
                    .filter(entry => entry.isIntersecting)
                    .map(entry => entry.target)
                    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);

                visible.forEach((el, i) => {
                    const delay = Math.min(i, 5) * 90;
                    el.style.setProperty('--reveal-delay', `${delay}ms`);
                    el.classList.add('is-revealed');
                    observer.unobserve(el);
                    // Afterwards, hand control back to the element's own transitions (hover etc.)
                    setTimeout(() => el.classList.add('reveal-done'), delay + 1150);
                });
            }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

            targets.forEach(el => observer.observe(el));
        }

        initScrollReveal();

        // Interactive 3D Tilt Effect on Portrait Frame
        const portraitCard = document.getElementById('portrait-card');

        if (portraitCard && window.innerWidth > 768 && !prefersReducedMotion) {
            const container = portraitCard.parentElement;
            
            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
                const rotateY = ((x - centerX) / centerX) * 10;
                
                portraitCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            container.addEventListener('mouseleave', () => {
                portraitCard.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        }

        // ===================================================================
        // Project Case Studies — Data
        // ===================================================================
        // Each project opens a full case-study view at #case/<slug>.
        // Every section is optional: empty strings / empty arrays are simply
        // not rendered, so missing information can be filled in later.
        //
        //   links:       { live: "", github: "", figma: "" }   ← paste real URLs here
        //   screenshots: [{ src: "img_donia/projects/<slug>/01.webp", alt: "...", caption: "..." }]
        //
        const projectOrder = ['tashkhes', 'palestine-al-orouba', 'market-makers', 'mas', 'lilia'];

        const projectsData = {
            'tashkhes': {
                title: "TASHKHES",
                type: "Healthcare Web Platform · Graduation Project",
                accent: "purple",
                tags: ["UI/UX", "System Analysis", "Front-End", "Back-End"],
                summary: "A web platform that guides patients from their symptoms to the right medical specialty, then to relevant hospitals, doctors, and appointment booking.",
                meta: {
                    role: "System Analysis, UI/UX Design & Full-Stack Development",
                    timeline: "2025 – 2026",
                    team: "",               // e.g. "Team of 3" / "Individual project"
                    result: "Graduation project, graded 98/100"
                },
                overview: "TASHKHES is a web-based healthcare platform that guides patients toward the appropriate medical specialty based on their reported symptoms. It connects patients with relevant hospitals and doctors, supports appointment requests, and enables doctor–patient communication. The project covered the full cycle: from requirement analysis and UX/UI design in Figma to a working full-stack application.",
                problem: "Patients lack a clear and accessible way to identify the appropriate medical specialty for their symptoms, and healthcare information and appointment processes are often fragmented and difficult to navigate.",
                goal: "Turn a complex healthcare decision into a clear, guided digital experience, backed by an integrated system that connects symptoms, specialties, hospitals, doctors, and appointments.",
                uxui: {
                    intro: "I designed a clear, guided, and user-centered experience that helps patients move from symptoms to the appropriate medical specialty.",
                    points: [
                        "Created personas and defined the information architecture",
                        "Designed user flows from symptom entry to specialty, hospital, doctor, and booking",
                        "Produced wireframes, high-fidelity UI, and a clickable prototype in Figma",
                        "Made symptom entry and selection simple, and presented the recommended specialty clearly",
                        "Organized medical information with clear hierarchy and accessible layouts",
                        "Designed clear feedback and error messages throughout the journey",
                        "Designed responsive interfaces for different screen sizes",
                        "Made it clear that the system offers guidance and does not replace professional diagnosis"
                    ]
                },
                analysis: {
                    intro: "I analyzed requirements and user needs to define how symptoms, specialties, hospitals, doctors, and appointments connect.",
                    points: [
                        "Requirement analysis and persona creation",
                        "User authentication and role management",
                        "Symptom and specialty management",
                        "Hospital and doctor management",
                        "Appointment booking and management",
                        "System architecture and database schema design"
                    ]
                },
                frontend: {
                    intro: "I built the patient-facing interface as a responsive React.js application.",
                    points: [
                        "Built the UI as React.js components",
                        "Styled responsive layouts with Tailwind CSS",
                        "Integrated the interface with the platform's REST APIs"
                    ]
                },
                backend: {
                    intro: "As part of the full-stack implementation, I developed the server side that powers the platform.",
                    points: [
                        "Developed REST APIs with Node.js and Express.js",
                        "Designed the MongoDB database schema",
                        "Implemented JWT-based authentication and role management",
                        "Handled database management and data security"
                    ]
                },
                process: ["Requirement Analysis", "Personas", "Information Architecture", "Wireframes", "High-Fidelity UI & Prototype", "DB Schema & REST APIs", "React Components", "Integration"],
                features: [
                    "Symptom-Based Specialty Recommendation",
                    "Hospital & Doctor Discovery",
                    "Appointment Booking & Approval",
                    "Real-Time Patient–Doctor Communication",
                    "Role-Based Authentication",
                    "Admin Dashboard"
                ],
                challenges: [
                    {
                        challenge: "Simplifying a complex healthcare journey into a clear, intuitive, and trustworthy user experience.",
                        solution: "A clear, guided flow that helps patients move from symptoms to the right medical specialty, hospital, and doctor."
                    },
                    {
                        challenge: "Integrating multiple user roles, symptom-based recommendations, database relationships, and appointment workflows into one reliable platform.",
                        solution: "An integrated full-stack platform that connects every step of the journey through secure APIs and a structured database."
                    }
                ],
                tech: {
                    design: ["Figma", "Canva", "User Flow Diagrams", "Wireframing"],
                    frontend: ["React.js", "Tailwind CSS"],
                    backend: ["Node.js", "Express.js", "MongoDB", "JWT"],
                    tools: []
                },
                screenshots: [],
                links: {
                    live: "https://tashkhes.onrender.com/",
                    github: "",             // https://github.com/mahmoud1amer2/TASHKHES returns 404 (private or removed) — add once public
                    figma: "https://www.figma.com/design/ObAdubQS5HnpnFSvVzlUeH/%D9%85%D8%B4%D8%B1%D9%88%D8%B9-%D8%AA%D8%AE%D8%B1%D8%AC-2-%D9%88%D8%A7%D8%AC%D9%87%D8%A7%D8%AA-%D8%A7%D9%85%D8%A7%D9%85%D9%8A%D8%A9?node-id=0-1&t=kNr6JQ9D75FjidRU-1"
                }
            },

            'palestine-al-orouba': {
                title: "Palestine Al-Orouba Educational Center",
                type: "E-Learning Platform · UI/UX Case Study",
                accent: "purple",
                tags: ["UI/UX", "System Analysis"],
                summary: "A course platform where students find the right course by narrowing down educational track, grade, and subject, then subscribe.",
                meta: {
                    role: "UI/UX Design & System Analysis",
                    timeline: "",
                    team: "",
                    result: ""
                },
                overview: "Palestine Al-Orouba Educational Center is a user-centered e-learning platform that gives students a clear way to discover courses based on their educational track, grade, and subject.",
                problem: "Students may struggle to find relevant courses when educational content is not organized clearly by track, grade, and subject, making the learning journey confusing and time-consuming.",
                goal: "Create a clear, intuitive learning experience that helps students easily discover and access the right courses for their academic needs.",
                uxui: {
                    intro: "I designed the user experience and interface, focusing on intuitive navigation, clear course organization, and a seamless journey from browsing to subscription.",
                    points: [
                        "Clear and intuitive navigation",
                        "Responsive and accessible interface",
                        "Consistent visual design system",
                        "Clear user feedback and error states",
                        "UI designed in Figma, with flows mapped in FigJam and Miro"
                    ]
                },
                analysis: {
                    intro: "I structured the course catalog and the student journey through it.",
                    points: [
                        "Organized content by Track → Grade → Subject → Course",
                        "Mapped the user flow from exploring the catalog to subscribing",
                        "Defined easy course discovery and access as core requirements"
                    ]
                },
                frontend: null,
                backend: null,
                process: ["Explore", "Select Track", "Select Grade", "Choose Subject", "Browse Courses", "View Course Details", "Subscribe", "Learn"],
                processLabel: "Student Journey",
                features: [
                    "Track, Grade & Subject-Based Course Organization",
                    "Step-by-Step Course Discovery",
                    "Course Details & Subscription Flow",
                    "Responsive, Consistent Design System",
                    "Clear User Feedback & Error States"
                ],
                challenges: [
                    {
                        challenge: "Organizing a catalog that spans multiple tracks, grades, and subjects without overwhelming students.",
                        solution: "A hierarchical navigation flow (Track → Grade → Subject → Course) that narrows the catalog step by step and leads directly to course details and subscription."
                    }
                ],
                tech: {
                    design: ["Figma", "FigJam", "Miro", "Adobe Photoshop"],
                    frontend: [],
                    backend: [],
                    tools: []
                },
                screenshots: [],
                links: { live: "", github: "", figma: "" }
            },

            'market-makers': {
                title: "Market Makers",
                type: "Trading Education Platform",
                accent: "blue",
                tags: ["UI/UX", "Front-End", "Back-End"],
                summary: "A course platform for a trading education company where users subscribe, upload payment proof, and unlock content after admin approval.",
                meta: {
                    role: "Full-Stack Developer (UI/UX, Front-End & Back-End)",
                    timeline: "2024 – 2025",
                    team: "",
                    result: ""
                },
                overview: "Market Makers is a full-stack e-learning platform developed for a trading education company. Users create accounts, subscribe to courses, and submit payment proof; educational content becomes available after admin approval.",
                problem: "The company needed a secure, structured way to manage course subscriptions, payment verification, and controlled access to educational content.",
                goal: "Build a secure, seamless platform that simplifies course subscriptions, payment verification, and controlled access to content.",
                uxui: {
                    intro: "I designed the platform's UI/UX as part of building it from concept to deployment.",
                    points: []
                },
                analysis: {
                    intro: "",
                    points: [
                        "User authentication and account management",
                        "Course subscription and access control",
                        "Payment proof submission and verification",
                        "Admin approval and course management"
                    ]
                },
                frontend: {
                    intro: "I built the responsive front-end interfaces with HTML, CSS, and JavaScript.",
                    points: []
                },
                backend: {
                    intro: "As part of the full-stack implementation, I built the services behind the platform.",
                    points: [
                        "Developed REST APIs with Node.js and Express.js",
                        "Implemented authentication and course access control",
                        "Handled payment-proof uploads with Multer",
                        "Built the admin approval flow",
                        "Integrated the Supabase database"
                    ]
                },
                process: ["Authentication Setup", "Course Access Control", "Payment Proof Upload", "Admin Approval", "Content Delivery"],
                features: [
                    "User Authentication & Account Management",
                    "Course Subscription & Access Control",
                    "Payment Proof Submission & Admin Approval",
                    "Secure Course Content Delivery"
                ],
                challenges: [
                    {
                        challenge: "Managing secure authentication, payment verification, and role-based course access while keeping the experience simple for learners.",
                        solution: "An integrated platform with secure authentication, payment-proof uploads, admin approval, and controlled course access."
                    }
                ],
                tech: {
                    design: [],
                    frontend: ["HTML", "CSS", "JavaScript"],
                    backend: ["Node.js", "Express.js", "Supabase", "Multer", "REST API"],
                    tools: []
                },
                screenshots: [],
                links: {
                    live: "",
                    github: "",             // https://github.com/doniaalnasan/market_makers is currently empty — add once code is pushed
                    figma: ""
                }
            },

            'mas': {
                title: "MAS",
                type: "Product & Services Website",
                accent: "emerald",
                tags: ["Front-End"],
                summary: "A responsive platform for selling Saudi paint products, which also offers construction and painting services to help with home design.",
                meta: {
                    role: "Front-End Development",
                    timeline: "",
                    team: "",
                    result: ""
                },
                overview: "MAS is a responsive platform for selling Saudi paint products, which also offers construction and painting services to help with home design.",
                problem: "",
                goal: "",
                uxui: null,
                analysis: null,
                frontend: {
                    intro: "I worked on the front-end UI development and responsive layouts.",
                    points: []
                },
                backend: null,
                process: [],
                features: [],
                challenges: [],
                tech: { design: [], frontend: [], backend: [], tools: [] },
                screenshots: [],
                links: { live: "", github: "", figma: "" }
            },

            'lilia': {
                title: "Lilia Digital Agency",
                type: "Landing Page",
                accent: "emerald",
                tags: ["Front-End"],
                summary: "A landing page for a digital agency, with a navigation bar, hero section, and service cards.",
                meta: {
                    role: "Front-End Development",
                    timeline: "",
                    team: "",
                    result: ""
                },
                overview: "Lilia is a landing page for a digital agency, with a navigation bar, hero section, and service cards.",
                problem: "",
                goal: "",
                uxui: null,
                analysis: null,
                frontend: {
                    intro: "I built the page layout and styling from scratch.",
                    points: [
                        "Structured the page with semantic HTML",
                        "Styled the layout with custom CSS"
                    ]
                },
                backend: null,
                process: [],
                features: [],
                challenges: [],
                tech: { design: [], frontend: ["HTML", "CSS"], backend: [], tools: [] },
                screenshots: [],
                links: { live: "", github: "https://github.com/doniaalnasan/lilia", figma: "" }
            }
        };

        // Project Filtering Logic
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => {
                    b.classList.remove('active', 'bg-brand-purple', 'text-white', 'shadow-glow-purple');
                    b.classList.add('text-brand-muted');
                    b.setAttribute('aria-pressed', 'false');
                });

                btn.classList.add('active', 'bg-brand-purple', 'text-white', 'shadow-glow-purple');
                btn.classList.remove('text-brand-muted');
                btn.setAttribute('aria-pressed', 'true');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    // A card can belong to several categories (space-separated)
                    const categories = card.getAttribute('data-category').split(' ');
                    card.style.display = (filterValue === 'all' || categories.includes(filterValue)) ? '' : 'none';
                });
            });
        });

        // ===================================================================
        // Project Case Studies — Full-Screen View (#case/<slug>)
        // ===================================================================
        const caseView = document.getElementById('case-study-view');
        const caseContent = document.getElementById('case-study-content');
        const caseBarTitle = document.getElementById('case-bar-title');
        const lightbox = document.getElementById('case-lightbox');
        const lightboxImg = document.getElementById('case-lightbox-img');
        const lightboxCaption = document.getElementById('case-lightbox-caption');

        const accentStyles = {
            purple: { text: 'text-brand-purple-light', soft: 'bg-brand-purple/15 text-brand-purple-light border-brand-purple/30' },
            blue: { text: 'text-brand-blue', soft: 'bg-brand-blue/15 text-brand-blue border-brand-blue/30' },
            emerald: { text: 'text-emerald-400', soft: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
        };

        let caseOpenedInSession = false;   // true when the view was opened by in-page navigation
        let caseReturnFocus = null;
        let caseSavedScroll = 0;
        let currentScreenshots = [];

        const esc = (value) => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
        const hasItems = (list) => Array.isArray(list) && list.length > 0;
        const hasSection = (section) => section && (section.intro || hasItems(section.points));

        function caseLinkButtons(links, primaryFirst) {
            const buttons = [];
            if (links.live) {
                buttons.push(`<a href="${esc(links.live)}" target="_blank" rel="noopener noreferrer" class="${primaryFirst ? 'gradient-accent text-white hover:shadow-glow-purple' : 'border border-white/10 text-white hover:bg-white/10'} px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"><i data-lucide="external-link" class="w-4 h-4"></i><span>Live Website</span></a>`);
            }
            if (links.github) {
                buttons.push(`<a href="${esc(links.github)}" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/10 text-sm font-semibold transition-all flex items-center gap-2"><i class="fa-brands fa-github"></i><span>GitHub Repository</span></a>`);
            }
            if (links.figma) {
                buttons.push(`<a href="${esc(links.figma)}" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/10 text-sm font-semibold transition-all flex items-center gap-2"><i class="fa-brands fa-figma text-brand-purple-light"></i><span>Figma Design</span></a>`);
            }
            return buttons.join('');
        }

        function caseSection(id, icon, title, body, accent) {
            return `
                <section id="cs-${id}" data-toc="${esc(title)}" class="scroll-mt-24">
                    <h3 class="flex items-center gap-3 text-xl sm:text-2xl font-bold text-white tracking-tight mb-5">
                        <span class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 ${accent.text}"><i data-lucide="${icon}" class="w-4 h-4"></i></span>
                        <span>${esc(title)}</span>
                    </h3>
                    ${body}
                </section>`;
        }

        function contributionBody(section, accent) {
            return `
                ${section.intro ? `<p class="text-brand-muted leading-relaxed max-w-3xl">${esc(section.intro)}</p>` : ''}
                ${hasItems(section.points) ? `
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 ${section.intro ? 'mt-5' : ''}">
                    ${section.points.map(point => `
                    <li class="flex gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-sm text-zinc-200 leading-relaxed">
                        <i data-lucide="check" class="w-4 h-4 mt-0.5 shrink-0 ${accent.text}"></i><span>${esc(point)}</span>
                    </li>`).join('')}
                </ul>` : ''}`;
        }

        function renderCaseStudy(slug) {
            const data = projectsData[slug];
            const accent = accentStyles[data.accent] || accentStyles.purple;
            const sections = [];

            // Overview
            if (data.overview) {
                sections.push(caseSection('overview', 'file-text', 'Project Overview',
                    `<p class="text-brand-muted leading-relaxed max-w-3xl">${esc(data.overview)}</p>`, accent));
            }

            // Problem / Goal
            if (data.problem || data.goal) {
                sections.push(caseSection('problem', 'target', 'Problem & Goal', `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${data.problem ? `<div class="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/5"><h4 class="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">The Problem</h4><p class="text-sm text-zinc-200 leading-relaxed">${esc(data.problem)}</p></div>` : ''}
                        ${data.goal ? `<div class="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/5"><h4 class="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">The Goal</h4><p class="text-sm text-zinc-200 leading-relaxed">${esc(data.goal)}</p></div>` : ''}
                    </div>`, accent));
            }

            // Contribution areas (only rendered when they have content)
            if (hasSection(data.uxui)) sections.push(caseSection('uxui', 'pen-tool', 'UI/UX Design', contributionBody(data.uxui, accent), accent));
            if (hasSection(data.analysis)) sections.push(caseSection('analysis', 'git-branch', 'System Analysis', contributionBody(data.analysis, accent), accent));
            if (hasSection(data.frontend)) sections.push(caseSection('frontend', 'code', 'Front-End Development', contributionBody(data.frontend, accent), accent));
            if (hasSection(data.backend)) sections.push(caseSection('backend', 'server', 'Back-End Development', contributionBody(data.backend, accent), accent));

            // Process / journey
            if (hasItems(data.process)) {
                sections.push(caseSection('process', 'route', data.processLabel || 'Process', `
                    <ol class="flex flex-wrap items-center gap-2">
                        ${data.process.map((step, i) => `
                        <li class="flex items-center gap-2">
                            <span class="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-zinc-200"><span class="${accent.text} font-semibold mr-1.5">${i + 1}</span>${esc(step)}</span>
                            ${i < data.process.length - 1 ? '<i data-lucide="chevron-right" class="w-4 h-4 text-brand-muted"></i>' : ''}
                        </li>`).join('')}
                    </ol>`, accent));
            }

            // Key features
            if (hasItems(data.features)) {
                sections.push(caseSection('features', 'sparkles', 'Key Features', `
                    <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        ${data.features.map(feature => `
                        <li class="p-4 sm:p-5 rounded-2xl glass-card border border-white/5 flex items-start gap-3">
                            <span class="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${accent.soft}"><i data-lucide="check" class="w-4 h-4"></i></span>
                            <span class="text-sm font-semibold text-white leading-snug">${esc(feature)}</span>
                        </li>`).join('')}
                    </ul>`, accent));
            }

            // Challenges & solutions
            if (hasItems(data.challenges)) {
                sections.push(caseSection('challenges', 'puzzle', 'Challenges & Solutions', `
                    <div class="space-y-4">
                        ${data.challenges.map(item => `
                        <div class="grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-white/5 overflow-hidden">
                            <div class="p-5 sm:p-6 bg-white/[0.03]"><h4 class="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">Challenge</h4><p class="text-sm text-zinc-200 leading-relaxed">${esc(item.challenge)}</p></div>
                            <div class="p-5 sm:p-6 bg-white/[0.06] border-t md:border-t-0 md:border-l border-white/5"><h4 class="text-xs font-bold uppercase tracking-wider ${accent.text} mb-2">Solution</h4><p class="text-sm text-zinc-200 leading-relaxed">${esc(item.solution)}</p></div>
                        </div>`).join('')}
                    </div>`, accent));
            }

            // Technologies (grouped)
            const techGroups = [['Design', data.tech.design], ['Front-End', data.tech.frontend], ['Back-End', data.tech.backend], ['Tools', data.tech.tools]].filter(([, list]) => hasItems(list));
            if (techGroups.length) {
                sections.push(caseSection('tech', 'layers', 'Technologies', `
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        ${techGroups.map(([label, list]) => `
                        <div class="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">${label}</h4>
                            <ul class="flex flex-wrap gap-2">${list.map(t => `<li class="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-zinc-200 border border-white/10">${esc(t)}</li>`).join('')}</ul>
                        </div>`).join('')}
                    </div>`, accent));
            }

            // Screenshots
            currentScreenshots = data.screenshots || [];
            if (hasItems(currentScreenshots)) {
                sections.push(caseSection('screenshots', 'image', 'Screenshots', `
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        ${currentScreenshots.map((shot, i) => `
                        <figure>
                            <button type="button" data-shot="${i}" class="group block w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-brand-surface">
                                <img src="${esc(shot.src)}" alt="${esc(shot.alt || data.title + ' screenshot')}" loading="lazy" class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300">
                            </button>
                            ${shot.caption ? `<figcaption class="text-xs text-brand-muted mt-2">${esc(shot.caption)}</figcaption>` : ''}
                        </figure>`).join('')}
                    </div>`, accent));
            }

            // Meta facts (only those that exist)
            const metaItems = [['My Role', data.meta.role], ['Project Type', data.type], ['Timeline', data.meta.timeline], ['Team', data.meta.team], ['Result', data.meta.result]].filter(([, value]) => value);

            // Previous / next project
            const index = projectOrder.indexOf(slug);
            const prevSlug = projectOrder[(index - 1 + projectOrder.length) % projectOrder.length];
            const nextSlug = projectOrder[(index + 1) % projectOrder.length];
            const links = caseLinkButtons(data.links, true);

            caseContent.innerHTML = `
                <header class="max-w-4xl">
                    <p class="text-xs font-bold tracking-widest uppercase ${accent.text}">${esc(data.type)}</p>
                    <h2 id="case-title" class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">${esc(data.title)}</h2>
                    <p class="text-base sm:text-lg text-brand-muted leading-relaxed mt-4">${esc(data.summary)}</p>
                    <ul class="flex flex-wrap gap-2 mt-5" aria-label="Contribution areas">
                        ${data.tags.map(tag => `<li class="px-3 py-1 rounded-full text-xs font-semibold border ${accent.soft}">${esc(tag)}</li>`).join('')}
                    </ul>
                    ${links ? `<div class="flex flex-wrap gap-3 mt-7">${links}</div>` : ''}
                </header>

                <dl class="grid grid-cols-1 sm:grid-cols-2 ${metaItems.length > 2 ? 'lg:grid-cols-4' : ''} gap-3 mt-10">
                    ${metaItems.map(([label, value]) => `
                    <div class="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                        <dt class="text-[11px] font-bold uppercase tracking-wider text-brand-muted">${label}</dt>
                        <dd class="text-sm font-semibold text-white mt-1.5 leading-snug">${esc(value)}</dd>
                    </div>`).join('')}
                </dl>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12 lg:mt-16">
                    <nav class="hidden lg:block lg:col-span-3" aria-label="Case study sections">
                        <div class="sticky top-24">
                            <p class="text-[11px] font-bold uppercase tracking-wider text-brand-muted mb-3">On this page</p>
                            <ul id="case-toc" class="space-y-1 border-l border-white/10"></ul>
                        </div>
                    </nav>
                    <div class="lg:col-span-9 space-y-14 sm:space-y-16">
                        ${sections.join('')}
                    </div>
                </div>

                <footer class="mt-16 pt-8 border-t border-white/10 flex flex-col gap-8">
                    ${links ? `<div class="flex flex-wrap items-center gap-3"><span class="text-sm text-brand-muted mr-2">Explore the project:</span>${caseLinkButtons(data.links, false)}</div>` : ''}
                    <div class="grid grid-cols-2 gap-3">
                        <a href="#case/${prevSlug}" data-case-nav class="group p-4 sm:p-5 rounded-2xl border border-white/10 hover:border-brand-purple-light/40 hover:bg-white/5 transition-all">
                            <span class="flex items-center gap-1.5 text-xs text-brand-muted"><i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>Previous</span>
                            <span class="block text-sm sm:text-base font-bold text-white mt-1 truncate">${esc(projectsData[prevSlug].title)}</span>
                        </a>
                        <a href="#case/${nextSlug}" data-case-nav class="group p-4 sm:p-5 rounded-2xl border border-white/10 hover:border-brand-purple-light/40 hover:bg-white/5 transition-all text-right">
                            <span class="flex items-center justify-end gap-1.5 text-xs text-brand-muted">Next<i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
                            <span class="block text-sm sm:text-base font-bold text-white mt-1 truncate">${esc(projectsData[nextSlug].title)}</span>
                        </a>
                    </div>
                </footer>`;

            // Build the "On this page" list from the rendered sections
            const toc = document.getElementById('case-toc');
            toc.innerHTML = [...caseContent.querySelectorAll('section[data-toc]')].map(section =>
                `<li><button type="button" data-toc-target="${section.id}" class="block w-full text-left -ml-px pl-4 py-1.5 border-l border-transparent text-sm text-brand-muted hover:text-white hover:border-brand-purple-light transition-colors">${esc(section.dataset.toc)}</button></li>`
            ).join('');

            caseBarTitle.textContent = data.title;
            lucide.createIcons();
        }

        function showCaseStudy(slug) {
            if (caseView.classList.contains('hidden')) {
                caseSavedScroll = window.scrollY;
                caseReturnFocus = document.activeElement;
            }
            renderCaseStudy(slug);
            caseView.classList.remove('hidden');
            caseView.scrollTop = 0;
            document.body.classList.add('modal-active');
            // Keep keyboard and screen-reader focus inside the case study
            [...document.body.children].forEach(el => {
                if (el !== caseView && el !== lightbox && el.tagName !== 'SCRIPT') el.inert = true;
            });
            caseView.focus();
        }

        function hideCaseStudy() {
            if (caseView.classList.contains('hidden')) return;
            closeLightbox();
            caseView.classList.add('hidden');
            document.body.classList.remove('modal-active');
            [...document.body.children].forEach(el => { el.inert = false; });
            window.scrollTo({ top: caseSavedScroll, behavior: 'instant' });
            if (caseReturnFocus && document.contains(caseReturnFocus)) caseReturnFocus.focus({ preventScroll: true });
        }

        // Close: step back in history when the view was opened in this session,
        // otherwise (direct link) just drop the #case/... hash.
        function closeCaseStudy() {
            if (caseOpenedInSession) {
                history.back();
            } else {
                history.replaceState(null, '', location.pathname + location.search + '#projects');
                hideCaseStudy();
                document.getElementById('projects').scrollIntoView({ behavior: 'instant' });
            }
        }

        function routeFromHash(isInitialLoad) {
            const match = location.hash.match(/^#case\/([\w-]+)$/);
            if (match && projectsData[match[1]]) {
                // Only a view opened by an in-page click can be closed with history.back()
                if (caseView.classList.contains('hidden')) caseOpenedInSession = !isInitialLoad;
                showCaseStudy(match[1]);
            } else {
                hideCaseStudy();
                caseOpenedInSession = false;
            }
        }

        // Lightbox for screenshots
        function openLightbox(index) {
            const shot = currentScreenshots[index];
            if (!shot) return;
            lightboxImg.src = shot.src;
            lightboxImg.alt = shot.alt || '';
            lightboxCaption.textContent = shot.caption || '';
            lightbox.classList.remove('hidden');
            lightbox.querySelector('[data-lightbox-close]').focus();
        }

        function closeLightbox() {
            if (lightbox.classList.contains('hidden')) return;
            lightbox.classList.add('hidden');
            lightboxImg.removeAttribute('src');
        }

        window.addEventListener('hashchange', () => routeFromHash(false));

        caseView.addEventListener('click', (e) => {
            if (e.target.closest('[data-case-close]')) closeCaseStudy();

            // Previous / next replace the current history entry, so one "close" always returns to the grid
            const navLink = e.target.closest('[data-case-nav]');
            if (navLink) {
                e.preventDefault();
                location.replace(navLink.getAttribute('href'));
            }

            const tocButton = e.target.closest('[data-toc-target]');
            if (tocButton) document.getElementById(tocButton.dataset.tocTarget).scrollIntoView({ behavior: 'smooth' });

            const shotButton = e.target.closest('[data-shot]');
            if (shotButton) openLightbox(Number(shotButton.dataset.shot));
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.closest('[data-lightbox-close]')) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            if (!lightbox.classList.contains('hidden')) closeLightbox();
            else if (!caseView.classList.contains('hidden')) closeCaseStudy();
        });

        // Open a case study directly when the page is loaded with #case/<slug>
        routeFromHash(true);

        // Contact Form Handler Simulation
        const contactForm = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');

        // The contact form is not currently on the page; only wire it up if it exists
        if (contactForm && formStatus) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();

                formStatus.textContent = "Thank you for reaching out! Your message has been sent successfully.";
                formStatus.className = "text-xs text-center p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 block";

                contactForm.reset();

                setTimeout(() => {
                    formStatus.className = "hidden";
                }, 5000);
            });
        }