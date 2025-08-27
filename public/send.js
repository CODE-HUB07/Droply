// File Selection and Validation Functionality
document.querySelector("#file").addEventListener("change", (event) => {
    console.log("File input changed");
    const selectedFiles = event.target.files; // FileList object
    if ((selectedFiles.length = 1)) {
        size = selectedFiles[0].size / 1024; // size in KB
        if (size > 102400) {
            // 100MB in KB
            // document.querySelector(".dragdrop").textContent =
            // "File size exceeds 100MB. \n Please select a smaller file.";
            document.querySelector("#file").value = ""; // Clear the input
        } else {
            // document.querySelector(".dragdrop").textContent =
            // "File selected: " + selectedFiles[0].name;
            
            
        }
    } else if (selectedFiles.length > 1) {
        // document.querySelector(".dragdrop").textContent =
        // "Please select only one file at a time.";
        // document.querySelector("#file").value = ""; // Clear the input
    } else {
        // document.querySelector(".dragdrop").textContent =
        // "No file selected or selection cancelled.";
    }
});


// Sharing Code Generation Functionality

var SenderName = document.getElementById("name");
var ReceiverName = document.getElementById("r-name");
var SenderEmail = document.getElementById("email");
var SendButton = document.querySelector("#uploadButton");
var fileInput = document.getElementById("file");

SendButton.addEventListener("click", async () => {
    if (
        SenderName.value === "" ||
        ReceiverName.value === "" ||
        SenderEmail.value === ""
    ) {
        alert("Please fill in all fields.");
        return;
    }
    if (fileInput.files.length === 0) {
        alert("Please select a file to upload.");
        return;
    }

    // ✅ Generate sharing code
    var code = Math.floor(100 + Math.random() * 900000);
    code =
        "SID" +
        SenderName.value.charAt(0).toUpperCase() +
        ReceiverName.value.charAt(2).toUpperCase() +
        code +
        SenderName.value.charAt(1).toUpperCase() +
        SenderName.value.charAt(0).toUpperCase();
    alert(
        "Your Sharing code is: " +
            code +
            "\nPlease save this code for future reference."
    );

    const file = fileInput.files[0];

    // ✅ Convert file → Base64
    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = (error) => reject(error);
        });

    try {
        const base64Content = await toBase64(file);
        const githubFilePath = `uploads/${code}/${file.name}`;

        // ✅ GitHub API request
        const response = await fetch(
            `https://api.github.com/repos/CODE-HUB07/SID-CODE/contents/${githubFilePath}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": "token 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", // 🚨 unsafe in frontend
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: `Upload ${file.name} to ${code}`,
                    content: base64Content,
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert(`File uploaded successfully!`);
            // console.log("Uploaded:", data);
        } else {
            alert("Upload failed: ");
            // console.error("GitHub Error:", data);
        }
    } catch (error) {
        console.error("Error:");
        alert("Something went wrong: ");
    }
});


// send2 partial functionality -

    function generateSharingCode() {
       const result = code;
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
