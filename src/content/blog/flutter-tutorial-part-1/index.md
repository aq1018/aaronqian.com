---
title: Flutter Tutorial Part 1 - Development Environment Setup
description:
  Setup Flutter on your local environment and make cross-platform mobile apps.
date: 2022-10-30
draft: true
categories:
  - frontend
tags:
  - flutter
  - dart
  - mobile
---

This tutorial will guide you through setting up your local Flutter development
environment on MacOS, enabling development for iOS and Android. It ends with
running your very first Flutter App.

## Why Flutter?

I have dabbled with [Dart](https://dart.dev/) for some toy backend experiment
when it first came out years ago, even before ES6 era. I really liked how it was
typed and offer very mature IDE integrations. I also loved its Stream API.

A few years later, [Flutter](https://flutter.dev/) is overtaking
[React Native](https://reactnative.dev/) on
[Google Trends](https://trends.google.com/trends/explore?date=today%205-y&geo=US&q=%2Fg%2F11h03gfxy9,%2Fg%2F11f03_rzbg),
I decided to dive head first and give it a try!

<!-- TODO: Add Google Trends embed component -->
<!-- {{<google_trends keywords="/g/11f03_rzbg, /g/11h03gfxy9" range="5-y">}} -->

## Overview

This series of articles will walk you through my journey from setting up the
development environment to various aspects of building a non-trivial app. Each
step of the way, I will document my findings in small, bite-sized articles for
easy consumptions.

In this article, I will cover setting up the development environment for both
iOS and Android development. I'm assuming you are using the latest MacOS.

This series of articles is broken down as the following:

- **Development Environment Setup**
- A Brief Overview on Flutter
- Login Page with Firebase Auth
- Profile Page

## Install XCode

Install
[XCode from the App Store](https://apps.apple.com/us/app/xcode/id497799835?mt=12)
if you haven't done so.

Next, you will need to install the XCode CommandLine Tools by running the
following command in your terminal:

```bash
xcode-select --install
```

## Install HomeBrew

[HomeBrew](https://brew.sh/) is a package manager for MacOS. The installation is
very simple, please go to https://brew.sh/ and follow the instructions there.

Read the notes after installation and make sure your `.zshrc` or `.bash_profile`
is properly configured. It's also helpful to run `brew doctor` to verify brew is
installed correctly.

## Install Flutter

The easiest way to install Flutter on macOS is probably by using HomeBrew.

```bash
brew install --cask flutter # install flutter
```

## Install Android Studio

In order to compile Flutter App for Android, we need to install Android Studio.
Again, this can be done with HomeBrew

```bash
brew install --cask android-studio
```

## Install Android SDK, CommandLineTools

Open Android Studio in the Apps folder and you will encounter the initial setup
process. Select the standard setup, and complete the initial setup. By default
this will download the Android SDK and Android Emulators.

Once the initial setup is done. You need to open the `Preferences` menu, and
navigate to: `Appearance And Behavior` -> `System Settings` -> `Android SDK`.

- In `SDK Platforms` tab, make sure the latest Android version ( 12 ) is
  checked.
- In `SDK Tools` tab, make sure you have the the following checked:
  - Android SDK Build-Tools 33
  - Android SDK Command-line Tools (latest)
  - Android Simulator
  - Android SDK Platform-Tools

Finally, click Ok button and wait for installation to complete.

## Sanity Check

Now it's time to see if we have setup everything correctly. In a terminal run:

```bash
flutter doctor
```

You should have everything green.

## Generate A New App

Now we have flutter setup, we can start by generating a skeleton app for our
project.

```bash
flutter create todoapp
```

This will create a new project called `todoapp` . Change the project name to
your liking.

## Run The New App on iOS Simulator

First open the iOS Simulator by either type in `Simulator` in Spotlight Search (
Cmd + Space ) or running `open -a Simulator` in terminal and wait for the
simulated iOS device to boot fully.

Now, in the project directory, run the command below.

```bash
flutter run # runs the new app
```

Wait for it to compile, it might take a while. After compilation is done, your
iOS simulator should have the skeleton app running.

## Run The New App on Android Simulator

First open Android Studio, then open the AVD Manager (Android Virtual Device
Manager). You should have a default virtual device setup during installation.
Click on the green arrow to start the device and wait for it to boot fully.

Now, in the project directory, run the command below.

```bash
flutter run # runs the new app
```

Similarly as with iOS, it takes a long time to compile on first run. But once
it's done, your app should show up on the simulated Android device.

## What's next?

With the development environment setup, we can now start building our App. But
before that, let's have an overview of Flutter and introduce some core concepts.
