---
layout: post
title: "Swift 4 Cookbook - Linux & MacOS, part 1"
tags: swift
logo: https://user-images.githubusercontent.com/552398/31557278-5deba14c-b048-11e7-9ab0-b2d115d15bc9.png
comments: true
---


Swift is powerful, fast and safe programming language. From version 2 it's open source, and officialy supported on Linux. Its native performance, type safety, interactive (REPL) playground and scripting posibility, is a joy to use. 

The main goal for Swift on Linux is to be compatible with Swift on macOS/ios/watchos, and there is an official Apple documentation for [Foundation](https://developer.apple.com/documentation/foundation). Howerever, this quick cheat-sheet gives you quick glance what this language+standard library is capable of.	

### Setup

There are 2 ways to install Swift 4 for server side applications:

1. Standard installation:
	
	Download Swift 4.0 from: [swift.org](https://swift.org/download/) for your Ubuntu distribution, following [manual](https://swift.org/download/#using-downloads)
	
2. You can also use Docker instead, (it runs on all distros)

```bash
docker run --rm --privileged -ti swiftdocker/swift:latest /usr/bin/swift -I /usr/lib/swift/clang/include/
```

### What's so special about Swift 4 ? 

* expressive, high level language with generics
* safe by design(type safety, [optionals](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/OptionalChaining.html), [error handling](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/ErrorHandling.html#//apple_ref/doc/uid/TP40014097-CH42-ID508), undefined behavior detection)
* native code compilation with [high](http://www.marcinkliks.pl/2015/02/22/swift-vs-others/) [runtime performance](http://benchmarksgame.alioth.debian.org/u64q/swift.html)
* seamless, zero cost C language interoperability without [ha](https://golang.org/cmd/cgo/)[ck](http://cffi.readthedocs.io/en/latest/overview.html#purely-for-performance-api-level-out-of-line)[s](https://stackoverflow.com/questions/7699020/what-makes-jni-calls-slow)
* efficient memory management [arc](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/AutomaticReferenceCounting.html) and [ownership](https://github.com/apple/swift/blob/master/docs/OwnershipManifesto.md)
* functional paradigms [included](https://www.raywenderlich.com/114456/introduction-functional-programming-swift) 

### How to use this tutorial

* **Make sure you read [this great intro to Swift 4](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/GuidedTour.html#//apple_ref/doc/uid/TP40014097-CH2-ID1)** 
* This tutorial is about using Foundation API's, it's not a language guide. 
* This tutorial doesn't cover writing web app in swift, though - it's coming soon!

To play with examples in this tutorial, you can use swift [REPL](https://pl.wikipedia.org/wiki/REPL). You also compile the code with `swiftc [file.swift]`

1. To run REPL:
	1. On Mac - just type `swift`
	2. Linux - type: `swift -I /usr/lib/swift/clang/include/` 
2. You can also use XCode playground - fire up Xcode, then `File -> New -> Playground`

[More capabilities of Swift REPL here](https://swift.org/getting-started/#using-the-repl)
	

	
### Printing text

```swift
>print("Hello world!")
Hello world

>print("""
Hello\nworld!
""") 	
Hello
world

>print("one", "two", "three")
one two three

>print("one", "two", "three", separator: ",")
one,two,three

>print("one", "two", "three", separator: "\n")
one
two
three

>print(1, "and", 2)
1 and 2
```
	
#### Printing to stderr

```swift

import Foundation
FileHandle.standardError.write("test".data(using: .utf8)!)
```

#### Printing to stdin

```swift
    
import Foundation

FileHandle.standardError.write("test".data(using: .utf8)!)
FileHandle.standardInput.write("test".data(using: .utf8)!)
FileHandle.standardOutput.write("test".data(using: .utf8)!)

```

### Executing shell commands

#### Run process with arguments and wait for completion

```swift
	
import Foundation

let p = Process()
p.launchPath = "/usr/bin/wc"
p.arguments = ["-l", "/etc/passwd"]
p.launch()
p.waitUntilExit()
```	
	
#### Suspend and resume process in background

```swift

import Foundation

let p = Process()
p.launchPath = "/bin/cat"
p.arguments = ["/var/log/system.log"]
p.launch()
p.suspend()
sleep(1)
p.resume()
sleep(1)
p.terminate()
```

#### Monitor process running in background

This example prints system logs for 10 seconds, and then exits.

```swift
    
import Foundation

let p = Process()
p.launchPath = "/usr/bin/tail"
p.arguments = ["-f", "/var/log/system.log"]
p.launch()

var elapsedSeconds = 10
while p.isRunning && elapsedSeconds > 0  {
  print("Running")
  sleep(1)
  elapsedSeconds -= 1
}
```
	
#### Redirect stdin / stdout

```swift
    
import Foundation

let p = Process()
p.launchPath = "/bin/cat"
p.arguments = ["-"]

let pp = Pipe()

p.standardInput = pp

p.launch()
pp.fileHandleForWriting.write("test\n\u{4}".data(using: .utf8)!)
p.waitUntilExit()
```
	
### Networking

#### Download HTTP document

```swift
    
import Foundation

let downloadURL = URL(string: "http://www.google.com")!
let contents = String(contentsOf: downloadURL, encoding: .utf8)
print(contents)
```

#### Download HTTP document and autodetect(sniff) encoding
  
 ```swift
     
import Foundation

var x: String.Encoding = String.Encoding.ascii 
let url = "https://www.ecma-inational.org/publications/files/ECMA-ST/Ecma-128.pdf"
try? String(contentsOf: URL(
            string: url)!, 
            usedEncoding: &x) 

print(x) 
```

#### Download binary file

```swift
    
import Foundation

let fileContents = Data(contentsOf: URL("http://filea.x")!)
```

*Note*:  It uses RAM memory to store entire file in it, it can be handy for smaller files / quick scripts.

#### Download in parts(chunks)

```swift
    
import Foundation
import Dispatch

let config = URLSessionConfiguration.default
let s = URLSession(configuration: config)

let task = s.downloadTask(with: URL(string: "http://google.com")!) { url, response, err in
    count += 1
    print(count)
}
task.resume()

```
	
	
### Filesystem operations

#### Read binary file

```swift
    
import Foundation

let binaryData = Data(contentsOf: URL(fileURLWithPath: "/tmp/a.x")) 
```

#### Read text file
	
```swift
    
import Foundation

let textFile = String(contentsOf: URL(fileURLWithPath: "/etc/passwd")) 
```
	
#### Write to text file

```swift

import Foundation

"hello world".write(toFile: "/etc/xxx", atomically: true, encoding: .utf8)
```
	
#### Write to stderr

```swift

import Foundation

FileHandle.standardError.write("test".data(using: .utf8)!)
```

#### Write to stdin

```swift
    
import Foundation

FileHandle.standardError.write("test".data(using: .utf8)!)
FileHandle.standardInput.write("test".data(using: .utf8)!)
FileHandle.standardOutput.write("test".data(using: .utf8)!)
```
	
#### Read data in chunks

```swift
    
import Foundation

let f = FileHandle(forReadingAtPath: "/etc/passwd")
f!.readData(ofLength: 10)

// all: 
f!.readDataToEndOfFile()
```
	
#### Check if file is readable

```swift
    
import Foundation

if FileManager.default.isReadableFile(atPath: "/etc/fstab") {

}
```
	
#### Remove file

```swift
    
import Foundation

FileManager.default.removeItem(at: URL(fileURLWithPath: "/tmp/x")!)
```

#### Copy file

```swift
    
import Foundation

FileManager.default.copyItem(atPath: "from.txt", toPath: "to.txt")
```


#### Copy directory

```swift

import Foundation

FileManager.default.copyItem(atPath: "/etc/", toPath: "/etc.backup")
```

 

#### List directories

```swift
    
import Foundation

// Shallow list without folders
for entry in FileManager.default.contentsOfDirectory(atPath: "/") {

}

// deep list
for item in  FileManager.default.enumerator(atPath: "/etc")! {  
  print(item) 
}
```

#### Recursively list files     

```swift

import Foundation

FileManager.default.subpathsOfDirectory(atPath: "/root/")
```

#### Create directory with permissions

```swift
    
import Foundation

let permission = 0o700 as NSNumber

FileManager.default.createDirectory(
  atPath: "/tmp/my/brand/new/directory", 
  withIntermediateDirectories: true, 
  attributes: [.posixPermissions: permission]
)
```

## Coroutines / threads / 

Swift comes with LibDispatch which uses threads and queues for dealing with asynchronous tasks. 

### Concurrent requests example

```swift
        
import Foundation
import Dispatch

let config = URLSessionConfiguration.default

let s = URLSession(configuration: config)

var count = 0
for i in 1...100 {

let task = s.downloadTask(with: URL(string: "http://www.wp.pl")!) { url, response, err in
  count += 1
  print(count)

}
task.resume()
print("Started")

}
dispatchMain()
```

## Scripting with Swift

You can use Swift as a interpreted language, too with pure text files!

Just create swift file:
	
```swift
    
touch /tmp/hello && chmod a+x /tmp/hello
```
	
With contents:

```swift
    
#!/usr/bin/xcrun swift
  
import Foundation

print("Hello, what's your name?")
let name = readLine(strippingNewline: true)
print("Hello, \(name)")
```
	
Run it with `/tmp/hello` 

Voila! You can execute *any* of examples using this technique.
