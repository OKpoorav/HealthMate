document.addEventListener('DOMContentLoaded', () => {
    const filePreviewWrapper = document.querySelector('.file-preview-wrapper');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const fileTypeFilters = document.querySelectorAll('.file-type-filter');

    let currentIndex = 0;
    const previewWidth = 270; // Adjust based on file preview width + gap

    // Carousel Navigation
    nextBtn.addEventListener('click', () => {
        const maxIndex = filePreviewWrapper.children.length - 3; // Visible previews
        currentIndex = Math.min(currentIndex + 1, maxIndex);
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        updateCarousel();
    });

    function updateCarousel() {
        filePreviewWrapper.style.transform = `translateX(-${currentIndex * previewWidth}px)`;
    }

    // File Type Filtering
    fileTypeFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Remove active from all
            fileTypeFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            const fileType = filter.dataset.type;
            filterFiles(fileType);
        });
    });

    function filterFiles(type) {
        const files = document.querySelectorAll('.file-preview');
        files.forEach(file => {
            if (type === 'all' || file.dataset.type === type) {
                file.style.display = 'flex';
            } else {
                file.style.display = 'none';
            }
        });
        currentIndex = 0;
        updateCarousel();
    }

    // File Action Buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filePreview = e.target.closest('.file-preview');
            const fileName = filePreview.querySelector('.file-name').textContent;
            openFilePreviewModal(fileName);
        });
    });

    function openFilePreviewModal(fileName) {
        // Implement modal to preview file
        const modal = document.createElement('div');
        modal.classList.add('file-preview-modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>${fileName}</h2>
                <iframe src="/view-file/${fileName}" width="100%" height="500px"></iframe>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    // Async File Loading (Optional enhancement)
    async function loadFiles() {
        try {
            const response = await fetch('/get-files');
            const files = await response.json();

            files.forEach(file => {
                const filePreview = createFilePreview(file);
                filePreviewWrapper.appendChild(filePreview);
            });
        } catch (error) {
            console.error('Error loading files:', error);
        }
    }

    function createFilePreview(file) {
        const filePreview = document.createElement('div');
        filePreview.classList.add('file-preview');
        filePreview.dataset.type = file.documentType;
        filePreview.innerHTML = `
            <img src="${getFileIcon(file.type)}" alt="File" class="file-icon">
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <div class="file-actions">
                <button class="btn view-btn">View</button>
                <button class="btn download-btn">Download</button>
                <button class="btn delete-btn">Delete</button>
            </div>
        `;
        return filePreview;
    }

    function getFileIcon(fileType) {
        const icons = {
            'application/pdf': '/icons/pdf-icon.png',
            'image/jpeg': '/icons/image-icon.png',
            'default': '/icons/default-file-icon.png'
        };
        return icons[fileType] || icons['default'];
    }

    function formatFileSize(bytes) {
        if(bytes < 1024) return bytes + ' bytes';
        else if(bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }

    // Initial load
    loadFiles();
});