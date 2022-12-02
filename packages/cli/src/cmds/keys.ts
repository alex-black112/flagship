import { program } from "commander";
import { keys, platforms } from "@brandingbrand/kernel-core";

program
  .command("keys")
  .description(
    "configure ios codesigning and/or android keystore signing config"
  )
  .option("-p, --platform [platform]", "platform: ios or android", "ios")
  .option("-q, --quiet", "supress stdout")
  .action(async (options) => {
    for (const e of keys.pre.executors) {
      await e.execute(options, {}, __dirname);
    }

    for (const u of [keys.prePlatform, keys.platform, keys.postPlatform]) {
      for (const p of platforms.get(options.platform)) {
        for (const e of u.executors) {
          await e.execute(options, {}, __dirname)[p]();
        }
      }
    }

    for (const e of keys.post.executors) {
      await e.execute(options, {}, __dirname);
    }
  });
