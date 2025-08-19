
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

class Stage {
    answer: string;
    leftAttempts: number = 5;
    question: Question;

    constructor(question: Question) {
        this.question = question;
        this.answer = new Array(question.word.length).fill("_").join("");
    }

    decrementAttempts(): number {
        return --this.leftAttempts;
    }

    updateAnswer(userInput: string = ""): void {
        if (!userInput) return; 
    
        const regex = new RegExp(userInput, "g"); // 入力を正規表現として使用
        const answerArry = this.answer.split(""); // 文字列を配列に変換
    
        let matches: RegExpExecArray | null; // 正規表現での検索結果を格納する変数
    
        while ((matches = regex.exec(this.question.word))) {
        
          const foundIdx = matches.index;
          
          answerArry.splice(foundIdx, userInput.length, ...userInput);
    
          this.answer = answerArry.join(""); 
        }
    }

    isTooLong(userInput: string): boolean {
        return userInput.length > this.question.word.length;
    }
    
      isIncludes(userInput: string): boolean {
        return this.question.word.includes(userInput);
    }
    
      isCorrect(): boolean {
        return this.answer === this.question.word;
    }
    
      isGameOver(): boolean {
        return this.leftAttempts === 0;
    }

}

class Message {
    ui: UserInterface; 
  
    constructor(ui: UserInterface) {
      this.ui = ui;
    }
    // 問題をユーザーに表示
    askQuestion(stage: Stage): void {
      this.ui.output(`Hint: ${stage.question.hint}`, "yellow");
      this.ui.outputAnswer(stage.answer.replaceAll("", " ").trim());
      this.ui.output(`（残りの試行回数: ${stage.leftAttempts}）`);
    }
    leftQuestions(quiz: Quiz) {
      this.ui.output(`残り${quiz.lefts() + 1}問`);
    }
    start() {
      this.ui.output("\nGame Start!!");
    }
    enterSomething() {
      this.ui.output(`何か文字を入力してください。`, "red");
    }
    notInclude(input: string) {
      this.ui.output(`"${input}" は単語に含まれていません。`, "red");
    }
    notCorrect(input: string) {
      this.ui.output(`残念！ "${input}" は正解ではありません。`, "red");
    }
    hit(input: string) {
      this.ui.output(`"${input}" が Hit!`, "green");
    }
    correct(question: Question) {
      this.ui.output(`正解！ 単語は "${question.word}" でした。`, "green");
    }
    gameover(question: Question) {
      this.ui.output(`正解は ${question.word} でした。`);
    }
    end() {
      this.ui.output("ゲーム終了です！お疲れ様でした！");
    }
  }
  

const questions: Question[] = rawData;
const quiz = new Quiz(questions);
