---
title: Swift vs Go vs Python battle
layout: post
---

Swift is the new programming language brought to you by Apple last year. 
As a Polyglot Programmer, I read whole Swift book just after Apple Keynote streaming - it was so fascinating to see
another Sexy Programming language. Apple compared Swift to the Python - because:

- it shares the same language simplicity (for example print is the keyword, OOP programming is optional)
- great interactive interpreter built into the runtime( `swift` vs `swiftc`)
- can be used for scripting purposes (`#!/usr/bin/xcrun swift`)

But the way it differs from Python is the internals. 
Swift underlaying technology is based on LLVM, which handles all of data structures, compiling and optimization tasks on its own.

Last week Swift 1.2 was released so i decided to write small benchmark game for 
- Swift
- Google's GO
- CPython
- PyPy

It was delightfull to simultanously write code for 4 platforms in multisplit code editor window :-)

![first](https://cloud.githubusercontent.com/assets/552398/6321021/40071842-baef-11e4-8a9e-c825642ca15c.png)

![second](https://cloud.githubusercontent.com/assets/552398/6321023/5160183c-baef-11e4-9deb-48cdd9689155.png)

![third](https://cloud.githubusercontent.com/assets/552398/6321026/6045d224-baef-11e4-9c42-75a8a8b36ed2.png)
