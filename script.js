const form = document.getElementById("resultForm");
const resultDiv = document.getElementById("result");
const nameInput = document.getElementById("studentName");
const rollInput = document.getElementById("rollNumber");

const subjectIds = [
    "maths",
    "science",
    "english",
    "socialScience",
    "computer"
];

const subjectInputs = subjectIds.map(function (id) {
    return document.getElementById(id);
});

const allInputs = [nameInput, rollInput, ...subjectInputs];


// 1. Validate each field
function validateField(input) {
    const value = input.value.trim();
    let isValid = true;

    if (input === nameInput) {
        isValid = value.length >= 3;
    } else if (input === rollInput) {
        isValid = value !== "";
    } else {
        const marks = Number(value);

        isValid =
            value !== "" &&
            Number.isFinite(marks) &&
            marks >= 0 &&
            marks <= 100;
    }

    input.classList.remove("is-valid", "is-invalid");

    if (isValid) {
        input.classList.add("is-valid");
    } else {
        input.classList.add("is-invalid");
    }

    return isValid;
}


// 2. Calculate total marks using a loop
function calculateTotal(marks) {
    let total = 0;

    for (let i = 0; i < marks.length; i++) {
        total += marks[i];
    }

    return total;
}


// 3. Calculate grade using switch
function getGrade(percentage) {
    switch (Math.floor(percentage / 10)) {
        case 10:
        case 9:
            return "A+";
        case 8:
            return "A";
        case 7:
            return "B";
        case 6:
            return "C";
        case 5:
            return "D";
        default:
            return "E";
    }
}


// 4. Check pass or fail
function checkPass(marks) {
    for (let i = 0; i < marks.length; i++) {
        if (marks[i] < 35) {
            return false;
        }
    }

    return true;
}


// 5. Prevent user input from being interpreted as HTML
function escapeHTML(value) {
    const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return value.replace(/[&<>"']/g, function (character) {
        return entities[character];
    });
}


// 6. Display the result
function showResult(name, roll, total, percentage, grade, passed) {
    const statusClass = passed ? "success" : "danger";
    const statusText = passed ? "PASS" : "FAIL";

    resultDiv.innerHTML = `
        <div class="card shadow-sm border-0">
            <div class="card-header bg-primary text-white py-3">
                <h5 class="mb-0">Student Result</h5>
            </div>

            <div class="card-body p-4">
                <h4 class="fw-bold">${escapeHTML(name)}</h4>

                <p class="text-secondary mb-3">
                    Roll Number: ${escapeHTML(roll)}
                </p>

                <hr>

                <div class="row text-center">
                    <div class="col-6 col-md-3 mb-3">
                        <p class="text-secondary mb-1">Total Marks</p>
                        <h4>${total} / 500</h4>
                    </div>

                    <div class="col-6 col-md-3 mb-3">
                        <p class="text-secondary mb-1">Percentage</p>
                        <h4>${percentage.toFixed(2)}%</h4>
                    </div>

                    <div class="col-6 col-md-3 mb-3">
                        <p class="text-secondary mb-1">Grade</p>
                        <h4>${grade}</h4>
                    </div>

                    <div class="col-6 col-md-3 mb-3">
                        <p class="text-secondary mb-1">Status</p>
                        <h4 class="text-${statusClass}">${statusText}</h4>
                    </div>
                </div>

                ${
                    passed
                        ? `<div class="alert alert-success mb-0">
                               Congratulations! The student passed all subjects.
                           </div>`
                        : `<div class="alert alert-danger mb-0">
                               The student failed because at least one subject has marks below 35.
                           </div>`
                }
            </div>
        </div>
    `;
}


// 7. Validate fields when the user types
allInputs.forEach(function (input) {
    input.addEventListener("input", function () {
        validateField(input);
        resultDiv.innerHTML = "";
    });
});


// 8. Handle form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();

    let formIsValid = true;

    for (let i = 0; i < allInputs.length; i++) {
        if (!validateField(allInputs[i])) {
            formIsValid = false;
        }
    }

    if (!formIsValid) {
        resultDiv.innerHTML = "";
        return;
    }

    const name = nameInput.value.trim();
    const roll = rollInput.value.trim();
    const marks = [];

    for (let i = 0; i < subjectInputs.length; i++) {
        marks.push(Number(subjectInputs[i].value));
    }

    const total = calculateTotal(marks);
    const percentage = (total / 500) * 100;
    const grade = getGrade(percentage);
    const passed = checkPass(marks);

    showResult(name, roll, total, percentage, grade, passed);
});


// 9. Reset the form
form.addEventListener("reset", function () {
    setTimeout(function () {
        allInputs.forEach(function (input) {
            input.classList.remove("is-valid", "is-invalid");
        });

        resultDiv.innerHTML = "";
    }, 0);
});
