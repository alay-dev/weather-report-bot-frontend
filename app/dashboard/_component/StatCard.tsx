"use client";
import { cn } from "@/lib/utils";
import {
  UsersGroupRounded as MemberIcon,
  CloudRain as WeatherIcon,
  ChatRound as ChatIcon,
} from "solar-icon-set";

export type Stats = "Members" | "Forecast";

const titleToIconMap: Record<Stats, any> = {
  Members: <MemberIcon iconStyle="BoldDuotone" size={35} color="#4CAF50" />,
  Forecast: <WeatherIcon iconStyle="BoldDuotone" size={35} color="#1E88E5" />,
};

const StatCard = ({ title, val, active, setActive }: StatCardProps) => {
  return (
    <div
      onClick={() => setActive(title)}
      className={cn(
        "bg-white rounded-xl p-4 pb-8 flex items-center justify-between gap-9 border shadow-sm min-w-[25rem]",
        active && "border-blue-600"
      )}
    >
      <div>
        <h4 className="text-gray-500 text-sm mb-3">{title}</h4>
        <h2 className="font-semibold text-3xl">{val}</h2>
      </div>
      <div className="bg-green-50 w-14 h-14 flex items-center justify-center rounded-full">
        {titleToIconMap[title]}
      </div>
    </div>
  );
};

export default StatCard;

type StatCardProps = {
  title: Stats;
  val: number;
  active: boolean;
  setActive: (data: Stats) => void;
};
