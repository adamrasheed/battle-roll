import clsx from "clsx";
import type { FC } from "react";

type DiceNumber = 1 | 2 | 3 | 4 | 5 | 6;

type Props = {
  rollsMap: Record<DiceNumber, number>;
  isRolling?: boolean;
};

const RollFrequencyTable: FC<Props> = ({ rollsMap, isRolling }) => {
  const diceKeys = Array.from({ length: 6 }, (_, i) => i + 1);

  const rollSum = Object.keys(rollsMap).reduce((acc, key) => {
    const numKey = Number(key) as DiceNumber;
    return acc + Number(key) * rollsMap[numKey];
  }, 0);

  return (
    <div className="mt-8 w-full max-w-[24rem] space-y-1 px-10">
      {diceKeys.map((_key) => {
        const key = _key as DiceNumber;
        const percentage =
          rollsMap[key] && rollSum
            ? Math.min(
                Math.round((rollsMap[key] / rollSum) * rollsMap[key] * 100),
                100
              )
            : 0;

        return (
          <div
            key={key}
            className={clsx(
              "grid",
              "grid-cols-[3rem_1fr]",
              "gap-2",
              "bg-slate-900",
              "py-2"
            )}
          >
            <div className="z-10 px-4 font-mono font-bold">{key}</div>

            <div className="relative z-10 font-mono opacity-80">
              <span className="relative z-10 pl-2"> {rollsMap[key]}</span>

              <div
                className={clsx(
                  "absolute",
                  "bg-slate-800",
                  "left-0",
                  "h-full",
                  "max-w-[calc(100% - 3rem)]",
                  "top-0",
                  "z-[1]"
                )}
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RollFrequencyTable;
