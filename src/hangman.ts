console.log("Game Start!");

import rawData from "./data/questions.test.json";

interface Question {
    word: string;
    hint: string;
}

const questions: Question[] = rawData;
