async function fetchLectureLink(baseLink) {
    try {
        const response = await fetch(baseLink);
        if (!response.ok) throw new Error("Failed to fetch HTML content");

        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        // Find the script containing publinkData
        const scriptTags = doc.querySelectorAll("script");
        let publinkDataScript = "";

        scriptTags.forEach(script => {
            if (script.textContent.includes("publinkData")) {
                publinkDataScript = script.textContent;
            }
        });

        if (publinkDataScript) {
            const dataMatch = publinkDataScript.match(/var publinkData = ({.*?});/s);
            if (dataMatch && dataMatch[1]) {
                const publinkData = JSON.parse(dataMatch[1]);
                if (publinkData.variants && publinkData.variants[0]) {
                    return "https://p-def6.pcloud.com" + publinkData.variants[0].path;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Error fetching lecture link:", error);
        return null;
    }
}

async function renderUnits() {
    content.innerHTML = "";
    for (const unit of subjects) {
        let unitDiv = document.createElement("div");
        unitDiv.classList.add("unit");

        let unitTitle = document.createElement("h2");
        unitTitle.textContent = unit.name;
        unitTitle.addEventListener("click", function () {
            let contentDiv = unitDiv.querySelector(".unit-content");
            contentDiv.style.display = contentDiv.style.display === "block" ? "none" : "block";
        });

        let contentDiv = document.createElement("div");
        contentDiv.classList.add("unit-content");

        let notesLink = document.createElement("a");
        notesLink.href = unit.notes;
        notesLink.textContent = "📄 Download Combined Notes";
        notesLink.target = "_blank";

        let lecturesDppList = document.createElement("div");
        lecturesDppList.innerHTML = "<h3>🎥 Lectures & 📝 DPPs:</h3>";

        for (let i = 0; i < unit.lectures.length; i++) {
            let lectureDppPair = document.createElement("div");
            lectureDppPair.classList.add("lecture-dpp-pair");

            let lectureBaseLink = unit.lectures[i]; // pCloud public link

            let lectureLink = document.createElement("a");
            lectureLink.textContent = `📌 Lecture ${i + 1}`;
            lectureLink.target = "_blank";

            let dppLink = document.createElement("a");
            dppLink.href = unit.dpps[i] || "#";
            dppLink.textContent = `📌 DPP ${i + 1}`;
            dppLink.target = "_blank";

            // Fetch the actual lecture link dynamically
            fetchLectureLink(lectureBaseLink).then(actualLectureLink => {
                if (actualLectureLink) {
                    lectureLink.href = actualLectureLink;
                } else {
                    lectureLink.href = "#"; // Prevent broken links
                    lectureLink.style.color = "red"; // Indicate error
                }
            });

            lectureDppPair.appendChild(lectureLink);
            lectureDppPair.appendChild(dppLink);
            lecturesDppList.appendChild(lectureDppPair);
        }

        contentDiv.appendChild(notesLink);
        contentDiv.appendChild(lecturesDppList);

        unitDiv.appendChild(unitTitle);
        unitDiv.appendChild(contentDiv);
        content.appendChild(unitDiv);
    }
}

// Call render function
renderUnits();
