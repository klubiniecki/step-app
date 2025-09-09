import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

type AuthContextValue = {
	session: Session | null;
	user: User | null;
	loading: boolean;
	signOut: () => Promise<void>;
	updateDisplayName: (displayName: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
	session: null,
	user: null,
	loading: true,
	signOut: async () => {},
	updateDisplayName: async () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const { data } = await supabase.auth.getSession();
			setSession(data.session ?? null);
			const { data: userData } = await supabase.auth.getUser();
			setUser(userData.user ?? null);
			setLoading(false);
		})();

		const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
			setSession(newSession);
			setUser(newSession?.user ?? null);
		});

		return () => {
			subscription.subscription.unsubscribe();
		};
	}, []);

	const value: AuthContextValue = {
		session,
		user,
		loading,
		signOut: async () => {
			await supabase.auth.signOut();
		},
		updateDisplayName: async (displayName: string) => {
			await supabase.auth.updateUser({ data: { display_name: displayName } });
			const { data: userData } = await supabase.auth.getUser();
			setUser(userData.user ?? null);
		},
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


