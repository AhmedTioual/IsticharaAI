
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

    const gridThemesContent = document.getElementById("gridThemesContent");
    const detailsContent = document.getElementById("details-content");
    const detailsItemTitle = document.getElementById("details-item-title");
    const detailsItemHeading = document.getElementById("details-item-heading");

    fetch('/data_source/themes_data.json')
        .then(response => response.json())
        .then(data => {
            themes.forEach(item => {
                const card = document.createElement("div");
                card.className = "card-theme";
                card.innerHTML = `
                    <img src="assets/them_icon.svg" alt="Icon" class="theme-icon">
                    <div class="card-theme-title">${item}</div>
                    <button class="theme-button">تصفح</button>
                `;

                card.querySelector('.theme-button').addEventListener('click', () => {
                    showDetails(item, data);
                });

                gridThemesContent.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error fetching JSON:", error);
            gridThemesContent.innerHTML = "<p>Error loading data.</p>";
        });

    function showDetails(theme, jsonData) {
        detailsItemHeading.textContent = theme;
        detailsItemTitle.innerHTML = '';

        if (jsonData && jsonData[theme]) {
            jsonData[theme].forEach(detail => {
                const detailCard = document.createElement('div');
                detailCard.className = 'details-card';

                const cardContent = document.createElement('div');
                cardContent.className = 'card-details-content';
                cardContent.innerHTML = `
                    <div class="card-details-text">
                        <h3>${detail.title}</h3>
                    </div>
                    <a href="${detail.pdf_link}" target="_blank">عرض PDF</a>
                `;

                detailCard.appendChild(cardContent);
                detailsItemTitle.appendChild(detailCard);
            });

            detailsContent.style.display = "flex";
            document.querySelector(".data-source-content").style.display = "none";
        } else {
            detailsItemTitle.innerHTML = '<p>No details found for this theme.</p>';
            detailsContent.style.display = "flex";
            document.querySelector(".data-source-content").style.display = "none";
        }
    }

    window.goBack = () => {
        detailsContent.style.display = "none";
        document.querySelector(".data-source-content").style.display = "flex";
    };

    // Back button icon change logic
    const backButton = document.getElementById('details-back-button');
    const backIcon = document.getElementById('back-icon');

    backButton.addEventListener('mouseenter', () => {
        backIcon.src = 'assets/left-arrow-b.png';
    });

    backButton.addEventListener('mouseleave', () => {
        backIcon.src = 'assets/left-arrow-w.png';
    });
});