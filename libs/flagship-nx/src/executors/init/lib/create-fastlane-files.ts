import { generateFiles, Tree } from '@nrwl/devkit';
import { join } from 'path';

import { android, ios, PlatformSpecific } from './platform';

export interface CreateFastlaneFilesOptions {
  projectRoot: string;
  className: string;
  shortVersion: string;
  organization: string;
  bundleIdentifier: string | PlatformSpecific<string>;
  appName: PlatformSpecific<string>;
  ios: {
    exportTeamId: string;
    appleCert: string;
    profilesDir: string;
    distCert: string;
    distP12: string;
    provisioningProfileName: string;
  };
  android: {
    storeFile: string;
    keyAlias: string;
  };
}

export const createFastlaneFiles = (tree: Tree, options: CreateFastlaneFilesOptions) => {
  const { bundleIdentifier, appName, ...iosOptions } = options;

  generateFiles(tree, join(__dirname, '../files/fastlane/ios'), join(options.projectRoot, 'ios'), {
    bundleIdentifier: ios(bundleIdentifier),
    appName: ios(appName),
    ...iosOptions,
  });

  generateFiles(
    tree,
    join(__dirname, '../files/fastlane/android'),
    join(options.projectRoot, 'android'),
    {
      bundleIdentifier: android(bundleIdentifier),
      appName: android(appName),
      ...iosOptions,
    }
  );
};
