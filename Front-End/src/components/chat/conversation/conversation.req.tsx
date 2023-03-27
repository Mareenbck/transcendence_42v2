//import ConversationDf from "./conversation.df"
//static async getAll() : Promise<ConversationDf[]> {
// static async postRoom(user, newConv) : Promise<ConversationDf[]> {

export class ConversationReq {
  static async getAll() {
    try {
      const resp = await fetch("http://localhost:3000/chatroom2", {method: "GET"})
      const data = await resp.json();
          return data;
    }
    catch (err) {
      console.log(err);
    }

  };

 static async postRoom(user, newConv) {
    try {
      const resp = await fetch(`http://localhost:3000/chatroom2`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(newConv),
      });

      if (!resp.ok) {
        const message = `An error has occured: ${resp.status} - ${resp.statusText}`;
        throw new Error(message);
      }
      const data = await resp.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };
}

export default ConversationReq;