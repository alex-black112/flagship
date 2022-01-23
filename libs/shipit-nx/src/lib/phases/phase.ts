import { logger } from '@nrwl/devkit';
import chalk from 'chalk';

import { ShipConfig } from '../configs/ship.config';

export type PhaseConstructor<C extends ShipConfig = ShipConfig> = new (config: C) => Phase;

export interface Phase {
  readonly readableName: string;
  run: () => Promise<void> | void;
}

export const runPhases = async <C extends ShipConfig>(
  phases: PhaseConstructor<C>[],
  config: C
): Promise<void> => {
  for (const Phase of phases) {
    const phase = new Phase(config);

    try {
      logger.log(`${chalk.dim('phase:')} ${phase.readableName}`);
      await phase.run();
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(error.message);
      } else {
        logger.error(`An unexpected error occurred`);
      }
      process.exitCode = 1;
      break;
    }
  }
};
