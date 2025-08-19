console.log("Game Start!");

import rawData from "./data/questions.test.json";

interface Question {
    word: string;
    hint: string;
}


class Quiz {
    questions: Question[];
    constructor(questions: Question[]) {
        this.questions = questions;
    }

    getNext():Question {
        const idx = Math.floor(Math.random() * this.questions.length);
        const[question] = this.questions.splice(idx, 1);    
        return question;
    }

    hasNext(): boolean {
        return this.questions.length > 0;
    }

    lefts(): number {
        return this.questions.length;
    }
}

const questions: Question[] = rawData;
const quiz = new Quiz(questions);
