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
  { key: '/breathe', label: <Link to="/breathe">Take a Breather</Link>, icon: <HeartOutlined /> },
  { key: '/moving', label: <Link to="/">Get Moving</Link>, disabled: true, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity" style={{ width: '16px', height: '16px' }}><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg> },
  { key: '/daily', label: <Link to="/">Daily Rhythm</Link>, disabled: true, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar" style={{ width: '16px', height: '16px' }}><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg> },
  { key: '/disconnect', label: <Link to="/">Disconnect and Connect</Link>, disabled: true, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wifi-off" style={{ width: '16px', height: '16px' }}><path d="M12 20h.01"></path><path d="M8.5 16.429a5 5 0 0 1 7 0"></path><path d="M5 12.859a10 10 0 0 1 5.17-2.69"></path><path d="M19 12.859a10 10 0 0 0-2.007-1.523"></path><path d="M2 8.82a15 15 0 0 1 4.177-2.643"></path><path d="M22 8.82a15 15 0 0 0-11.288-3.764"></path><path d="m2 2 20 20"></path></svg> },
  // Add more pages as needed
];

function Layout() {
	const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [collapsed, setCollapsed] = useState(true);
	const [showStepper, setShowStepper] = useState(false);
	const [conversations, setConversations] = useState<any[]>([]);
	const [selectedConversation, setSelectedConversation] = useState<any>(null);
	const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);
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

	useEffect(() => {
		if (user) {
			loadConversations();
		}
	}, [user]);

	const loadConversations = async () => {
		try {
			console.log('💬 SIDEBAR: Loading conversations for user:', cognitoUser.userId);
			const { data } = await client.models.Conversation.list({
				filter: { owner: { eq: cognitoUser.userId } }
			});
			console.log('💬 SIDEBAR: Raw conversation data from DB:', data);
			const processedConversations = data?.map(conv => ({
				...conv,
				// Parse the JSON transcript back to array for future use
				transcript: typeof conv.transcript === 'string' ? JSON.parse(conv.transcript) : conv.transcript
			})) || [];
			const sortedConversations = processedConversations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
			console.log('💬 SIDEBAR: Processed and sorted conversations:', sortedConversations);
			setConversations(sortedConversations);
		} catch (error) {
			console.error('💬 SIDEBAR: Error loading conversations:', error);
		}
	};

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
			jobDescription: '',
			diagnosis: ''
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
				jobDescription: '',
				diagnosis: ''
			});
			setShowStepper(false);
		}
		setLoading(false);
	}

	const handleConversationClick = (conversation: any) => {
		setSelectedConversation(conversation);
		setIsConversationModalOpen(true);
		setCollapsed(true); // Close sidebar when opening conversation
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
				
				<div className={styles.chat_history_section}>
					<div className={styles.section_header}>Chat History</div>
					<div className={styles.conversation_list}>
						{conversations.length === 0 ? (
							<div className={styles.conversation_item}>
								No conversations yet
							</div>
						) : (
							conversations.slice(0, 5).map((conversation) => (
								<div 
									key={conversation.id} 
									className={styles.conversation_item}
									onClick={() => handleConversationClick(conversation)}
									style={{ cursor: 'pointer' }}
								>
									<div className={styles.conversation_title}>{conversation.title}</div>
									<div className={styles.conversation_meta}>
										{conversation.messageCount} messages • {new Date(conversation.createdAt).toLocaleDateString()}
									</div>
								</div>
							))
						)}
					</div>
				</div>
				
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
			<Header style={{ display: 'flex', alignItems: 'center', height: '56px', padding: '0 16px', position: 'sticky', top: 0, zIndex: 1, width: '100%', borderBottom: '2px solid #ff8160' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', margin: '0 auto' }}>
					<MenuOutlined onClick={() => setCollapsed(false)} style={{ color: 'white' }} />
					<h1 className={styles.header_header}>I Got This!</h1>
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
			<Footer className={styles.footer} style={{ color: '#ff8160' }}>
				iGT-PA Ltd ©{new Date().getFullYear()}
			</Footer>
		</AntLayout>
		<Modal
			title={<p className={styles.modal_title}>Important Notice</p>}
			open={isModalOpen}
			onCancel={() => setIsModalOpen(false)}
			centered
			footer={[]}
		>
			<p className={`${styles.modal_text} ${styles.modal_text_accent}`}>I Got This! is a digital wellbeing assistant designed to provide general emotional support and self-help tools. It does not provide medical diagnosis, treatment, or professional mental health advice.</p>
			<p className={styles.modal_text}>If you are experiencing a mental health crisis or feel unsafe, please contact a qualified mental health professional or an emergency helpline immediately.</p>
			<p className={styles.modal_text}>I Got This! is powered by artificial intelligence. Conversations may be reviewed by trained human moderators for safety and quality purposes. Your data is handled according to our Privacy Policy and is never used to make automated clinical decisions about you.</p>
			<p className={`${styles.modal_text} ${styles.modal_text_accent}`}>If you need urgent help in the UK, call Samaritans on 116 123 (freephone, 24/7). For other countries, visit: <a href='https://www.iasp.info/resources/Crisis_Centres/' target='_blank' rel='noopener noreferrer'>www.iasp.info/resources/Crisis_Centres/</a></p>
		</Modal>
		
		<Modal
			title={selectedConversation ? `Conversation: ${selectedConversation.title}` : 'Conversation'}
			open={isConversationModalOpen}
			onCancel={() => setIsConversationModalOpen(false)}
			centered
			width={800}
			footer={[]}
		>
			{selectedConversation && (
				<div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '10px 0' }}>
					<div style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}>
						{selectedConversation.messageCount} messages • {new Date(selectedConversation.createdAt).toLocaleString()}
					</div>
					{selectedConversation.transcript.map((entry: any, index: number) => (
						<div key={index} style={{ marginBottom: '16px' }}>
							{entry.source === 'user' ? (
								<div style={{ 
									backgroundColor: '#f0f0f0', 
									padding: '12px', 
									borderRadius: '8px',
									marginLeft: '20px'
								}}>
									<div style={{ 
										fontWeight: 'bold', 
										color: '#ff8160', 
										marginBottom: '4px',
										fontSize: '14px'
									}}>
										{user?.name || 'You'}
									</div>
									<div>{entry.text}</div>
								</div>
							) : (
								<div style={{ 
									backgroundColor: '#e6f7ff', 
									padding: '12px', 
									borderRadius: '8px',
									marginRight: '20px'
								}}>
									<div style={{ 
										fontWeight: 'bold', 
										color: '#1890ff', 
										marginBottom: '4px',
										fontSize: '14px'
									}}>
										Finn
									</div>
									<div>{entry.text}</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</Modal>
		</AntLayout>
	)
}

export default Layout