<template>
    <h1 class="welcome">
        WELCOME TO THE QUIZ, TEN DIFFERENT QUESTIONS WILL BE PROVIDED HERE
    </h1>
    <div class="complexity" v-if="!complexity">
        <div class="complexity__title">Select difficulty level</div>
        <button
            @click="setDifficulty(level)"
            v-for="level in difficultyLevels"
            :key="level"
        >
            {{ level }}
        </button>
    </div>
    <!-- <button v-if="!isInGame && complexity" class="start" @click="start">
        Start
    </button> -->
    <div class="item" v-if="isInGame && complexity">
        <div class="question">
            {{ currentQuestion.question }} ({{ currentQuestion.category }})
        </div>
        <div class="answers">
            <button
                @click="chooseAnswer(answer)"
                class="answer"
                v-for="answer in answerList"
                :key="answer"
                :class="
                    this.answer
                        ? currentQuestion.correctAnswer === answer
                            ? 'active'
                            : 'disabled'
                        : ''
                "
                :disabled="this.answer != ''"
            >
                {{ answer }}
            </button>
        </div>
        <div class="info">
            {{ questionNumber }} / {{ countQuestions }}
            <br />
            <span> {{ complexity }} </span>
        </div>
    </div>
    <button
        class="next"
        @click="getQuestion"
        v-if="answer && questionNumber < countQuestions"
    >
        next question
    </button>

    <div class="result" v-if="countQuestions === questionNumber && answer">
        <div class="result-counter">
            Answers {{ trueAnswers }} of {{ countQuestions }} | difficulty level: {{ complexity }}
            <br />
            <button class="play-again" @click="resetGame">Play again</button>
        </div>
    </div>

    <mySpinner :isOpen="openSpinner" />
</template>

<script>
import { RandomQuestions } from "./components/API/RandomQuestions.js";
import mySpinner from "./components/mySpinner.vue";
import shuffleArr from "./components/shuffleArr.js";

export default {
    name: "App",
    components: {
        mySpinner,
    },
    data() {
        return {
            isInGame: false,
            countQuestions: 10,
            questionNumber: 0,
            trueAnswers: 0,
            currentQuestion: {},
            questions: [],
            answerList: [],
            openSpinner: false,
            answer: "",
            difficultyLevels: {
                easy: "easy",
                medium: "medium",
                hard: "hard",
                mixed: "mixed",
            },
            complexity: "",
        };
    },
    methods: {
        async start() {
            this.questionNumber = 0;
            this.trueAnswers = 0;
            this.openSpinner = true;
            this.questions = await RandomQuestions(
                this.countQuestions,
                this.complexity
            );
            this.openSpinner = false;
            this.isInGame = true;
            this.getQuestion();
        },
        resetGame() {
            this.isInGame = false
            this.questionNumber = 0
            this.trueAnswers = 0
            this.currentQuestion = {}
            this.questions = []
            this.answerList = []
            this.openSpinner = false
            this.answer = ""
            this.complexity =""
        },
        setAnswers() {
            this.answerList.push(this.currentQuestion.correctAnswer);
            Object.values(this.currentQuestion.incorrectAnswers).forEach(
                (answer) => {
                    this.answerList.push(answer);
                }
            );
            this.answerList = shuffleArr(this.answerList);
        },
        chooseAnswer(UserAnswer) {
            this.answer = UserAnswer;
            if (UserAnswer === this.currentQuestion.correctAnswer) {
                this.trueAnswers++;
            }
        },
        getQuestion() {
            this.currentQuestion = this.questions[this.questionNumber];
            this.questionNumber++;
            this.answer = "";
            this.answerList = [];
            this.setAnswers();
        },
        setDifficulty(level) {
            this.complexity = level;
            this.start();
        },
    },
    watch: {
        answer() {
            if (this.countQuestions === this.questionNumber && this.answer) {
                console.log("game end");
            }
        },
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
}

button {
    padding: 12px 16px;
    border-radius: 3px;
    border: 1px solid green;
    margin-right: 8px;
    background-color: transparent;
    cursor: pointer;
    font-size: 1.1em;
    line-height: 1.2em;
}

.welcome {
    width: 60%;
    text-align: center;
    display: block;
    margin: 0 auto;
    margin-top: 32px;
    line-height: 1.4em;
}

.start {
    margin-left: auto;
    margin-right: auto;
    width: max-content;
    margin-top: 24px;
    font-size: 1.4em;
    padding-left: 48px;
    padding-right: 48px;
}

.question {
    font-size: 1.3rem;
    margin-bottom: 16px;
    text-align: center;
    margin-top: 42px;
    margin-bottom: 16px;
}
.answers {
    display: flex;
}

.answer {
    width: 50%;
}

.answer:last-child {
    margin-right: 0px;
}

.answer.disabled,
.answer.active {
    color: #fff;
}

.answer.active {
    background-color: green;
}
.answer.disabled {
    background-color: red;
    border-color: red;
}
.next {
    margin-left: auto;
    margin-right: auto;
    width: max-content;
    margin-top: 24px;
    font-size: 1.4em;
    padding-left: 48px;
    padding-right: 48px;
}

.info {
    font-size: 4em;
    font-weight: 800;
    position: absolute;
    top: 24px;
    left: 48px;
    line-height: 0.5em;
}

.info span {
    font-size: 0.4em;
}

.result {
    margin-top: 32px;
    display: flex;
    align-items: center;
}
.result-counter {
    margin-right: 24px;
    font-size: 2em;
}

.complexity__title {
    font-size: 1.4em;
    text-align: center;
    margin-bottom: 14px;
}

.complexity {
    margin-top: 24px;
    margin-bottom: 0px;
    margin-right: auto;
    margin-left: auto;
}

.complexity button {
    margin-right: 16px;
    padding-left: 28px;
    padding-right: 28px;
}

.play-again {
    margin-top: 16px;
    font-size: 0.5em;
}

@media (max-width: 1024px) {
    .welcome {
        width: 100%;
        margin-top: 16px;
        font-size: 1.4em;
    }
    .item .info {
        top: unset;
        bottom: 8px;
        margin-left: auto;
        margin-right: auto;
        left: 8px;
        right: 0;
        height: max-content;
        font-size: 1.8em;
        line-height: 1em;
    }
    .info span {
        font-size: 0.8em;
    }
    .answers {
        flex-wrap: wrap;
    }
    .answer {
        width: 100%;
        margin-right: 0;
        margin-bottom: 12px;
    }
    .result-counter {
        margin-right: 0;
        width: 100%;
        text-align: center;
    }
    .play-again {
        margin-right: auto;
        margin-left: auto;
        margin-top: 16px;
    }
    .question {
        margin-top: 24px;
        margin-bottom: 12px;
    }
    .complexity {
        flex-wrap: wrap;
    }
    .complexity button {
        width: 100%;
        margin-bottom: 12px;
    }
}
</style>

