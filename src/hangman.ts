
import rawData from "./data/questions.test.json";
import readlinePromises from "readline/promises";
import chalk from "chalk";
import figlet from "figlet";

console.log("Game Start!");

console.log(chalk.green("正解！！"))

type Color = "red" | "green" | "yellow" | "white";

const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout,
});

interface Question {
    word: string;
    hint: string;
}

interface UserInterface {
    input(): Promise<string>;
    clear(): void;
    destroy(): void;
    output(message: string, color?: Color): void;
    outputAnswer(message: string): void;
}

const CLI: UserInterface = {

    async input(){
        const input = await rl.question("文字または単語を推測してください:");
        return input.replaceAll(" ", "").toLowerCase();
    },

    clear() {
        console.clear();
    },

    destroy() {
        rl.close();
    },

    output(message: string, color: Color = "white") {
        console.log(chalk[color](message), "\n");
    },

    outputAnswer(message: string) {
        console.log(figlet.textSync(message,{ font: "Big"}), "\n"); 
    }
}

//確認用関数
async function testQuestion() {
    CLI.clear();
    const userInput = await CLI.input();
    console.log(userInput);
    CLI.destroy();
}
testQuestion();


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
