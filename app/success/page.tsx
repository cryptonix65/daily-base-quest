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
      const text = `I’m on a streak in ${minikitConfig.miniapp.name} 🔥 Complete today’s quests on Base and climb the leaderboard.`;
      
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

  const handleBackHome = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} type="button" onClick={() => router.push("/")}>
        ✕
      </button>
      
      <div className={styles.content}>
        <div className={styles.successMessage}>
          <div className={styles.orbIcon}>🏆</div>
          
          <h1 className={styles.title}>Quest Complete</h1>
          
          <p className={styles.subtitle}>
            Keep your streak alive and invite others to join.<br />
            Share your progress on Farcaster/Base.
          </p>

          <div className={styles.buttonGroup}>
            <button onClick={handleShare} className={styles.shareButton}>
              SHARE ON FARCASTER
            </button>
            <button onClick={handleBackHome} className={styles.backButton}>
              BACK TO QUESTS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
