import { Layout as AntLayout, Button, ConfigProvider, Menu, theme } from 'antd';
import { Outlet } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import { useState } from 'react';

const { Header, Content, Footer } = AntLayout;

const pages = [
  { key: '/', label: <Link to="/">Home</Link> },
  { key: '/profile', label: <Link to="/profile">Profile</Link> }
];

function Layout() {
	const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	const location = useLocation();

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

	return (
		<AntLayout style={{ minHeight: '100vh' }}>
			<Header style={{ display: 'flex', alignItems: 'center' }}>
				<div className="demo-logo" />
				<div style={{ display: 'flex', alignItems: 'center', width: '1100px', margin: '0 auto' }}>
					<Menu
						mode="horizontal"
						selectedKeys={[location.pathname]}
						items={pages}
						style={{ flex: 1, minWidth: 0 }}
					/>
					<ConfigProvider
						theme={{
							components: {
								Button: {
									colorPrimary:"#ffd3c8",
									colorPrimaryActive:"#d9a89e",
									colorPrimaryBg:"#fff5f0",
									colorPrimaryBorder:"#fff4f0",
									colorPrimaryHover:"#ff8160",
									colorPrimaryText:"#2a2e30",
									colorPrimaryTextActive:"#d9a89e",
									primaryColor:"#2a2e30",
								}
							}
						}}
					>
						<Button type="primary" style={{ marginLeft: 'auto' }} loading={isUserLoading} onClick={() => signOutlander()}>Logout</Button>
					</ConfigProvider>
				</div>

			</Header>
			<Content style={{ padding: '48px 48px 0 48px', display: 'flex', flexDirection: 'column', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
				<div
					style={{
						background: colorBgContainer,
						height: '100%',
						padding: 24,
						flex: 1,
						borderRadius: borderRadiusLG,
					}}
				>
					<Outlet />
				</div>
			</Content>
			<Footer style={{ textAlign: 'center' }}>
				IGT ©{new Date().getFullYear()}
			</Footer>
		</AntLayout>
	)
}

export default Layout