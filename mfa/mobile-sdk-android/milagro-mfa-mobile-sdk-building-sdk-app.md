---
currentMenu: milagro-mfa-mobile-sdk-building-sdk-app-android
---

# Building the SDK & App

This page explains how to build the Milagro MFA Mobile SDK and the app for Android with _Android Studio_.

## Prerequisites

Download and install Android Studio or higher with Android SDK 16 or higher.

## Building the mobile SDK

Download or Clone the project [`milagro-mfa-sdk-android`](https://github.com/miracl/milagro-mfa-sdk-android) with its submodules.

### From Android Studio

* Import the project: File -&gt; Open -&gt;  &lt;milagro-mfa-sdk-android&gt;
* From Gradle Tool View select: mpinsdk -&gt; Tasks -&gt; build -&gt; build
* The assembled aar's will be located in `<milagro-mfa-sdk-android>/mpinsdk/build/outputs/aar`

### From a Command Line

* Navigate to `<milagro-mfa-sdk-android>`
* Execute `./gradlew build`
* The assembled aar's will be located in `<milagro-mfa-sdk-android>/mpinsdk/build/outputs/aar`
