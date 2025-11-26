"use client";
import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../minikit.config";
import styles from "./page.module.css";

const ANSWERS = [
  "Yes",
  "No",
  "Definitely",
  "Absolutely not",
  "Maybe",
  "Ask again later",
  "Without a doubt",
  "Don't count on it",
  "Very likely",
  "Unlikely",
  "Certainly",
  "Not a chance",
  "It is certain",
  "Very doubtful",
  "Signs point to yes"
];

export default function Home() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Initialize the miniapp
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAskQuestion = () => {
    if (!question.trim()) {
      return;
    }

    setIsShaking(true);
    setShowAnswer(false);
    setAnswer("");

    // Simulate shaking animation
    setTimeout(() => {
      setIsShaking(false);
      const randomAnswer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
      setAnswer(randomAnswer);
      setShowAnswer(true);
    }, 1500);
  };

  const handleReset = () => {
    setQuestion("");
    setAnswer("");
    setShowAnswer(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{minikitConfig.miniapp.name}</h1>
        <p className={styles.tagline}>{minikitConfig.miniapp.tagline}</p>

        {context?.user?.displayName && (
          <p className={styles.greeting}>
            Hello, {context.user.displayName}!
          </p>
        )}

        <div className={styles.magicBallSection}>
          <div 
            className={`${styles.magicBall} ${isShaking ? styles.shaking : ""}`}
            onClick={question.trim() ? handleAskQuestion : undefined}
            style={{ cursor: question.trim() ? "pointer" : "default" }}
          >
            <div className={styles.ballInner}>
              {showAnswer ? (
                <div className={styles.answerWindow}>
                  <span className={styles.answerText}>{answer}</span>
                </div>
              ) : (
                <div className={styles.ballNumber}>8</div>
              )}
            </div>
          </div>

          <div className={styles.questionSection}>
            <input
              type="text"
              placeholder="Ask a yes/no question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={styles.questionInput}
              disabled={isShaking}
              onKeyDown={(e) => {
                if (e.key === "Enter" && question.trim()) {
                  handleAskQuestion();
                }
              }}
            />
            
            {!showAnswer ? (
              <button
                onClick={handleAskQuestion}
                className={styles.askButton}
                disabled={!question.trim() || isShaking}
              >
                {isShaking ? "Thinking..." : "Ask the Oracle"}
              </button>
            ) : (
              <button
                onClick={handleReset}
                className={styles.resetButton}
              >
                Ask Another Question
              </button>
            )}
          </div>
        </div>

        <p className={styles.instruction}>
          {showAnswer 
            ? "Got your answer! Ask another question or share your result." 
            : "Type your question and tap the magic ball to reveal your answer."}
        </p>
      </div>
    </div>
  );
}
