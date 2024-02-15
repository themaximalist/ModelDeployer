function setupRecentScroll() {
    const container = document.querySelector('.scrolling-x-content');
    if (container) {
        let hovering = false;

        container.onmouseenter = () => {
            hovering = true;
        };

        container.onmouseleave = () => {
            hovering = false;
            requestAnimationFrame(smoothScroll);
        };

        // Initialize scrollAmount to the current scroll position to handle any pre-scrolling.
        let scrollAmount = container.scrollLeft;

        function smoothScroll() {
            if (!hovering && container.scrollLeft < container.scrollWidth - container.offsetWidth) {
                // Adjust the value here to change the scroll speed
                scrollAmount += 0.2;
                container.scrollLeft = scrollAmount;

                // Use requestAnimationFrame for smoother animation
                requestAnimationFrame(smoothScroll);
            }
        }

        // Listen for manual scrolling and update scrollAmount accordingly
        container.addEventListener('scroll', () => {
            // If the container is manually scrolled, update scrollAmount to the new scroll position
            if (hovering) {
                scrollAmount = container.scrollLeft;
            }
        });

        // Start the smooth scrolling animation
        smoothScroll();
    }
}

//setupRecentScroll();
