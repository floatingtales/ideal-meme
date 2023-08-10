const client = ZAFClient.init();
client.invoke("resize", {
  width: "100%",
  height: "200px",
});

const generateReply = () => {
  client.get("ticket.conversation").then(async (data) => {
    const chat = [];

    for (const conversation of data["ticket.conversation"]) {
      chat.push({
        role: conversation.author.role === "end-user" ? "user" : "assistant",
        content: conversation.message.content.match(/(?<=>).+(?=<)/gm)[0],
      });
    }

    const reply = await axios.post(
      "https://proud-queens-mate.loca.lt/getAIReply",
      { chat },
      {
        headers: { "Bypass-Tunnel-Reminder": true },
      }
    );

    client.invoke("comment.appendText", reply.data[0].message.content);
  });
};

client.on("ticket.conversation.changed", () => {
  client.get("ticket.conversation").then(async (data) => {
    if (
      data.ticket.conversation.at(-1).author.role === "agent" ||
      data.ticket.conversation.at(-1).author.role === "system" ||
      data.ticket.conversation.at(-1).author.role === "admin"
    ) {
      console.log("agent/admin/system messaged last");
    } else {
      generateReply();
    }
  });
});
