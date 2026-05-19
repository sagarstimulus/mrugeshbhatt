document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('vertical-container');
    const menuItems = document.querySelectorAll('.menu-item');
    const closeButtons = document.querySelectorAll('.close-overlay');
    const detailPages = document.querySelectorAll('.detail-page');

    // --- Section 4: Sarcastic Contact Option Switching ---
    const optButtons = document.querySelectorAll('.contact-opt-btn');
    const responseCards = document.querySelectorAll('.response-card');

    optButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from buttons and cards
            optButtons.forEach(b => b.classList.remove('active'));
            responseCards.forEach(card => card.classList.remove('active'));

            // Set clicked button to active
            btn.classList.add('active');

            // Set corresponding response card to active
            const reason = btn.getAttribute('data-reason');
            const targetCard = document.getElementById(`resp-${reason}`);
            if (targetCard) {
                targetCard.classList.add('active');
            }
        });
    });

    // --- Sub-subsection Overlay Management ---
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            const targetPage = document.getElementById(`detail-${targetId}`);
            if (targetPage) {
                detailPages.forEach(p => p.classList.remove('active'));
                targetPage.classList.add('active');
            }
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.closest('.detail-page');
            if (page) page.classList.remove('active');
        });
    });

    // Handle closing via swipe right
    let swipeStartX = 0;
    document.addEventListener('touchstart', (e) => swipeStartX = e.touches[0].clientX, { passive: true });
    document.addEventListener('touchend', (e) => {
        const swipeEndX = e.changedTouches[0].clientX;
        // Swipe left-to-right (swipeEndX - swipeStartX > 100) to close detail overlay
        if (swipeEndX - swipeStartX > 100) { 
            const activePage = document.querySelector('.detail-page.active');
            if (activePage) activePage.classList.remove('active');
        }
    }, { passive: true });
});
