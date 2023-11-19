import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Forecast } from "@/types/forecast";
import { format } from "date-fns";

const ForecastList = ({ data }: ForecastListProps) => {
  return (
    <div className="bg-white rounded-xl p-4 flex-1 border self-stretch">
      <ul className="h-[22rem] overflow-auto">
        <ScrollArea>
          {data.map((forecast, i) => {
            return (
              <li
                key={i}
                className="flex items-center justify-between hover:bg-gray-50 border-b py-2 pr-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={`https://openweathermap.org/img/wn/${forecast?.icon}@2x.png`}
                    className="w-14 rounded-full border"
                    alt={forecast?.main}
                  />
                  <p>
                    {forecast?.main}{" "}
                    <span className="text-gray-500 text-xs">
                      {forecast?.tempMax}° c /{forecast?.tempMin}° c
                    </span>{" "}
                  </p>
                </div>
                <p className="text-gray-600 text-sm">
                  {format(new Date(forecast?.date), "do, MMM y")}
                </p>
              </li>
            );
          })}
        </ScrollArea>
      </ul>
    </div>
  );
};

export default ForecastList;

type ForecastListProps = {
  data: Forecast[];
};
