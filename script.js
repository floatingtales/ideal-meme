const client = ZAFClient.init();
client.invoke("resize", {
  width: "100%",
  height: "200px",
});

const generateReply = () => {
  client.invoke("comment.appendText", "test one two three");
};

client.on("ticket.conversation.changed", () => {
  console.log("conversation changed");
  client.get("ticket.conversation").then((data) => {
    console.log("getting data");
    console.log(data);

    generateReply();
  });
});
