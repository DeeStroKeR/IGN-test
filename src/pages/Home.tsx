import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { ProfileForm } from './profileTypes';
import { client } from '../http/client';


function Home() {
	const { user } = useAuthenticator((context) => [context.user]);
	const [userInfo, setUserInfo] = useState<ProfileForm | null>(null);
	
	useEffect(() => {
		if (user) {
			getUserInfo(user.userId).then((info) => {
				console.log('User info fetched:', info);
				if (info) {
					setUserInfo(null);
				}
			}).catch((error) => {
				console.error('Error fetching user info:', error);
			});
		} 
	}, [user]);

	const getUserInfo = async (userId: string) => {
		return await client.models.User.list(
		).catch((error) => {
			console.error('Error fetching user info:', error);
			return null;
		});
	}


	return (
		<div

		>
			Content, {user.userId} {userInfo ? `- ${userInfo.name} ${userInfo.surname}` : ''}
		</div>
	)
}

export default Home