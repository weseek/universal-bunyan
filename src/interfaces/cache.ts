import Logger from 'bunyan';

export interface LoggerCache {
  [key: string] : Logger;
}
