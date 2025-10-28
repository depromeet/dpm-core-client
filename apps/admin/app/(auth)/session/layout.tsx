const SessionLayout = async ({
	children,
	detail,
}: Readonly<{
	detail: React.ReactNode;
	children: React.ReactNode;
}>) => {
	return (
		<>
			{children}
			{detail}
		</>
	);
};

export default SessionLayout;
