document.addEventListener("DOMContentLoaded", () => {
    const themes = [
        "المادة الأسرية", "اتفاقيات إقليمية", "مادة الوظيفة العمومية", "السلطة التنفيدية",
        "التنظيم الهيكلي للوزارة", "الدستور", "مادة المهن", "المادة الاجتماعية",
        "مادة الصناعة والاقتصاد والاستثمار", "السلطة القضائية", "المادة البيئية", "المجلس الأعلى للحسابات",
        "النقل عبر الطرق", "المجلس الاقتصادي والاجتماعي والبيئي", "مادة الصناعة التقليدية",
        "مادة اختصاصات وتنظيم القطاعات الحكومية والمؤسساتية", "مادة الطاقة", "مؤسسات الأعمال الإجتماعية للقطاعات الحكومية",
        "مادة النقل البري والجوي", "مادة الجماعات الترابية", "السلطة التشريعية", "مادة التربية والتعليم",
        "مؤسسات وهيئات حماية حقوق الإنسان والنهوض بها", "مادة الحقوق والحريات", "المادة الإنتخابية", "مادة الفلاحة",
        "المادة التجارية", "مهنة المحاماة", "مادة المنظومة الصحية والحماية الاجتماعية", "المفوضون القضائيون",
        "مادة التأمين و التقاعد", "مهنة النساخة", "المادة الجنائية", "الخبراء القضائيين", "المحكمة الدستورية",
        "المادة المالية", "المادة الإدارية", "مادة الثقافة والسياحة والتراث", "اتفاقيات دولية", "المادة العقارية",
        "مادة التنظيم القضائي", "المادة الأمنية", "مادة المعاملات الالكترونية", "مادة الصيد البحري",
        "المادة المدنية", "مهنة التوثيق", "مادة الشؤون الدينية والإسلامية", "مهنة التراجمة", "اتفاقيات جنيف",
        "المادة الجبائية", "مادة الصحافة", "الهيئة الوطنية للنزاهة والوقاية من الرشوة ومحاربتها", "مادة السلامة الصحية والغدائية",
        "حالة الطوارئ الصحية", "اتفاقيات حقوق الإنسان", "المادة السمعية البصرية", "خطة العدالة", "مجلس المنافسة",
        "مادة الحقوق و الحريات", "المهن القانونية والقضائية", "التشريع الخاص بالتنظيم الإداري والسياسي", "مادة الأنظمة الأساسية الخاصة"
    ];

    const gridContainer = document.getElementById("grid-container");
    const detailsContainer = document.getElementById("details-container");
    const itemTitle = document.getElementById("item-title");
    const itemHeading = document.getElementById("item-heading");

    fetch('/Data/themes_data.json')
        .then(response => response.json())
        .then(data => {
            themes.forEach(item => {
                const card = document.createElement("div");
                card.className = "card-themes";
                card.innerHTML = `
                    <img src="assets/them_icon.svg" alt="Icon">
                    <div class="card-theme-title">${item}</div>
                    <button class="theme-button">تصفح</button>
                `;

                card.querySelector('.hover-button').addEventListener('click', () => {
                    showDetails(item, data);
                });

                gridContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error fetching JSON:", error);
            gridContainer.innerHTML = "<p>Error loading data.</p>";
        });

    function showDetails(theme, jsonData) {
        itemHeading.textContent = theme;
        itemTitle.innerHTML = '';

        if (jsonData && jsonData[theme]) {
            jsonData[theme].forEach(detail => {
                const detailCard = document.createElement('div');
                detailCard.className = 'details-card';

                const cardContent = document.createElement('div');
                cardContent.className = 'card-content';
                cardContent.innerHTML = `
                    <div class="card-text">
                        <h3>${detail.title}</h3>
                    </div>
                    <a href="${detail.pdf_link}" target="_blank">عرض PDF</a>
                `;

                const rectangle = document.createElement('div');
                rectangle.className = 'rectangle';
                const firstWord = detail.title.split(' ')[0];

                if (firstWord === 'مرسوم' || firstWord === 'مرسـوم') {
                    rectangle.style.backgroundColor = '#744541';
                    rectangle.textContent = 'مرسوم';
                } else if (firstWord === 'ظهير') {
                    rectangle.style.backgroundColor = '#61804d';
                    rectangle.textContent = 'ظهير';
                } else {
                    rectangle.style.backgroundColor = '#416483';
                    rectangle.textContent = firstWord;
                }

                detailCard.appendChild(cardContent);
                detailCard.appendChild(rectangle);
                itemTitle.appendChild(detailCard);
            });

            detailsContainer.style.display = "block";
            gridContainer.parentElement.style.display = "none";
        } else {
            itemTitle.innerHTML = '<p>No details found for this theme.</p>';
            detailsContainer.style.display = "block";
            gridContainer.parentElement.style.display = "none";
        }
    }

    window.goBack = () => {
        detailsContainer.style.display = "none";
        gridContainer.parentElement.style.display = "block";
    };

    // Add event listeners to nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');

            // Here we handle 'data-source'
            if (section === 'data-source') {
                // Hide all sections
                document.querySelectorAll('.content-section').forEach(section => {
                    section.style.display = 'none';
                });
                // Show data-source content
                const dataSourceContent = document.getElementById('data-source-content');
                if (dataSourceContent) {
                    dataSourceContent.style.display = 'block';
                }
            } else {
                // Handle other sections if needed
            }
        });
    });

    // If you want to ensure home is shown by default:
    document.getElementById('home').click();

    // Back button icon change logic
    const backButton = document.getElementById('back-button');
    const backIcon = document.getElementById('back-icon');

    backButton.addEventListener('mouseenter', () => {
        backIcon.src = 'assets/left-arrow-b.png';
    });

    backButton.addEventListener('mouseleave', () => {
        backIcon.src = 'assets/left-arrow-w.png';
    });
});