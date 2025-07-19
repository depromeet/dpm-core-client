import { AuthProvider } from "@/providers/auth-provider";
import type { PropsWithChildren } from "react";

const AuthLayout = async ({ children }: PropsWithChildren) => {
	return <AuthProvider>{children}</AuthProvider>;
};

export default AuthLayout;
