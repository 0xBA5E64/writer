
// Word bank, list
let word_bank = [];

// Demo: Populate "word_bank" via sentence string
let example_phrase = "The quick brown fox jumps over the lazy dog";
word_bank = word_bank.concat(example_phrase.split(" "));

// Debug
console.log(word_bank);

// Generate randomized string
let rnd_str = [];
for(let i = 0; i < 10; i++) {
    rnd_str.push(word_bank[Math.floor(Math.random() * word_bank.length)].toLowerCase());
}

// Debug
console.log(rnd_str);

for(let word = 0; word < rnd_str.length; word++) {
    
    let current_word = rnd_str[word];

    let word_element = document.createElement("span");
    word_element.classList.add("word");
    //word_element.innerHTML = current_word;
    for(let word_letter = 0; word_letter < rnd_str[word].length; word_letter++) {
        let letter_element = document.createElement("span");
        letter_element.classList.add("letter");
        letter_element.innerHTML = rnd_str[word][word_letter];
        word_element.appendChild(letter_element);
    }
    document.getElementById("words").appendChild(word_element);

    if(word < rnd_str.length - 1) {
        let space_element = document.createElement("span");
        space_element.classList.add("space");
        space_element.classList.add("letter");
        space_element.innerHTML = "_";
        document.getElementById("words").appendChild(space_element);
    }
}

let letter_elements = document.getElementById("words").getElementsByClassName("letter");

let caret_element = document.createElement("div");
caret_element.classList.add("caret");
document.getElementById("words").appendChild(caret_element);


let caret_pos = 0;

function setCaretPos(input) {

    if(input >= 1) {
        // Quick option
        //letter_elements[input-1].classList.add("passed");
    }
    
    //Over-engineered
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
setCaretPos(0);

document.addEventListener("keydown", function(event) {

    if (event.key == letter_elements[caret_pos].innerHTML || (letter_elements[caret_pos].innerHTML == "_" && event.key == " ")) {
        if(caret_pos < letter_elements.length - 1) {
            caret_pos++;
        }
    } else if(event.key == "Backspace") {
        if(caret_pos > 0) {
            caret_pos--;
        }
    } else if(event.key == "Escape") {
        caret_pos = 0;
    }
    setCaretPos(caret_pos);
})