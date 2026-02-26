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
                
                if (resetTimeout) {
                    clearTimeout(resetTimeout);
                    resetTimeout = null;
                    console.log('>>> Cleared reset timeout');
                }
                
                showSkillContent(skillType);
            });
        });

        // Sidebar'dan çıkıldığında - sol tarafa gidildiğinde
        if (sidebar) {
            sidebar.addEventListener('mouseleave', function(e) {
                console.log('>>> Sidebar LEAVE');
                const sidebarRect = sidebar.getBoundingClientRect();
                if (e.clientX < sidebarRect.left) {
                    console.log('>>> Mouse went LEFT, resetting');
                    resetView();
                    currentSkill = null;
                }
            });
        }

        // Content area'dan çıkıldığında
        if (contentArea) {
            contentArea.addEventListener('mouseleave', function(e) {
                console.log('>>> Content area LEAVE');
                resetTimeout = setTimeout(() => {
                    if (!sidebar.matches(':hover')) {
                        console.log('>>> Resetting from content area');
                        resetView();
                        currentSkill = null;
                    }
                }, 100);
            });
        }

        // Main content area'dan çıkıldığında reset yap (yukarı/aşağı)
        if (mainContent) {
            mainContent.addEventListener('mouseleave', function(e) {
                console.log('>>> Main content LEAVE');
                const mainRect = mainContent.getBoundingClientRect();
                
                if (e.clientY < mainRect.top || e.clientY > mainRect.bottom) {
                    console.log('>>> Mouse went UP or DOWN, resetting');
                    resetTimeout = setTimeout(() => {
                        console.log('>>> Executing RESET');
                        resetView();
                        currentSkill = null;
                    }, 100);
                }
            });

            mainContent.addEventListener('mouseenter', function() {
                console.log('>>> Main content ENTER');
                if (resetTimeout) {
                    clearTimeout(resetTimeout);
                    resetTimeout = null;
                    console.log('>>> Cleared reset on enter');
                }
            });
        }

        function showSkillContent(skillType) {
            console.log('>>> showSkillContent called for:', skillType);
            
            if (experienceSection) {
                experienceSection.classList.add('hidden');
                console.log('>>> Experience section hidden');
            }
            
            catalogs.forEach(catalog => {
                catalog.classList.remove('active');
            });
            console.log('>>> All catalogs deactivated');
            
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
            
            if (experienceSection) {
                experienceSection.classList.remove('hidden');
                console.log('>>> Experience section shown');
            }
            
            catalogs.forEach(catalog => {
                catalog.classList.remove('active');
            });
            console.log('>>> All catalogs hidden');
        }

        // =============================================
        // SUPABASE ZİYARETÇİ SAYACI
        // =============================================
        const SUPABASE_URL = 'https://bjdfigdrnrvseklbcwli.supabase.co';
        const SUPABASE_KEY = 'sb_publishable_IwpWn7GCTtjJNsMp2xXV4Q__ilKTT9G';

        async function initVisitorCounter() {
            try {
                // Önce sayacı artır
                await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_visitor`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Sonra güncel değeri oku
                const response = await fetch(`${SUPABASE_URL}/rest/v1/znb_001_counter?id=eq.0&select=count`, {
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`
                    }
                });

                const data = await response.json();

                if (data && data.length > 0) {
                    const countElement = document.getElementById('visitorCount');
                    if (countElement) {
                        animateCount(countElement, data[0].count);
                    }
                }
            } catch (error) {
                console.log('Visitor counter error:', error);
                const countElement = document.getElementById('visitorCount');
                if (countElement) {
                    countElement.textContent = '---';
                }
            }
        }

        function animateCount(element, targetCount) {
            const duration = 1500;
            const start = 0;
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(start + (targetCount - start) * easeOutQuart);
                
                element.textContent = current.toLocaleString('tr-TR');
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        }

        // Sayfa yüklendiğinde çalıştır
        document.addEventListener('DOMContentLoaded', initVisitorCounter);
