import BulletList from '@tiptap/extension-bullet-list';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';

export const CustomStarterKit = StarterKit.configure({
	listItem: {
		HTMLAttributes: {
			style: 'margin: 0; padding: 0; list-style-type: revert; margin-left: 16px;',
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
	// orderedList는 StarterKit 기본값 사용
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
		class: 'bullet-list',
	},
});

export const CustomLink = Link.configure({
	// URL 자동 링크, HTTPS 강제
	openOnClick: false,
	HTMLAttributes: {
		class: 'link',
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
export const tiptapExtensions = [CustomStarterKit, CustomBulletList, CustomLink, CustomUnderline];
