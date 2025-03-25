// Function to render subjects and units
function renderUnits() {
    const content = document.getElementById("content");
    content.innerHTML = "";

    subjectsData.forEach(subject => {
        subject.units.forEach(unit => {
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

                let lectureLink = document.createElement("a");
                lectureLink.textContent = `📌 Lecture ${i + 1}`;
                lectureLink.href = "#";
                lectureLink.style.cursor = "pointer";
                lectureLink.addEventListener("click", (event) => {
                    event.preventDefault();
                    fetchAndPlayLecture(subject.subject, unit.name, `Lecture ${i + 1}`, unit.lectures[i]);
                });

                let dppLink = document.createElement("a");
                dppLink.href = unit.dpps[i] || "#";
                dppLink.textContent = `📌 DPP ${i + 1}`;
                dppLink.target = "_blank";

                lectureDppPair.appendChild(lectureLink);
                lectureDppPair.appendChild(dppLink);
                lecturesDppList.appendChild(lectureDppPair);
            }

            contentDiv.appendChild(notesLink);
            contentDiv.appendChild(lecturesDppList);

            unitDiv.appendChild(unitTitle);
            unitDiv.appendChild(contentDiv);
            content.appendChild(unitDiv);
        });
    });
}

// Function to fetch and play lecture inside an iframe
async function fetchAndPlayLecture(subject, unitName, lectureTitle, fetchUrl) {
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("Failed to fetch lecture data");

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
            const dataMatch = publinkDataScript.match(/var publinkData = ({.*?});/s);
            if (dataMatch && dataMatch[1]) {
                const publinkData = JSON.parse(dataMatch[1]);
                if (publinkData && publinkData.variants && publinkData.variants[0]) {
                    const fullLink = `https://p-def6.pcloud.com${publinkData.variants[0].path}`;
                    playLecture(subject, unitName, lectureTitle, fullLink);
                } else {
                    alert("Error: Lecture path not found.");
                }
            } else {
                alert("Error: Could not extract lecture data.");
            }
        } else {
            alert("Error: publinkData script not found.");
        }
    } catch (error) {
        alert("Error fetching lecture: " + error.message);
    }
}

// Function to display lecture in iframe
function playLecture(subject, unitName, lectureTitle, lectureUrl) {
    let playerDiv = document.getElementById("player-container");
    let playerTitle = document.getElementById("player-title");
    let lectureFrame = document.getElementById("lecture-frame");

    playerTitle.textContent = `${subject} - ${unitName} - ${lectureTitle}`;
    lectureFrame.src = lectureUrl;
    playerDiv.style.display = "block";
}

// Call render function
renderUnits();
