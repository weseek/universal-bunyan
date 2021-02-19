import { LogLevel, Serializers, Stream } from 'bunyan';
import { UniversalBunyanConfig } from './config';

export type UniversalLoggerOptions = {
    name: string;
    streams?: Stream[];
    level?: LogLevel;
    stream?: NodeJS.WritableStream;
    serializers?: Serializers;
    src?: boolean;
    config?: UniversalBunyanConfig;
    [custom: string]: any;
}
