import { Request, Response } from "express";

export const slTimeConfig = (req: Request, res: Response) => {
  const date = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = Object.fromEntries(formatter.formatToParts(date).map((part)=>[part.type, part.value]))

  if(parts.hour ==="24")
    parts.hour ="00";

  const milliseconds = String(date.getMilliseconds()).padStart(3,"0")

  const offset = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Colombo",
  timeZoneName: "longOffset",
})
  .formatToParts(new Date())
  .find((part) => part.type === "timeZoneName")?.value
  .replace("GMT", "")
  .replace(":", "");

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}:${milliseconds} ${offset}`
};
