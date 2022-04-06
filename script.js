
let caret_pos = 0;
let lesson_str = [];
let lesson_element = document.getElementById("words");
let letter_elements = document.getElementById("words").getElementsByClassName("letter");

// Word bank, list
let word_bank = [];
    // Demo: Populate "word_bank" via sentence string
    let example_phrase = "The quick brown fox jumps over the lazy dog Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    word_bank = word_bank.concat(example_phrase.split(" "));

// Carret
let caret_element = document.createElement("div");
caret_element.classList.add("caret");

function setCaretPos(input) {
    caret_pos = input;

    // Quick option
    //if(input >= 1) {    
    //    letter_elements[input-1].classList.add("passed");
    //}
    
    // Over-engineered
    for(let i = 0; i < letter_elements.length; i++) {
        if(i < caret_pos) {
            letter_elements[i].classList.add("passed")
        } else { 
            letter_elements[i].classList.remove("passed");
        }
    }
    

    caret_element.style.transition = "150ms";
    caret_element.style.position = "absolute";
    caret_element.style.top    = letter_elements[input].offsetTop  + "px";
    caret_element.style.left   = letter_elements[input].offsetLeft + "px";
    caret_element.style.width  = letter_elements[input].clientWidth  + "px";
    caret_element.style.height = letter_elements[input].clientHeight + "px";
}

function generateLesson(length_input) {
    // Cleanup
    caret_pos = 0;
    lesson_str = [];
    // Remove old words
    if (letter_elements.length >= 1) {
        let element_rem_count = document.getElementById("words").children.length;
        for(let i = 0; i < element_rem_count; i++) {
            document.getElementById("words").children[0].remove();
        }
    }

    // Generate randomized string
    for(let i = 0; i < length_input; i++) {
        lesson_str.push(word_bank[Math.floor(Math.random() * word_bank.length)].toLowerCase());
    }

    // Populate page with said string, word by word
    for(let word = 0; word < lesson_str.length; word++) {

        let current_word = lesson_str[word];

        let word_element = document.createElement("span");
        word_element.classList.add("word");

        // Add individual letters into .word span as .letter span's
        for(let word_letter = 0; word_letter < lesson_str[word].length; word_letter++) {
            let letter_element = document.createElement("span");
            letter_element.classList.add("letter");
            letter_element.innerHTML = lesson_str[word][word_letter];
            word_element.appendChild(letter_element);

            // Add space after word, if this isn't the last word.
            if(word < lesson_str.length - 1 && word_letter == lesson_str[word].length - 1) {
                let space_element = document.createElement("span");
                space_element.classList.add("space");
                space_element.classList.add("letter");
                space_element.innerHTML = "_";
                word_element.appendChild(space_element);
            }
        }
        lesson_element.appendChild(word_element);
    }

    document.getElementById("words").appendChild(caret_element);
    resetLesson()
}

function resetLesson() {
    setCaretPos(0);
    lesson_time_start = new Date();
    for(let i = 0; i < letter_elements.length; i++) {
        letter_elements[i].classList.remove("failed");
    }
    debugLog("Lesson Reset")
}

let debug_term_element = document.createElement("div");
debug_term_element.style.position = "fixed";
debug_term_element.style.top = "0px"
debug_term_element.style.right = "0px"
debug_term_element.style.width = "300px";
debug_term_element.style.height = "100%";
debug_term_element.style.background = "#222D";
debug_term_element.style.color = "#FFF";
debug_term_element.style.fontFamily = "Roboto Mono";
debug_term_element.style.overflowY = "scroll";
document.body.appendChild(debug_term_element)

function debugLog(input) {
    let entry_element = document.createElement("p");
    entry_element.style.margin = "4px";
    entry_element.style.background = "#111";
    entry_element.style.padding = "2px";
    entry_element.style.fontSize = "10px";

    entry_element.innerHTML = input;
    debug_term_element.appendChild(entry_element);
    entry_element.scrollIntoView();
    return entry_element;
}

debugLog("Debug Term initiated")

let lesson_words = 10;
let lesson_time_start = 0;

document.addEventListener("keydown", function(event) {

    if (caret_pos == 0) {
        resetLesson();
    }

    if (event.key == letter_elements[caret_pos].innerHTML || (letter_elements[caret_pos].innerHTML == "_" && event.key == " ")) {
        if(caret_pos < letter_elements.length - 1) {
            caret_pos++; // Move to next letter succesfully
        } else {
            let lesson_time_ms = Date.now() - lesson_time_start.getTime();
            let lesson_time_wpm = Math.round( ( lesson_words / ( ( lesson_time_ms / 1000 ) / 60) ) * 100 ) / 100

            debugLog("Lesson finished!<br>Length (ms): " + lesson_time_ms + "<br>WordsPerMin: " + lesson_time_wpm);
            generateLesson(lesson_words)
        }
    } else if(event.key == "Backspace") {
        if(caret_pos > 0) { 
            caret_pos--; // Backspace 1 character
        } else {
            resetLesson(); // If backspace on beginning, reset.
        }
    } else if(event.key == "Escape") { // Reset on "Esc"
        resetLesson();
    } else {
        letter_elements[caret_pos].classList.add("failed");
    }
    setCaretPos(caret_pos);
})

generateLesson(lesson_words);