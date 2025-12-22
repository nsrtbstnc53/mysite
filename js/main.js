    // Önce tüm elementleri kontrol edelim
        console.log('=== DEBUGGING START ===');
        
        const skillItems = document.querySelectorAll('.skills-list li');
        console.log('Total skills found:', skillItems.length);
        skillItems.forEach((item, index) => {
            console.log(`Skill ${index}:`, item.getAttribute('data-skill'), item.textContent);
        });
        
        const catalogs = document.querySelectorAll('.skill-catalog');
        console.log('Total catalogs found:', catalogs.length);
        catalogs.forEach((catalog, index) => {
            console.log(`Catalog ${index}:`, catalog.getAttribute('data-skill'));
        });
        
        const experienceSection = document.querySelector('.experience-section');
        const contentArea = document.querySelector('.content-area');
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        console.log('Elements found:', {
            experienceSection: !!experienceSection,
            contentArea: !!contentArea,
            sidebar: !!sidebar,
            mainContent: !!mainContent
        });
        console.log('=== DEBUGGING END ===');
        
        let currentSkill = null;
        let resetTimeout = null;

        // Her skill item için hover eventi
        skillItems.forEach(skill => {
            skill.addEventListener('mouseenter', function() {
                const skillType = this.getAttribute('data-skill');
                currentSkill = skillType;
                
                console.log('>>> Skill hover:', skillType);
                
                // Eğer bekleyen bir reset varsa iptal et
                if (resetTimeout) {
                    clearTimeout(resetTimeout);
                    resetTimeout = null;
                    console.log('>>> Cleared reset timeout');
                }
                
                showSkillContent(skillType);
            });
        });

        // Main content area'dan çıkıldığında reset yap
        if (mainContent) {
            mainContent.addEventListener('mouseleave', function() {
                console.log('>>> Main content LEAVE');
                resetTimeout = setTimeout(() => {
                    console.log('>>> Executing RESET');
                    resetView();
                    currentSkill = null;
                }, 100);
            });

            // Main content area'ya girildiğinde
            mainContent.addEventListener('mouseenter', function() {
                console.log('>>> Main content ENTER');
                // Bekleyen reset'i iptal et
                if (resetTimeout) {
                    clearTimeout(resetTimeout);
                    resetTimeout = null;
                    console.log('>>> Cleared reset on enter');
                }
            });
        }

        function showSkillContent(skillType) {
            console.log('>>> showSkillContent called for:', skillType);
            
            // Work Experience section'ını gizle
            if (experienceSection) {
                experienceSection.classList.add('hidden');
                console.log('>>> Experience section hidden');
            }
            
            // Önce tüm katalogları gizle
            catalogs.forEach(catalog => {
                catalog.classList.remove('active');
            });
            console.log('>>> All catalogs deactivated');
            
            // Seçili skill'in katalogunu göster
            const targetCatalog = document.querySelector(`.skill-catalog[data-skill="${skillType}"]`);
            console.log('>>> Looking for catalog with data-skill:', skillType);
            console.log('>>> Found catalog:', !!targetCatalog);
            
            if (targetCatalog) {
                targetCatalog.classList.add('active');
                console.log('>>> Catalog ACTIVATED for:', skillType);
            } else {
                console.error('>>> ERROR: Catalog NOT FOUND for:', skillType);
            }
        }

        function resetView() {
            console.log('>>> resetView called');
            
            // Work Experience section'ını göster
            if (experienceSection) {
                experienceSection.classList.remove('hidden');
                console.log('>>> Experience section shown');
            }
            
            // Tüm katalogları gizle
            catalogs.forEach(catalog => {
                catalog.classList.remove('active');
            });
            console.log('>>> All catalogs hidden');
        }
