/**
 * Gem Gallery - Main JavaScript
 * Handles loading, filtering, displaying gemstones, and lightbox functionality
 */

(function() {
    'use strict';

    // DOM Elements - Gallery
    const gallery = document.getElementById('gallery');
    const searchInput = document.getElementById('search');
    const speciesFilter = document.getElementById('species-filter');

    // DOM Elements - Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxThumbnails = document.getElementById('lightbox-thumbnails');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxSpecies = document.getElementById('lightbox-species');
    const lightboxColor = document.getElementById('lightbox-color');
    const lightboxWeight = document.getElementById('lightbox-weight');
    const lightboxDimensions = document.getElementById('lightbox-dimensions');
    const lightboxOutline = document.getElementById('lightbox-outline');
    const lightboxCut = document.getElementById('lightbox-cut');
    const lightboxOrigin = document.getElementById('lightbox-origin');
    const lightboxDate = document.getElementById('lightbox-date');
    const lightboxNotes = document.getElementById('lightbox-notes');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    // State
    let gemstones = [];
    let filteredGems = [];
    let currentGem = null;
    let currentImageIndex = 0;
    let currentImages = [];


    /**
     * Initialize the gallery
     */
    async function init() {
        try {
            await loadGemstones();
            populateFilters();
            renderGallery();
            setupEventListeners();
        } catch (error) {
            showError('Failed to load gemstones. Please try again later.');
            console.error('Error initializing gallery:', error);
        }
    }

    /**
     * Load gemstones data from JSON file
     */
    async function loadGemstones() {
        const response = await fetch('data/gemstones.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        gemstones = await response.json();
        filteredGems = [...gemstones];
    }

    /**
     * Populate filter dropdowns with unique values
     */
    function populateFilters() {
        const species = [...new Set(gemstones.map(gem => gem.species))].sort();

        species.forEach(s => {
            const option = document.createElement('option');
            option.value = s;
            option.textContent = s;
            speciesFilter.appendChild(option);
        });
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Search and filters
        searchInput.addEventListener('input', debounce(applyFilters, 300));
        speciesFilter.addEventListener('change', applyFilters);

        // Gallery card clicks
        gallery.addEventListener('click', handleCardClick);

        // Lightbox controls
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxBackdrop.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPreviousImage);
        lightboxNext.addEventListener('click', showNextImage);

        // Keyboard navigation
        document.addEventListener('keydown', handleKeydown);

        // Thumbnail clicks
        lightboxThumbnails.addEventListener('click', handleThumbnailClick);
    }

    /**
     * Apply all active filters and re-render gallery
     */
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedSpecies = speciesFilter.value;

        filteredGems = gemstones.filter(gem => {
            const matchesSearch = !searchTerm ||
                gem.species.toLowerCase().includes(searchTerm) ||
                gem.color.toLowerCase().includes(searchTerm) ||
                gem.notes.toLowerCase().includes(searchTerm) ||
                gem.sourceGeo.toLowerCase().includes(searchTerm) ||
                gem.cutName.toLowerCase().includes(searchTerm);

            const matchesSpecies = !selectedSpecies || gem.species === selectedSpecies;

            return matchesSearch && matchesSpecies;
        });

        renderGallery();
    }

    /**
     * Render the gallery with current filtered gems
     */
    function renderGallery() {
        if (filteredGems.length === 0) {
            gallery.innerHTML = `
                <div class="no-results">
                    <p>No gemstones found matching your criteria.</p>
                    <button class="btn btn-secondary" onclick="location.reload()">Clear Filters</button>
                </div>
            `;
            return;
        }

        gallery.innerHTML = filteredGems.map(gem => createGemCard(gem)).join('');
    }

    /**
     * Create HTML for a gem card
     */
    function createGemCard(gem) {
        const imageSrc = `${gem.imagesPath}/${gem.defaultImage}`;

        return `
            <article class="gem-card" data-id="${gem.id}" tabindex="0" role="button" aria-label="View ${gem.species} details">
                <figure class="gem-image">
                    <img src="${imageSrc}" alt="${gem.species}" loading="lazy">
                    <div class="gem-overlay">
                        <span class="view-details">View Details</span>
                    </div>
                </figure>
                <div class="gem-info">
                    <h3>${gem.species}</h3>
                    <div class="gem-meta">
                        <span class="gem-weight">${gem.weightCarats} ct</span>
                    </div>
                </div>
            </article>
        `;
    }

    /**
     * Handle click on gem card
     */
    function handleCardClick(e) {
        const card = e.target.closest('.gem-card');
        if (!card) return;

        const gemId = parseInt(card.dataset.id, 10);
        const gem = gemstones.find(g => g.id === gemId);
        if (gem) {
            openLightbox(gem);
        }
    }

    /**
     * Open lightbox with gem details
     */
    function openLightbox(gem) {
        currentGem = gem;
        currentImageIndex = 0;

        // Populate gem details
        lightboxTitle.textContent = gem.species;
        lightboxSpecies.textContent = gem.species;
        lightboxColor.textContent = gem.color;
        lightboxWeight.textContent = `${gem.weightCarats} carats`;
        lightboxDimensions.textContent = gem.dimensions;
        lightboxOutline.textContent = gem.outline;
        lightboxCut.textContent = gem.cutName;
        lightboxOrigin.textContent = gem.isMined ? gem.sourceGeo : 'Lab-created';
        lightboxDate.textContent = formatDate(gem.dateCut);
        lightboxNotes.textContent = gem.notes;

        // Load images for this gem
        loadGemImages(gem);

        // Show lightbox
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';

        // Focus management for accessibility
        lightboxClose.focus();
    }

    /**
     * Check if a filename is a video
     */
    function isVideo(filename) {
        const videoExtensions = ['.mp4', '.webm', '.mov', '.ogg', '.m4v'];
        const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
        return videoExtensions.includes(ext);
    }

    /**
     * Load all available images/videos for a gem
     */
    function loadGemImages(gem) {
        currentImages = [];

        // Always include the default image first
        currentImages.push({
            src: `${gem.imagesPath}/${gem.defaultImage}`,
            alt: `${gem.species} - Main view`,
            isVideo: isVideo(gem.defaultImage)
        });

        // Add additional images/videos from the array if present
        if (gem.additionalImages && gem.additionalImages.length > 0) {
            gem.additionalImages.forEach((fileName, index) => {
                const viewName = fileName
                    .replace(/\.[^/.]+$/, '') // Remove extension
                    .replace(/[-_]/g, ' ')    // Replace dashes/underscores with spaces
                    .replace(/^\w/, c => c.toUpperCase()); // Capitalize first letter

                currentImages.push({
                    src: `${gem.imagesPath}/${fileName}`,
                    alt: `${gem.species} - ${viewName} view`,
                    isVideo: isVideo(fileName)
                });
            });
        }

        // Render thumbnails and show first image
        renderThumbnails();
        showImage(0);
        updateNavButtons();
    }

    /**
     * Render thumbnail images/videos
     */
    function renderThumbnails() {
        if (currentImages.length <= 1) {
            lightboxThumbnails.innerHTML = '';
            lightboxThumbnails.style.display = 'none';
            return;
        }

        lightboxThumbnails.style.display = 'flex';
        lightboxThumbnails.innerHTML = currentImages.map((media, index) => {
            if (media.isVideo) {
                return `
                    <button class="thumbnail thumbnail-video ${index === 0 ? 'active' : ''}"
                            data-index="${index}"
                            aria-label="View video ${index + 1}"
                            aria-pressed="${index === 0}">
                        <video src="${media.src}" muted preload="metadata"></video>
                        <span class="video-indicator">▶</span>
                    </button>
                `;
            }
            return `
                <button class="thumbnail ${index === 0 ? 'active' : ''}"
                        data-index="${index}"
                        aria-label="View image ${index + 1}"
                        aria-pressed="${index === 0}">
                    <img src="${media.src}" alt="${media.alt}">
                </button>
            `;
        }).join('');
    }

    /**
     * Show image or video at specified index
     */
    function showImage(index) {
        if (index < 0 || index >= currentImages.length) return;

        currentImageIndex = index;
        const media = currentImages[index];
        const container = lightboxImage.parentElement;

        // Remove any existing video element
        const existingVideo = container.querySelector('video');
        if (existingVideo) {
            existingVideo.remove();
        }

        if (media.isVideo) {
            // Hide image, show video
            lightboxImage.style.display = 'none';

            const video = document.createElement('video');
            video.src = media.src;
            video.controls = true;
            video.autoplay = true;
            video.loop = true;
            video.muted = false;
            video.playsInline = true;
            video.style.maxWidth = '100%';
            video.style.maxHeight = '100%';
            video.style.objectFit = 'contain';

            // Insert video before the nav buttons
            container.insertBefore(video, lightboxImage.nextSibling);
        } else {
            // Show image, hide any video
            lightboxImage.style.display = '';
            lightboxImage.src = media.src;
            lightboxImage.alt = media.alt;
        }

        // Update thumbnail active state
        const thumbnails = lightboxThumbnails.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
            thumb.setAttribute('aria-pressed', i === index);
        });

        updateNavButtons();
    }

    /**
     * Update navigation button visibility
     */
    function updateNavButtons() {
        const showNav = currentImages.length > 1;
        lightboxPrev.style.display = showNav ? 'flex' : 'none';
        lightboxNext.style.display = showNav ? 'flex' : 'none';

        lightboxPrev.disabled = currentImageIndex === 0;
        lightboxNext.disabled = currentImageIndex === currentImages.length - 1;
    }

    /**
     * Show previous image
     */
    function showPreviousImage() {
        if (currentImageIndex > 0) {
            showImage(currentImageIndex - 1);
        }
    }

    /**
     * Show next image
     */
    function showNextImage() {
        if (currentImageIndex < currentImages.length - 1) {
            showImage(currentImageIndex + 1);
        }
    }

    /**
     * Handle thumbnail click
     */
    function handleThumbnailClick(e) {
        const thumbnail = e.target.closest('.thumbnail');
        if (!thumbnail) return;

        const index = parseInt(thumbnail.dataset.index, 10);
        showImage(index);
    }

    /**
     * Close lightbox
     */
    function closeLightbox() {
        // Remove any video elements and pause them
        const container = lightboxImage.parentElement;
        const video = container.querySelector('video');
        if (video) {
            video.pause();
            video.remove();
        }
        lightboxImage.style.display = '';

        lightbox.hidden = true;
        document.body.style.overflow = '';

        // Store gem id before clearing
        const gemId = currentGem?.id;

        currentGem = null;
        currentImages = [];
        currentImageIndex = 0;

        // Return focus to the card that opened the lightbox
        const card = document.querySelector(`.gem-card[data-id="${gemId}"]`);
        if (card) card.focus();
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeydown(e) {
        if (lightbox.hidden) {
            // Gallery navigation - Enter/Space to open card
            if (e.key === 'Enter' || e.key === ' ') {
                const focused = document.activeElement;
                if (focused?.classList.contains('gem-card')) {
                    e.preventDefault();
                    focused.click();
                }
            }
            return;
        }

        // Lightbox keyboard controls
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }

    /**
     * Format ISO date string to readable format
     */
    function formatDate(isoDate) {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Show error message
     */
    function showError(message) {
        gallery.innerHTML = `
            <div class="error-state">
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
            </div>
        `;
    }

    /**
     * Debounce utility function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
