const client = ZAFClient.init();
client.invoke("resize", {
  width: "100%",
  height: "200px",
});

const generateReply = () => {
  client.get("ticket.conversation").then(async (data) => {
    const chat = [];

    console.log(data);

    for (const conversation of data.ticket.conversation) {
      chat.push({
        role: conversation.author.role,
        content: conversation.message.content,
      });
    }

    const reply = await axios.post(
      "https://empty-cloths-peel.loca.lt/getAIReply",
      { chat }
    );
    client.invoke("comment.appendText", reply[0].message.content);
  });
};

client.on("ticket.conversation.changed", () => {
  console.log("conversation changed");
  client.get("ticket.conversation").then(async (data) => {
    if (
      data.ticket.conversation.at(-1).author.role === "agent" ||
      data.ticket.conversation.at(-1).author.role === "system" ||
      data.ticket.conversation.at(-1).author.role === "admin"
    ) {
      console.log("agent/admin/system messaged last");
    } else {
      console.log("client messaged last");
      generateReply();
    }
  });
});
