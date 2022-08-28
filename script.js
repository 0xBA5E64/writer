class log_entry {
    constructor() {
        this.date = new Date();
        this.log = [];
        this.duration = 0;
    }
    getSentence()       { return this.log.map((entry)=>{ return entry.letter }).reduce((out, entry)=> {return out + entry }) }
    getWordCount()      { return this.getSentence().split(" ").length };
    getWpm()            { return ( Math.round( ( this.getWordCount() / ( ( this.duration / 1000 ) / 60) ) * 100 ) / 100 ) };
    getMedianKeySpeed() { return this.log.map((entry) => { return entry.time }).sort((a,b)=>{return a-b})[Math.round(this.log.length/2)-1] };
    getAccuracy()       { return Math.floor(this.log.map((entry) => { if(entry.failed) {return 0} else {return 1} }).reduce((a,b)=>{return a+b})/this.log.length*100) };
}

class writer_app {
    constructor(lesson_element_input) {
        this.lesson_log = [];
        this.element = lesson_element_input;
        this.element.app = this;
        this.letter_elements = this.element.getElementsByClassName("letter");
        this.lesson = {
            time_start: 0,
            letter_time: 0,
            current_log_entry: {},
            lesson_str: {
                words: 10,
                word_bank: [],
                value: [],
                generate: function() {
                    this.value = [];
                    // Generate randomized string
                    for(let i = 0; i < this.words; i++) {
                        this.value.push(this.word_bank[Math.floor(Math.random() * this.word_bank.length)].toLowerCase());
                    }
                }
            }
        }
        this.carret = {
            app: this,
            element: document.createElement("div"),
            pos: 0,
            set_position: function(input) {
                this.pos = input;
            
                // Quick option
                //if(input >= 1) {    
                //    letter_elements[input-1].classList.add("passed");
                //}
                
                // Over-engineered
                for(let i = 0; i < this.app.letter_elements.length; i++) {
                    if(i < this.pos) {
                        this.app.letter_elements[i].classList.add("passed")
                    } else { 
                        this.app.letter_elements[i].classList.remove("passed");
                    }
                }
                
                this.element.style.transition = "150ms";
                this.element.style.position = "absolute";
                this.element.style.top    = this.app.letter_elements[input].offsetTop  + "px";
                this.element.style.left   = this.app.letter_elements[input].offsetLeft + "px";
                this.element.style.width  = this.app.letter_elements[input].clientWidth  + "px";
                this.element.style.height = this.app.letter_elements[input].clientHeight + "px";
            }
        }
        this.carret.element.classList.add("caret");
        this.element.tabIndex = "-1"
        this.element.addEventListener("keydown", this.handle_keypress);
    }
    reset() {
        // Cleanup
        this.carret.pos = 0;
        this.lesson.lesson_str.generate();
        // Remove old words
        if (this.letter_elements.length >= 1) {
            let element_rem_count = document.getElementById("words").children.length;
            for(let i = 0; i < element_rem_count; i++) {
                document.getElementById("words").children[0].remove();
            }
        }
    }

    generate() {
        this.reset();
        // Populate page with said string, word by word
        for(let word = 0; word < this.lesson.lesson_str.value.length; word++) {
    
            let current_word = this.lesson.lesson_str.value[word];
    
            let word_element = document.createElement("span");
            word_element.classList.add("word");
    
            // Add individual letters into .word span as .letter span's
            for(let word_letter = 0; word_letter < this.lesson.lesson_str.value[word].length; word_letter++) {
                let letter_element = document.createElement("span");
                letter_element.classList.add("letter");
                letter_element.innerHTML = this.lesson.lesson_str.value[word][word_letter];
                word_element.appendChild(letter_element);
    
                // Add space after word, if this isn't the last word.
                if(word < this.lesson.lesson_str.value.length - 1 && word_letter == this.lesson.lesson_str.value[word].length - 1) {
                    let space_element = document.createElement("span");
                    space_element.classList.add("space");
                    space_element.classList.add("letter");
                    space_element.innerHTML = "_";
                    word_element.appendChild(space_element);
                }
            }
            this.element.appendChild(word_element);
        }
    
        this.element.appendChild(this.carret.element);
        this.restart()
    }
    restart() {
        this.carret.set_position(0);
        this.lesson.time_start = new Date();
        this.lesson.letter_time = new Date();
        for(let i = this.letter_elements.length-1; i >= 0; i--) {
            
            this.letter_elements[i].classList.remove("failed");
    
            if(this.letter_elements[i].classList.contains("incorrect")) {
                this.letter_elements[i].remove();
            }
        }
        this.lesson.current_log_entry = new log_entry();
    }

    handle_keypress(event) {
        // When the presses a key at the start of the curren, restart current lesson
        // This is done as to not accumilate time on the first letter being pressed,-
        // and so that back-spacing allows for an ergonomic reset. 
        if (this.app.carret.pos == 0) {
            this.app.restart();
        }

        // If the user presses the *correct* current key...
        if (event.key == this.app.letter_elements[this.app.carret.pos].innerHTML || (this.app.letter_elements[this.app.carret.pos].innerHTML == "_" && event.key == " ")) {
            
            // Add key-press to current lesson log list
            this.app.lesson.current_log_entry.log.push({
                letter: this.app.letter_elements[this.app.carret.pos].innerHTML.replace("_", " "),
                time: (Date.now() - this.app.lesson.letter_time),
                failed: this.app.letter_elements[this.app.carret.pos].classList.contains("failed")
            });
            
            // Reset key-timer for next key (used to calculate per-key speed)
            this.app.lesson.letter_time = new Date();
            
            // Check if the user has reached the end of the sentence, with no remaining errors
            if (this.app.carret.pos == this.app.letter_elements.length - 1 && this.app.element.getElementsByClassName("incorrect").length == 0) {
                this.app.lesson.current_log_entry.date = new Date();
                this.app.lesson.current_log_entry.duration = Date.now() - this.app.lesson.time_start.getTime();
                this.app.lesson_log.push(this.app.lesson.current_log_entry);
                debugLog("Lesson Finished!<br>WPM: " + this.app.lesson_log[this.app.lesson_log.length-1].getWpm() + "<br>Sentence: <i>\"" + this.app.lesson_log[this.app.lesson_log.length-1].getSentence() + "\"</i><br>Complete Log: " + JSON.stringify(this.app.lesson_log[this.app.lesson_log.length-1], null, 1).replace(/(?:\r\n|\r|\n)/g, '<br>'));
                this.app.generate()
            } else if (this.app.carret.pos < this.app.letter_elements.length - 1) {
                this.app.carret.pos++; // If we are before the end, move carret one step forward
            }
        // If user presses backspace...
        } else if(event.key == "Backspace") {
            // ...delete previous incorrect character (if applicable)-
            // and move carret back one position.
            if(this.app.carret.pos > 0) {
                if(this.app.letter_elements[this.app.carret.pos-1].classList.contains("incorrect")) {
                    this.app.letter_elements[this.app.carret.pos-1].remove();
                }
                this.app.carret.pos--;
            // If user backspaces at beginning, restart.
            } else {
                this.app.restart();
            }
        // If user presses escape...
        } else if(event.key == "Escape") {
            // ...restart lesson.
            this.app.restart();
        // Finally, if input is any other normal input (a-Z, 0-9 or space)...
        } else if(event.key.length == 1 || event.key == " ") {
            // Register incorrect keypress
            this.app.letter_elements[this.app.carret.pos].classList.add("failed");
            
            // Create incorrect letter element...
            let wrong_char_element = document.createElement("span");
            wrong_char_element.classList.add("letter");
            wrong_char_element.classList.add("incorrect");
            wrong_char_element.innerHTML = event.key.replace(" ", "_");
            // ...and append to current position
            this.app.letter_elements[this.app.carret.pos].parentElement.insertBefore(wrong_char_element, this.app.letter_elements[this.app.carret.pos]);
    
            this.app.carret.pos++;
        }
        this.app.carret.set_position(this.app.carret.pos);
    }
}

let debug_term_element = document.createElement("div");
debug_term_element.classList.add("debug-term");
document.body.appendChild(debug_term_element);

function debugLog(input) {
    let entry_element = document.createElement("p");
    entry_element.classList.add("entry");
    entry_element.innerHTML = input;
    debug_term_element.appendChild(entry_element);
    entry_element.scrollIntoView();
    return entry_element;
}

debugLog("Debug Term initiated")

let writer = new writer_app(document.getElementById("words"));

// Demo: Populate "word_bank" via sentence string
let example_phrase = "The quick brown fox jumps over the lazy dog";
// example_phrase += " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
writer.lesson.lesson_str.word_bank = writer.lesson.lesson_str.word_bank.concat(example_phrase.split(" "));

writer.generate();