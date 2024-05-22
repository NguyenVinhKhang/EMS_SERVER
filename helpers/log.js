import chalk from "chalk";

function logi(tag, func, message) {
  const formattedMessage = message
    ? ": " + (typeof message === "object" ? JSON.stringify(message) : message)
    : "";
  console.log(
    chalk.white(chalk.bold(`[I]` + ` [${tag}] ` + `${func}`) + formattedMessage)
  );
}
function logs(tag, func, message) {
  const formattedMessage = message
    ? ": " + (typeof message === "object" ? JSON.stringify(message) : message)
    : "";
  console.log(
    chalk.cyanBright(
      chalk.bold(`[S]` + ` [${tag}] ` + `${func}`) + formattedMessage
    )
  );
}
function loge(tag, func, message) {
  let formattedMessage = message
    ? message.stack
      ? ": " + message.stack
      : ": " + (typeof message === "object" ? JSON.stringify(message) : message)
    : "";
  console.log(
    chalk.red(chalk.bold(`[E]` + ` [${tag}] ` + `${func}`) + formattedMessage)
  );
}
function logw(tag, func, message) {
  const formattedMessage = message
    ? ": " + (typeof message === "object" ? JSON.stringify(message) : message)
    : "";
  console.log(
    chalk.yellow(
      chalk.bold(`[W]` + ` [${tag}] ` + `${func}`) + formattedMessage
    )
  );
}

export { logi, loge, logs, logw };
