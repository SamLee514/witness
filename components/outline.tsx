import Image from 'next/image';
import styles from '../styles/Outline.module.css';
import React from 'react';
import { Button, Layout, Menu, Skeleton, Space } from 'antd';
const { Header, Content, Footer } = Layout;
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/client';

interface OutlineProps {
	children: React.ReactNode;
	home?: boolean;
	selectedKey: string;
}

export default function Outline({ children, home, selectedKey }: OutlineProps) {
	const [session, loading] = useSession();
	if (loading) return <Skeleton />;
	const userType = session?.userType;
	return (
		<Layout className={styles.layout}>
			<Header className={styles.header}>
				<Link href="/">
					<div className={styles.logo}>
						<Image src="/vhlogo-white.svg" alt="VH Logo" width={36} height={36} />
					</div>
				</Link>
				
				<Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey]}>
					{userType && userType !== 'HACKER' && (
						<Menu.Item key="dashboard">
							<Link href="/dashboard">Dashboard</Link>
						</Menu.Item>
					)}
					{userType && userType !== 'HACKER' && (
						<Menu.Item key="forms">
							<Link href="/forms">Forms</Link>
						</Menu.Item>
					)}
					<Menu.Item key="logout">
						<div onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</div>
					</Menu.Item>
				</Menu>
			</Header>
			<Content style={{ padding: '0 50px' }}>
				<Space direction="vertical" className={styles.siteLayoutContent}>
					{children}
				</Space>
			</Content>
			<Footer className={styles.footer}>
				<a
					href="https://vercel.com?utm_source=vandyhacks-witness&utm_campaign=oss"
					target="_blank"
					rel="noopener noreferrer">
					Powered by{' '}
					<span className={styles.ossBanner}>
						<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
					</span>
				</a>
			</Footer>
		</Layout>
	);
}
