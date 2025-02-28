import chalk from "chalk";

type Source = "registry" | "vite:host" | "vite:remote";
type LogType = "log" | "info" | "error";

export function logMessage(source: Source, message: string) {
  return log("log", source, message);
}

export function logInfo(source: Source, message: string) {
  return log("info", source, message);
}

export function logError(source: Source, message: string, error: Error) {
  return log("error", source, message, error);
}

function log(type: LogType, source: Source, message: string, error?: Error) {
  const time = chalk.dim(getTime());

  const headerText = `[micro-frontend:${source}]`;
  let header = "";
  switch (type) {
    case "log":
      header = chalk.green(headerText);
      break;
    case "info":
      header = chalk.blue(headerText);
      break;
    case "error":
      header = chalk.red(headerText);
      break;
  }

  const logText = `${time} ${header} ${message}`;

  if (error) {
    console.log(logText);
  } else {
    console.log(logText, error);
  }
}

function getTime() {
  const date = new Date();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const amPm = hours >= 12 ? "PM" : "AM";

  const hours12Format = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const strMinutes = minutes.toString().padStart(2, "0");
  const strSeconds = seconds.toString().padStart(2, "0");

  return `${hours12Format}:${strMinutes}:${strSeconds} ${amPm}`;
}
