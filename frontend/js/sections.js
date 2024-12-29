document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const imageMap = {
        'home': {
            default: "assets/chat-icon.png",
            clicked: "assets/chat-icon_clicked.png"
        },
        'voice-chat': {
            default: "assets/voice-chat-icon.png",
            clicked: "assets/voice-chat-icon_clicked.png"
        },
        'history': {
            default: "assets/history-icon.png",
            clicked: "assets/history-icon_clicked.png"
        },
        'data-source': {
            default: "assets/data-source-icon.png",
            clicked: "assets/data-source-icon_clicked.png"
        },
        'about': {
            default: "assets/about-icon.png",
            clicked: "assets/about-icon_clicked.png"
        }
    };

    // Define sections
    const sections = {
        'home': document.querySelector('#main-content'),
        'voice-chat': document.querySelector('#voice-chat-content'),
        'history': document.querySelector('#history-content'),
        'data-source': document.querySelector('#data-source-content'),
        'details': document.querySelector('#details-content'),
        'about': document.querySelector('#about-content')
    };

    // Function to hide all sections
    function hideAllSections() {
        for (let section of Object.values(sections)) {
            if (section) {
                section.style.display = 'none';
            }
        }
    }

    // Function to show a specific section
    function showSection(sectionId) {
        hideAllSections();
        if (sections[sectionId]) {
            sections[sectionId].style.display = 'flex';
        }
    }

    // Default to showing the home section on page load or reload
    showSection('home');

    // Also simulate a click on the home navigation item to set it as active
    const homeNavItem = document.querySelector('#home a');
    if (homeNavItem) {
        homeNavItem.click();
    }

    navItems.forEach(item => {
        const img = item.querySelector('img');
        const section = item.getAttribute('data-section');

        // Set up click event
        item.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior
            
            // Show the corresponding section
            showSection(section);

            // Update navigation appearance
            navItems.forEach(navItem => {
                navItem.classList.remove('clicked');
                const navImg = navItem.querySelector('img');
                const navSection = navItem.getAttribute('data-section');
                navImg.src = imageMap[navSection].default;
            });
            
            // Add 'clicked' class to the clicked item and change its image
            this.classList.add('clicked');
            img.src = imageMap[section].clicked;
        });

        // Hover effect
        item.addEventListener('mouseover', function() {
            if (!this.classList.contains('clicked')) {
                img.src = imageMap[section].clicked;
            }
        });

        // Reset to original image when mouse leaves if the item was not clicked
        item.addEventListener('mouseout', function() {
            if (!this.classList.contains('clicked')) {
                img.src = imageMap[section].default;
            }
        });
    });
});