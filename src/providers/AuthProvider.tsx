import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

type AuthContextValue = {
	session: Session | null;
	user: User | null;
	loading: boolean;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
	session: null,
	user: null,
	loading: true,
	signOut: async () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session ?? null);
			setLoading(false);
		});

		const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
			setSession(newSession);
		});

		return () => {
			subscription.subscription.unsubscribe();
		};
	}, []);

	const value: AuthContextValue = {
		session,
		user: session?.user ?? null,
		loading,
		signOut: async () => {
			await supabase.auth.signOut();
		},
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


