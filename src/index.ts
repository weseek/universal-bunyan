import Logger, { createLogger as createLoggerForNode, LogLevel, LogLevelString } from 'bunyan';
import { createLogger as createLoggerForBrowser } from 'browser-bunyan';
import minimatch from 'minimatch';

import defaultStream from './stream';
import { LoggerCache } from './interfaces/cache';
import { UniversalBunyanConfig } from './interfaces/config';
import { UniversalLoggerOptions } from './interfaces/options';

const isBrowser = typeof window !== 'undefined';
const isProd = process.env.NODE_ENV === 'production';

const loggers: LoggerCache = {};


// retrieve configuration from environment variables
const envLevelMap: { [key: string] : LogLevelString } = {
  INFO:   'info',
  DEBUG:  'debug',
  WARN:   'warn',
  TRACE:  'trace',
  ERROR:  'error',
  FATAL:  'fatal',
};
const configFromEnv: UniversalBunyanConfig = {};
Object.keys(envLevelMap).forEach((envName) => { // ['INFO', 'DEBUG', ...].forEach
  const envVars = process.env[envName]; // process.env.DEBUG should have a value like 'app:service1,app:service2,...'
  if (envVars != null) {
    const level = envLevelMap[envName];
    envVars.split(',').forEach((ns) => { // ['app:service1', 'app:service2', ...].forEach
      configFromEnv[ns.trim()] = level;
    });
  }
});

/**
 * determine logger level
 * @param ns Logger namespace
 */
function determineLogLevel(config: UniversalBunyanConfig, ns: string): LogLevel {
  if (isBrowser && isProd) {
    return 'error';
  }

  let level: LogLevel = config.default ?? 'info';

  /* eslint-disable array-callback-return, no-useless-return */
  // retrieve configured level
  Object.keys(config).some((key) => { //  breakable forEach
    // test whether ns matches to 'key'(blob)
    if (minimatch(ns, key)) {
      level = config[key];
      return; //                          break if match
    }
  });

  return level;
}

export const createLogger = (opts: UniversalLoggerOptions): Logger => {
  const createLoggerFixed = isBrowser
    ? createLoggerForBrowser
    : createLoggerForNode;

  const ns = opts.name;

  // create logger instance if absent
  if (loggers[ns] == null) {
    if (opts.stream == null && opts.streams == null) {
      opts.stream = defaultStream;
    }
    if (opts.level == null) {
      const config = Object.assign(opts.config ?? {}, configFromEnv);
      opts.level = determineLogLevel(config, ns);
    }
    loggers[ns] = createLoggerFixed(opts as any) as unknown as Logger;
  }

  return loggers[ns];
};
