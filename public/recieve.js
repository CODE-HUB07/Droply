let sharingCode = document.querySelector("#code");
let fetchButton = document.querySelector(".fetch-btn");

// ------------------ DOWNLOAD (optional) ------------------
fetchButton.addEventListener("click", () => {
  if (sharingCode.value === "") {
    alert("Please enter a sharing code.");
    return;
  }
  fetchAndDownload(sharingCode.value.trim());
});

// 🔹 Download file function
async function fetchAndDownload(sharingCode) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/CODE-HUB07/SID-CODE/contents/uploads/${sharingCode}`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: "token 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",
        },
      }
    );

    const data = await response.json();
    console.log("📂 Files response:", data);

    if (!response.ok) {
      alert("❌ Error: " + data.message);
      return;
    }

    // Step 1: Get file metadata
    const filePath = data[0].path;

    // Step 2: Download
    const fileResponse = await fetch(data[0].download_url);
    const blob = await fileResponse.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filePath.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
    console.log("📥 Download started for:", link.download);
  } catch (error) {
    console.error("❌ Error:", error);
    alert("Something went wrong: " + error.message);
  }
}

// ------------------ DELETE (direct without fetch first) ------------------
document.querySelector("#deattachButton").addEventListener("click", async () => {
  if (sharingCode.value === "") {
    alert("⚠️ Please enter a sharing code to delete file.");
    return;
  }

  const code = sharingCode.value.trim();

  if (!confirm(`⚠️ Are you sure you want to permanently delete the file with code: ${code}?`)) {
    return; // user cancelled
  }

  try {
    // Step 1: Fetch file info by code
    const response = await fetch(
      `https://api.github.com/repos/CODE-HUB07/SID-CODE/contents/uploads/${code}`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: "token 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",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert("Re-Check the Sharing Code \n Error Status : " + data.message);
      return;
    }

    const filePath = data[0].path;
    const fileSha = data[0].sha;

    // Step 2: Delete the file directly
    const deleteResponse = await fetch(
      `https://api.github.com/repos/CODE-HUB07/SID-CODE/contents/${filePath}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "token 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",
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
      console.error("❌ Delete failed:", result);
      alert("The file with this code is not Found Can you re-check the Code \n ","Error Status : " + result.message);
    }
  } catch (error) {
    console.error("❌ Error in delete:", error);
    alert("Something went wrong: " + error.message);
  }
});
