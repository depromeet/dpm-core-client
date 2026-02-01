import { textblockTypeInputRule } from '@tiptap/core';
import BulletList from '@tiptap/extension-bullet-list';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';

export const CustomStarterKit = StarterKit.configure({
	listItem: {
		HTMLAttributes: {
			style: 'margin: 0.25rem 0; padding-left: 0.25rem; list-style-type: revert; margin-left: 8px;',
		},
	},
	blockquote: {
		HTMLAttributes: {
			style: 'margin: 0; padding: 0; padding-left: 17px; border-left: 3px solid #ddd; color: #555;',
		},
	},
	bold: {
		HTMLAttributes: {
			style: 'font-family: inherit;',
		},
	},
	italic: {
		HTMLAttributes: {
			style: 'font-family: inherit;',
		},
	},
	strike: {
		HTMLAttributes: {
			style: 'font-family: inherit;',
		},
	},
	bulletList: false,
	orderedList: {
		HTMLAttributes: {
			style:
				'list-style-position: outside; padding-left: 0.5rem; margin: 0.5rem 0; list-style-type: decimal;',
		},
	},
	heading: false,
	codeBlock: false,
	code: false,
	dropcursor: {
		width: 2,
	},
});

export const CustomBulletList = BulletList.configure({
	// 마크다운 지원 (- , + , * )
	HTMLAttributes: {
		style:
			'list-style-position: outside; padding-left: 0.5rem; margin: 0.5rem 0; list-style-type: disc;',
	},
});

type Level = 2 | 3 | 4 | 5 | 6;

export const CustomHeading = Heading.extend({
	addInputRules() {
		const levels: Level[] = [2, 3, 4, 5, 6];
		return levels.map((level) =>
			textblockTypeInputRule({
				find: new RegExp(`^(#{${level - 1}})\\s$`),
				type: this.type,
				getAttributes: { level },
			}),
		);
	},
	addAttributes() {
		return {
			...this.parent?.(),
			style: {
				default: null,
				parseHTML: (element) => element.getAttribute('style'),
				renderHTML: (attributes) => {
					if (!attributes.level) {
						return {};
					}
					const levelStyles: Record<number, string> = {
						2: 'font-size: 22px; line-height: 30px; font-weight: 600; color: #111827; margin: 1rem 0 0.5rem 0;',
						3: 'font-size: 20px; line-height: 28px; font-weight: 600; color: #111827; margin: 0.875rem 0 0.5rem 0;',
						4: 'font-size: 18px; line-height: 26px; font-weight: 600; color: #111827; margin: 0.75rem 0 0.5rem 0;',
						5: 'font-size: 16px; line-height: 24px; font-weight: 600; color: #111827; margin: 0.625rem 0 0.5rem 0;',
						6: 'font-size: 14px; line-height: 20px; font-weight: 600; color: #111827; margin: 0.5rem 0 0.5rem 0;',
					};
					return {
						style: levelStyles[attributes.level] || '',
					};
				},
			},
		};
	},
}).configure({
	levels: [2, 3, 4, 5, 6],
});

export const CustomLink = Link.configure({
	// URL 자동 링크, HTTPS 강제
	openOnClick: false,
	HTMLAttributes: {
		style:
			'color: #5e83fe; text-decoration: underline; text-underline-offset: 2px; cursor: pointer;',
	},
	validate: (url) => {
		// HTTPS 강제
		return /^https?:\/\//.test(url);
	},
});

export const CustomUnderline = Underline.configure({
	HTMLAttributes: {
		class: 'underline',
	},
});

// 모든 확장을 배열로 export
export const tiptapExtensions = [
	CustomStarterKit,
	CustomBulletList,
	CustomHeading,
	CustomLink,
	CustomUnderline,
];
