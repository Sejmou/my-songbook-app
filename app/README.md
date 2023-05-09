# My Songbook App
This is a React Native App I built with Expo. It allows musicians to store the songs (atm only song lyrics w/ section markers) on their local device and also sync to the cloud (TODO: proper account management). Furthermore, the app features MIDI support. So if you have a MIDI controller that you can connect to your iPhone or iPad, you can scroll the lyrics with it. This is especially nice if you have a foot switch connected.

## Notes to future self

In general, if something does not work `expo prebuild` should fix issues with native code dependencies in most cases.

### Building/Sideloading iOS app locally without Apple Dev account (100 euros per year lul) incl. the JS bundle

Note: It is IMPOSSIBLE to build via EAS without an Apple Dev account (yes, stupid af, but that's the way it is)

This should produce a proper app for use without having Metro dev server running

1. Open Xcode
2. Run Product -> Archive (should create an Archive for the current 'App Release' in Organizer Window)
3. Inside Organizer, right click latest archive -> Show in Finder
4. In Finder, right click -> Show Package Contents
5. Find `.app` file
6. Find your device in Window -> Devices and Simulators
7. Drag app onto your device's installed apps window
8. After installation you need to tell Apple that you trust the developer of the app (ironically this check is even required if I am logged in with my own account on my own device with the same Apple ID as my dev account lool) -> Settings -> General -> VPN & Device Management -> something with 'trust developer'

### If build fails

Disable Push Notifications addon/entitlement or whatever (should be somewhere in xcode project build settings, for some reason it reappers every now and then even after deletion)
