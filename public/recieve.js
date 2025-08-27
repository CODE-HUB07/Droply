    let sharingCode = document.querySelector("#code").value.toUpperCase();
    let fetchButton = document.querySelector(".fetch-btn");

    fetchButton.addEventListener("click", () => {
      if (sharingCode === "") {
        alert("Please enter a sharing code.");
        return;
      }
      fetchFilesByCode(sharingCode);
    });

    // 🔹 Fetch files by sharing code
    async function fetchFilesByCode(sharingCode) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/CODE-HUB07/SID-CODE/contents/uploads/${sharingCode}`,
          {
            method: "GET",
            headers: {
              "Accept": "application/vnd.github.v3+json",
              "Authorization": "token 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"
            }
          }
        );

        const data = await response.json();
        console.log("📂 Files response:", data);

        if (!response.ok) {
          alert("❌ Error: " + data.message);
          return;
        }
        downloadAndDelete(data[0].path, data[0].sha);
        
      } catch (error) {
        console.error("❌ Error:", error);
        alert("Something went wrong: " + error.message);
      }
    }

    // 🔹 Download then delete
    async function downloadAndDelete(filePath, fileSha) {
      try {
        console.log("📥 Fetching metadata for:", filePath);

        // Step 1: Get metadata
        const metaResponse = await fetch(
          `https://api.github.com/repos/CODE-HUB07/SID-CODE/contents/${filePath}`,
          {
            headers: {
              "Authorization": "token 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",
              "Accept": "application/vnd.github.v3+json"
            }
          }
        );

        const fileData = await metaResponse.json();
        console.log("🔍 Metadata:", fileData);

        if (!metaResponse.ok) {
          alert("❌ Error fetching file metadata: " + fileData.message);
          return;
        }

        // Step 2: Fetch file binary
        const fileResponse = await fetch(fileData.download_url);
        const blob = await fileResponse.blob();

        // Step 3: Trigger download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filePath.split("/").pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);
        console.log("📥 Download started for:", link.download);

        // Step 4: Delete after delay
        fileSize = fileData.size;
   const fileSizeMB = fileSize / (1024 * 1024); // convert to MB

let delay;

// Progressive calculation
if (fileSizeMB <= 10) {
  delay = 90_000; // 1.5 min
} else {
  // base 1.5 min + 1 min per extra 10MB
  const steps = Math.ceil(fileSizeMB / 10) - 1; 
  delay = 90_000 + steps * 60_000;
}

// Cap at 5 min
if (delay > 300_000) {
  delay = 300_000;
}

console.log(
  `File size: ${fileSizeMB.toFixed(2)} MB → Delay: ${(delay / 60000).toFixed(2)} min`
);
setTimeout(async () => {
  console.log("🗑️ Deleting file:", filePath);

  const deleteResponse = await fetch(
    `https://api.github.com/repos/CODE-HUB07/SID-CODE/contents/${filePath}`,
    {
      method: "DELETE",
      headers: {
        "Authorization": "token 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", 
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: `Delete ${filePath} after download`,
        sha: fileSha
      }),
    }
  );

  const result = await deleteResponse.json();
  if (deleteResponse.ok) {
    alert(`✅ File deleted from repo: ${filePath}`);
    console.log("🗑️ Delete success:", result);
  } else {
    console.error("❌ Delete failed:", result);
    alert("❌ Delete failed: " + result.message);
  }
}, delay);


      } catch (error) {
        console.error("❌ Error in download/delete:", error);
        alert("Something went wrong: " + error.message);
      }

    }



