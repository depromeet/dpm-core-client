type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
	level: LogLevel;
	enableColors: boolean;
	enableEmojis: boolean;
	enableTimestamp: boolean;
	enableEnvironment: boolean;
}

class Logger {
	private config: LoggerConfig;
	private readonly levels: Record<LogLevel, number> = {
		debug: 0,
		info: 1,
		warn: 2,
		error: 3,
	};

	private readonly colors: Record<LogLevel, string> = {
		debug: '\x1b[36m', // cyan
		info: '\x1b[34m', // blue
		warn: '\x1b[33m', // yellow
		error: '\x1b[31m', // red
	};

	private readonly emojis: Record<LogLevel, string> = {
		debug: '🔍',
		info: 'ℹ️',
		warn: '⚠️',
		error: '❌',
	};

	private readonly reset = '\x1b[0m';

	constructor(config: Partial<LoggerConfig> = {}) {
		this.config = {
			level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
			enableColors: true,
			enableEmojis: true,
			enableTimestamp: true,
			enableEnvironment: true,
			...config,
		};
	}

	private shouldLog(level: LogLevel): boolean {
		return this.levels[level] >= this.levels[this.config.level];
	}

	private formatMessage(level: LogLevel, message: string, data?: unknown): string {
		let formattedMessage = '';

		/*
    타임스탬프
    */
		if (this.config.enableTimestamp) {
			const timestamp = new Date().toISOString();
			formattedMessage += `[${timestamp}] `;
		}

		/*
    환경 정보
    */
		if (this.config.enableEnvironment && process.env.NODE_ENV) {
			formattedMessage += `[${process.env.NODE_ENV.toUpperCase()}] `;
		}

		/*
    로그 레벨
    */
		const levelStr = level.toUpperCase().padEnd(5);

		if (this.config.enableColors) {
			formattedMessage += `${this.colors[level]}${levelStr}${this.reset} `;
		} else {
			formattedMessage += `${levelStr} `;
		}

		/*
    이모지
    */
		if (this.config.enableEmojis) {
			formattedMessage += `${this.emojis[level]} `;
		}

		/*
    메시지
    */
		formattedMessage += message;

		return formattedMessage;
	}

	private log(level: LogLevel, message: string, data?: unknown): void {
		if (!this.shouldLog(level)) return;

		const formattedMessage = this.formatMessage(level, message, data);

		const consoleMethod =
			level === 'error'
				? console.error
				: level === 'warn'
					? console.warn
					: level === 'info'
						? console.info
						: console.debug;

		if (data !== undefined) {
			consoleMethod(formattedMessage, data);
		} else {
			consoleMethod(formattedMessage);
		}
	}

	debug(message: string, data?: unknown): void {
		this.log('debug', message, data);
	}

	info(message: string, data?: unknown): void {
		this.log('info', message, data);
	}

	warn(message: string, data?: unknown): void {
		this.log('warn', message, data);
	}

	error(message: string, data?: unknown): void {
		this.log('error', message, data);
	}

	api(method: string, url: string, status?: number): void {
		const emoji = status ? (status >= 400 ? '🔴' : status >= 300 ? '🟡' : '🟢') : '🌐';
		this.info(`${emoji} ${method.toUpperCase()} ${url}${status ? ` - ${status}` : ''}`);
	}

	auth(action: string, data?: unknown): void {
		this.info(`🔐 AUTH: ${action}`, data);
	}

	query(queryKey: string[], action: string): void {
		this.debug(`🔄 QUERY: [${queryKey.join(', ')}] - ${action}`);
	}

	component(name: string, action: string, data?: unknown): void {
		this.debug(`🧩 COMPONENT: ${name} - ${action}`, data);
	}

	// 설정 업데이트 메서드
	setLevel(level: LogLevel): void {
		this.config.level = level;
	}

	setConfig(config: Partial<LoggerConfig>): void {
		this.config = { ...this.config, ...config };
	}
}

// 기본 logger 인스턴스 생성
export const logger = new Logger();

// Logger 클래스도 export하여 커스텀 인스턴스 생성 가능
export { Logger };

// 타입도 export
export type { LoggerConfig, LogLevel };
