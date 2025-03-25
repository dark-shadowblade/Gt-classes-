document.addEventListener("DOMContentLoaded", function () {
    const contentDiv = document.getElementById("content");

    async function fetchPCloudLink(baseLink) {
        try {
            const response = await fetch(baseLink);
            if (!response.ok) throw new Error("Failed to fetch HTML content");

            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");

            // Extract publinkData from scripts
            const scriptTags = doc.querySelectorAll("script");
            let publinkDataScript = "";

            scriptTags.forEach((script) => {
                if (script.textContent.includes("publinkData")) {
                    publinkDataScript = script.textContent;
                }
            });

            if (publinkDataScript) {
                const dataMatch = publinkDataScript.match(/var publinkData = ({.*?});/s);
                if (dataMatch && dataMatch[1]) {
                    const publinkData = JSON.parse(dataMatch[1]);
                    if (publinkData && publinkData.variants && publinkData.variants[0]) {
                        return "https://p-def6.pcloud.com" + publinkData.variants[0].path;
                    }
                }
            }
            throw new Error("pCloud link not found");
        } catch (error) {
            console.error("Error fetching pCloud link:", error);
            return null;
        }
    }

    subjectsData.forEach((subject) => {
        subject.units.forEach((unit, unitIndex) => {
            const unitDiv = document.createElement("div");
            unitDiv.classList.add("unit");

            const unitHeader = document.createElement("h2");
            unitHeader.textContent = unit.name;
            unitDiv.appendChild(unitHeader);

            const unitContent = document.createElement("div");
            unitContent.classList.add("unit-content");

            unit.lectures.forEach(async (lecture, lectureIndex) => {
                const lectureDPPDiv = document.createElement("div");
                lectureDPPDiv.classList.add("lecture-dpp-pair");

                const lectureLink = document.createElement("a");
                lectureLink.textContent = `Lecture ${lectureIndex + 1}`;
                
                const pCloudLink = await fetchPCloudLink(lecture);
                if (pCloudLink) {
                    lectureLink.href = `player.html?subject=${encodeURIComponent(subject.subject)}&unit=${encodeURIComponent(unit.name)}&lecture=${encodeURIComponent(`Lecture ${lectureIndex + 1}`)}&video=${encodeURIComponent(pCloudLink)}&notes=${encodeURIComponent(unit.notes)}&dpp=${encodeURIComponent(unit.dpps[lectureIndex])}`;
                    lectureLink.target = "_blank";
                } else {
                    lectureLink.textContent = `Lecture ${lectureIndex + 1} (Unavailable)`;
                    lectureLink.style.color = "gray";
                    lectureLink.style.pointerEvents = "none";
                }

                lectureDPPDiv.appendChild(lectureLink);
                unitContent.appendChild(lectureDPPDiv);
            });

            unitDiv.appendChild(unitContent);
            contentDiv.appendChild(unitDiv);

            unitHeader.addEventListener("click", () => {
                unitContent.style.display = unitContent.style.display === "none" ? "block" : "none";
            });
        });
    });
});
