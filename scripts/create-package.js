#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

// 콘솔 색상 정의
const colors = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
};

// 로깅 함수
const log = {
	info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
	success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
	error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
	warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
	title: (msg) => console.log(`${colors.cyan}${colors.bright}${msg}${colors.reset}`),
};

// 사용자 입력을 위한 readline 인터페이스
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// 질문 함수
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// 패키지 템플릿 정의
const packageTemplates = {
	'ui-component': {
		name: 'UI 컴포넌트 패키지',
		description: 'React 컴포넌트를 포함하는 패키지',
		dependencies: {
			'@radix-ui/react-slot': '^1.2.3',
			'class-variance-authority': '^0.7.1',
			clsx: '^2.1.1',
			'tailwind-merge': '^3.3.1',
		},
		peerDependencies: {
			react: '^19.0.0',
			'react-dom': '^19.0.0',
		},
		main: 'src/index.ts',
		types: 'src/index.ts',
		files: ['dist', 'src'],
		hasComponents: true,
	},
	'api-service': {
		name: 'API 서비스 패키지',
		description: 'API 통신을 위한 서비스 패키지',
		dependencies: {
			axios: '^1.10.0',
		},
		main: 'dist/index.js',
		types: 'dist/index.d.ts',
		files: ['dist'],
		hasComponents: false,
	},
	utility: {
		name: '유틸리티 패키지',
		description: '공통 유틸리티 함수들을 포함하는 패키지',
		dependencies: {
			dayjs: '^1.11.13',
			lodash: '^4.17.21',
		},
		main: 'dist/index.js',
		types: 'dist/index.d.ts',
		files: ['dist'],
		hasComponents: false,
	},
	custom: {
		name: '커스텀 패키지',
		description: '사용자 정의 패키지',
		dependencies: {},
		main: 'dist/index.js',
		types: 'dist/index.d.ts',
		files: ['dist'],
		hasComponents: false,
	},
};

// package.json 템플릿 생성
const createPackageJson = (packageName, template, description) => {
	const packageJson = {
		name: `@dpm-core/${packageName}`,
		version: '0.1.0',
		private: true,
		description,
		main: template.main,
		types: template.types,
		files: template.files,
		scripts: {
			build: 'tsup src/index.ts --format cjs,esm --dts',
			dev: 'tsup src/index.ts --format cjs,esm --dts --watch',
			format: 'biome format --write .',
			lint: 'biome lint --write .',
		},
		dependencies: template.dependencies,
		devDependencies: {
			'@biomejs/biome': '^1.9.4',
			tsup: '^8.0.1',
			typescript: '^5',
		},
	};

	if (template.peerDependencies) {
		packageJson.peerDependencies = template.peerDependencies;
	}

	return JSON.stringify(packageJson, null, 2);
};

// tsconfig.json 템플릿 생성
const createTsConfig = () => {
	return JSON.stringify(
		{
			extends: '../../tsconfig.base.json',
			compilerOptions: {
				outDir: 'dist',
				rootDir: 'src',
			},
			include: ['src/**/*'],
			exclude: ['node_modules', 'dist'],
		},
		null,
		2,
	);
};

// README.md 템플릿 생성
const createReadme = (packageName, description) => {
	return `# @dpm-core/${packageName}

${description}

## 설치

\`\`\`bash
yarn add @dpm-core/${packageName}
\`\`\`

## 사용법

\`\`\`typescript
import { } from '@dpm-core/${packageName}';

// 사용 예시
\`\`\`

## API 문서

### 컴포넌트/함수 목록

| 이름 | 타입 | 설명 |
|------|------|------|
| - | - | - |

## 예시

\`\`\`typescript
// 예시 코드
\`\`\`

## 변경사항

### [0.1.0] - ${new Date().toISOString().split('T')[0]}

#### Added
- 초기 패키지 생성
`;
};

// 기본 index.ts 파일 생성
const createIndexFile = (hasComponents) => {
	if (hasComponents) {
		return `// 컴포넌트 export
// export * from './components/MyComponent';

// 유틸리티 export
// export * from './utils/myUtils';

// 타입 export
// export * from './types/myTypes';

// 기본 export (필요시)
// export { default as MyComponent } from './components/MyComponent';
`;
	}

	return `// 유틸리티 함수 export
// export * from './utils/myUtils';

// 서비스 export
// export * from './services/myService';

// 타입 export
// export * from './types/myTypes';

// 기본 export (필요시)
// export { default as myService } from './services/myService';
`;
};

// 컴포넌트 템플릿 생성
const createComponentTemplate = (componentName) => {
	return `'use client';

import { type ComponentProps } from 'react';
import { cn } from '../utils/cn';

export interface ${componentName}Props extends ComponentProps<'div'> {
  // 컴포넌트 props 정의
}

export const ${componentName} = ({ 
  className, 
  children,
  ...props 
}: ${componentName}Props) => {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
};
`;
};

// cn 유틸리티 함수 생성
const createCnUtil = () => {
	return `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
};

// 디렉터리 생성 함수
const createDirectories = (packagePath, hasComponents) => {
	const dirs = ['src', 'src/types'];

	if (hasComponents) {
		dirs.push('src/components', 'src/utils');
	} else {
		dirs.push('src/services', 'src/utils');
	}

	for (const dir of dirs) {
		const dirPath = path.join(packagePath, dir);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
	}
};

// 메인 실행 함수
const main = async () => {
	try {
		log.title('🚀 DPM Core 패키지 생성 도구');
		console.log();

		// 패키지 이름 입력
		const packageName = await question('패키지 이름을 입력하세요 (예: ui-components): ');

		if (!packageName) {
			log.error('패키지 이름은 필수입니다.');
			process.exit(1);
		}

		// 패키지 경로 확인
		const packagePath = path.join(process.cwd(), 'packages', packageName);
		if (fs.existsSync(packagePath)) {
			log.error(`패키지 '${packageName}'이 이미 존재합니다.`);
			process.exit(1);
		}

		// 패키지 타입 선택
		console.log('\n패키지 타입을 선택하세요:');
		Object.keys(packageTemplates).forEach((key, index) => {
			console.log(
				`${index + 1}. ${packageTemplates[key].name} - ${packageTemplates[key].description}`,
			);
		});

		const typeChoice = await question('\n선택 (1-4): ');
		const templateKeys = Object.keys(packageTemplates);
		const selectedTemplate = packageTemplates[templateKeys[Number.parseInt(typeChoice) - 1]];

		if (!selectedTemplate) {
			log.error('올바른 선택을 해주세요.');
			process.exit(1);
		}

		// 패키지 설명 입력
		const description =
			(await question('패키지 설명을 입력하세요: ')) || selectedTemplate.description;

		log.info(`패키지 생성 중: @dpm-core/${packageName}`);
		log.info(`타입: ${selectedTemplate.name}`);
		log.info(`설명: ${description}`);

		// 패키지 디렉터리 생성
		fs.mkdirSync(packagePath, { recursive: true });
		createDirectories(packagePath, selectedTemplate.hasComponents);

		// package.json 생성
		fs.writeFileSync(
			path.join(packagePath, 'package.json'),
			createPackageJson(packageName, selectedTemplate, description),
		);

		// tsconfig.json 생성
		fs.writeFileSync(path.join(packagePath, 'tsconfig.json'), createTsConfig());

		// README.md 생성
		fs.writeFileSync(path.join(packagePath, 'README.md'), createReadme(packageName, description));

		// src/index.ts 생성
		fs.writeFileSync(
			path.join(packagePath, 'src', 'index.ts'),
			createIndexFile(selectedTemplate.hasComponents),
		);

		// 컴포넌트 관련 파일 생성
		if (selectedTemplate.hasComponents) {
			// cn 유틸리티 생성
			fs.writeFileSync(path.join(packagePath, 'src', 'utils', 'cn.ts'), createCnUtil());

			// 샘플 컴포넌트 생성 여부 확인
			const createSample = await question('샘플 컴포넌트를 생성하시겠습니까? (y/N): ');
			if (createSample.toLowerCase() === 'y') {
				const componentName =
					(await question('컴포넌트 이름을 입력하세요 (예: MyComponent): ')) || 'MyComponent';

				fs.writeFileSync(
					path.join(packagePath, 'src', 'components', `${componentName}.tsx`),
					createComponentTemplate(componentName),
				);

				// index.ts 업데이트
				fs.writeFileSync(
					path.join(packagePath, 'src', 'index.ts'),
					`// 컴포넌트 export
export * from './components/${componentName}';

// 유틸리티 export
export * from './utils/cn';

// 타입 export
// export * from './types/myTypes';
`,
				);
			}
		}

		log.success(`패키지 '@dpm-core/${packageName}'이 성공적으로 생성되었습니다!`);

		console.log('\n다음 단계:');
		console.log(`1. cd packages/${packageName}`);
		console.log('2. yarn install (워크스페이스 레벨에서 실행)');
		console.log(`3. yarn workspace @dpm-core/${packageName} build`);
		console.log(`4. 다른 패키지에서 사용: yarn workspace <app-name> add @dpm-core/${packageName}`);

		rl.close();
	} catch (error) {
		log.error(`오류 발생: ${error.message}`);
		process.exit(1);
	}
};

// 스크립트 실행
if (require.main === module) {
	main();
}

module.exports = { main };
