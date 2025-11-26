---
title: Flutter Tutorial Part 2 - Understanding The Basics
description: Walk through how the basic demo app works.
lastUpdatedOn: 2025-11-15
categories:
  - frontend
tags:
  - flutter
  - dart
  - mobile
---

Last time we went through development environment setup for Flutter and
generated a demo app. Today, let's take a deeper look at the generated source
code and understand how it works.

Without further ado, I'm going to open the project in VSCode. If you are using
VSCode also, make sure you install the
[Official Flutter Extension](https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter).

## Folders And Files.

Wow, that's a lot of directories - you might say, but actually we can ignore
most of them. The only two directories, we care about are only the `lib` and
`test` directories, which holds your source code and unit test code
respectively. You can see a single `main.dart` file in the `lib` directory, and
that is our entire code base, for now...

For completeness, here is what each directories do:

- `.dart_tool` - Dart packages and tools. Generated and used by Dart / Flutter.
- `.idea` - Settings for [IntelliJ IDEA](https://www.jetbrains.com/idea/).
- `.vscode` - Settings for [VSCode](https://code.visualstudio.com/).
- `android` - Android project settings. Used by Android Studio for build Android
  Apps.
- `build` - Flutter generated build files.
- `ios` - iOS project settings. Open with XCode to configure and build iOS Apps.
- `lib` - Contains source code. We will be working in this folder mostly.
- `linux` - Linux project settings. Contains CMake file to build for Linux.
- `macos` - MacOS project settings. Open with XCode to configure and build MacOS
  apps.
- `test` - This is where you write tests.
- `web` - Web build.
- `windows` - Windows project settings. Contains CMake file to build for
  Windows.

**This means Flutter can build for the following platforms**

- Android
- iOS
- Web
- MacOS
- Linux
- Windows

I don't think we will ever need this much compatibility, but it's good to know
you've got pretty much everything covered. Maybe game consoles are the next,
Flutter?

## The Code

Now we have the directory structure squared away, let's take a look at the file
that actually matters. The `lib/main.dart` file. Let's go over it section by
section.

### Imports And Dependencies Management

As you can see, our demo has only a single import - `flutter/material.dart`.

```dart
import 'package:flutter/material.dart';
```

This is package for Google's
[Material Components](https://docs.flutter.dev/ui/widgets/material). We use this
package to render components such as FABs and Texts.

More importantly, this code demonstrates the use of dependencies. Just like
`npm` for `node`, the equivalent package manager for Dart is `pub`. For example,
if we want to use the popular [bloc](https://pub.dev/packages/bloc) package to
help us manage streams, we can simply run:

```bash
dart pub get bloc
```

Dart will faithfully retrieve the package, create or update dependency section
in `pubspec.yaml` and creates a `pubspec.lock` file. These files are
conceptually similar to `package.json` and `package-lock.json` in `Node.js`.

### Entry Point

Moving on to the next section, you will see the following code:

```dart
void main() {
  runApp(const MyApp());
}
```

This is actually pretty self-explanatory. the `void main()` signature should be
familiar for anyone worked in `C` / `C++`. This is where the application starts.
Inside the `main` function, we call `runApp` with an instance of `MyApp`. We are
literally telling Flutter to literally run `MyApp`.

### App Structure

Next let's take a look at the definition of `MyApp`.

```dart
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}
```

Immediately, we can tell that `MyApp` inherits from `StatelessWidget`. In
Flutter, a `Widget` is the same thing as a `Component` in React. A
`StatelessWidget` is similar to a `Pure Component` in React, that is, it
contains no mutable state.

The `@override` line is actually optional. However it is recommended for
clarity. In this case, it denotes that the `build` method is being re-defined by
the `MyApp` child class.

Next, let's take a look at the `build` method. Just like the `render` method in
classic React, the `build` method is what makes the components show up on the
screen. The `build` method takes a `BuildContext` parameter. Conceptually, it is
similar to `context` in classic React. It then returns a `Widget` as the child
component. So, it is almost conceptually identical to the `render` method in
React.

In side the `build` method, we instantiate a
[`MaterialApp`](https://api.flutter.dev/flutter/material/MaterialApp-class.html)
widget provided by the `material` package imported earlier. In the constructor
parameter, we specify its title, theme, and home screen. For a real app, you
will need to define routes and screens. You can specify `routes` here as well,
but we will skip it for now.
[`ThemeData`](https://api.flutter.dev/flutter/material/ThemeData-class.html) is
again imported from the `material` package, and it allows you to customize the
Material Theme. Lastly, the `MyHomePage` widget is defined in the next section.

### Home Screen

Let's take a look at the definition of `MyHomePage` down below.

```dart
class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}
```

As you can see, `MyHomePage` is a `StatefulWidget`. This means it contains
states. This is where Flutter and React differs when it comes to defining
components with states. In Flutter, `StatefulWidget`s need to define a
`createState` method. This method is responsible to create a `State` instance
for `MyHomePage` class. The return type `State<MyHomePage>` is a generic State
that contains the actual logic for state handling. In this code, we define this
method using an arrow function `=>` with implicit return. This is identical to
ES6 arrow function.

In most cases, the `StatefulWidget` is actually mostly ceremony. An incantation
you must utter to make things happen. (The real reason is more complicated, and
is due to `Widgets` have to be immutable, and it's not really important to
explain it at this stage.)

The actual state manipulation and rendering is defined in `_MyHomePageState`.

```dart
class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headline4,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

As expected, this class is a lot longer, because it contains all the
implementations of the app. The class name is `_MyHomePageState`. The `_` makes
this class `private`. This is a Dart feature / rule. Baiscally, when you see
`_`, think `private` in Dart. This class also inherits from `State<MyHomePage>`,
which is what we need satisfy the return type of `createState`.

The class variable `_counter` is the state that we need to track. Again due to
`_`, it is `private`.

The `_incrementCounter` method is a private method that handles state change. It
serves the same purpose as event handlers in React. The `setState` function must
be called to let Flutter know that the state has changed, triggering a redraw.
Again, it is similar to `setState` in React.

Lastly, the `build` method creates child widgets used for rendering. In this
method, we instantiate various components. The
[`Scaffold`](https://api.flutter.dev/flutter/material/Scaffold-class.html)
component creates a basic Material Layout where you can specify an
[`AppBar`](https://api.flutter.dev/flutter/material/AppBar-class.html), it's
body, FAB, etc.

Inside the `body` specification, we used `Center` and `Column` to horizontally
and vertically center our
[`Text`](https://api.flutter.dev/flutter/widgets/Text-class.html)s. The string
`'$_counter'` is a Dart feature that allows string interpolation. In this case,
it just prints the value of `_counter`.

In the `floatingActionButton` specification, we use the
[`FloatingActionButton`](https://api.flutter.dev/flutter/material/FloatingActionButton-class.html)
widget to render a FAB. We hook the `onPressed` event to the `_incrementCounter`
event handler. So every time the FAB is pressed, the `_incrementCounter` method
is called. In there the `setState` is called with `_counter++`, triggering
re-render to update the counter.

## Conclusion

As you can see, Flutter is very similar in concept to React with a few
superficial differences. Therefore, if you already know React, Flutter should be
not be difficult to learn. Now it's your turn to take the dive. See if you can
customize the theme color. Or perhaps, add another button to decrease click
counts. These hands on exercises will help you learn faster.

In our next session, we will make a simple app with routes, pages, and
[bloc](https://pub.dev/packages/flutter_bloc), making the demo app one step
closer to a real application.
