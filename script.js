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

    // --- Media Stopping Logic ---
    const stopMedia = (pageElement) => {
        if (!pageElement) return;
        const videos = pageElement.querySelectorAll('video');
        const audios = pageElement.querySelectorAll('audio');
        videos.forEach(v => v.pause());
        audios.forEach(a => a.pause());
        
        // Stop iframe players (Google Drive embeds) by resetting their source
        const iframes = pageElement.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            const currentSrc = iframe.src;
            iframe.src = '';
            iframe.src = currentSrc;
        });
    };

    const closePage = (page) => {
        if (!page) return;
        page.classList.remove('active');
        stopMedia(page);
    };

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
            closePage(page);
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
            if (activePage) {
                closePage(activePage);
            }
        }
    }, { passive: true });

    // --- Lightbox Modal for Images ---
    const createLightbox = () => {
        let lightbox = document.getElementById('lightbox-modal');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'lightbox-modal';
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                height: 100dvh;
                background: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.4s ease;
                z-index: 1000;
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = `
                position: absolute;
                top: max(3vh, env(safe-area-inset-top, 20px));
                right: max(4vw, env(safe-area-inset-right, 20px));
                background: transparent;
                border: none;
                color: #fff;
                font-size: 3.5rem;
                cursor: pointer;
                opacity: 0.6;
                transition: opacity 0.3s;
                line-height: 1;
            `;
            closeBtn.addEventListener('click', () => hideLightbox());
            closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
            closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.6');
            
            const img = document.createElement('img');
            img.id = 'lightbox-img';
            img.style.cssText = `
                max-width: 90vw;
                max-height: 85vh;
                max-height: 85dvh;
                object-fit: contain;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
                transform: scale(0.95);
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            `;
            
            lightbox.appendChild(closeBtn);
            lightbox.appendChild(img);
            document.body.appendChild(lightbox);
            
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    hideLightbox();
                }
            });
        }
        return lightbox;
    };

    const showLightbox = (src, alt) => {
        const lightbox = createLightbox();
        const img = document.getElementById('lightbox-img');
        img.src = src;
        img.alt = alt || 'Expanded View';
        lightbox.style.opacity = '1';
        lightbox.style.pointerEvents = 'auto';
        setTimeout(() => {
            img.style.transform = 'scale(1)';
        }, 50);
    };

    const hideLightbox = () => {
        const lightbox = document.getElementById('lightbox-modal');
        const img = document.getElementById('lightbox-img');
        if (lightbox) {
            lightbox.style.opacity = '0';
            lightbox.style.pointerEvents = 'none';
            if (img) {
                img.style.transform = 'scale(0.95)';
            }
        }
    };

    // Attach click listener to detail images
    document.querySelectorAll('.detail-img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            showLightbox(img.src, img.alt);
        });
    });

    // Escape Key Close Handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const lightbox = document.getElementById('lightbox-modal');
            if (lightbox && lightbox.style.opacity === '1') {
                hideLightbox();
            } else {
                const activePage = document.querySelector('.detail-page.active');
                if (activePage) {
                    closePage(activePage);
                }
            }
        }
    });
});
