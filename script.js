const sudokuElement = document.getElementById("sudoku");
const btnNewSudoku = document.getElementById("new-sudoku");
const btnSolveSudoku = document.getElementById("solve-sudoku");
const boxElements = sudokuElement.getElementsByTagName("td");
const keyboardElement = document.getElementById("keyboard");
const keyboardSmallElement = document.getElementById("keyboard-small");
const keyboardToKeyboardSmallElement = document.getElementById("keyboard__to-keyboard-small");
const keyboardSmallToKeyboardElement = document.getElementById("keyboard-small__to-keyboard");
const mainInputElement = document.getElementById("main-input");
const keyboardKeyElements = document.getElementsByClassName("key");
const smallKeyboardKeyElements = document.getElementsByClassName("min-key");
const table = new Sudoku.Table();

let solved = false;
let selectedBox = null;
let selectedBoxIndex = -1;

(function() {
    for(let y = 0; y < 9; y++) {
        const tr = document.createElement("tr");
        sudokuElement.appendChild(tr);
        for(let x = 0; x < 9; x++) {
            const boxData = Sudoku.Util.indexToCasteData(y * 9 + x);
            const td = document.createElement("td");
            tr.appendChild(td);
            if(boxData.boxArrayIndex % 2 === 0) {
                td.classList.add("box-straight");
            }
        }
    }

    if(generateSudoku(table)) {
        displayTable(table);
        
    } else {
        console.error("Generation failed");
    }

    let boxCount = 0;

    Array.from(boxElements).forEach(function(box) {
        const boxIndex = boxCount;
        ++boxCount;
        box.dataset.index = boxIndex;
        box.addEventListener("click", function(event) {
            if(selectedBoxIndex !== boxIndex) {
                if(selectedBox) {
                    selectedBox.classList.remove("selected");
                }
                selectedBox = box;
                selectedBoxIndex = boxIndex;
                selectedBox.classList.add("selected");

                if(selectedBox.classList.contains("solid")) {
                    mainInputElement.classList.add("inactive");
                    selectedBox.classList.add("invalid");
                } else {
                    mainInputElement.classList.remove("inactive");
                    selectedBox.classList.remove("invalid");
                }
            }
        });
    });

    Array.from(keyboardKeyElements).forEach(function(key) {
        key.addEventListener("click", function(event) {
            if(selectedBox && !selectedBox.classList.contains("solid")) {
                selectedBox.innerText = key.innerText;
                table.real[parseInt(selectedBox.dataset.index)].set("\xa0" + key.innerText + "\xa0");
                selectedBox.classList.add("full-number");
                selectedBox.classList.remove("multiple-numbers");
            }
        });
    });

    Array.from(smallKeyboardKeyElements).forEach(function(key) {
        if(!key.classList.contains("up")) {
            key.addEventListener("click", function(event) {
                if(selectedBox && !selectedBox.classList.contains("solid")) {
                    if(!selectedBox.classList.contains("multiple-numbers")) {
                        selectedBox.innerHTML = "";
                        selectedBox.appendChild(createSeveralNumberBox());
                    }
                    selectedBox.classList.add("multiple-numbers");
                    selectedBox.classList.remove("full-number");
    
                    const table = selectedBox.getElementsByTagName("table");
                    const td = selectedBox.getElementsByTagName("td");
                    if(td[parseInt(key.innerText) - 1].innerText.length > 0) {
                        td[parseInt(key.innerText) - 1].innerText = "";
                    } else {
                        td[parseInt(key.innerText) - 1].innerText = key.innerText;
                    }
                }
            });
        }
    });
})();

function createSeveralNumberBox() {
    const table = document.createElement("table");
    for(let i = 0; i < 3; i++) {
        const row = document.createElement("tr");
        table.appendChild(row);

        for(let j = 0; j < 3; j++) {
            const td = document.createElement("td");
            td.classList.add("number-field");
            row.appendChild(td);
        }
    }

    return table;
}

document.body.addEventListener("click", function(event) {
    if(event.target === document.body && selectedBox) {
        selectedBox.classList.remove("invalid");
        selectedBox.classList.remove("selected");
        selectedBox = null;
        mainInputElement.classList.add("inactive");
        selectedBoxIndex = -1;
    }
});

keyboardSmallToKeyboardElement.addEventListener("click", function(event) {
    keyboardSmallElement.classList.remove("active");
    keyboardElement.classList.add("active");
});

keyboardToKeyboardSmallElement.addEventListener("click", function(event) {
    keyboardSmallElement.classList.add("active");
    keyboardElement.classList.remove("active");
});

btnNewSudoku.addEventListener("click", function(event) {
    generateSudoku(table);
    displayTable(table);
});

btnSolveSudoku.addEventListener("click", function(event) {
    if(!solved) {
        solved = true;
        solveSudoku(table);
        displayTable(table);
    }
});

function generateSudoku(table) {
    solved = false;
    table.clear();
    const rt = Sudoku.Backtrack.full(table, Sudoku.Backtrack.Generation);
    Sudoku.Erase.createFillable(table, Sudoku.Erase.Mode.HARDEST, Sudoku.Erase.Checkover.CLEAN);
    return rt;
}

function displayTable(table) {
    Array.from(boxElements).forEach(function(box) {
        box.classList.remove("solid");
    });

    if(boxElements.length === 81) {
        for(let y = 0; y < 9; y++) {
            for(let x = 0; x < 9; x++) {
                boxElements[y * 9 + x].innerText = table.real[y * 9 + x].isEmpty() ? "\xa0\xa0\xa0" : table.real[y * 9 + x].get();
                if(!table.real[y * 9 + x].isChangeable()) {
                    boxElements[y * 9 + x].classList.add("solid");

                }
            }
        }
    } else {
        console.error("Sudoku display does not have 81 cells...");
    }
}

function solveSudoku(table) {
    if(!Sudoku.Backtrack.full(table, Sudoku.Backtrack.Generation)) {
        console.error("Sudoku isn't valid");
    }
}