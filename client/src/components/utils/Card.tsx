import React from "react";
import '../../style/Profile.css'
import ShowFriends from "../friends/ShowFriends";
import BodyStatsCard from "./BodyStatsCard";
import MenuCard from "./MenuCard";
import MatchHistory from "../game/MatchHistory";
import ShowAchievements from "../game/ShowAchievements";
import Table from "../scores/Table"
import Podium from "../scores/Podium"
import FriendsDemands from "../friends/FriendsDemands";

const colorMap = {
	red: "#FF5166",
	blue: "#5551FF",
	green: "#04A777",
	yellow: "#F9C80E",
}; 
interface CardProps {
	color: 'blue' | 'red' | 'green' | 'yellow';
	title: string;
	body?: string;
	type: 'stats' | 'showFriends' | 'menu' | 'match' | 'achiev' | 'table' | 'viewGame' | 'podium';
	icon?: string;
	friendCtx?: any; 
	authCtx?: any;
	id?: string; 
	style?: string;
  }

const Card: React.FC<CardProps>  = (props) => {
	const color: string = colorMap[props.color] || '';

	const getCardContent = (): React.ReactNode => {
		switch (props.type) {
			case 'stats':
				return <BodyStatsCard icon={props.icon} />;
			case 'showFriends':
				return <ShowFriends friendCtx={props.friendCtx} authCtx={props.authCtx} />;
			case 'menu':
				return <MenuCard body={props.body} />;
			case 'match':
				return <MatchHistory id={props.id} authCtx={props.authCtx} />;
			case 'achiev':
				return <ShowAchievements id={props.id} />;
			case 'table':
				return <Table id={props.id} />;
			case 'viewGame':
				return <MatchHistory id={props.id} authCtx={props.authCtx} />;
			case 'podium':
				return <Podium id={props.id} />;
			default:
				return null;
		}
	};

	return (
		<div className='card'>
			{props.style !== "none" && (
        		<div className='title-card'>
         		 	<div className='custom-status' style={{ background: color }}></div>
          			<h5>{props.title}</h5>
         	 		{props.type === 'showFriends' && <FriendsDemands token={props.authCtx.token} authCtx={props.authCtx} friendCtx={props.friendCtx} />}
        		</div>
     		 )}
     		 {getCardContent()}
		</div>
	)
}

export default Card;
