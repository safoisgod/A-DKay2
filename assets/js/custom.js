document.addEventListener('DOMContentLoaded', function () {
    // Debug: Log when script starts
    console.log('Main script loaded');

    // === Header Functionality ===
    const header = document.querySelector('.header-space');
    const hamburgerCheckbox = document.querySelector('#hamburger-checkbox');
    const menuSpace = document.querySelector('.menu-space');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const navLinks = document.querySelectorAll('.menu-space a');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Hamburger Menu Toggle
    if (hamburgerCheckbox && menuSpace && hamburgerIcon) {
        hamburgerCheckbox.addEventListener('change', () => {
            console.log('Hamburger toggled:', hamburgerCheckbox.checked);
            menuSpace.classList.toggle('active', hamburgerCheckbox.checked);
            // Update aria-expanded for accessibility
            hamburgerIcon.setAttribute('aria-expanded', hamburgerCheckbox.checked);
            // Close dropdowns when menu toggles
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when a link is clicked (on mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 1200) {
                    // Only close the menu if the link is not a dropdown toggle
                    if (!link.classList.contains('dropdown-toggle')) {
                        console.log('Mobile link clicked:', link.getAttribute('href'));
                        hamburgerCheckbox.checked = false;
                        menuSpace.classList.remove('active');
                        hamburgerIcon.setAttribute('aria-expanded', 'false');
                        // Close dropdowns
                        dropdowns.forEach(dropdown => {
                            dropdown.classList.remove('active');
                            const toggle = dropdown.querySelector('.dropdown-toggle');
                            toggle.setAttribute('aria-expanded', 'false');
                        });
                    }
                }
            });
        });

        // Dropdown toggle for both desktop and mobile
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            toggle.addEventListener('click', (e) => {
                console.log('Dropdown toggle clicked:', toggle.getAttribute('href'));
                // Prevent default only on mobile or if we want to toggle the dropdown
                if (window.innerWidth <= 1200) {
                    e.preventDefault();
                }
                const isActive = dropdown.classList.contains('active');
                // Close other dropdowns
                dropdowns.forEach(d => {
                    d.classList.remove('active');
                    d.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
                });
                // Toggle current dropdown
                dropdown.classList.toggle('active', !isActive);
                toggle.setAttribute('aria-expanded', !isActive);
            });
        });

        // Reset menu state on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1200) {
                console.log('Window resized to desktop');
                hamburgerCheckbox.checked = false;
                menuSpace.classList.remove('active');
                hamburgerIcon.setAttribute('aria-expanded', 'false');
                // Close dropdowns
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                    const toggle = dropdown.querySelector('.dropdown-toggle');
                    toggle.setAttribute('aria-expanded', 'false');
                });
            }
        });

        // Accessibility: Allow keyboard toggle for hamburger
        hamburgerIcon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hamburgerCheckbox.checked = !hamburgerCheckbox.checked;
                menuSpace.classList.toggle('active', hamburgerCheckbox.checked);
                hamburgerIcon.setAttribute('aria-expanded', hamburgerCheckbox.checked);
                console.log('Hamburger toggled via keyboard');
            }
        });

        // Accessibility: Allow keyboard toggle for dropdown
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    console.log('Dropdown toggle keydown:', e.key);
                    e.preventDefault();
                    const isActive = dropdown.classList.contains('active');
                    dropdowns.forEach(d => {
                        d.classList.remove('active');
                        d.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
                    });
                    dropdown.classList.toggle('active', !isActive);
                    toggle.setAttribute('aria-expanded', !isActive);
                }
            });
        });
    } else {
        console.error('Header: Hamburger checkbox, menu-space, or hamburger-icon elements are missing.');
    }

    // Fixed Header and Scroll Behavior
    if (header) {
        // Initial check for fixed position
        const updateHeaderPosition = () => {
            if (window.scrollY === 0) {
                header.classList.add('fixed');
            }
        };
        updateHeaderPosition();

        // Scroll behavior
        window.addEventListener('scroll', () => {
            if (window.scrollY > 0) {
                header.classList.add('scrolled');
                header.classList.add('fixed');
            } else {
                header.classList.remove('scrolled');
                updateHeaderPosition();
            }
        });
    } else {
        console.error('Header: .header-space element is missing.');
    }

    // === Hero Section Carousel ===
    $('.owl-carousel:not(#pubco_books_carousel):not(#platforms_carousel)').owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        items: 1,
        navText: [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>'
        ]
    });

    // === Featured Books Carousel ===
    const pubcoBooksCarousel = $("#pubco_books_carousel");
    if (pubcoBooksCarousel.length) {
        pubcoBooksCarousel.owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            dots: false,
            items: 3,
            center: false,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
                0: { items: 1 },
                768: { items: 2 },
                1000: { items: 3 }
            },
            navContainer: '.pubco_carousel_nav .owl-nav',
            onInitialized: function (event) {
                pubcoUpdateDescriptionAndStyles();
                updateNavButtons(event);
            },
            onTranslated: function (event) {
                pubcoUpdateDescriptionAndStyles();
                updateNavButtons(event);
            },
            onDragged: function (event) {
                pubcoUpdateDescriptionAndStyles();
                updateNavButtons(event);
            }
        });

        // Function to update description, blur, size, and button navigation based on the active item
        function pubcoUpdateDescriptionAndStyles() {
            // Fade out the description elements
            $('#pubco_book_title, #pubco_category_text, #pubco_author_text, #pubco_description_text').css('opacity', '0');

            // Reset all items to non-active styles
            $("#pubco_books_carousel .pubco_item img").css({
                'filter': 'blur(2px)',
                'width': window.innerWidth <= 480 ? '140px' : window.innerWidth <= 1000 ? '140px' : '160px',
                'height': window.innerWidth <= 480 ? '210px' : window.innerWidth <= 1000 ? '210px' : '240px'
            });

            // Identify the active item (first visible active item)
            const activeItem = $("#pubco_books_carousel .owl-item.active").first().find('.pubco_item');
            
            // Apply active styles to the first active item
            activeItem.find('img').css({
                'filter': 'blur(0)',
                'width': window.innerWidth <= 480 ? '190px' : window.innerWidth <= 1000 ? '190px' : '210px',
                'height': window.innerWidth <= 480 ? '285px' : window.innerWidth <= 1000 ? '285px' : '315px'
            });

            // Update the category, title, author, description, and button navigation with a fade-in effect
            setTimeout(() => {
                const category = activeItem.data('pubco-category') || 'Category';
                const title = activeItem.data('pubco-title') || 'Title';
                const author = activeItem.find('.pubco_author').text() || 'Author';
                const description = activeItem.data('pubco-description') || 'Description.';
                $('#pubco_category_text').text(category);
                $('#pubco_book_title').text(title);
                $('#pubco_author_text').text(author);
                $('#pubco_description_text').text(description);
                
                // Update the Read More button's onclick event
                const readMoreBtn = document.getElementById('learn-more-btn');
                if (readMoreBtn) {
                    readMoreBtn.onclick = function() {
                        window.location.href = `book-details.html?title=${encodeURIComponent(title)}`;
                    };
                    // Update aria-label for accessibility
                    readMoreBtn.setAttribute('aria-label', `Read more about ${title} by ${author}`);
                }
                
                // Fade in the description elements
                $('#pubco_book_title, #pubco_category_text, #pubco_author_text, #pubco_description_text').css('opacity', '1');
            }, 300); // Delay to sync with fade-out
        }

        // Function to update navigation buttons (show only one at a time)
        function updateNavButtons(event) {
            const owl = event.target;
            const itemCount = event.item.count; // Total number of items
            const itemsPerPage = event.page.size; // Number of items visible at once
            const currentIndex = event.item.index; // Current starting index (adjusted for loop)

            // Since loop is true, Owl Carousel clones items for infinite scrolling
            // We need to normalize the currentIndex to the actual item range (0 to itemCount - 1)
            const normalizedIndex = currentIndex % itemCount;
            const prevButton = document.querySelector('.pubco_carousel_nav .owl-nav .owl-prev');
            const nextButton = document.querySelector('.pubco_carousel_nav .owl-nav .owl-next');

            // Reset button states
            prevButton.classList.remove('disabled');
            nextButton.classList.remove('disabled');

            // Determine which button to show based on position
            if (normalizedIndex === 0) {
                // At the "start" (first item), show only the next button
                prevButton.classList.add('disabled');
            } else if (normalizedIndex === itemCount - itemsPerPage) {
                // At the "end" (last visible set of items), show only the prev button
                nextButton.classList.add('disabled');
            }
        }

        // Update on window resize
        window.addEventListener('resize', pubcoUpdateDescriptionAndStyles);

        // Accessibility: Keyboard navigation for carousel items
        $('.pubco_item').on('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const index = $(this).closest('.owl-item').index();
                pubcoBooksCarousel.trigger('to.owl.carousel', index);
            }
        });
    }

    // === Platforms Carousel ===
    const platformsCarousel = $("#platforms_carousel");
    if (platformsCarousel.length) {
        platformsCarousel.owlCarousel({
            loop: true,
            margin: 20,
            nav: false, // Remove navigation buttons
            dots: false, // Remove dots
            items: 4,
            center: false,
            autoplay: true,
            autoplayTimeout: 4000,
            autoplayHoverPause: true,
            responsive: {
                0: { items: 1 },
                480: { items: 2 },
                768: { items: 3 },
                1000: { items: 4 }
            }
        });

        // Accessibility: Keyboard navigation for platform items
        $('.platform_item').on('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const index = $(this).closest('.owl-item').index();
                platformsCarousel.trigger('to.owl.carousel', index);
            }
        });
    }

    // === Services Section ===
    const servicesSection = document.getElementById('services');
    const servicesHeader = document.querySelector('.services-header');
    const cards = document.querySelectorAll('.service-card');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const navigation = document.querySelector('.navigation');

    if (servicesSection && servicesHeader && cards.length && prevBtn && nextBtn && navigation) {
        let currentServiceIndex = 0;
        let cardsPerPage = 2;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    servicesSection.style.height = '750px';
                    servicesHeader.classList.add('visible');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 200);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(servicesSection);

        function updateCardsPerPage() {
            if (window.innerWidth <= 850) {
                cardsPerPage = 1;
            } else if (window.innerWidth <= 1050) {
                cardsPerPage = 2;
            } else {
                cardsPerPage = cards.length;
            }
        }

        function updateVisibleCards() {
            cards.forEach((card, index) => {
                if (window.innerWidth <= 1050) {
                    const isVisible = index >= currentServiceIndex && index < currentServiceIndex + cardsPerPage;
                    card.classList.toggle('active-card', isVisible);
                } else {
                    card.classList.add('active-card');
                }
            });

            prevBtn.disabled = currentServiceIndex === 0;
            nextBtn.disabled = currentServiceIndex >= cards.length - cardsPerPage;
        }

        function updateNavigationVisibility() {
            navigation.style.display = window.innerWidth <= 1050 ? 'flex' : 'none';
        }

        updateCardsPerPage();
        updateVisibleCards();
        updateNavigationVisibility();

        window.addEventListener('resize', () => {
            updateCardsPerPage();
            if (currentServiceIndex > cards.length - cardsPerPage) {
                currentServiceIndex = Math.max(0, cards.length - cardsPerPage);
            }
            updateVisibleCards();
            updateNavigationVisibility();
        });

        prevBtn.addEventListener('click', () => {
            if (currentServiceIndex > 0) {
                currentServiceIndex -= cardsPerPage;
                updateVisibleCards();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentServiceIndex < cards.length - cardsPerPage) {
                currentServiceIndex += cardsPerPage;
                updateVisibleCards();
            }
        });

        cards.forEach(card => {
            card.addEventListener('click', () => {
                if (window.innerWidth > 1050) {
                    cards.forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                }
            });
        });
    } else {
        console.log('Services section: Not present on this page or required DOM elements are missing.');
    }

    // === FAQ Section ===
    const faqQuestions = document.querySelectorAll('#faq_section .faq_question');
    if (faqQuestions.length) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isOpen = question.getAttribute('aria-expanded') === 'true';

                // Close all other FAQ items in this section
                faqQuestions.forEach(q => {
                    if (q !== question) {
                        q.setAttribute('aria-expanded', 'false');
                        q.nextElementSibling.classList.remove('active');
                    }
                });

                // Toggle the clicked FAQ item
                question.setAttribute('aria-expanded', !isOpen);
                answer.classList.toggle('active');
            });
        });
    }

    // === Active Page Highlighting ===
    let currentPath = window.location.pathname.split('/').pop() || 'index.htm';
    // Normalize path to handle .html or no extension
    if (currentPath.endsWith('.html')) {
        currentPath = currentPath.replace('.html', '.htm');
    }
    // Fallback: Check full pathname for about-us pages
    const aboutUsPages = ['about-us.htm', 'team.htm', 'authors.htm'];
    if (!aboutUsPages.includes(currentPath) && aboutUsPages.some(page => window.location.pathname.includes(page))) {
        currentPath = aboutUsPages.find(page => window.location.pathname.includes(page)) || currentPath;
    }

    const menuLinks = document.querySelectorAll('.menu-space a');

    console.log('Current path (normalized):', currentPath);
    console.log('About Us pages:', aboutUsPages);

    // Reset all active classes
    menuLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Apply active classes
    menuLinks.forEach(link => {
        let href = link.getAttribute('href');
        // Normalize href to handle .html
        if (href && href.endsWith('.html')) {
            href = href.replace('.html', '.htm');
        }
        console.log('Checking link:', href, 'Classes:', link.className);

        // Exact match for non-dropdown links and submenu links
        if (href === currentPath) {
            console.log('Exact match found:', href);
            link.classList.add('active');
        }

        // Handle About Us dropdown toggle
        if (aboutUsPages.includes(currentPath) && link.classList.contains('dropdown-toggle')) {
            console.log('Activating About Us dropdown toggle:', href);
            link.classList.add('active');
        }
    });

    // Debug: Log final state of links
    menuLinks.forEach(link => {
        console.log('Final state:', link.getAttribute('href'), 'Active:', link.classList.contains('active'));
    });

    // === Expandable Timeline Items in Our Story Section ===
    const timelineItems = document.querySelectorAll('#our-story .timeline-item');
    if (timelineItems.length) {
        timelineItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('expanded');
            });
        });
    }

    // === Mission & Vision Toggle ===
    const toggleButtons = document.querySelectorAll('.toggle-button');
    const toggleContents = document.querySelectorAll('.toggle-content');
    if (toggleButtons.length && toggleContents.length) {
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                toggleButtons.forEach(btn => btn.classList.remove('active'));
                toggleContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                const toggleId = button.getAttribute('data-toggle');
                document.getElementById(toggleId).classList.add('active');
            });
        });
    }

    // === Team Section Interactivity ===
    const teamSection = document.getElementById('team');
    if (teamSection) {
        // Team member data
        const teamData = [
            {
                name: "Nana Kwesi Safo",
                role: "CEO",
                image: "assets/images/team/author6.webp",
                bio: "Nana Kwesi Safo took over as CEO in 2023 after his father’s passing, continuing to lead A-D Kay Publications with a focus on global expansion and nurturing new talent.",
                social: [
                    { platform: "linkedin", url: "https://linkedin.com/in/iamnanasafo" },
                    { platform: "twitter", url: "https://twitter.com/iamnanasafo" }
                ]
            },
            {
                name: "Kojo Ampem-Darko",
                role: "Founder",
                image: "assets/images/team/ama_owusu.webp",
                bio: "Kojo Ampem-Darko, an educator and writer from Ghana, founded A-D Kay Publications in 2020 with a passion for combating illiteracy through literature. Inspired by the lack of African voices in global storytelling, he started the company to amplify diverse narratives in politics, tradition, and culture. His first book, <em>Killed by Illiteracy</em>, sold over 2,000 copies, laying the foundation for a publishing house dedicated to empowering African writers and readers. Kojo’s legacy continues to inspire through his 7 published titles and 5 upcoming works.",
                social: [
                    { platform: "linkedin", url: "https://linkedin.com/in/" },
                    { platform: "instagram", url: "https://instagram.com/" }
                ]
            },
            {
                name: "Kofi Adjei",
                role: "Senior Editor",
                image: "assets/images/team/author3.webp",
                bio: "Kofi Adjei brings over 10 years of editing experience, shaping impactful narratives that resonate with readers worldwide.",
                social: [
                    { platform: "linkedin", url: "https://linkedin.com/in/" }
                ]
            },
            {
                name: "Eric Coffie",
                role: "Editor",
                image: "assets/images/team/author3.webp",
                bio: "Eric Coffie is passionate about storytelling, specializing in cultural narratives that highlight African traditions and history.",
                social: [
                    { platform: "linkedin", url: "https://linkedin.com/in/" },
                    { platform: "twitter", url: "https://twitter.com/" }
                ]
            },
            {
                name: "Nana Kweku Safo",
                role: "Lead Designer",
                image: "assets/images/team/author5.webp",
                bio: "Nana Kweku Safo leads the design team, creating visually stunning covers and layouts that bring stories to life.",
                social: [
                    { platform: "linkedin", url: "https://linkedin.com/in/nananazil" },
                    { platform: "instagram", url: "https://instagram.com/nananazil" }
                ]
            },
        ];

        // Filter functionality
        const teamFilterButtons = document.querySelectorAll('#team .filter-btn');
        const teamFilterDropdown = document.querySelector('#team .filter-dropdown');
        const teamCards = document.querySelectorAll('#team .team-card');

        if (teamFilterButtons.length && teamFilterDropdown && teamCards.length) {
            function filterTeam(category) {
                teamCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (category === 'all' || cardCategory === category) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            }

            teamFilterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    teamFilterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    const category = button.getAttribute('data-filter');
                    filterTeam(category);
                    teamFilterDropdown.value = category;
                });
            });

            teamFilterDropdown.addEventListener('change', () => {
                const category = teamFilterDropdown.value;
                filterTeam(category);
                teamFilterButtons.forEach(button => {
                    button.classList.toggle('active', button.getAttribute('data-filter') === category);
                });
            });
        }

        // Modal functionality
        const teamModal = document.getElementById('team-modal');
        if (teamModal) {
            const modalImage = document.getElementById('modal-image');
            const modalName = document.getElementById('modal-name');
            const modalRole = document.getElementById('modal-role');
            const modalBio = document.getElementById('modal-bio');
            const modalSocialLinks = document.getElementById('modal-social-links');
            const teamCloseBtn = teamModal.querySelector('.close-btn');

            if (modalImage && modalName && modalRole && modalBio && modalSocialLinks && teamCloseBtn) {
                teamCards.forEach((card, index) => {
                    card.addEventListener('click', () => {
                        const member = teamData[index];
                        modalImage.src = member.image;
                        modalImage.alt = member.name;
                        modalName.textContent = member.name;
                        modalRole.textContent = member.role;
                        modalBio.innerHTML = member.bio; // Use innerHTML to render <em> tags

                        // Populate social links
                        modalSocialLinks.innerHTML = '';
                        member.social.forEach(link => {
                            const a = document.createElement('a');
                            a.href = link.url;
                            a.target = '_blank';
                            a.rel = 'noopener noreferrer';
                            a.setAttribute('aria-label', `Follow ${member.name} on ${link.platform}`);
                            const icon = document.createElement('i');
                            icon.className = `fab fa-${link.platform}`;
                            a.appendChild(icon);
                            modalSocialLinks.appendChild(a);
                        });

                        teamModal.style.display = 'flex';
                        document.body.style.overflow = 'hidden'; // Prevent scrolling
                    });

                    // Accessibility: Open modal with keyboard
                    card.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            card.click();
                        }
                    });
                });

                teamCloseBtn.addEventListener('click', () => {
                    teamModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                });

                teamModal.addEventListener('click', (e) => {
                    if (e.target === teamModal) {
                        teamModal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
                });

                // Accessibility: Close modal with keyboard
                teamCloseBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        teamCloseBtn.click();
                    }
                });
            }
        }
    }

    // === Authors Section Interactivity ===
    const authorsSection = document.getElementById('authors');
    if (authorsSection) {
        // Author data
        const authorsData = [
            {
                name: "Kojo Ampem-Darko",
                genre: "Non-Fiction Writer",
                image: "assets/images/team/author1.webp",
                bio: "Kojo Ampem-Darko, the founder of A-D Kay Publications, is a renowned non-fiction writer dedicated to African politics and culture. Under his pen name Ampem-Daako Kay, he also explores fiction, weaving narratives of heritage and legacy.",
                social: [
                    { platform: "linkedin", url: "https://linkedin.com/in/kojo-ampem-darko" },
                    { platform: "twitter", url: "https://twitter.com/kojoampem" }
                ],
                books: [
                    { title: "Picture Description & Guided Composition", cover: "assets/images/BOOKS/picture_description_&_guided_composition.webp", link: "book-details.html?title=picture-description-and-guided-composition" },
                ]
            },
            {
                name: "Yaw Asamoah Gyansah",
                genre: "Fiction Writer",
                image: "assets/images/team/author2.webp",
                bio: "Yaw Asamoah Gyansah crafts compelling fictional narratives that explore the complexities of African family dynamics and traditions.",
                social: [
                    { platform: "instagram", url: "https://instagram.com/yawasamoahgyansah" }
                ],
                books: [
                    { title: "Moonlight & Melodies", cover: "assets/images/BOOKS/moonlight_&_melodies.webp", link: "book-details.html?title=moonlight-and-melodies" }
                ]
            },
            {
                name: "Kofi Mensah",
                genre: "Non-Fiction Writer",
                image: "assets/images/team/author3.webp",
                bio: "Kofi Mensah writes thought-provoking non-fiction on African history and socio-political issues, aiming to educate and inspire.",
                social: [
                    { platform: "linkedin", url: "https://linkedin.com/in/kofi-mensah" }
                ],
                books: [
                    { title: "Politics for Sale", cover: "assets/images/BOOKS/politics_for_sale.webp", link: "book-details.html?title=politics-for-sale" }
                ]
            },
            {
                name: "Nana Kwesi Safo",
                genre: "Poet",
                image: "assets/images/team/author6.webp",
                bio: "Nana Kwesi Safo’s poetry reflects on leadership, legacy, and the cultural heritage of Africa with deep emotion.",
                social: [
                    { platform: "twitter", url: "https://twitter.com/iamnanasafo" }
                ],
                books: [
                    { title: "The King's Dilemma", cover: "assets/images/BOOKS/the_kings_dilemma.webp", link: "book-details.html?title=the-kings-dilemma" },
                    { title: "Son of a King", cover: "assets/images/BOOKS/son_of_king.webp", link: "book-details.html?title=son-of-a-king" }
                ]
            },
            {
                name: "Ampem-Daako Kay",
                genre: "Fiction Writer",
                image: "assets/images/about_us/kojo_ampem_darko.webp",
                bio: "Ampem-Daako Kay is the pen name of Kojo Ampem-Darko, used for his fictional works. His stories delve into African heritage, leadership, and cultural narratives, blending tradition with imagination.",
                social: [
                    { platform: "twitter", url: "https://twitter.com/kojoampem" }
                ],
                books: [
                    { title: "Killed by Illiteracy", cover: "assets/images/BOOKS/killed_by_illiteracy.webp", link: "book-details.html?title=killed-by-illiteracy" },
                    { title: "Culture Brewed in an African Pot", cover: "assets/images/BOOKS/culture_brewed_in_an_african_pot.webp", link: "book-details.html?title=culture-brewed-in-an-african-pot" },
                    { title: "Particles of Wisdom", cover: "assets/images/BOOKS/particles_of_wisdom.webp", link: "book-details.html?title=particles-of-wisdom" },
                    { title: "Particles of Wisdom 2", cover: "assets/images/BOOKS/particles_of_wisdom2.webp", link: "book-details.html?title=particles-of-wisdom-2" },
                ]
            }
        ];

        // Filter functionality
        const authorsFilterButtons = document.querySelectorAll('#authors .filter-btn');
        const authorsFilterDropdown = document.querySelector('#authors .filter-dropdown');
        const authorCards = document.querySelectorAll('#authors .author-card');

        if (authorsFilterButtons.length && authorsFilterDropdown && authorCards.length) {
            function filterAuthors(category) {
                authorCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (category === 'all' || cardCategory === category) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            }

            authorsFilterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    authorsFilterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    const category = button.getAttribute('data-filter');
                    filterAuthors(category);
                    authorsFilterDropdown.value = category;
                });
            });

            authorsFilterDropdown.addEventListener('change', () => {
                const category = authorsFilterDropdown.value;
                filterAuthors(category);
                authorsFilterButtons.forEach(button => {
                    button.classList.toggle('active', button.getAttribute('data-filter') === category);
                });
            });
        }

        // Modal functionality
        const authorModal = document.getElementById('author-modal');
        if (authorModal) {
            const modalImage = document.getElementById('modal-image');
            const modalName = document.getElementById('modal-name');
            const modalGenre = document.getElementById('modal-genre');
            const modalBio = document.getElementById('modal-bio');
            const modalSocialLinks = document.getElementById('modal-social-links');
            const modalBooksCarousel = document.getElementById('modal-books-carousel');
            const authorCloseBtn = authorModal.querySelector('.close-btn');

            if (modalImage && modalName && modalGenre && modalBio && modalSocialLinks && modalBooksCarousel && authorCloseBtn) {
                authorCards.forEach((card, index) => {
                    card.addEventListener('click', () => {
                        const author = authorsData[index];
                        modalImage.src = author.image;
                        modalImage.alt = author.name;
                        modalName.textContent = author.name;
                        modalGenre.textContent = author.genre;
                        modalBio.textContent = author.bio;

                        // Populate social links
                        modalSocialLinks.innerHTML = '';
                        author.social.forEach(link => {
                            const a = document.createElement('a');
                            a.href = link.url;
                            a.target = '_blank';
                            a.rel = 'noopener noreferrer';
                            a.setAttribute('aria-label', `Follow ${author.name} on ${link.platform}`);
                            const icon = document.createElement('i');
                            icon.className = `fab fa-${link.platform}`;
                            a.appendChild(icon);
                            modalSocialLinks.appendChild(a);
                        });

                        // Populate books carousel
                        modalBooksCarousel.innerHTML = '';
                        const carousel = document.createElement('div');
                        carousel.className = 'owl-carousel';
                        carousel.style.display = 'none'; // Hide carousel explicitly until initialized
                        author.books.forEach(book => {
                            const bookItem = document.createElement('div');
                            bookItem.className = 'book-item';
                            bookItem.innerHTML = `
                                <img src="${book.cover}" alt="${book.title}">
                                <h4>${book.title}</h4>
                                <a href="${book.link}">Learn More</a>
                            `;
                            carousel.appendChild(bookItem);
                        });
                        modalBooksCarousel.appendChild(carousel);

                        // Initialize Owl Carousel and show modal only after initialization
                        $(carousel).owlCarousel({
                            loop: author.books.length > 1,
                            margin: 10,
                            nav: true,
                            dots: false,
                            items: 3,
                            responsive: {
                                0: { items: 1 },
                                480: { items: 2 },
                                768: { items: 3 }
                            },
                            navText: [
                                '<i class="fas fa-chevron-left"></i>',
                                '<i class="fas fa-chevron-right"></i>'
                            ],
                            onInitialize: function () {
                                // Ensure carousel is hidden during initialization
                                carousel.style.display = 'none';
                            },
                            onInitialized: function () {
                                // Add initialized class to make carousel visible
                                carousel.classList.add('initialized');
                                // Ensure carousel is visible
                                carousel.style.display = 'block';
                                // Show the modal after carousel is ready with a slight delay for rendering
                                setTimeout(() => {
                                    authorModal.style.display = 'flex';
                                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                                }, 50); // Small delay to ensure rendering is complete
                            }
                        });
                    });

                    // Accessibility: Open modal with keyboard
                    card.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            card.click();
                        }
                    });
                });

                authorCloseBtn.addEventListener('click', () => {
                    authorModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    // Destroy carousel to prevent duplicate instances
                    $(modalBooksCarousel).find('.owl-carousel').owlCarousel('destroy');
                });

                authorModal.addEventListener('click', (e) => {
                    if (e.target === authorModal) {
                        authorModal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        $(modalBooksCarousel).find('.owl-carousel').owlCarousel('destroy');
                    }
                });

                // Accessibility: Close modal with keyboard
                authorCloseBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        authorCloseBtn.click();
                    }
                });
            }
        }
    }
});