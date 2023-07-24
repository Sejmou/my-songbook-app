# My Songbook App
This is the native app for the My Songbook project. It is built with React Native and Expo, using the [`react-native-midi`](https://github.com/motiz88/react-native-midi) Expo module by motiz88 for MIDI support.

## Prerequisites for development/building/sideloading
Android Studio needs to be installed for Android development (I think lol).

You can only develop for iOS on a Mac! Also, you need to have Xcode installed.

As this project uses native code (for the MIDI part), you need to run `npx expo prebuild` before running the app for the first time. This will create the native code dependencies for both Android and iOS.

## Development/testing
With this approach, JavaScript code for React Native is served from your machine (bundler runs in the background) and served to your device (either emulator or real device).

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

Per default, either option should run an emulator on your machine.

TODO: add instructions for real device testing (don't understand fully yet)

## Sideloading (i.e. 'inofficial' builds for real devices)
### Android

#### Option A: Android Studio
Build -> Generate Signed Bundle/APK -> APK -> (if not exists: Create new keystore -> Fill out form) -> Build Type: release -> Copy APK to device (install Android File Transfer if necessary) -> Install APK (allow unknown sources in settings, skip Play protect warning)

#### Option B: Command line (doesn't work for me atm)
Requirements:

 - `bundletool` for creating Android App Bundle (`.aab` file, contains `.apk` for your app as well) - installable via homebrew
 - `adb` for installing created `.apk` on your device - should come with Android Studio installation, also installable via homebrew (as part of `android-platform-tools`)
 - `keytool` for generating keystore used for signing the app (without signing, built app will NOT be installable!) - comes with your JDK installation

Steps:

1. Create `.aab` file for App Bundle containing your `.apk` (either with `eas build` or `eas build --local`, picking Android as target platform, of course) - if building locally, make sure `ANDROID_HOME` is set properly
2. If you don't have a keystore file yet, create one with `keytool` (make sure to specify the proper keystore and key alias name):
   
   ```
   keytool -genkey -v -keystore my-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
   ```

3. Locate created `.aab` file from previous step and run
   
   ```
   bundletool build-apks --bundle=your-bundle-name.aab --output=app.apks --mode=universal --ks=my-key.keystore --ks-key-alias=alias_name   
   ```
4. unzip created `.apks` file
   
   ```
   unzip -o app.apks -d app
   ```
5. Install `.apk` located inside created directory with `adb`
   
   ```
   adb install app/universal.apk
   ```

### iOS

Note: It is IMPOSSIBLE to build via EAS without an Apple Dev account (yes, stupid af, but that's the way it is)

1. Open Xcode
2. Run Product -> Archive (should create an Archive for the current 'App Release' in Organizer Window)
3. Inside Organizer, right click latest archive -> Show in Finder
4. In Finder, right click -> Show Package Contents
5. Find `.app` file
6. Find your device in Window -> Devices and Simulators
7. Drag app onto your device's installed apps window
8. After installation you need to tell Apple that you trust the developer of the app (ironically this check is even required if I am logged in with my own account on my own device with the same Apple ID as my dev account lool) -> Settings -> General -> VPN & Device Management -> something with 'trust developer'

#### If the build fails
Disable Push Notifications addon/entitlement or whatever (should be somewhere in xcode project build settings, for some reason it reappers every now and then even after deletion)

## Building for release
TODO: figure it out

## Random notes
A weird issue that probably only affects me: I installed `coursier` on my Mac because I used Scala in some other project. This would set my `JAVA_HOME` to the wrong Java JDK (version 8 instead of 11) and cause `npx expo run:android` to fail. Only after setting `JAVA_HOME` to the correct JDK version, the build would succeed.

To set coursier to the proper Java version, run `cs java --jvm 11`.
