import React from 'react';

export function createContext<ContextValueType extends object | null>(
	rootComponentName: string,
	defaultContext?: ContextValueType,
) {
	const Context = React.createContext<ContextValueType | undefined>(defaultContext);

	const Provider: React.FC<ContextValueType & { children: React.ReactNode }> = (props) => {
		const { children, ...context } = props;
		// biome-ignore lint/correctness/useExhaustiveDependencies: context object is stable for this usage
		const value = React.useMemo(() => context, Object.values(context)) as ContextValueType;
		return <Context.Provider value={value}>{children}</Context.Provider>;
	};

	Provider.displayName = `${rootComponentName}Provider`;

	function useContext() {
		const context = React.useContext(Context);
		if (context) return context;
		if (defaultContext !== undefined) return defaultContext;
		// if a defaultContext wasn't specified, it's a required context.
		throw new Error(`\`${rootComponentName}\` must be used within \`${rootComponentName}\``);
	}

	return [Provider, useContext] as const;
}
