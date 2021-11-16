module.exports = {
	reactStrictMode: true,
	distDir: '/tmp/witness-cache',
	async redirects() {
		return [
			{
				source: '/',
				destination: '/dashboard',
				permanent: true,
			},
		];
	},
};
