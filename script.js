const client = ZAFClient.init();
client.invoke("resize", {
  width: "100%",
  height: "200px",
});

const generateReply = () => {
  client.invoke("comment.appendText", "test one two three");
};
