import { useEffect, useState } from 'react';
import { Loader } from '@aws-amplify/ui-react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { ProfileForm } from './profileTypes';
import { client } from '../http/client';
import { useNavigate } from 'react-router';


function Home() {
	const { user } = useAuthenticator((context) => [context.user]);
	const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
	const [userInfo, setUserInfo] = useState<ProfileForm | null>(null);
	const navigate = useNavigate();
	
	useEffect(() => {
		getUserInfo(user.userId)
	}, [user]);

	const getUserInfo = async (userId: string) => {
		const { data, errors } = await client.models.User.get({ id: userId });
		if (data) {
			setUserInfo(data);
			setIsUserLoading(false);
		}

		if (errors) {
			navigate('/profile');
		}
	}

	if (isUserLoading) {
		return <Loader />;
	}


	return (
		<div

		>
			Content, {user.userId} {userInfo ? `- ${userInfo.name} ${userInfo.surname}` : ''}
		</div>
	)
}

export default Home