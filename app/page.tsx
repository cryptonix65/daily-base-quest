"use client";
import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, type Address } from "viem";
import { minikitConfig } from "../minikit.config";
import styles from "./page.module.css";

// USDC contract address on Base
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as Address;
const PAYMENT_AMOUNT = "0.1"; // 0.1 USDC
const ORACLE_WALLET = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" as Address; // Замените на ваш адрес

// ERC20 Transfer ABI
const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable"
  }
] as const;

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
  const { writeContractAsync } = useWriteContract();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [txHash, setTxHash] = useState<Address | undefined>();

  // Initialize the miniapp
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const { isLoading: _isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      return;
    }

    setPaymentError("");
    setIsProcessingPayment(true);

    try {
      // Send USDC transfer transaction
      const hash = await writeContractAsync({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [ORACLE_WALLET, parseUnits(PAYMENT_AMOUNT, 6)] // USDC has 6 decimals
      });

      setTxHash(hash as Address);

      // Transaction sent, show the oracle animation
      setIsProcessingPayment(false);
      setIsShaking(true);
      setShowAnswer(false);
      setAnswer("");

      // Simulate shaking animation and reveal answer
      setTimeout(() => {
        setIsShaking(false);
        const randomAnswer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
        setAnswer(randomAnswer);
        setShowAnswer(true);
      }, 1500);

    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessingPayment(false);
      const errorMessage = error instanceof Error ? error.message : "Payment failed. Please try again.";
      setPaymentError(errorMessage);
    }
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

        <div className={styles.priceTag}>
          💎 {PAYMENT_AMOUNT} USDC per question
        </div>

        <div className={styles.magicBallSection}>
          <div 
            className={`${styles.magicBall} ${isShaking ? styles.shaking : ""}`}
            onClick={question.trim() && !isProcessingPayment ? handleAskQuestion : undefined}
            style={{ cursor: question.trim() && !isProcessingPayment ? "pointer" : "default" }}
          >
            <div className={styles.ballInner}>
              {isProcessingPayment ? (
                <div className={styles.processingWindow}>
                  <span className={styles.processingText}>💳</span>
                </div>
              ) : showAnswer ? (
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
              disabled={isShaking || isProcessingPayment}
              onKeyDown={(e) => {
                if (e.key === "Enter" && question.trim() && !isProcessingPayment) {
                  handleAskQuestion();
                }
              }}
            />
            
            {paymentError && (
              <p className={styles.error}>{paymentError}</p>
            )}
            
            {!showAnswer ? (
              <button
                onClick={handleAskQuestion}
                className={styles.askButton}
                disabled={!question.trim() || isShaking || isProcessingPayment}
              >
                {isProcessingPayment 
                  ? "Processing Payment..." 
                  : isShaking 
                  ? "Thinking..." 
                  : `Pay ${PAYMENT_AMOUNT} USDC & Ask`}
              </button>
            ) : (
              <button
                onClick={handleReset}
                className={styles.resetButton}
              >
                Ask Another Question ({PAYMENT_AMOUNT} USDC)
              </button>
            )}
          </div>
        </div>

        <p className={styles.instruction}>
          {isProcessingPayment 
            ? "⏳ Confirming payment on Base network..." 
            : showAnswer 
            ? "Got your answer! Ask another question or share your result." 
            : `Type your question. Each answer costs ${PAYMENT_AMOUNT} USDC on Base.`}
        </p>
      </div>
    </div>
  );
}
