import { useEffect, useState } from "react";
import "./../../../style/Conversation.css"
import React from "react";

export default function Conversation(props: any) {

 
  return (
    <>
    <div className="conversation">
        <div className="conversationName">{props.name}</div>
    </div>
    </>
  );

}
