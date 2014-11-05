---
title: Apple and Opensource
layout: post
---


Apple is known for being the most closed company in the world. But let's see what is the truth about it. 

Let's take a look into the openess of Apple from 3 perspectives.

1. Development
2. Community 
3. Open standards

Development
-----------

It turns out there is a site which publish all open source components which apple make accessible for anybody: [opensource.apple.com)[https://www.opensource.apple.com]. But the caveat is - Apple decided to not open graphics libraries of OSX, only publishing the Darwin Open Source components
* CLI tools
* kernel
* core libraries

You can even try to compile kernel, but you have to feed it with proprietary binary blobs so you can boot the system.

Community
---------

It's complicated.


* They don't provide built-in package manager. But the community resolved this with `homebrew` and `macports`. 

* *KTHML/Webkit* Apple from time to time hihack some open source project with the leader together, than develop it in-house without much integration with the community. The case were for example when Apple decided to fork KHTML into the Webkit. The stigma of this remains for today, where KDE team develop in parallel own fork of Webkit. 
* *Clang / LLVM* is an example of live project so far, they accept pull request quite fast
* *CUPS* - live well, all community around the CUPS lives great.
* *SWIFT* - we will see if this new project will see the open source light soon. The community request it [already!]( http://www.infoworld.com/article/2682425/application-development/application-development-7-reasons-apple-should-open-source-swift-and-7-reasons-it-won-t.html)
* *OpenCL* - industry standard for GPU computing language, probably one of the most important today - fully opensourced from Apple.



