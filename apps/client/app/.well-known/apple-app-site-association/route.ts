const association = {
	applinks: {
		details: [
			{
				appIDs: ['F4YNWT2PF6.com.depromeet.core.app'],
				components: [{ '/': '/session/*/feedback' }, { '/': '/' }],
			},
		],
	},
};

export function GET() {
	return Response.json(association);
}
