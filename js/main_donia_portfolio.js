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

        // Interactive 3D Tilt Effect on Portrait Frame
        const portraitCard = document.getElementById('portrait-card');
        
        if (portraitCard && window.innerWidth > 768) {
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

        // Project Case Study Data Store
        const projectsData = {
            1: {
                title: "TASHKHES—A medical system for patient diagnosis.",
                categoryBadge: "UX/UI & System Analysis",
                badgeClass: "bg-brand-purple/20 text-brand-purple-light border-brand-purple/30",
                overview: "TASHKHES is an intelligent web-based system that guides patients toward the appropriate medical specialty based on their reported symptoms. The platform connects patients with relevant hospitals and doctors while supporting appointment requests and doctor-patient communication through a structured digital experience.",
                problem: "Patients lack a clear and accessible way to identify the appropriate medical specialty based on their symptoms, making the healthcare journey more confusing and time-consuming.",
                goal: "To simplify the patient journey by transforming a complex healthcare decision into a clear, intuitive, and guided digital experience.",
                role: "Role = Design a clear, guided, and user-centered healthcare experience that helps patients move from symptoms to the appropriate medical specialty.",
                requirements: [
                    "UProvide a simple and intuitive interface for patients.",
                    "Allow users to enter and select their symptoms easily.",
                    "Present the recommended medical specialty clearly and understandably.",
                    "Guide users through hospitals, doctors, and appointment booking with a clear user flow.",
                    "Organize medical information using clear hierarchy and accessible layouts.",
                    "Provide clear feedback and error messages throughout the user journey.",
                    "Design responsive interfaces that work across different screen sizes.",
                    "Maintain a professional, trustworthy, and accessible healthcare experience.",
                    "Ensure that the interface clearly communicates that the system provides guidance and does not replace professional medical diagnosis."
                ],
                flow: "Requirement Analysis -> Persona Creation -> Information Architecture -> Wireframing -> High-Fidelity UI -> Clickable Prototype",
                tech: ["System Analysis", "Figma", "User Flow Diagrams", "Wireframing", "Canva"],
                keyFeatures: [
                    "Symptom-Based Specialty Recommendation",
                    "Hospital & Doctor Discovery",
                    "Simple Appointment Booking",
                    "Clear & Guided User Experience"
                ],
                challenges: "Simplifying a complex healthcare journey into a clear, intuitive, and trustworthy user experience.",
                solution: "“Designing a clear and guided digital experience that helps patients move from symptoms to the right medical specialty, hospital, and doctor.”",
                liveLink:"https://www.figma.com/design/ObAdubQS5HnpnFSvVzlUeH/%D9%85%D8%B4%D8%B1%D9%88%D8%B9-%D8%AA%D8%AE%D8%B1%D8%AC-2-%D9%88%D8%A7%D8%AC%D9%87%D8%A7%D8%AA-%D8%A7%D9%85%D8%A7%D9%85%D9%8A%D8%A9?node-id=0-1&t=kNr6JQ9D75FjidRU-1"
            },
            2: {
                title: "TASHKHES",
                categoryBadge: "Full Stack",
                badgeClass: "bg-brand-blue/20 text-brand-blue border-brand-blue/30",
                overview: "TASHKHES is a full-stack web application that helps patients identify the appropriate medical specialty based on their reported symptoms. The system integrates a responsive frontend with a Node.js and Express.js backend, MongoDB database, authentication, and RESTful APIs to manage patients, hospitals, doctors, specialties, and appointments.",
                problem: "Patients often face difficulties identifying the appropriate medical specialty and finding the right doctor, while healthcare information and appointment processes can be fragmented and difficult to navigate. The challenge was to build an integrated system that connects symptoms, specialties, hospitals, doctors, and appointments through a single structured platform.",
                goal: "To develop a reliable full-stack healthcare platform that connects patients with the appropriate medical specialty, hospitals, doctors, and appointment services through an integrated and secure system.",
                role: "Full-Stack Developer (Front-End UI, Node.js API, DB MONGO_DB)",
                requirements: [
                    "User Authentication & Role Management",
                    "Symptom & Specialty Management",
                    "Hospital & Doctor Management",
                    "Appointment Booking & Management",
                    "RESTful API Integration",
                    "Database Management & Data Security"
                ],
                flow: "System Architecture -> DB Schema Design -> REST API Development -> React Component Building -> Integration",
                tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Tailwind CSS"],
                keyFeatures: [
                    "Symptom-Based Specialty Recommendation",
                    "Hospital & Doctor Management",
                    "Appointment Booking & Approval",
                    "Real-Time Patient–Doctor Communication"
                ],
                challenges: "Building a secure and reliable system while integrating multiple user roles, symptom-based recommendations, database relationships, and appointment workflows into one seamless platform.",
                solution: "Developing an integrated full-stack platform that connects symptom analysis, specialty recommendations, hospitals, doctors, appointments, and patient–doctor communication through secure APIs and a structured database.",
                liveLink: "https://tashkhes.onrender.com/",
                githubLink: "https://github.com/mahmoud1amer2/TASHKHES"
            },
            3: {
                title: "Nova — Analytics Dashboard UI",
                categoryBadge: "Front-End",
                badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                overview: "A sleek, responsive financial and metrics web dashboard built with modern front-end technologies focusing on speed and micro-interactions.",
                problem: "Data visualizers often lag on mobile viewports and overload users with poorly structured navigation.",
                goal: "Build a fluid, component-driven front-end dashboard that renders seamlessly across all screen sizes.",
                role: "Front-End Engineer",
                requirements: [
                    "100% Mobile Responsive Layout",
                    "Interactive chart UI components and filters",
                    "Dark mode optimized layout",
                    "Clean JavaScript state management"
                ],
                flow: "UI Design Review -> DOM Component Architecture -> State Setup -> Responsiveness Polish",
                tech: ["JavaScript (ES6+)", "React.js", "Tailwind CSS", "Lucide Icons"],
                keyFeatures: [
                    "Dynamic search and filtering across metrics",
                    "Custom chart visualizer UI elements",
                    "Smooth theme toggling and transitions",
                    "Zero external heavy layout libraries"
                ],
                challenges: "Preventing layout shifts on small mobile viewports during data load.",
                solution: "Utilized CSS Grid with minimum fractional constraints and custom skeleton placeholders.",
                liveLink: "https://example.com",
                githubLink: "https://github.com"
            },

            4: {
                title: "Palestine of Arabism Center – An Educational Platform",
                categoryBadge: "UX UI",
                badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                overview: "Palestine Al-Orouba Educational Center is a user-centered e-learning platform designed to provide students with a clear and intuitive way to discover courses based on their educational track, grade, and subject.",
                problem: "Students may struggle to navigate and find relevant courses when educational content is not organized clearly by track, grade, and subject, creating a confusing and time-consuming learning journey.",
                goal: "To create a clear, intuitive, and user-centered learning experience that helps students easily discover and access the right courses based on their academic needs.",
                role: "Designed the user experience and interface, focusing on intuitive navigation, clear course organization, and a seamless learning journey for students.",
                requirements: [
                    "Clear & Intuitive Navigation",
                    "Track, Grade & Subject Organization",
                    "Easy Course Discovery & Access",
                    "Responsive & Accessible Interface",
                    "Consistent Visual Design System",
                    "Clear User Feedback & Error States"
                ],
                flow: "Explore → Select Track → Select Grade → Choose Subject → Browse Courses → View Course Details → Subscribe → Learn",
                tech: ["Figma", "FigJam", "Miro", "Adobe Photoshop"],
                keyFeatures: [
                    "Intuitive Course Navigation",
                    "Track & Grade-Based Organization",
                    "Clear Subject & Course Discovery",
                    "Responsive & User-Centered Design"
                ],
                challenges: "Preventing layout shifts on small mobile viewports during data load.",
                solution: "Utilized CSS Grid with minimum fractional constraints and custom skeleton placeholders.",
                liveLink: "https://example.com",
                githubLink: "https://github.com"
            },

            5: {
                title: "Market Makers – Digital Trading Platform",
                categoryBadge: "Front-End",
                badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                overview: "Market Makers is a full-stack e-learning platform developed for a trading education company. The platform enables users to create accounts, subscribe to courses, submit payment proof, and access educational content after admin approval, with a backend system managing authentication, payments, and course access.",
                problem: "The company needed a secure and structured platform to manage course subscriptions, payment verification, and controlled access to educational content.",
                goal: "To build a secure and seamless platform that simplifies course subscriptions, payment verification, and controlled access to educational content.",
                role: "Designed and developed the platform’s frontend and backend, implementing authentication, course access control, payment verification, and database integration.",
                requirements: [
                    "User Authentication & Account Management",
                    "Course Subscription & Access Control",
                    "Payment Proof Submission & Verification",
                    "Admin Approval & Course Management",
                    "Secure Backend & Database Integration"
                ],
                flow: "Authentication Setup → Course Access Control → Payment Integration → Admin Approval → Content Delivery",
                tech: ["HTML", "CSS", "JavaScript", "Node.js", "Express.js", "Supabase", "Multer", "REST API"],
                keyFeatures: [
                    "User Authentication & Account Management",
                    "Course Subscription & Access Control",
                    "Payment Proof Submission & Admin Approval",
                    "Secure Course Content Delivery"
                ],
                challenges: "Managing secure authentication, payment verification, and role-based course access while ensuring a seamless user experience.",
                solution: "Developed an integrated full-stack platform with secure authentication, payment verification, admin approval, and controlled course access.",
                githubLink: "https://github.com/doniaalnasan/market_makers"
            },

            6: {
                title: "Nova — Analytics Dashboard UI",
                categoryBadge: "Front-End",
                badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                overview: "A sleek, responsive financial and metrics web dashboard built with modern front-end technologies focusing on speed and micro-interactions.",
                problem: "Data visualizers often lag on mobile viewports and overload users with poorly structured navigation.",
                goal: "Build a fluid, component-driven front-end dashboard that renders seamlessly across all screen sizes.",
                role: "Front-End Engineer",
                requirements: [
                    "100% Mobile Responsive Layout",
                    "Interactive chart UI components and filters",
                    "Dark mode optimized layout",
                    "Clean JavaScript state management"
                ],
                flow: "UI Design Review -> DOM Component Architecture -> State Setup -> Responsiveness Polish",
                tech: ["JavaScript (ES6+)", "React.js", "Tailwind CSS", "Lucide Icons"],
                keyFeatures: [
                    "Dynamic search and filtering across metrics",
                    "Custom chart visualizer UI elements",
                    "Smooth theme toggling and transitions",
                    "Zero external heavy layout libraries"
                ],
                challenges: "Preventing layout shifts on small mobile viewports during data load.",
                solution: "Utilized CSS Grid with minimum fractional constraints and custom skeleton placeholders.",
                liveLink: "https://example.com",
                githubLink: "https://github.com/doniaalnasan/lilia"
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
                });
                
                btn.classList.add('active', 'bg-brand-purple', 'text-white', 'shadow-glow-purple');
                btn.classList.remove('text-brand-muted');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Case Study Modal Management
        const modal = document.getElementById('case-study-modal');
        const modalContent = document.getElementById('modal-content');
        const modalTitle = document.getElementById('modal-title');
        const modalCategoryBadge = document.getElementById('modal-category-badge');
        const modalLinksContainer = document.getElementById('modal-links-container');

        function openModal(id) {
            const data = projectsData[id];
            if (!data) return;

            modalTitle.textContent = data.title;
            modalCategoryBadge.textContent = data.categoryBadge;
            modalCategoryBadge.className = `px-3 py-1 rounded-full text-xs font-semibold border ${data.badgeClass}`;

            modalContent.innerHTML = `
                <div class="space-y-6">
                    <div>
                        <h4 class="text-xs font-bold uppercase tracking-wider text-brand-purple-light mb-1">Project Overview</h4>
                        <p class="text-sm text-brand-text leading-relaxed">${data.overview}</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="glass-card p-4 rounded-2xl border border-white/5">
                            <h5 class="text-xs font-bold text-white mb-1">The Problem</h5>
                            <p class="text-xs text-brand-muted">${data.problem}</p>
                        </div>
                        <div class="glass-card p-4 rounded-2xl border border-white/5">
                            <h5 class="text-xs font-bold text-white mb-1">The Goal</h5>
                            <p class="text-xs text-brand-muted">${data.goal}</p>
                        </div>
                    </div>

                    <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <span class="text-xs font-bold text-white block mb-1">My Personal Role & Contribution</span>
                        <p class="text-xs text-brand-purple-light font-medium">${data.role}</p>
                    </div>

                    <div>
                        <h4 class="text-xs font-bold uppercase tracking-wider text-brand-purple-light mb-2">Key Features</h4>
                        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-muted">
                            ${data.keyFeatures.map(f => `<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-brand-purple-light"></span>${f}</li>`).join('')}
                        </ul>
                    </div>

                    <div>
                        <h4 class="text-xs font-bold uppercase tracking-wider text-brand-purple-light mb-2">Technologies & Tools</h4>
                        <div class="flex flex-wrap gap-2">
                            ${data.tech.map(t => `<span class="px-3 py-1 rounded-lg text-xs bg-white/5 text-white border border-white/10">${t}</span>`).join('')}
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                            <h5 class="text-xs font-bold text-white mb-1">Challenge</h5>
                            <p class="text-xs text-brand-muted">${data.challenges}</p>
                        </div>
                        <div>
                            <h5 class="text-xs font-bold text-white mb-1">Solution</h5>
                            <p class="text-xs text-brand-muted">${data.solution}</p>
                        </div>
                    </div>
                </div>
            `;

            // Render Links dynamically
            let linksHTML = '';
            if (data.liveLink) {
                linksHTML += `<a href="${data.liveLink}" target="_blank" rel="noopener" class="px-4 py-2 rounded-xl gradient-accent text-white text-xs font-semibold flex items-center gap-1.5"><span>Live Demo</span><i data-lucide="external-link" class="w-3.5 h-3.5"></i></a>`;
            }
            if (data.githubLink) {
                linksHTML += `<a href="${data.githubLink}" target="_blank" rel="noopener" class="px-4 py-2 rounded-xl glass-card text-white text-xs font-semibold hover:bg-white/10 flex items-center gap-1.5 border border-white/10"><span>GitHub Repository</span><i data-lucide="github" class="w-3.5 h-3.5"></i></a>`;
            }
            modalLinksContainer.innerHTML = linksHTML;

            lucide.createIcons();
            modal.classList.remove('hidden');
            document.body.classList.add('modal-active');
        }

        function closeModal() {
            modal.classList.add('hidden');
            document.body.classList.remove('modal-active');
        }

        // Close Modal on clicking background overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Contact Form Handler Simulation
        const contactForm = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            formStatus.textContent = "Thank you for reaching out! Your message has been sent successfully.";
            formStatus.className = "text-xs text-center p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 block";
            
            contactForm.reset();

            setTimeout(() => {
                formStatus.className = "hidden";
            }, 5000);
        });