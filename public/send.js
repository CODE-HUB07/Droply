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

