import { Writable } from 'stream';

import bunyanFormat from 'bunyan-format';
import { ConsoleFormattedStream } from '@browser-bunyan/console-formatted-stream';

const isBrowser: boolean = typeof window !== 'undefined';

function toBoolean(value: string): boolean {
  return /^(true|1)$/i.test(value);
}

function determineStream(): Writable {
  // browser settings
  if (isBrowser) {
    return new ConsoleFormattedStream() as Writable;
  }

  // node settings
  const isFormat = (process.env.FORMAT_NODE_LOG == null) || toBoolean(process.env.FORMAT_NODE_LOG);
  if (isFormat) {
    return bunyanFormat({ outputMode: 'long' });
  }
  return process.stdout;
}

export default determineStream();
