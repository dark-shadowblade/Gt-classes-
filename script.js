document.addEventListener("DOMContentLoaded", function () {
    const content = document.getElementById("content");
    const searchInput = document.getElementById("searchInput");
    const darkModeToggle = document.getElementById("darkModeToggle");

    function renderUnits() {
        content.innerHTML = "";
        subjects.forEach((unit, index) => {
            let unitDiv = document.createElement("div");
            unitDiv.classList.add("unit");

            // Unit Title (Clickable)
            let unitTitle = document.createElement("h2");
            unitTitle.textContent = unit.name;
            unitTitle.addEventListener("click", function () {
                let contentDiv = unitDiv.querySelector(".unit-content");
                contentDiv.style.display = contentDiv.style.display === "block" ? "none" : "block";
            });

            // Hidden Content (Lectures & DPPs)
            let contentDiv = document.createElement("div");
            contentDiv.classList.add("unit-content");

            let notesLink = document.createElement("a");
            notesLink.href = unit.notes;
            notesLink.textContent = "📄 Download Combined Notes";
            notesLink.target = "_blank";

            let lecturesDppList = document.createElement("div");
            lecturesDppList.innerHTML = "<h3>🎥 Lectures & 📝 DPPs:</h3>";

            // Pairing Lectures and DPPs side by side
            for (let i = 0; i < unit.lectures.length; i++) {
                let lectureDppPair = document.createElement("div");
                lectureDppPair.classList.add("lecture-dpp-pair");

                let lectureLink = document.createElement("a");
                lectureLink.href = unit.lectures[i];
                lectureLink.textContent = `📌 Lecture ${i + 1}`;
                lectureLink.target = "_blank";

                let dppLink = document.createElement("a");
                dppLink.href = unit.dpps[i] || "#"; // If no DPP, use #
                dppLink.textContent = `📌 DPP ${i + 1}`;
                dppLink.target = "_blank";

                lectureDppPair.appendChild(lectureLink);
                lectureDppPair.appendChild(dppLink);
                lecturesDppList.appendChild(lectureDppPair);
            }

            // Append everything
            contentDiv.appendChild(notesLink);
            contentDiv.appendChild(lecturesDppList);

            unitDiv.appendChild(unitTitle);
            unitDiv.appendChild(contentDiv);
            content.appendChild(unitDiv);
        });
    }

    // Initial render
    renderUnits();

    // Search Functionality
    searchInput.addEventListener("input", function () {
        let searchTerm = searchInput.value.toLowerCase();
        let units = document.querySelectorAll(".unit");

        units.forEach(unit => {
            let text = unit.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                unit.style.display = "block";
            } else {
                unit.style.display = "none";
            }
        });
    });

    // Dark Mode Toggle
    darkModeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            darkModeToggle.textContent = "☀️ Light Mode";
        } else {
            darkModeToggle.textContent = "🌙 Dark Mode";
        }
    });
});
