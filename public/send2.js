
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const toggleIcon = themeToggle.querySelector('.toggle-icon');
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateToggleIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcon(newTheme);
    });
    
    function updateToggleIcon(theme) {
        if (theme === 'dark') {
            toggleIcon.textContent = '☀️';
        } else {
            toggleIcon.textContent = '🌙';
        }
    }

    // Drag and Drop Functionality
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('file');
    const fileList = document.getElementById('fileList');
    const uploadButton = document.getElementById('uploadButton');
    const sharingResult = document.getElementById('sharingResult');
    let selectedFiles = [];

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    uploadArea.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFileSelect, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        uploadArea.classList.add('drag-over');
    }

    function unhighlight() {
        uploadArea.classList.remove('drag-over');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        selectedFiles = [...files];
        displayFiles(selectedFiles);
        
        // Update progress steps
        updateProgressStep(2);
    }

    function displayFiles(files) {
        fileList.innerHTML = '';
        
        files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <div class="file-icon">
                        ${getFileIcon(file.name)}
                    </div>
                    <div class="file-details">
                        <h5>${file.name}</h5>
                        <span>${formatFileSize(file.size)}</span>
                    </div>
                </div>
                <button class="remove-file" onclick="removeFile(${index})" type="button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            `;
            fileList.appendChild(fileItem);
        });
    }

    function getFileIcon(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'pdf': '📄',
            'doc': '📝',
            'docx': '📝',
            'txt': '📄',
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'png': '🖼️',
            'gif': '🖼️',
            'mp4': '🎥',
            'avi': '🎥',
            'mp3': '🎵',
            'wav': '🎵',
            'zip': '🗜️',
            'rar': '🗜️',
            'default': '📁'
        };
        return iconMap[extension] || iconMap.default;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Make removeFile function global
    window.removeFile = function(index) {
        selectedFiles.splice(index, 1);
        displayFiles(selectedFiles);
        
        if (selectedFiles.length === 0) {
            updateProgressStep(1);
        }
    };

    // Upload functionality
    uploadButton.addEventListener('click', function() {
        const name = document.getElementById('name').value;
        const receiverName = document.getElementById('r-name').value;
        const email = document.getElementById('email').value;

        if (!name || !receiverName) {
            alert('Please fill in sender and receiver names');
            return;
        }

        if (selectedFiles.length === 0) {
            alert('Please select at least one file');
            return;
        }

        // Check file size (100MB limit)
        const maxSize = 100 * 1024 * 1024; // 100MB in bytes
        for (let file of selectedFiles) {
            if (file.size > maxSize) {
                alert(`File "${file.name}" exceeds the 100MB limit`);
                return;
            }
        }

        startUpload();
    });

    function startUpload() {
        uploadButton.classList.add('loading');
        uploadButton.disabled = true;

        // Simulate upload process
        setTimeout(() => {
            uploadButton.classList.remove('loading');
            uploadButton.disabled = false;
            
            // Generate random sharing code
            const sharingCode = generateSharingCode();
            showSharingResult(sharingCode);
            updateProgressStep(3);
        }, 3000);
    }

    function generateSharingCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function showSharingResult(code) {
        const senderName = document.getElementById('name').value;
        const receiverName = document.getElementById('r-name').value;
        const fileCount = selectedFiles.length;
        const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

        sharingResult.innerHTML = `
            <div class="result-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h2>Files Ready for Sharing!</h2>
            <p>Your ${fileCount} file${fileCount > 1 ? 's' : ''} (${formatFileSize(totalSize)}) have been prepared for ${receiverName}.</p>
            
            <div class="sharing-code" id="generatedCode">${code}</div>
            
            <button class="copy-button" onclick="copyToClipboard('${code}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/>
                </svg>
                Copy Code
            </button>
            
            <div class="sharing-info">
                <p><strong>Share this code with ${receiverName}</strong></p>
                <p>Files will be automatically deleted in 30 minutes</p>
                <p>Code expires after first download</p>
            </div>
        `;
        
        sharingResult.classList.add('show');
    }

    // Make copyToClipboard function global
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            const copyButton = document.querySelector('.copy-button');
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Copied!
            `;
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 2000);
        });
    };

    function updateProgressStep(step) {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((stepEl, index) => {
            if (index < step) {
                stepEl.classList.add('active');
            } else {
                stepEl.classList.remove('active');
            }
        });
    }

    // Form validation
    const nameInput = document.getElementById('name');
    const receiverNameInput = document.getElementById('r-name');
    
    nameInput.addEventListener('input', function() {
        if (this.value.trim()) {
            updateProgressStep(1);
        }
    });
});
