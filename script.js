document.addEventListener("DOMContentLoaded", function () {
    const content = document.getElementById("content");
    const searchInput = document.getElementById("searchInput");
    const darkModeToggle = document.getElementById("darkModeToggle");

    // Function to render the subjects
    function renderUnits() {
        content.innerHTML = "";
        subjects.forEach((unit, index) => {
            let unitDiv = document.createElement("div");
            unitDiv.classList.add("unit");

            let unitTitle = document.createElement("h2");
            unitTitle.textContent = unit.name;

            let notesLink = document.createElement("a");
            notesLink.href = unit.notes;
            notesLink.textContent = "Download Combined Notes";
            notesLink.target = "_blank";

            let lecturesList = document.createElement("div");
            lecturesList.innerHTML = "<h3>Lectures:</h3>";
            unit.lectures.forEach((lecture, i) => {
                let lectureLink = document.createElement("a");
                lectureLink.href = lecture;
                lectureLink.textContent = `Lecture ${i + 1}`;
                lectureLink.target = "_blank";
                lecturesList.appendChild(lectureLink);
            });

            let dppList = document.createElement("div");
            dppList.innerHTML = "<h3>Daily Practice Problems:</h3>";
            unit.dpps.forEach((dpp, i) => {
                let dppLink = document.createElement("a");
                dppLink.href = dpp;
                dppLink.textContent = `DPP ${i + 1}`;
                dppLink.target = "_blank";
                dppList.appendChild(dppLink);
            });

            unitDiv.appendChild(unitTitle);
            unitDiv.appendChild(notesLink);
            unitDiv.appendChild(lecturesList);
            unitDiv.appendChild(dppList);

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
