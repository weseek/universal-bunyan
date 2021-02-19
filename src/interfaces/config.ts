import { LogLevel } from 'bunyan';

export interface UniversalBunyanConfig {
  [key: string] : LogLevel;
}
