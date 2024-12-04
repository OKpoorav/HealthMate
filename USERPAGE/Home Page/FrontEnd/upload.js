document.addEventListener('DOMContentLoaded', () => {
    const addDocumentBtn = document.getElementById('add-document-btn');
    const fileUploadModal = document.getElementById('file-upload-modal');
    const fileUploadClose = document.querySelector('.file-upload-close');
    const fileUploadInput = document.getElementById('file-upload-input');
    const fileList = document.getElementById('file-list');
    const uploadBtn = document.querySelector('.upload-btn');
    const dropArea = document.querySelector('.file-drop-area');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const filePreviewWrapper = document.querySelector('.file-preview-wrapper');

    let currentIndex = 0;
    const previewWidth = 270; // Adjust based on file preview width + gap

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

    // Open Modal
    addDocumentBtn.addEventListener('click', () => {
        fileUploadModal.style.display = 'flex';
    });

    // Close Modal
    fileUploadClose.addEventListener('click', () => {
        fileUploadModal.style.display = 'none';
    });

    // Close modal if clicked outside
    fileUploadModal.addEventListener('click', (e) => {
        if (e.target === fileUploadModal) {
            fileUploadModal.style.display = 'none';
        }
    });

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop area when item is dragged over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropArea.classList.add('drag-over');
    }

    function unhighlight() {
        dropArea.classList.remove('drag-over');
    }

    // File Selection and Display
    fileUploadInput.addEventListener('change', handleFiles);
    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFiles(event) {
        const files = event.target ? event.target.files : event;
        fileList.innerHTML = ''; // Clear previous selections

        Array.from(files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-list-item');
            fileItem.innerHTML = `
                <span>${file.name}</span>
                <span>${(file.size / 1024).toFixed(2)} KB</span>
            `;
            fileList.appendChild(fileItem);
        });
    }

    // Upload Button Handler
    uploadBtn.addEventListener('click', async () => {
        const files = fileUploadInput.files;
        if (files.length === 0) {
            alert('Please select files to upload');
            return;
        }

        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('documents', file);
        });

        try {
            const response = await fetch('/upload-document', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert('Documents uploaded successfully!');
                fileUploadModal.style.display = 'none';
                
                // Refresh document list
                loadDocuments();
            } else {
                alert(`Error: ${result.error || 'Upload failed'}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload documents');
        }
    });

    // Summarize Document Function
    async function summarizeDocument(documentId) {
        try {
            const response = await fetch(`/get-document-summary/${documentId}`);
            const { summary } = await response.json();

            const summaryModal = document.getElementById('summaryModal');
            const summaryText = document.getElementById('summaryText');
            
            if (summaryModal && summaryText) {
                summaryText.textContent = summary;
                summaryModal.style.display = 'block';
            }
        } catch (error) {
            console.error('Error getting document summary:', error);
            alert('Failed to generate document summary');
        }
    }

    // Close Summary Modal
    const closeButton = document.querySelector('#summaryModal .close-button');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            const summaryModal = document.getElementById('summaryModal');
            if (summaryModal) summaryModal.style.display = 'none';
        });
    }

    // Attach summarize functionality to document list
    function attachSummarizeListeners() {
        const summarizeBtns = document.querySelectorAll('.summarize-btn');
        summarizeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const documentId = e.target.dataset.documentId;
                summarizeDocument(documentId);
            });
        });
    }

    // Call this after loading documents
    attachSummarizeListeners();
});
// Modify modal display to use more consistent approach
function openModal(modal) {
    if (modal) {
        modal.style.display = 'flex';  // Use flex for better layout
        modal.classList.add('show');   // Add a show class for animations
    }
}

function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
}

// Update existing modal event listeners
addDocumentBtn.addEventListener('click', () => openModal(fileUploadModal));
fileUploadClose.addEventListener('click', () => closeModal(fileUploadModal));

// Improve modal close functionality
fileUploadModal.addEventListener('click', (e) => {
    if (e.target === fileUploadModal) {
        closeModal(fileUploadModal);
    }
});
const summaryModal = document.getElementById('summaryModal');
const summaryText = document.getElementById('summaryText');
const summaryCloseButton = summaryModal.querySelector('.close-button');

function openSummaryModal(summary) {
    if (summaryModal && summaryText) {
        summaryText.textContent = summary;
        summaryModal.style.display = 'flex';
        summaryModal.classList.add('show');
    }
}

function closeSummaryModal() {
    if (summaryModal) {
        summaryModal.style.display = 'none';
        summaryModal.classList.remove('show');
    }
}

if (summaryCloseButton) {
    summaryCloseButton.addEventListener('click', closeSummaryModal);
}

// Close modal when clicking outside
summaryModal.addEventListener('click', (e) => {
    if (e.target === summaryModal) {
        closeSummaryModal();
    }
});
