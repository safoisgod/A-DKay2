document.addEventListener('DOMContentLoaded', function () {
    // === Hero Section Carousel ===
    $('.owl-carousel:not(#pubco_books_carousel)').owlCarousel({
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
        items: 3, // Keep at 3 items at a time (including active)
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
        onInitialized: pubcoUpdateDescriptionAndStyles,
        onTranslated: pubcoUpdateDescriptionAndStyles,
        onDragged: pubcoUpdateDescriptionAndStyles
    });

    // Function to update description, blur, and size based on the active item
    function pubcoUpdateDescriptionAndStyles() {
        // Fade out the description elements
        $('#pubco_book_title, #pubco_category_text, #pubco_description_text').css('opacity', '0');

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

        // Update the category, title, description, and button link with a fade-in effect
        setTimeout(() => {
            const category = activeItem.data('pubco-category') || 'Category';
            const title = activeItem.data('pubco-title') || 'Title';
            const description = activeItem.data('pubco-description') || 'Description.';
            $('#pubco_category_text').text(category);
            $('#pubco_book_title').text(title);
            $('#pubco_description_text').text(description);
            $('#pubco_books_section .pubco_btn').attr('href', `book-details.html?title=${encodeURIComponent(title)}`);
            
            // Fade in the description elements
            $('#pubco_book_title, #pubco_category_text, #pubco_description_text').css('opacity', '1');
        }, 300); // Delay to sync with fade-out
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
});