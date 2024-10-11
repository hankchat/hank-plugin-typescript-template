import { Command, CommandContext,Message, PreparedStatement } from "@hank.chat/types";
import { hank, PluginMetadata } from "@hank.chat/pdk";

export * from "@hank.chat/pdk";

export function plugin() {
  hank.pluginMetadata = PluginMetadata.create({
    name: "sample-typescript-plugin",
    description: "A sample plugin to demonstrate some functionality.",
    version: "0.1.0",
    handlesCommands: true,
    commandName: "ping",
    subcommands: [
      Command.create({
        name: "reverse",
        description: "Do the same thing in reverse!",
      })
    ]
  });
  hank.registerInstallFunction(install);
  hank.registerInitializeFunction(initialize);
  hank.registerChatMessageHandler(handle_message);
  hank.registerChatCommandHandler(handle_chat_command);
}

interface Person {
  name: string,
  age: number;
}

function install() {
  let stmt = PreparedStatement.create({
    sql: "CREATE TABLE IF NOT EXISTS people (name TEXT, age INTEGER)"
  });
  hank.dbQuery(stmt);
}

async function initialize() {
  console.log("initializing...");

  hank.cron("1/7 * * * * *", run_every_7_seconds);
  hank.oneShot(30, run_once_in_30_seconds);
}

function run_once_in_30_seconds() {
  console.log("Ok, 30 seconds have passed!!");
}

function run_every_7_seconds() {
  console.log("I run every 7 seconds");
}

function handle_message(message: Message) {
  console.log(`${message.authorName}: ${message.content}`);
}

async function handle_chat_command(context: CommandContext, message: Message) {
  message.content = "Pong!";

  if (context.subcommand?.name == "reverse") {
    message.content = [...message.content].reverse().join("");
  }

  hank.sendMessage(message);

  let people = await hank.dbQuery(
    PreparedStatement.create({ sql: "SELECT * from people" })
  );
  console.log(JSON.stringify(people));

  let person_select = PreparedStatement.create({
    sql: "SELECT * FROM people"
  });

  let persons = await hank.dbQuery<Person>(person_select);
  console.log(JSON.stringify(persons));
}
