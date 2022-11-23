/* eslint-disable @typescript-eslint/no-var-requires */
import { fs, path } from "@brandingbrand/kernel-core";
import { execSync } from "child_process";

const ios = async () => {
  const { iosSize = 212, backgroundColor = "#333132" } = {};

  const inputFile = path.project.resolve(
    path.config.assetsPath(),
    "splash-screen",
    "logo.png"
  );
  const { generate } = require(path.project.resolve(
    "node_modules",
    "react-native-bootsplash",
    "dist",
    "commonjs",
    "generate.js"
  ));

  await generate({
    ios: { projectPath: path.project.resolve("ios", "HelloWorld") },
    android: null,
    workingPath: path.project.path(),
    logoPath: inputFile,
    assetsPath: null,
    backgroundColor,
    logoWidth: iosSize,
  });

  execSync(
    `mv -f ${path.project.resolve(
      "ios",
      "HelloWorld",
      "BootSplash.storyboard"
    )} ${path.project.resolve("ios", "HelloWorld", "LaunchScreen.storyboard")}`
  );
};

const android = async () => {
  const { androidSize = 180, backgroundColor = "#333132" } = {};

  const inputFile = path.project.resolve(
    path.config.assetsPath(),
    "splash-screen",
    "logo.png"
  );
  const { generate } = require(path.project.resolve(
    "node_modules",
    "react-native-bootsplash",
    "dist",
    "commonjs",
    "generate.js"
  ));

  await generate({
    ios: null,
    android: { sourceDir: path.project.resolve("android", "app") },
    flavor: "main",
    workingPath: path.project.path(),
    logoPath: inputFile,
    assetsPath: null,
    backgroundColor,
    logoWidth: androidSize,
  });

  await fs.mkdirp(path.project.resolve(path.android.resourcesPath(), "layout"));
  await fs.writeFile(
    path.project.resolve(path.android.resourcesPath(), "layout", "splash.xml"),
    `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center_horizontal|center_vertical"
    android:background="${backgroundColor}">
    <ImageView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:background="@mipmap/bootsplash_logo"
        />
</LinearLayout>
`
  );

  fs.update(
    path.android.mainActivityPath({
      bundleIds: { android: "com.helloworld" },
    } as never),
    /(package[\s\S]+?;)/,
    `$1

import android.os.Bundle;
import androidx.annotation.Nullable;
`
  );

  fs.update(
    path.android.mainActivityPath({
      bundleIds: { android: "com.helloworld" },
    } as never),
    /(public class[\s\S]+?{)/,
    `$1
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      setContentView(R.layout.splash);
    }
`
  );
};

export { ios, android };
