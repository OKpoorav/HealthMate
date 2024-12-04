document.addEventListener('DOMContentLoaded', () => {
    // Analytics Chart (Chart.js)
    const ctx = document.getElementById("myChart")?.getContext("2d");
    if (ctx) {
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Monthly Data',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Dynamic chart data functions
        window.addChartData = function() {
            const newData = Math.floor(Math.random() * 20) + 1;
            const newLabel = `Month ${myChart.data.labels.length + 1}`;

            myChart.data.labels.push(newLabel);
            myChart.data.datasets.forEach((dataset) => {
                dataset.data.push(newData);
            });

            myChart.update();
        };

        window.removeChartData = function() {
            if (myChart.data.labels.length > 0) {
                myChart.data.labels.pop();
                myChart.data.datasets.forEach((dataset) => {
                    dataset.data.pop();
                });

                myChart.update();
            }
        };
    }

    // Image Carousel
    const images = document.querySelectorAll('.carousel-image');
    if (images.length > 0) {
        let currentIndex = 0;

        function showNextImage() {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
        }

        images[currentIndex].classList.add('active');
        setInterval(showNextImage, 3000);
    }

    // Document Management
    const fileTypeFilters = document.querySelectorAll('.file-type-filter');
    const filePreviewWrapper = document.querySelector('.file-preview-wrapper');
    const uploadModal = document.getElementById('file-upload-modal');
    const addDocumentButton = document.querySelector('.add-document-btn');

    // Configure Upload Modal
    if (uploadModal) {
        uploadModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Upload Document</h2>
                <form id="document-upload-form">
                    <select name="category" required>
                        <option value="">Select Document Type</option>
                        <option value="medical-report">Medical Report</option>
                        <option value="prescription">Prescription</option>
                        <option value="insurance">Insurance</option>
                        <option value="other">Other</option>
                    </select>
                    <input type="file" name="document" accept=".pdf,.jpg,.jpeg,.png,.docx" required>
                    <button type="submit">Upload</button>
                </form>
            </div>
        `;

        // Upload Modal Event Listeners
        const closeModalBtn = uploadModal.querySelector('.close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                uploadModal.style.display = 'none';
            });
        }

        // Document Upload Form
        const uploadForm = document.getElementById('document-upload-form');
        if (uploadForm) {
            uploadForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);

                try {
                    const response = await fetch('/upload-document', {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();

                    if (response.ok) {
                        alert('Document uploaded successfully!');
                        uploadModal.style.display = 'none';
                        loadDocuments();
                    } else {
                        alert(`Error: ${result.error}`);
                    }
                } catch (error) {
                    console.error('Upload error:', error);
                    alert('Failed to upload document');
                }
            });
        }
    }

    // Add Document Button
    if (addDocumentButton) {
        addDocumentButton.addEventListener('click', () => {
            if (uploadModal) uploadModal.style.display = 'block';
        });
    }

    // Load Documents Function
    async function loadDocuments(category = 'all') {
        if (!filePreviewWrapper) return;

        try {
            const response = await fetch(`/get-documents?category=${category}`);
            const documents = await response.json();

            filePreviewWrapper.innerHTML = '';

            documents.forEach(doc => {
                const filePreview = document.createElement('div');
                filePreview.classList.add('file-preview');

                // Preview for images
                const isImage = ['image/jpeg', 'image/png'].includes(doc.mimetype);
                const previewElement = isImage
                    ? `<img src="/uploads/${doc.filename}" alt="${doc.originalName}" class="file-thumbnail">`
                    : `<img src="/icons/${doc.category}-icon.png" alt="${doc.category}" class="file-icon">`;

                filePreview.innerHTML = `
                    ${previewElement}
                    <div class="file-info">
                        <div class="file-name">${doc.originalName}</div>
                        <div class="file-size">${(doc.size / 1024).toFixed(2)} KB</div>
                    </div>
                    <div class="file-actions">
                        <button class="btn view-btn" data-url="/uploads/${doc.filename}">View</button>
                        <button class="btn download-btn" data-url="/uploads/${doc.filename}">Download</button>
                        <button class="btn delete-btn" data-id="${doc.id}">Delete</button>
                        <button class="btn summarize-btn" data-document-id="${doc.id}">Summarize</button>
                    </div>
                `;
                filePreviewWrapper.appendChild(filePreview);

                // View Button
                filePreview.querySelector('.view-btn').addEventListener('click', (e) => {
                    window.open(e.target.dataset.url, '_blank');
                });

                // Download Button
                filePreview.querySelector('.download-btn').addEventListener('click', (e) => {
                    const link = document.createElement('a');
                    link.href = e.target.dataset.url;
                    link.download = doc.originalName;
                    link.click();
                });

                // Delete Button
                filePreview.querySelector('.delete-btn').addEventListener('click', async (e) => {
                    const docId = e.target.dataset.id;
                    if (confirm('Are you sure you want to delete this document?')) {
                        try {
                            const response = await fetch(`/delete-document/${docId}`, { method: 'DELETE' });
                            if (response.ok) {
                                alert('Document deleted successfully');
                                loadDocuments(category);
                            } else {
                                alert('Error deleting document');
                            }
                        } catch (error) {
                            console.error('Delete error:', error);
                        }
                    }
                });

                // Summarize Button
                filePreview.querySelector('.summarize-btn').addEventListener('click', async (e) => {
                    const documentId = e.target.dataset.documentId;
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
                    }
                });
            });
        } catch (error) {
            console.error('Failed to load documents:', error);
        }
    }

    // Close Summary Modal
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            const summaryModal = document.getElementById('summaryModal');
            if (summaryModal) summaryModal.style.display = 'none';
        });
    }

    // Filter Documents
    if (fileTypeFilters) {
        fileTypeFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                const category = filter.dataset.type;
                loadDocuments(category);

                fileTypeFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
            });
        });
    }

    // Initial document load
    loadDocuments();
});
    loadUserProfile();
const addDocumentBtn = document.getElementById('add-document-btn');
const fileUploadModal = document.getElementById('file-upload-modal');
const fileUploadClose = document.querySelector('.file-upload-close');
const fileUploadInput = document.getElementById('file-upload-input');
const fileList = document.getElementById('file-list');
const uploadBtn = document.querySelector('.upload-btn');

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

// File Selection
fileUploadInput.addEventListener('change', (e) => {
    fileList.innerHTML = ''; // Clear previous selections
    Array.from(e.target.files).forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-list-item');
        fileItem.innerHTML = `
            <span>${file.name}</span>
            <span>${(file.size / 1024).toFixed(2)} KB</span>
        `;
        fileList.appendChild(fileItem);
    });
});

// Drag and Drop Functionality
const dropArea = document.querySelector('.file-drop-area');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    fileUploadInput.files = files;
    fileUploadInput.dispatchEvent(new Event('change'));
}

// Upload Button
uploadBtn.addEventListener('click', () => {
    // Implement your upload logic here
    alert('Files will be uploaded');
    fileUploadModal.style.display = 'none';
});

async function loadUserProfile() {
    try {
        const response = await fetch('/USERPAGE/Login%20Page/userData.json'); // Path to your JSON file
        console.log('Response:', response);

        const users = await response.json();
        console.log('Users:', users);

        if (users) {
            const user = users; // Ensure 'user' is properly initialized here
            console.log('Selected User:', user);

            // Update the profile photo and name in the header
            const profileImage = document.getElementById('profile-image');
            const profileName = document.getElementById('profile-name');

            console.log(profileImage);
            profileImage.src = user.profilePhoto;
            profileName.textContent = `Hi, ${user.name}`;
        } else {
            console.warn("No users found in the JSON file.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

// Improved Image Carousel
function setupImageCarousel() {
    const images = document.querySelectorAll('.carousel-image');
    if (images.length > 0) {
        let currentIndex = 0;

        function showNextImage() {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
        }

        // Initial setup
        images[currentIndex].classList.add('active');
        
        // Use requestAnimationFrame for smoother transitions
        function autoAdvance() {
            showNextImage();
            setTimeout(autoAdvance, 3000);
        }
        
        autoAdvance();
    }
}

// Improved File Preview
function generateFilePreview(doc) {
    const isImage = ['image/jpeg', 'image/png'].includes(doc.mimetype);
    const previewUrl = isImage 
        ? `/uploads/${doc.filename}` 
        : `/icons/${doc.category || 'default'}-icon.png`;

    const filePreview = document.createElement('div');
    filePreview.classList.add('file-preview');
    filePreview.innerHTML = `
        <img 
            src="${previewUrl}" 
            alt="${doc.originalName}" 
            class="${isImage ? 'file-thumbnail' : 'file-icon'}"
            onerror="this.src='/icons/default-icon.png'"
        >
        <div class="file-info">
            <div class="file-name">${doc.originalName}</div>
            <div class="file-size">${(doc.size / 1024).toFixed(2)} KB</div>
        </div>
        <!-- Rest of the file actions -->
    `;

    return filePreview;
}