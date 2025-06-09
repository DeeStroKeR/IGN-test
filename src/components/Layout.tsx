import { Layout as AntLayout, Menu, theme } from 'antd';
import { Outlet } from 'react-router';
import { Link, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = AntLayout;

const pages = [
  { key: '/', label: <Link to="/">Home</Link> },
  { key: '/profile', label: <Link to="/profile">Profile</Link> },
  { key: '/app', label: <Link to="/app">App</Link> },
];

function Layout() {
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	const location = useLocation();

	return (
		<AntLayout style={{ minHeight: '100vh' }}>
			<Header style={{ display: 'flex', alignItems: 'center' }}>
				<div className="demo-logo" />
				<Menu
					theme="dark"
					mode="horizontal"
					selectedKeys={[location.pathname]}
					items={pages}
					style={{ flex: 1, minWidth: 0 }}
				/>
			</Header>
			<Content style={{ padding: '48px 48px 0 48px', display: 'flex', flexDirection: 'column' }}>
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