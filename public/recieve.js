    let sharingCode = document.querySelector("#code");
    let fetchButton = document.querySelector(".fetch-btn");

    fetchButton.addEventListener("click", () => {
      if (sharingCode.value === "") {
        alert("Please enter a sharing code.");
        return;
      }
      fetchFilesByCode(sharingCode.value.toUpperCase());
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
       

      } catch (error) {
        console.error("❌ Error in download/delete:", error);
        alert("Something went wrong: " + error.message);
      }

    }





