"use client";

import { useComposeCast } from '@coinbase/onchainkit/minikit';
import { useRouter } from "next/navigation";
import { minikitConfig } from "../../minikit.config";
import styles from "./page.module.css";

export default function Success() {
  const { composeCastAsync } = useComposeCast();
  const router = useRouter();
  
  const handleShare = async () => {
    try {
      const text = `Just consulted the ${minikitConfig.miniapp.name} oracle! 🔮 Ask your own yes/no questions now!`;
      
      const result = await composeCastAsync({
        text: text,
        embeds: [process.env.NEXT_PUBLIC_URL || ""]
      });

      // result.cast can be null if user cancels
      if (result?.cast) {
        console.log("Cast created successfully:", result.cast.hash);
      } else {
        console.log("User cancelled the cast");
      }
    } catch (error) {
      console.error("Error sharing cast:", error);
    }
  };

  const handleBackToOracle = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} type="button">
        ✕
      </button>
      
      <div className={styles.content}>
        <div className={styles.successMessage}>
          <div className={styles.orbIcon}>🔮</div>
          
          <h1 className={styles.title}>The Oracle Has Spoken!</h1>
          
          <p className={styles.subtitle}>
            Thanks for consulting {minikitConfig.miniapp.name}.<br />
            Share your experience with others!
          </p>

          <div className={styles.buttonGroup}>
            <button onClick={handleShare} className={styles.shareButton}>
              SHARE ON FARCASTER
            </button>
            <button onClick={handleBackToOracle} className={styles.backButton}>
              ASK AGAIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
