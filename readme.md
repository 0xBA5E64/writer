# LibreWriter
A touch-typing coaching tool with a little bit of snare.

## Motivation
I have for a while now been trying to teach myself to touch type, with the distant target of surpassing a 100 WPM average. To do this, so far, I have utilized the free online service [KeyBR.com](https://keybr.com/) as a guiding hand. But as my skills have now grown, and with now years of background using it, I now desire to create a better, and open-source alternative, with more advanced featues to guide users beyond the beginnings of touch-type exercise.

One such point is **"misstake-categorization"**; With KeyBR, any typing-misstake is the same, and although this is to some extent helpful in forcing you to simply "git gud", it's also lacking in crucial insight into exactly *why* you are making said mistakes; 

 - Are you pressing certain keys too quickly?
 - Missing space-bar presses between words?
 - Accidentally double clicking letters you meant to only press once?

Indeed, all of these misstakes do lead to the same outcome; misspellings, and with KeyBR, errors are simply tracked per key as a ratio between miss-clicks and good-clicks. However, it is my belief that addressing these issues require drastically different methods of practice. For instance; Double-clicking the `D` in `window` obviously doesn't mean you should now be practicing typing `O`'s for the next three days, just because that is the logical key you technically miss-pressed, and so forth.

## TODO:
A non-comprehensive lists of features to be implemented

 - Log parsing
   - [~] Words-Per-Minute (WPM)
     - [x] average
     - [ ] median
     - [ ] 99%/95% avrg
     - [ ] **5%/10% worst
   - [ ] Characters per Second (CPS)
     - [ ] average
     - [ ] median
     - [ ] 99%/95% avrg
     - [ ] **5%/10% worst
 - Intelligent log-analysis:
   - [ ] early (skipped current) key-press?
   - [ ] late (repeated previous) key-press?
   - [ ] "slight of hand" (correct hand, key beside)?
   - [ ] Twitch? (wrong hand / completely wrong)