"use client";
import { useEffect, useMemo, useState } from "react";
import { useComposeCast, useMiniKit } from "@coinbase/onchainkit/minikit";
import { usePublicClient, useAccount } from "wagmi";
import { keccak256, stringToHex, type Address, isHex } from "viem";
import { minikitConfig } from "../minikit.config";
import styles from "./page.module.css";

type QuestCategory = "DeFi" | "NFT" | "Social";
type QuestType = "checkin" | "share" | "tx_hash_nft_mint" | "tx_hash_defi_swap";

type Quest = {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  points: number;
  type: QuestType;
  requiresWallet?: boolean;
};

type StoredState = {
  totalPoints: number;
  streakDays: number;
  lastCompletedDay?: string; // YYYY-MM-DD
  completedByDay: Record<string, string[]>; // day -> questIds
  proofsByDay?: Record<string, Record<string, string>>; // day -> questId -> txHash (or proof)
};

type LeaderboardEntry = {
  userKey: string;
  displayName: string;
  points: number;
  streakDays: number;
};

const APP_STORAGE_VERSION = 1;
const LEADERBOARD_KEY = `daily-base-quest:leaderboard:v${APP_STORAGE_VERSION}`;

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function userStorageKey(userKey: string) {
  return `daily-base-quest:v${APP_STORAGE_VERSION}:${userKey}`;
}

function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function defaultState(): StoredState {
  return { totalPoints: 0, streakDays: 0, completedByDay: {} };
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function topicToAddress(topic: string): Address | null {
  // topic is 32 bytes hex; last 20 bytes are the address
  if (!topic?.startsWith("0x") || topic.length !== 66) return null;
  return (`0x${topic.slice(26)}` as Address);
}

function getDailyQuests(dayKey: string): Quest[] {
  // Deterministic per-day quest set. No backend required.
  // Always: check-in + 1 quest for each category (DeFi/NFT/Social) => 4 quests.
  return [
    {
      id: "checkin",
      title: "Daily check-in",
      description: "Open the app and claim today’s check-in.",
      category: "Social",
      points: 10,
      type: "checkin",
    },
    {
      id: "defi_swap",
      title: "DeFi: Make a swap",
      description: "Do a swap on a Base DEX (e.g., Uniswap / Aerodrome / Sushi), then paste the transaction hash to verify.",
      category: "DeFi",
      points: 35,
      type: "tx_hash_defi_swap",
      requiresWallet: true,
    },
    {
      id: "nft_mint",
      title: "NFT: Mint something",
      description: "Mint any NFT on Base, then paste the transaction hash to verify.",
      category: "NFT",
      points: 40,
      type: "tx_hash_nft_mint",
      requiresWallet: true,
    },
    {
      id: "social_share",
      title: "Social: Share your progress",
      description: "Post your streak + points to Farcaster/Base from the app.",
      category: "Social",
      points: 15,
      type: "share",
    },
  ];
}

export default function Home() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { composeCastAsync } = useComposeCast();
  const [error, setError] = useState("");
  const [state, setState] = useState<StoredState>(defaultState());
  const [isSharing, setIsSharing] = useState(false);
  const [txInputs, setTxInputs] = useState<Record<string, string>>({});
  const [isVerifying, setIsVerifying] = useState<Record<string, boolean>>({});

  // Initialize the miniapp
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const userKey = useMemo(() => {
    const fid = context?.user?.fid;
    if (fid) return `fid:${fid}`;
    if (address) return `addr:${address.toLowerCase()}`;
    return "anon";
  }, [context?.user?.fid, address]);

  const displayName = useMemo(() => {
    if (context?.user?.displayName) return context.user.displayName;
    if (address) return shortenAddress(address);
    if (context?.user?.fid) return `FID ${context.user.fid}`;
    return "Anon";
  }, [context?.user?.displayName, context?.user?.fid, address]);

  const todayKey = useMemo(() => getTodayKey(), []);
  const dailyQuests = useMemo(() => getDailyQuests(todayKey), [todayKey]);

  // Load/save per-user state
  useEffect(() => {
    const key = userStorageKey(userKey);
    const parsed = safeParseJSON<StoredState>(localStorage.getItem(key));
    setState(parsed ?? defaultState());
  }, [userKey]);

  useEffect(() => {
    const key = userStorageKey(userKey);
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, userKey]);

  // Update local leaderboard (MVP: local/demo only)
  useEffect(() => {
    if (userKey === "anon") return;
    const current = safeParseJSON<Record<string, LeaderboardEntry>>(localStorage.getItem(LEADERBOARD_KEY)) ?? {};
    current[userKey] = {
      userKey,
      displayName,
      points: state.totalPoints,
      streakDays: state.streakDays,
    };
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(current));
  }, [state.totalPoints, state.streakDays, userKey, displayName]);

  const completedToday = useMemo(() => {
    const list = state.completedByDay[todayKey] ?? [];
    return new Set(list);
  }, [state.completedByDay, todayKey]);

  const proofsToday = useMemo(() => {
    return state.proofsByDay?.[todayKey] ?? {};
  }, [state.proofsByDay, todayKey]);

  const totalTodayPoints = useMemo(() => {
    return dailyQuests.reduce((sum, q) => sum + q.points, 0);
  }, [dailyQuests]);

  const earnedTodayPoints = useMemo(() => {
    return dailyQuests.reduce((sum, q) => (completedToday.has(q.id) ? sum + q.points : sum), 0);
  }, [dailyQuests, completedToday]);

  const progressPct = totalTodayPoints ? Math.round((earnedTodayPoints / totalTodayPoints) * 100) : 0;

  const awardQuest = (questId: string, points: number) => {
    setState((prev) => {
      const existing = new Set(prev.completedByDay[todayKey] ?? []);
      if (existing.has(questId)) return prev;
      existing.add(questId);

      const last = prev.lastCompletedDay;
      const yesterday = getYesterdayKey();
      const nextStreak =
        last === todayKey
          ? prev.streakDays
          : last === yesterday
            ? prev.streakDays + 1
            : 1;

      return {
        ...prev,
        totalPoints: prev.totalPoints + points,
        streakDays: nextStreak,
        lastCompletedDay: todayKey,
        completedByDay: { ...prev.completedByDay, [todayKey]: Array.from(existing) },
      };
    });
  };

  const handleCheckin = () => {
    setError("");
    awardQuest("checkin", dailyQuests.find((q) => q.id === "checkin")?.points ?? 10);
  };

  const TRANSFER_TOPIC0 = useMemo(
    () => keccak256(stringToHex("Transfer(address,address,uint256)")),
    []
  );
  const TRANSFER_SINGLE_TOPIC0 = useMemo(
    () => keccak256(stringToHex("TransferSingle(address,address,address,uint256,uint256)")),
    []
  );
  const TRANSFER_BATCH_TOPIC0 = useMemo(
    () => keccak256(stringToHex("TransferBatch(address,address,address,uint256[],uint256[])")),
    []
  );

  const handleVerifyTxHash = async (quest: Quest) => {
    setError("");
    const raw = (txInputs[quest.id] ?? "").trim();
    const normalized = raw.toLowerCase();

    if (!isHex(normalized) || normalized.length !== 66) {
      setError("Please paste a valid transaction hash (0x… 66 chars).");
      return;
    }
    if (!publicClient) {
      setError("No public client available. Please try again.");
      return;
    }

    setIsVerifying((p) => ({ ...p, [quest.id]: true }));
    try {
      const hash = normalized as `0x${string}`;
      const [tx, receipt] = await Promise.all([
        publicClient.getTransaction({ hash }),
        publicClient.getTransactionReceipt({ hash }),
      ]);

      if (receipt.status !== "success") {
        setError("Transaction is not successful (status != success).");
        return;
      }
      if (!tx.to) {
        setError("Contract creation tx is not supported for verification. Please use a regular interaction tx.");
        return;
      }

      // For wallet-required quests: ensure tx belongs to the connected wallet
      if (quest.requiresWallet) {
        if (!isConnected || !address) {
          setError("Connect your wallet in Base app first.");
          return;
        }
        if (tx.from.toLowerCase() !== address.toLowerCase()) {
          setError("This tx was not sent from your connected wallet address.");
          return;
        }
      }

      if (quest.type === "tx_hash_nft_mint") {
        const minted = receipt.logs.some((log) => {
          const t0 = log.topics[0];
          if (!t0) return false;

          // ERC721/20 Transfer: mint if from == 0x0 (topic1)
          if (t0 === TRANSFER_TOPIC0 && log.topics.length >= 3) {
            const fromTopic = log.topics[1]!;
            return fromTopic.endsWith("0000000000000000000000000000000000000000");
          }

          // ERC1155 TransferSingle/Batch: mint if from == 0x0 (topic2)
          if ((t0 === TRANSFER_SINGLE_TOPIC0 || t0 === TRANSFER_BATCH_TOPIC0) && log.topics.length >= 4) {
            const fromTopic = log.topics[2]!;
            return fromTopic.endsWith("0000000000000000000000000000000000000000");
          }

          return false;
        });

        if (!minted) {
          setError("Couldn’t detect an NFT mint in this tx. Paste a mint tx (ERC721/1155) on Base.");
          return;
        }
      }

      if (quest.type === "tx_hash_defi_swap") {
        // Heuristic swap verification (no allowlist): require multiple ERC20 Transfer events,
        // across >=2 token contracts, and user involvement in at least one transfer.
        const transferLogs = receipt.logs.filter((log) => log.topics?.[0] === TRANSFER_TOPIC0);
        const tokenContracts = new Set<string>(transferLogs.map((l) => l.address.toLowerCase()));
        const user = (address ?? tx.from).toLowerCase();
        const involved = transferLogs.some((l) => {
          const from = topicToAddress(l.topics[1] ?? "")?.toLowerCase();
          const to = topicToAddress(l.topics[2] ?? "")?.toLowerCase();
          return from === user || to === user;
        });

        // Optional: if provided, restrict to known routers (comma-separated addresses)
        const allow = (process.env.NEXT_PUBLIC_DEFI_ROUTER_ALLOWLIST ?? "")
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
        if (allow.length > 0) {
          if (!allow.includes(tx.to.toLowerCase())) {
            setError(
              `This tx.to (${tx.to}) is not in NEXT_PUBLIC_DEFI_ROUTER_ALLOWLIST. Add it (comma-separated) or use a supported DEX.`
            );
            return;
          }
        }

        if (transferLogs.length < 2 || tokenContracts.size < 2 || !involved) {
          setError("Couldn’t verify a swap pattern (need multiple ERC20 Transfers across 2+ tokens with your address involved). Paste a swap tx on Base.");
          return;
        }
      }

      // Verified: store proof + award points
      setState((prev) => ({
        ...prev,
        proofsByDay: {
          ...(prev.proofsByDay ?? {}),
          [todayKey]: { ...(prev.proofsByDay?.[todayKey] ?? {}), [quest.id]: hash },
        },
      }));

      awardQuest(quest.id, quest.points);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Verification failed. Please try again.";
      setError(msg);
    } finally {
      setIsVerifying((p) => ({ ...p, [quest.id]: false }));
    }
  };

  const handleShare = async () => {
    setError("");
    setIsSharing(true);
    try {
      const text = `Daily Base Quest 🔥 Day ${state.streakDays} streak · ${state.totalPoints} points. Join me and complete today’s quests on Base.`;
      const result = await composeCastAsync({
        text,
        embeds: [process.env.NEXT_PUBLIC_URL || ""],
      });
      if (result?.cast) {
        const pts = dailyQuests.find((q) => q.id === "share")?.points ?? 15;
        awardQuest("share", pts);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Share failed. Please try again.";
      setError(msg);
    } finally {
      setIsSharing(false);
    }
  };

  const leaderboard = useMemo(() => {
    const raw = safeParseJSON<Record<string, LeaderboardEntry>>(localStorage.getItem(LEADERBOARD_KEY)) ?? {};
    const list = Object.values(raw);
    // Add a few demo users so the UI doesn't look empty on first run
    const demo: LeaderboardEntry[] = [
      { userKey: "demo:1", displayName: "BaseRunner", points: 420, streakDays: 12 },
      { userKey: "demo:2", displayName: "OnchainNinja", points: 365, streakDays: 9 },
      { userKey: "demo:3", displayName: "QuestMaxxer", points: 310, streakDays: 7 },
    ];
    const merged = [...list];
    for (const d of demo) {
      if (!merged.some((e) => e.userKey === d.userKey)) merged.push(d);
    }
    merged.sort((a, b) => (b.points - a.points) || (b.streakDays - a.streakDays));
    return merged.slice(0, 10);
  }, [state.totalPoints, state.streakDays, userKey]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{minikitConfig.miniapp.name}</h1>
        <p className={styles.tagline}>{minikitConfig.miniapp.tagline}</p>

        {context?.user?.displayName && (
          <p className={styles.greeting}>
            Hi, {context.user.displayName}!
          </p>
        )}

        <div className={styles.priceTag}>
          🔥 Streak: <strong>{state.streakDays}</strong> days · ⭐ Points: <strong>{state.totalPoints}</strong>
        </div>

        <div className={styles.magicBallSection}>
          <div className={styles.magicBall} style={{ cursor: "default" }}>
            <div className={styles.ballInner}>
              <div className={styles.answerWindow}>
                <span className={styles.answerText}>{progressPct}%</span>
              </div>
            </div>
          </div>

          <div className={styles.questionSection}>
            <div className={styles.instruction}>
              Today: <strong>{earnedTodayPoints}</strong> / <strong>{totalTodayPoints}</strong> points
            </div>

            {dailyQuests.map((q) => {
              const done = completedToday.has(q.id);
              const hasProof = Boolean(proofsToday[q.id]);
              const buttonLabel =
                q.type === "checkin"
                  ? done
                    ? "Completed"
                    : "Claim"
                  : q.type === "share"
                      ? done
                        ? "Completed"
                        : isSharing
                          ? "Sharing..."
                          : "Share"
                      : done
                        ? "Completed"
                        : isVerifying[q.id]
                          ? "Verifying..."
                          : hasProof
                            ? "Verified"
                            : "Verify tx";

              const onClick =
                q.type === "checkin"
                  ? handleCheckin
                  : q.type === "share"
                      ? handleShare
                      : () => handleVerifyTxHash(q);

              return (
                <div key={q.id} style={{ width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontWeight: 600 }}>
                        {q.title} · <span style={{ opacity: 0.8 }}>{q.category}</span>
                      </div>
                      <div style={{ opacity: 0.8, fontSize: 13 }}>{q.description}</div>
                      <div style={{ opacity: 0.8, fontSize: 13 }}>+{q.points} pts</div>
                    </div>
                    <button
                      onClick={onClick}
                      className={done ? styles.resetButton : styles.askButton}
                      disabled={
                        done ||
                        (q.type === "share" && isSharing) ||
                        ((q.type === "tx_hash_nft_mint" || q.type === "tx_hash_defi_swap") && isVerifying[q.id]) ||
                        (q.requiresWallet && !isConnected)
                      }
                      type="button"
                      style={{ minWidth: 140 }}
                    >
                      {buttonLabel}
                    </button>
                  </div>

                  {(q.type === "tx_hash_nft_mint" || q.type === "tx_hash_defi_swap") && !done && (
                    <div style={{ marginTop: 10 }}>
                      <input
                        className={styles.questionInput}
                        placeholder="Paste tx hash (0x...)"
                        value={txInputs[q.id] ?? ""}
                        onChange={(e) => setTxInputs((p) => ({ ...p, [q.id]: e.target.value }))}
                        inputMode="text"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                      />
                      {proofsToday[q.id] && (
                        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
                          Verified: <span style={{ fontFamily: "var(--font-source-code-pro)" }}>{proofsToday[q.id]}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{ height: 12 }} />
                </div>
              );
            })}

            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>

        <div style={{ width: "100%", maxWidth: 500, marginTop: 8 }}>
          <div style={{ opacity: 0.7, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Leaderboard (local MVP)
          </div>
          <div style={{ height: 10 }} />
          <div
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 12,
              padding: 12,
              textAlign: "left",
            }}
          >
            {leaderboard.map((e, idx) => {
              const isMe = e.userKey === userKey;
              return (
                <div
                  key={e.userKey}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "8px 6px",
                    borderRadius: 10,
                    background: isMe ? "rgba(99,102,241,0.15)" : "transparent",
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 24, opacity: 0.8 }}>#{idx + 1}</div>
                    <div style={{ fontWeight: 600 }}>
                      {e.displayName}
                      {isMe ? " (you)" : ""}
                    </div>
                  </div>
                  <div style={{ opacity: 0.85 }}>
                    <strong>{e.points}</strong> pts · <strong>{e.streakDays}</strong>d
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className={styles.instruction}>
          Tip: onchain quests cost gas. DeFi swap is verified by tx hash via ERC20 Transfer patterns (and optionally a router allowlist).
        </p>
      </div>
    </div>
  );
}
