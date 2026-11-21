# AfterGlowAve iOS Preview

This is a **native SwiftUI prototype**, intended for iOS Simulator testing. It currently includes a searchable alphabetical city directory, on-device saved favorites, tic-tac-toe, dice rolling, and a self-attested 18+ entry gate. It does **not** yet include video calling, live multiplayer, paid subscriptions, real identity/age verification, or cloud accounts.

## Build

This repository contains an XcodeGen specification in `project.yml`. On a Mac with Xcode 26 and XcodeGen installed:

```sh
xcodegen generate
xcodebuild -project AfterGlowAve.xcodeproj -scheme AfterGlowAve -configuration Debug -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO build
```

Or open the **Build AGA iOS simulator** GitHub Actions workflow, select a successful run, and download the `AfterGlowAve-iOS-Simulator` artifact. This `.app` is for an Apple simulator only; it is **not** an App Store `.ipa` or a directly installable iPhone application.

## App Store release blockers

Before submitting to Apple, complete the service features promised to customers, privacy policy and data handling disclosures, substantive moderation and account safeguards for the social/dating category, true age verification where required, in-app purchase integration for digital memberships, app icons, launch assets, device tests, and signed device archives using your Apple Developer team. The example bundle identifier `com.afterglowave.ios` is provisional; confirm ownership and availability before creating the App Store Connect record.

**Do not commit signing certificates, private keys, or store credentials to this public repository.**
