import React from "react";
import { Link } from "react-router-dom";
interface CardContent {
	body: string;
	icon: string;
	link: string;
  }
  
const bodyMappings: Record<string, CardContent> = {
	play: {
		body: "choose one of your online friends and play against them in a pong match",
		icon: "fa-sharp fa-solid fa-trophy",
		link: "/game",
	},
	watch: {
		body: "join a room and attend a pong match between your friends",
		icon: "fa-solid fa-video",
		link: "/game",
	},
	chat: {
		body: "join a channel or discuss privately with your friends",
		icon: "fa-solid fa-comments",
		link: "/chat/message",
	},
};
  
  const MenuCard = (props: { body: string }) => {
	const { body, icon, link } = bodyMappings[props.body] || { body: '', icon: '', link: '' };
  
	return (
		<div className="body-card">
	  		<Link to={link}>
				<p>{body}</p>
				<i className={icon}></i>
	 		 </Link>
		</div>
	);
  };
  
  export default MenuCard;
