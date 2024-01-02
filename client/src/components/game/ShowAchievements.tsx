import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/AuthContext";
import BadgeIcon from "../utils/BadgeIcon";
import '../../style/Profile.css';
import { useParams } from "react-router-dom";

interface Achievement {
	achievement: {
	  id: number;
	  name: string;
	  description: string;
	  icon: string;
	  points: number;
	};
	achievementId: number;
	createdAt: string;
	id: number;
	userId: number;
  }

const ShowAchievements = (props: any) => {
	const authCtx = useContext(AuthContext);
	const { id } = useParams();
	const [achievements, setAchievements] = useState<Achievement[]>([]);
	let nameIconClass = 'name-icon';
	const apiUrl = `http://${window.location.hostname}:3000/users/`;

	useEffect(() => {
		fetchUserAchievements();
	}, [id])

	const fetchUserAchievements = async () => {
		const response = await fetch(
			apiUrl + `${id}/achievements`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authCtx.token}`
				}
			}
		)
		if (response.ok) {
			const data: Achievement[] = await response.json();
			// Convert image URLs to blobs
			const achievementsWithBlobs = await Promise.all(data.map(async (achiev: any) => {
			  const icon = await fetchIcon(achiev.achievement.id);
			  return { ...achiev, achievement: {...achiev.achievement, icon}};
			}));
			setAchievements(achievementsWithBlobs);
		  }
	}

	const fetchIcon = async (id: number) => {
		try {
			const response = await fetch(
				apiUrl + `${id}/icon`, {
				method: 'GET',
			});
			if (response.ok) {
				const blob = await response.blob();
				return URL.createObjectURL(blob);
			}
		} catch (error) {
			return console.log("error", error);
		}
	}

	return (
		<>
		<div className="container-achiev scrollContainer">
			{achievements.map((achiev) => (
				<li key={achiev.id}>
					<div className={nameIconClass}>
						<h6>{achiev.achievement.name}</h6>
						<BadgeIcon style='nameIconClass' src={achiev.achievement.icon} className="badge-icon" description={achiev.achievement.description}/>
					</div>
				</li>
			))}
		</div>
		</>
	)
}

export default ShowAchievements;
