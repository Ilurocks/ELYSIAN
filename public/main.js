document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.btn-search');
    const propertyType = document.getElementById('property-type');
    const cards = document.querySelectorAll('.card');

    // Smooth scroll for nav links
    document.querySelectorAll('nav a, .footer-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Simple Filter Implementation
    searchBtn.addEventListener('click', () => {
        const type = propertyType.value;
        const locationInput = document.getElementById('location-input').value.toLowerCase();

        cards.forEach(card => {
            const cardType = card.getAttribute('data-type');
            const cardTitle = card.querySelector('.card-title').innerText.toLowerCase();
            const cardLocation = card.querySelector('.card-location').innerText.toLowerCase();

            const typeMatch = type === 'all' || cardType === type;
            const textMatch = cardTitle.includes(locationInput) || cardLocation.includes(locationInput);

            if (typeMatch && textMatch) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
    // Modal Logic
    const modal = document.getElementById('contact-modal');
    const closeBtn = document.querySelector('.close-modal');
    const inquireBtns = document.querySelectorAll('.btn-contact, .card');

    inquireBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!btn.classList.contains('card')) {
                e.preventDefault();
            }
            modal.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Form Submission Logic
    const handleFormSubmit = async (form, isModal = false) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            // Collect data
            let data = {};
            if (isModal) {
                data = {
                    name: form.querySelector('input[type="text"]').value,
                    email: form.querySelector('input[type="email"]').value,
                    message: form.querySelector('textarea').value
                };
            } else {
                const firstName = form.querySelector('input[placeholder="John"]').value;
                const lastName = form.querySelector('input[placeholder="Doe"]').value;
                data = {
                    name: `${firstName} ${lastName}`,
                    email: form.querySelector('input[type="email"]').value,
                    subject: form.querySelector('select')?.value || 'Message from Contact Form',
                    message: form.querySelector('textarea').value
                };
            }

            btn.innerText = 'Sending...';
            btn.disabled = true;

            try {
                const response = await fetch('http://localhost:3000/api/inquiry', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    btn.innerText = 'Sent successfully!';
                    btn.style.background = '#10b981';
                    setTimeout(() => {
                        if (isModal) modal.classList.remove('active');
                        btn.innerText = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                        form.reset();
                    }, 2000);
                } else {
                    throw new Error('Failed to send');
                }
            } catch (error) {
                console.error('Submission error:', error);
                btn.innerText = 'Error! Try Again';
                btn.style.background = '#ef4444';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }
        });
    };

    // Attach to existing forms
    const inquiryForm = document.getElementById('inquiry-form');
    const mainContactForm = document.getElementById('main-contact-form');

    if (inquiryForm) handleFormSubmit(inquiryForm, true);
    if (mainContactForm) handleFormSubmit(mainContactForm, false);
});
