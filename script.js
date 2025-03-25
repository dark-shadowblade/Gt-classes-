async function fetchLectureLink(pCloudLink) {
    try {
        const response = await fetch(pCloudLink);
        if (!response.ok) throw new Error("Failed to fetch HTML content");

        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        let scriptTags = doc.querySelectorAll("script");
        let publinkDataScript = "";

        scriptTags.forEach(script => {
            if (script.textContent.includes("publinkData")) {
                publinkDataScript = script.textContent;
            }
        });

        if (publinkDataScript) {
            let dataMatch = publinkDataScript.match(/var publinkData = ({.*?});/s);
            if (dataMatch && dataMatch[1]) {
                let publinkData = JSON.parse(dataMatch[1]);
                if (publinkData.variants && publinkData.variants[0]) {
                    return "https://p-def6.pcloud.com" + publinkData.variants[0].path;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Error fetching pCloud link:", error);
        return null;
    }
}

// Function to render units and lectures
async function renderUnits() {
    const content = document.getElementById("content");
    content.innerHTML = "";

    for (const subject of subjectsData) {
        for (const unit of subject.units) {
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
            notesLink.textContent = "📄 Download Notes";
            notesLink.target = "_blank";

            let lecturesDppList = document.createElement("div");
            lecturesDppList.innerHTML = "<h3>🎥 Lectures & 📝 DPPs:</h3>";

            for (let i = 0; i < unit.lectures.length; i++) {
                let lectureDppPair = document.createElement("div");
                lectureDppPair.classList.add("lecture-dpp-pair");

                // Fetch lecture link dynamically
                let lectureLink = await fetchLectureLink(unit.lectures[i]);

                let lectureElement = document.createElement("a");
                lectureElement.href = "#";
                lectureElement.textContent = `Lecture ${i + 1}`;
                if (lectureLink) {
                    lectureElement.addEventListener("click", function (event) {
                        event.preventDefault();
                        playLecture(subject.subject, unit.name, `Lecture ${i + 1}`, lectureLink, unit.notes, unit.dpps[i]);
                    });
                } else {
                    lectureElement.style.color = "red";
                    lectureElement.textContent += " (Unavailable)";
                }

                let dppLink = document.createElement("a");
                dppLink.href = unit.dpps[i];
                dppLink.textContent = `DPP ${i + 1}`;
                dppLink.target = "_blank";

                lectureDppPair.appendChild(lectureElement);
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
}

// Function to play lecture inside iframe
function playLecture(subject, unit, lectureTitle, lectureLink, notesLink, dppLink) {
    document.getElementById("player-container").style.display = "block";
    document.getElementById("player-title").textContent = `${subject} - ${unit} - ${lectureTitle}`;
    document.getElementById("lecture-frame").src = lectureLink;
    document.getElementById("notes-btn").href = notesLink;
    document.getElementById("dpp-btn").href = dppLink;
}

// Load the units and lectures dynamically
window.onload = renderUnits;
