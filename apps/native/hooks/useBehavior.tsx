import { useEffect, useState } from 'react';
import { Keyboard, type KeyboardAvoidingViewProps, Platform } from 'react-native';

export function useBehavior() {
	const defaultValue: KeyboardAvoidingViewProps['behavior'] =
		Platform.OS === 'ios' ? 'padding' : 'height';

	const [behavior, setBehavior] = useState<KeyboardAvoidingViewProps['behavior']>(defaultValue);

	useEffect(() => {
		const showListener = Keyboard.addListener('keyboardDidShow', () => {
			setBehavior(defaultValue);
		});
		const hideListener = Keyboard.addListener('keyboardDidHide', () => {
			setBehavior(undefined);
		});

		return () => {
			showListener.remove();
			hideListener.remove();
		};
	}, [defaultValue]);

	return behavior;
}
