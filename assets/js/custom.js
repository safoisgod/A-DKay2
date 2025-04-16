document.addEventListener('DOMContentLoaded', function () {
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
                console.log('Dropdown toggle clicked:', toggle); // Debug log
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
            }
        });

        // Accessibility: Allow keyboard toggle for dropdown
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    console.log('Dropdown toggle keydown:', e.key); // Debug log
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
    const pubcoBooksCarousel = $("#pubco_books_carousel").owlCarousel({
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

    // === Platforms Carousel ===
    const platformsCarousel = $("#platforms_carousel").owlCarousel({
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

    // === Services Section ===
    const servicesSection = document.getElementById('services');
    const servicesHeader = document.querySelector('.services-header');
    const cards = document.querySelectorAll('.service-card');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const navigation = document.querySelector('.navigation');

    if (!servicesSection || !servicesHeader || !cards.length || !prevBtn || !nextBtn || !navigation) {
        console.error('Services section: Required DOM elements are missing.');
    } else {
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
    }

    const faqQuestions = document.querySelectorAll('#faq_section .faq_question');

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
});