import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';
import dbConnect from '../../../middleware/database';
import vakenLogin from '../../../models/vakenLogin';
import User from '../../../models/user';

export default async function auth(req: any, res: any) {
	await NextAuth(req, res, {
		providers: [
			GitHubProvider({
				clientId: process.env.GITHUB_ID as string,
				clientSecret: process.env.GITHUB_SECRET as string,
			}),
			GoogleProvider({
				clientId: process.env.GOOGLE_ID as string,
				clientSecret: process.env.GOOGLE_SECRET as string,
			}),
		],
		secret: process.env.SESSION_SECRET as string,
		session: {
			strategy: 'jwt',
		},
		callbacks: {
			async jwt({ token, user }) {
				await dbConnect();
				if (user) {
					// user is only defined on first sign in
					const login = await User.findOne({ email: user.email });
					console.log('user: ', user);
					console.log('all users:', await User.find());
					// read usertype from vaken db
					console.log('HEY!');
					console.log(login.userType);
					console.log('DONE!');
					if (!login.userType) {
						const vakenUser = await vakenLogin.findOne({ email: user.email }).lean();
						if (vakenUser?.userType) login.userType = vakenUser.userType;
						await login.save();
					}

					console.log('HEY TOKEN!');
					console.log(token.userType);
					console.log('DONE TOKEN');

					token.userType = login.userType;
				}
				return token;
			},
			async session({ session, token }) {
				console.log('HEY session!');
				console.log(session.userType);
				console.log('DONE session!');
				if (!session.userType || !session.userID) {
					session.userType = token.userType;
					session.userID = token.sub;
				}
				return session;
			},
		},

		// A database is optional, but required to persist accounts in a database
		adapter: MongoDBAdapter({
			db: (await clientPromise).db('witness'),
		}),

		theme: {
			colorScheme: 'dark',
			logo: '/vhlogo-white.svg',
		},
	});
}
