import { Layout as AntLayout, Button, ConfigProvider, Drawer, Menu, message, Modal, theme } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { CloseOutlined, MenuOutlined, HomeOutlined, UserOutlined, HeartOutlined, InfoOutlined, QuestionOutlined } from '@ant-design/icons';
import styles from './layout.module.scss';
import { useUser } from '../contexts/UserContext';
import { client } from '../http/client';
import { useAuthenticator } from '@aws-amplify/ui-react';
import RegisterSteps from './Register/RegisterSteps';
import { ProfileForm } from '../pages/profileTypes';
import { DualRingLoader } from './DualRingLoader';

const { Header, Content, Footer } = AntLayout;
const pages: MenuProps['items'] = [
  { key: '/', label: <Link to="/">Home</Link>, icon: <HomeOutlined /> },
  { key: '/profile', label: <Link to="/profile">Profile</Link>, icon: <UserOutlined /> },
  { type: 'divider' },
  { key: 'exercises', label: 'Well-being Tools', type: 'group' },
  { key: '/breathe', label: <Link to="/breathe">Take a Breather</Link>, icon: <HeartOutlined /> }
  // Add more pages as needed
];

function Layout() {
	const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [collapsed, setCollapsed] = useState(true);
	const [showStepper, setShowStepper] = useState(false);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	const location = useLocation();
	const { user, setUser, isLoading, setLoading } = useUser();
	const { user: cognitoUser } = useAuthenticator((context) => [context.user]);

	useEffect(() => {
		if (!user) {
			getUserInfo(cognitoUser.userId)
		}
	}, [user]);

	const getUserInfo = async (userId: string) => {
		const { data, errors } = await client.models.User.get({ id: userId });

		console.log('Fetched user data:', data, errors);
		if (data) {
			setUser(data)
		} else {
			setShowStepper(true);
		}
	}

	const signOutlander = async () => {
		setIsUserLoading(true);
		try {
			await signOut();
		} catch (error) {
			console.error('Error signing out:', error);
		} finally {
			setIsUserLoading(false);
		}
	}

	const onCompleteStepper = async (data: Partial<ProfileForm>) => {
		setLoading(true);
		const { errors } = await client.models.User.create({
			id: cognitoUser.userId,
			name: data.name || '',
			birthday: data.birthday || '',
			gender: data.gender || '',
			owner: cognitoUser.userId,
			aboutMe: '',
			jobTitle: '',
			jobDescription: ''
		});

		if (errors) {
			message.error(errors[0].message);
			setShowStepper(true);
		} else {
			setUser({
				id: cognitoUser.userId,
				name: data.name || '',
				birthday: data.birthday || '',
				gender: data.gender || '',
				owner: cognitoUser.userId,
				aboutMe: '',
				jobTitle: '',
				jobDescription: ''
			});
			setShowStepper(false);
		}
		setLoading(false);
	}

	if (!user && !showStepper) {
		return <DualRingLoader text="Loading user information..." size={80}/>;
	}

	if (!user && showStepper) {
		return (
			<RegisterSteps onComplete={onCompleteStepper} />
		)
	}

	return (
		<AntLayout style={{ minHeight: '100vh' }}>
			<Drawer className={styles.sider} open={!collapsed} width={256} placement='left' closeIcon={null}>
				<div className={styles.sider_header}>
					<span className={styles.menu_header}>Menu</span>
					<CloseOutlined onClick={() => setCollapsed(true)} />
				</div>
				<Menu
					selectedKeys={[location.pathname]}
					items={pages}
					className={styles.menu_items}
					disabled={isLoading}
					onClick={() => setCollapsed(true)}
				/>
				<a href="mailto:info@igt-pa.co.uk" className={styles.help_link}><QuestionOutlined className={styles.help_icon}/> Request help</a>
				<div className={styles.logout_wrapper}>
					<ConfigProvider
						theme={{
							components: {
								Button: {
									colorPrimary: '#2f3b69',
									colorPrimaryHover: '#1c2541',
									paddingInline: 0,
									paddingBlock: 0,
									controlHeight: 40,
									
								}
							}
						}}>
						<Button type="primary" size="middle" className={styles.logout_button} loading={isUserLoading} style={{ width: '100%' }} onClick={() => signOutlander()}>Logout</Button>
					</ConfigProvider>
				</div>
			</Drawer>
		<AntLayout>	
			<Header style={{ display: 'flex', alignItems: 'center', height: '56px', padding: '0 16px' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', margin: '0 auto' }}>
					<MenuOutlined onClick={() => setCollapsed(false)} style={{ color: 'white' }} />
					<h1 className={styles.header_header}>iGT-PA!</h1>
					<Button variant="outlined" size="small" style={{ background: 'transparent', color: 'white' }} shape='circle' icon={<InfoOutlined />} onClick={() => setIsModalOpen(true)} />
				</div>
			</Header>
			<Content className={styles.content_wrapper}>
				<div
					className={styles.content_main}
					style={{
						background: colorBgContainer,
						borderRadius: borderRadiusLG,
					}}
				>
					<Outlet context={123}/>
				</div>
			</Content>
			<Footer className={styles.footer}>
				IGT ©{new Date().getFullYear()}
			</Footer>
		</AntLayout>
		<Modal
			title={<p className={styles.modal_title}>Important Notice</p>}
			open={isModalOpen}
			onCancel={() => setIsModalOpen(false)}
			centered
			footer={[]}
		>
			<p className={`${styles.modal_text} ${styles.modal_text_accent}`}>iGT-PA is a digital wellbeing assistant designed to provide general emotional support and self-help tools. It does not provide medical diagnosis, treatment, or professional mental health advice.</p>
			<p className={styles.modal_text}>If you are experiencing a mental health crisis or feel unsafe, please contact a qualified mental health professional or an emergency helpline immediately.</p>
			<p className={styles.modal_text}>iGT-PA is powered by artificial intelligence. Conversations may be reviewed by trained human moderators for safety and quality purposes. Your data is handled according to our Privacy Policy and is never used to make automated clinical decisions about you.</p>
			<p className={`${styles.modal_text} ${styles.modal_text_accent}`}>If you need urgent help in the UK, call Samaritans on 116 123 (freephone, 24/7). For other countries, visit: <a href='https://www.iasp.info/resources/Crisis_Centres/' target='_blank' rel='noopener noreferrer'>www.iasp.info/resources/Crisis_Centres/</a></p>
		</Modal>
		</AntLayout>
	)
}

export default Layout