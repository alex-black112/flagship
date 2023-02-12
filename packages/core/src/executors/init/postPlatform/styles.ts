import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";
import { styles } from "../../../utils";

export const execute = (options: InitOptions, config: Config) => ({
  ios: async () => {
    //
  },
  android: async () => {
    if (config.android.styles?.appThemeAttributes) {
      styles.setAppThemeAttributes(config.android.styles.appThemeAttributes);
    }

    if (config.android.styles?.appThemeElements) {
      styles.addAppThemeElements(config.android.styles.appThemeElements);
    }
  },
});