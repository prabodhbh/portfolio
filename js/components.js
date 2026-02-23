class AppNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <!-- DESKTOP NAV (Visible md+) -->
        <nav class="nav-pill hidden md:flex">
            <a href="index.html#work" class="nav-link">Work</a>
            <a href="project-how-i-ai.html" class="nav-link">How I AI</a>
            <a href="index.html" class="nav-brand">PB</a>
            <a href="index.html#about" class="nav-link">About</a>
            <a href="https://drive.google.com/file/d/1DP5I-LkXqicd64i75C9EQXtzkQJuTEa7/view?usp=sharing" target="_blank"
                class="nav-link">Resume</a>
        </nav>

        <!-- MOBILE NAV (Visible < md) -->
        <div id="mobile-nav" class="fixed top-8 left-6 right-6 z-50 md:hidden bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-[40px] shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.725,0.25,1)] overflow-hidden h-[74px]">
            
            <!-- Header -->
            <div id="mobile-header" class="flex justify-between items-center px-6 py-5">
                <!-- Logo -->
                <a href="index.html" class="nav-brand text-xl drop-shadow-lg">PB</a>

                <!-- Hamburger Button -->
                <button id="menu-btn" class="relative w-10 h-8 flex flex-col justify-center items-center gap-1.5 z-50 group focus:outline-none" aria-label="Menu">
                    <span class="w-6 h-0.5 bg-white/80 rounded-full transition-all duration-300 origin-center"></span>
                    <span class="w-6 h-0.5 bg-white/80 rounded-full transition-all duration-300 origin-center"></span>
                    <span class="w-6 h-0.5 bg-white/80 rounded-full transition-all duration-300 origin-center"></span>
                </button>
            </div>

            <!-- Links (Hidden initially) -->
            <div id="mobile-links" class="flex flex-col items-center gap-6 pb-3 opacity-0 pointer-events-none transition-opacity duration-300 delay-100">
                <a href="index.html#about" class="mobile-link text-lg font-['Inter'] font-medium text-gray-400 hover:text-white transition-colors">About</a>
                <a href="index.html#work" class="mobile-link text-lg font-['Inter'] font-medium text-gray-400 hover:text-white transition-colors">Work</a>
                <a href="project-how-i-ai.html" class="mobile-link text-lg font-['Inter'] font-medium text-gray-400 hover:text-white transition-colors">How I AI</a>
                <a href="https://drive.google.com/file/d/1DP5I-LkXqicd64i75C9EQXtzkQJuTEa7/view?usp=sharing" target="_blank" class="mobile-link text-lg font-['Inter'] font-medium text-gray-400 hover:text-white transition-colors">Resume</a>
            </div>
        </div>
        `;

        // Highlight active link simple check (Desktop)
        const currentPath = window.location.pathname;
        const links = this.querySelectorAll('.nav-link');
        links.forEach(link => {
            if (link.getAttribute('href') === currentPath.split('/').pop()) {
                link.style.color = '#ffffff';
            }
        });

        // Mobile Menu Logic
        const navContainer = this.querySelector('#mobile-nav');
        const header = this.querySelector('#mobile-header');
        const menuBtn = this.querySelector('#menu-btn');
        const linksContainer = this.querySelector('#mobile-links');
        const spans = menuBtn.querySelectorAll('span');
        const mobileLinks = this.querySelectorAll('.mobile-link');
        let isOpen = false;

        menuBtn.addEventListener('click', () => {
            isOpen = !isOpen;
            toggleMenu();
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                isOpen = false;
                toggleMenu();
            });
        });

        function toggleMenu() {
            const headerHeight = header.offsetHeight;

            if (isOpen) {
                // Open State
                // Show links first to calculate height
                linksContainer.classList.remove('opacity-0', 'pointer-events-none');
                linksContainer.classList.add('opacity-100', 'pointer-events-auto');

                // Calculate total height: Header Height + Links content
                const contentHeight = linksContainer.scrollHeight;
                navContainer.style.height = (headerHeight + contentHeight) + 'px';

                navContainer.classList.add('bg-[#0a0a0a]/90');
                navContainer.classList.remove('bg-[#0a0a0a]/60');

                // Animate Hamburger to X
                spans[0].classList.add('rotate-45', 'translate-y-2');
                spans[1].classList.add('opacity-0');
                spans[2].classList.add('-rotate-45', '-translate-y-2');
            } else {
                // Closed State
                navContainer.style.height = headerHeight + 'px'; // Back to header height
                navContainer.classList.add('bg-[#0a0a0a]/60');
                navContainer.classList.remove('bg-[#0a0a0a]/90');

                // Hide links
                linksContainer.classList.remove('opacity-100', 'pointer-events-auto');
                linksContainer.classList.add('opacity-0', 'pointer-events-none');

                // Animate X back to Hamburger
                spans[0].classList.remove('rotate-45', 'translate-y-2');
                spans[1].classList.remove('opacity-0');
                spans[2].classList.remove('-rotate-45', '-translate-y-2');
            }
        }

        // --- Scroll Logic for Sliding Navbar ---
        let lastScrollY = window.scrollY;
        const desktopNav = this.querySelector('.nav-pill');
        const mobileNavContainer = this.querySelector('#mobile-nav');

        // Note: For mobile-nav, we'll translate it up. Its original class has top-8 (2rem).
        // Let's add a nav-hidden class for mobile as well.
        mobileNavContainer.style.transition = 'transform 0.4s ease-in-out, height 0.5s ease[cubic-bezier(0.32,0.725,0.25,1)], background-color 0.5s';

        // We'll use JS to assign the transform since we don't want to mess up Tailwind classes if we can avoid it.
        // Actually, creating a CSS class is cleaner. Let's just toggle 'transform:-translateY(150%)'

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Don't hide if menu is open on mobile
            if (isOpen) return;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down & past threshold -> Hide
                if (desktopNav) desktopNav.classList.add('nav-hidden');
                if (mobileNavContainer) mobileNavContainer.style.transform = 'translateY(min(-150%, -100px))';
            } else {
                // Scrolling up -> Show
                if (desktopNav) desktopNav.classList.remove('nav-hidden');
                if (mobileNavContainer) mobileNavContainer.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }
}

class AppFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="relative z-10 pt-12 pb-12 flex flex-col items-center justify-center gap-8 px-6">
            <!-- Centered Text (Socials Removed) -->
            <div class="flex items-center gap-2 opacity-60">
                <span class="text-xl">⚡</span>
                <p class="font-serif italic text-lg text-gray-300">Crafted with caffeine, Antigravity & death stares from my cat</p>
            </div>
        </footer>
        `;
    }
}

customElements.define('app-navbar', AppNavbar);
customElements.define('app-footer', AppFooter);
