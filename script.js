const sudokuElement = document.getElementById("sudoku");
const btnNewSudoku = document.getElementById("new-sudoku");
const btnSolveSudoku = document.getElementById("solve-sudoku");
const boxElements = sudokuElement.getElementsByClassName("box");
const keyboardElement = document.getElementById("keyboard");
const keyboardSmallElement = document.getElementById("keyboard-small");
const keyboardToKeyboardSmallElement = document.getElementById("keyboard__to-keyboard-small");
const keyboardSmallToKeyboardElement = document.getElementById("keyboard-small__to-keyboard");
const mainInputElement = document.getElementById("main-input");
const keyboardKeyElements = document.getElementsByClassName("key");
const smallKeyboardKeyElements = document.getElementsByClassName("min-key");
const mainInputExtraElement = document.getElementById("main-input__extra");
const kHolderElement = document.getElementById("k-holder");
const menuHolderElement = document.getElementById("menu-holder");
const buttonCreateSudokuSelectDifficultyElement = document.getElementById("btn-new-sudoku__select-difficulty");
const buttonCreateSudokuListHolder = document.getElementById("btn-new-sudoku__list-holder");
const buttonCreateSudokuList = document.getElementById("btn-new-sudoku__list");
const switchMarkErrorsElement = document.getElementById("switch-mark-errors");
const table = new Sudoku.Table();
let fullTable = null;

let solved = false;
let selectedBox = null;
let selectedBoxIndex = -1;

let sudokuModeSelected = "MIDDLE";
let markingErrors = false;
let sudokuCorrectlyFilled = false;

window.mobileAndTabletcheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

(function() {
    for(let y = 0; y < 9; y++) {
        const tr = document.createElement("tr");
        sudokuElement.appendChild(tr);
        for(let x = 0; x < 9; x++) {
            const boxData = Sudoku.Util.indexToCasteData(y * 9 + x);
            const td = document.createElement("td");
            td.classList.add("box");
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
            if(sudokuCorrectlyFilled)
                return;
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
        if(!key.classList.contains("down")) {
            key.addEventListener("click", function(event) {
                if(selectedBox && !selectedBox.classList.contains("solid")) {
                    if(selectedBox.innerText === key.innerText) {
                        selectedBox.innerText = "\xa0\xa0\xa0";
                        table.real[parseInt(selectedBox.dataset.index)].set(0);
                        selectedBox.classList.remove("full-number");
                        selectedBox.classList.remove("multiple-numbers");
                    } else {
                        selectedBox.innerText = key.innerText;
                        table.real[parseInt(selectedBox.dataset.index)].set(key.innerText);
                        selectedBox.classList.add("full-number");
                        selectedBox.classList.remove("multiple-numbers");
                        if(markingErrors) {
                            if(parseInt(key.innerText) !== fullTable.real[parseInt(selectedBox.dataset.index)].get()) {
                                selectedBox.classList.add("error");
                            } else {
                                selectedBox.classList.remove("error");
                            }
                        }
                        if(sudokuCorrect(table, fullTable)) {
                            sudokuCorrectlyFilled = true;
                            mainInputElement.classList.add("inactive");
                            sudokuElement.classList.add("correct");
                            createSolvedElement();
                        }
                    }
                }
            });
        }
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
                    table.real[parseInt(selectedBox.dataset.index)].set(0);
                    selectedBox.classList.remove("error");
    
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

    mainInputExtraElement.addEventListener("click", function(event) {
        if(mainInputElement.classList.contains("menu")) {
            mainInputElement.classList.remove("menu");
            kHolderElement.classList.remove("inactive");
            menuHolderElement.classList.remove("active");
        } else {
            mainInputElement.classList.add("menu");
            kHolderElement.classList.add("inactive");
            menuHolderElement.classList.add("active");
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

buttonCreateSudokuList.addEventListener("click", function(event) {
    if(event.target.classList.contains("item")) {
        sudokuModeSelected = event.target.innerText;
        buttonCreateSudokuListHolder.classList.remove("active");
    }
});

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

switchMarkErrorsElement.addEventListener("click", function(event) {
    switchMarkErrorsElement.classList.toggle("active");
    if(switchMarkErrorsElement.classList.contains("active")) {
        let index = -1;
        markingErrors = true;
        const errors = tableFilledBoxesEqual(table, fullTable);
        errors.forEach(function(id) {
            boxElements[id].classList.add("error");
        });
    } else {
        markingErrors = false;
        Array.from(boxElements).forEach(function(box) {
            box.classList.remove("error");
        });
    }
});

btnNewSudoku.addEventListener("click", function(event) {
    if(event.target === btnNewSudoku) {
        solved = false;
        generateSudoku(table);
        displayTable(table);
    } else if(event.target === buttonCreateSudokuSelectDifficultyElement) {
        buttonCreateSudokuListHolder.classList.toggle("active");
    }
});

btnSolveSudoku.addEventListener("click", function(event) {
    if(!solved) {
        solved = true;
        solveSudoku(table);
        displayTable(table);
    }
});

function createSolvedElement() {
    const sudokuSolvedElement = document.createElement("div");
    sudokuSolvedElement.classList.add("sudoku-solved");

    const buttonElement = document.createElement("div");
    buttonElement.classList.add("button");

    const buttonTitleElement = document.createElement("p");
    buttonTitleElement.classList.add("title");
    buttonTitleElement.innerText = "Next";

    const textElement = document.createElement("p");
    textElement.classList.add("text");
    textElement.innerText = "Sudoku Solved!";

    buttonElement.addEventListener("click", function(event) {
        generateSudoku(table);
        displayTable(table);
        sudokuSolvedElement.remove();
    });

    buttonElement.appendChild(buttonTitleElement);
    
    sudokuSolvedElement.appendChild(buttonElement);
    sudokuSolvedElement.appendChild(textElement);

    document.getElementsByTagName("main")[0].appendChild(sudokuSolvedElement);
}

function generateSudoku(table) {
    sudokuElement.classList.remove("correct");
    sudokuCorrectlyFilled = false;
    solved = false;
    table.clear();
    const rt = Sudoku.Backtrack.full(table, Sudoku.Backtrack.Generation);
    fullTable = new Sudoku.Table(table);
    let mode = null;
    switch(sudokuModeSelected) {
        case "HARD":
            mode = Sudoku.Erase.Mode.HARDEST;
        break;

        case "EASY":
            mode = 16;
        break;

        case "MIDDLE":
        default:
            mode = 36;
        break;
    }
    Sudoku.Erase.createFillable(table, mode, Sudoku.Erase.Checkover.CLEAN);
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

function tableFilledBoxesEqual(table, fullTable) {
    const arr = [];
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            const number = table.rows[i].get(j).get();
            if(number > 0 && number != fullTable.rows[i].get(j).get()) {
                arr.push(i * 9 + j);
            }
        }
    }
    return arr;
}

function sudokuCorrect(table, fullTable) {
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            const number = table.rows[i].get(j).get();
            if(number === 0 || number != fullTable.rows[i].get(j).get()) {
                return false;
            }
        }
    }
    return true;
}

function solveSudoku(table) {
    if(!Sudoku.Backtrack.full(table, Sudoku.Backtrack.Generation)) {
        console.error("Sudoku isn't valid");
    }
}