import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "@/utils/api";
import { useState } from "react";
import RollFrequencyTable from "@/components/RollFrequencyTable";
import clsx from "clsx";

const Home: NextPage = () => {
  const [numDice, setNumDice] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [rollsMap, setRollsMap] = useState<Record<number, number> | null>(null);
  const handleDecrement = () => {
    setNumDice((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setNumDice((prev) => prev + 1);
  };

  const handleDiceRoll = () => {
    setIsRolling(true);
    setTimeout(() => {
      const diceRolls = Array.from(
        { length: numDice },
        () => Math.floor(Math.random() * 6) + 1
      );

      const rollFrequency = diceRolls.reduce((acc, roll) => {
        acc[roll] = (acc[roll] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      setRollsMap(rollFrequency);
      setIsRolling(false);
    }, 650);
  };

  return (
    <>
      <Head>
        <title>Battle Roll</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={clsx(
          "flex min-h-screen flex-col items-center justify-start",
          "bg-slate-950 bg-gradient-to-t from-purple-950 to-blue-900 py-16 text-white"
        )}
      >
        <div>
          <h3 className="text-bold mb-2 text-center">Number of Dice</h3>
          <div className="mr-auto flex min-w-[9rem] items-center gap-4">
            <button
              className="p-4 text-xl opacity-70"
              onClick={handleDecrement}
            >
              -
            </button>
            <p className="flex-grow text-center font-mono text-xl">{numDice}</p>
            <button
              className="p-4 text-xl opacity-70"
              onClick={handleIncrement}
            >
              +
            </button>
          </div>
        </div>

        {rollsMap && (
          <RollFrequencyTable rollsMap={rollsMap} isRolling={isRolling} />
        )}

        <div className="mb-4 mt-auto">
          <button
            onClick={handleDiceRoll}
            disabled={isRolling}
            className={clsx(
              "rounded-full",
              "bg-orange-600 px-16 py-3 text-white",
              "disabled:bg-orange-500",
              "shadow-2xl",
              "transition-all",
              "border-[rgba(255,255,255,0.1)]",
              "border-4",
              "uppercase",
              "tracking-wider",
              "font-medium"
            )}
          >
            {isRolling ? "Rolling..." : "Roll Dice"}
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
