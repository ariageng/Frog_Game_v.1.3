// The Profesowl grammar dictionary (in js: "object")
export const grammar_prof = {
    words:{

    },
    sentences: {
        yes: { response: "positive" },
        no: { response: "negative" },
        ofCourse: { response: "positive" },
        noWay: { response: "negative" },
    }
};

// The Frog dictionary
export const grammar_frog = {
words: {
    // Word entries can have their own features
    hello: { category: "greeting", type: "interjection" },
    cat: { category: "animal", type: "noun" },
    run: { category: "action", type: "verb" },
    // ... add more words as needed
},
sentences: {
    "Good morning": { category: "greeting", type: "collocation", CFG: ["adjective", "noun"] },
    "The cat runs": { category: "action", type: "sentence", CFG: ["article", "noun", "verb"] },
    // ... add more sentences with their features
},
};