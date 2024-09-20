import { Metadata, PreparedStatement } from "@hank.chat/types";
import { hank, HandleCommandInput, HandleMessageInput } from "@hank.chat/pdk";

export * from "@hank.chat/pdk";

hank.pluginMetadata = Metadata.create({
  name: "sample-typescript-plugin",
  description: "A sample plugin to demonstrate some functionality.",
  version: "0.1.0",
  database: true,
});
hank.registerInstallFunction(install);
hank.registerInitializeFunction(initialize);
hank.registerMessageHandler(handle_message);
hank.registerCommandHandler(handle_command);

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

function handle_message(input: HandleMessageInput) {
  const { message } = input;

  console.log(`${message.authorName}: ${message.content}`);
}

async function handle_command(input: HandleCommandInput) {
  const { message } = input;

  if (message.content == "ping") {
    message.content = "Pong!";
    hank.sendMessage(message);
  }

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
