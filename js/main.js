document.addEventListener('DOMContentLoaded', () => {
    const filterNav = document.querySelector('.filter-nav');
    const buttons = Array.from(document.querySelectorAll('.filter-nav .filter-btn'));
    const cards = Array.from(document.querySelectorAll('.project-card'));
    const grids = Array.from(document.querySelectorAll('.project-grid'));
    const allSubtitle = document.querySelector('.all-subtitle');
    const categorySubtitles = Array.from(document.querySelectorAll('.category-subtitle'));

    function applyFilter(filter) {
        // Tampilkan/sembunyikan kartu sesuai kategori
        cards.forEach(card => {
            const category = (card.getAttribute('data-category') || '').toLowerCase();
            const show = filter === 'all' || category === filter;
            card.style.display = show ? '' : 'none';
        });

        // Rapikan layout: sembunyikan grid yang kosong saat filter selain 'all'
        grids.forEach(grid => {
            const visibleCards = Array.from(grid.querySelectorAll('.project-card')).some(c => c.style.display !== 'none');
            grid.style.display = (filter === 'all' || visibleCards) ? '' : 'none';
        });

        // Subjudul global 'Semua Project'
        if (allSubtitle) {
            allSubtitle.style.display = (filter === 'all') ? '' : 'none';
        }

        // Subjudul per kategori: tampilkan hanya saat filter 'all' dan grid-nya punya kartu terlihat
        categorySubtitles.forEach(sub => {
            const cat = (sub.getAttribute('data-category') || '').toLowerCase();
            const grid = sub.nextElementSibling; // grid berada tepat setelah subtitle
            const hasVisible = grid && Array.from(grid.querySelectorAll('.project-card')).some(c => c.style.display !== 'none');
            sub.style.display = (filter === 'all' && hasVisible) ? '' : 'none';
        });
    }

    function setActiveButton(targetBtn) {
        buttons.forEach(btn => {
            const isActive = btn === targetBtn;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });
    }

    filterNav?.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        const filter = (btn.getAttribute('data-filter') || 'all').toLowerCase();
        setActiveButton(btn);
        applyFilter(filter);
    });

    // Inisialisasi: gunakan tombol yang sudah active atau default 'all'
    const initialBtn = buttons.find(b => b.classList.contains('active'))
        || buttons.find(b => (b.getAttribute('data-filter') || '').toLowerCase() === 'all');
    if (initialBtn) {
        setActiveButton(initialBtn);
        const initial = (initialBtn.getAttribute('data-filter') || 'all').toLowerCase();
        applyFilter(initial);
        if (allSubtitle) allSubtitle.style.display = (initial === 'all') ? '' : 'none';
    } else {
        applyFilter('all');
        if (allSubtitle) allSubtitle.style.display = '';
    }

    // Loop presisi 17 detik untuk video YouTube background dengan Iframe API
    const ytId = 'heroVideo';
    const heroIframe = document.getElementById(ytId);
    if (heroIframe) {
        // Muat Iframe API jika belum ada
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        }

        let player;
        window.onYouTubeIframeAPIReady = function () {
            player = new YT.Player(ytId, {
                events: {
                    'onReady': () => {
                        try {
                            player.mute();
                            player.playVideo();
                        } catch (_) { }
                    },
                    'onStateChange': (e) => {
                        // Tidak perlu aksi khusus di state change
                    }
                }
            });
        };

        // Polling waktu untuk reset ke 0 setelah 17 detik
        const LOOP_SECONDS = 17;
        const tick = () => {
            try {
                if (player && typeof player.getCurrentTime === 'function') {
                    const t = player.getCurrentTime();
                    if (t >= LOOP_SECONDS) {
                        player.seekTo(0, true);
                    }
                }
            } catch (_) { }
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }
});