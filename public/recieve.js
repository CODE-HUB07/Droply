
let sharingCode = document.querySelector("#code");
let fetchButton = document.querySelector(".fetch-btn");


const GITHUB = "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";  

// ------------------ DOWNLOAD ------------------
fetchButton.addEventListener("click", () => {
  if (sharingCode.value === "") {
    alert("⚠️ Please enter a sharing code.");
    return;
  }
  fetchAndDownload(sharingCode.value.trim());
});

// Download file function
async function fetchAndDownload(sharingCode) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/CODE-HUB07/SID-CODE/contents/uploads/${sharingCode}`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${GITHUB}`,
        },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      alert("❌ Error: " + err.message);
      return;
    }

    const data = await response.json();
    console.log("📂 Files response:", data);

    // ✅ Handle file vs folder response
    let file = Array.isArray(data) ? data[0] : data;
    if (!file || !file.download_url) {
      alert("❌ No downloadable file found for this code.");
      return;
    }

    // Download the file
    const fileResponse = await fetch(file.download_url);
    const blob = await fileResponse.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    console.log("📥 Download started for:", file.name);
  } catch (error) {
    console.error("❌ Error:", error);
    alert("Something went wrong: " + error.message);
  }
}

// ------------------ DELETE ------------------
document.querySelector("#deattachButton").addEventListener("click", async () => {
  if (sharingCode.value === "") {
    alert("⚠️ Please enter a sharing code to delete file.");
    return;
  }

  const code = sharingCode.value.trim();
  if (!confirm(`⚠️ Are you sure you want to permanently delete: ${code}?`)) {
    return; // cancelled
  }

  try {
    // Step 1: Get file info
    const response = await fetch(
      `https://api.github.com/repos/CODE-HUB07/SID-CODE/contents/uploads/${code}`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${GITHUB}`,
        },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      alert("❌ Error: " + err.message);
      return;
    }

    const data = await response.json();
    let file = Array.isArray(data) ? data[0] : data;

    if (!file || !file.sha) {
      alert("❌ File not found for this code.");
      return;
    }

    const filePath = file.path;
    const fileSha = file.sha;

    // Step 2: Delete the file
    const deleteResponse = await fetch(
      `https://api.github.com/repos/CODE-HUB07/SID-CODE/contents/${filePath}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `token ${GITHUB}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          message: `Delete ${filePath} using code ${code}`,
          sha: fileSha,
        }),
      }
    );

    const result = await deleteResponse.json();
    if (deleteResponse.ok) {
      alert(`✅ File deleted successfully: ${filePath}`);
      console.log("🗑️ Delete success:", result);
    } else {
      alert("❌ Delete failed: " + result.message);
      console.error("❌ Delete failed:", result);
    }
  } catch (error) {
    console.error("❌ Error in delete:", error);
    alert("Something went wrong: " + error.message);
  }
});

