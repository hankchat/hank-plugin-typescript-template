import { Metadata, PreparedStatement } from "@hank.chat/types";
import { hank, HandleCommandInput, HandleMessageInput } from "@hank.chat/pdk";

export * from "@hank.chat/pdk";

hank.pluginMetadata = Metadata.create({
  name: "sample-plugin",
  description: "A sample plugin to demonstrate some functionality.",
  version: "0.1.0",
  database: true,
});
hank.registerInstallFunction(install);
hank.registerInitializeFunction(initialize);
hank.registerMessageHandler(handle_message);
hank.registerCommandHandler(handle_command);

function install() {
  let stmt = PreparedStatement.create({
    sql: "CREATE TABLE IF NOT EXISTS people (name TEXT, age INTEGER)"
  });
  hank.dbQuery(stmt);
}

function initialize() {
  console.log("initializing...");
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
}
