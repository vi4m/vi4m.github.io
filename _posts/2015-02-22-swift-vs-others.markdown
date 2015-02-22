---
title: Swift vs Go vs Python battle
layout: post
---

## Motivation

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
The alghorithm is faily easy - creating 1M array and filling with the incremental integers(64 bit ints). Then, creating another array which consits of sum of every 2 elements from first array. It de facto tests memory read / write access time. Then again, try to sum ap all of the array reading every 100th element - it should be very difficult to inline it properly, but who knows what Swift can do :->

![first](https://cloud.githubusercontent.com/assets/552398/6321021/40071842-baef-11e4-8a9e-c825642ca15c.png){: .center-image }

## Code differences

# Go
As you can see, the Go code is the longest one, but not much longer that the others. The source code is fairly short whatsover. But we can see, that mandatory `package()` and `main` function description is there. The weird part of Go is that the Rob Pike decided to not make `Print` a keyword, but rather library function. That's why you should import `fmt` module. Appart from this, array functions are quite limited in comparison to Python and Swift. By default, *Go's arrays are not resizable - as in C*. They provide `append` keyword for resizing arrays but don't agree on single vectors implementation. For example you can use [Slices pattern](http://golang.org/doc/effective_go.html#slices). WTF. After 30 years language designers should provide *one* efficient generics implementation! But let's go on. The way we declare the variable is bizzare - inside `for` loops declare local variable without `var`. But you can use `a := 1` and `var a = 1` the same way. Really messy.

# Swift
Swift has as well type inference everywhere, hence the short syntax for type definitions.
`append()` is a method, not keyword, just like in Python. The thing i love is to optional OOP - source code without structure of module, entry point is just compiled and evaluated like script. In fact adding header `#!/usr/bin/xcrun swift` followed by `chmod +x test.swift` allows us to do just `./test.swift` without compilation. *Wow*. 
What else... Println and print - are a keywords, your fingers will appreciate it. I really like the Range operators which are lazy evaluated, and handle custom iterations steps in performant manner. 

# Python
I really love Python, but the lack of optional typing, type inference, and compilation is lacking here. 
But where the language shines is - the source code is the shortest and the cleanest. `var y: Array<Int> = []` looks really iffy in comparison to the simple `y = []` in Python. But on the other hand, in Swift we can deal with that writing `var y : [Int] = []` which is slighty better on the eyes. I really love the Python clarity here. `xrange` operator is here with the similar purpose as `Range<Int>` in Swift.

## Performance

I run loop 30 times to be sure. The results are mixed. Python is more than 30x slower than Swift! On the other hand, Swift and Go comes so close, it doesn't matter - but in this microbenchmark Swift was 60% faster than Go. 
Pypy amazed my how performant it was - more than 5 times faster than ordinar CPython implementation. Wow. 
Unfortunatelly my favorite language - Python - sadly needed 34,5 times more than Swift, to finish the same program. 
The performance difference is so big, you can image, when swift/go finish the program in one day, and the CPython counterpart needs a *MONTH* to do the same thing.

The run times for all implementations:

![second](https://cloud.githubusercontent.com/assets/552398/6321023/5160183c-baef-11e4-9deb-48cdd9689155.png){: .center-image }

Let's compare it to the fastes implementation.

![third](https://cloud.githubusercontent.com/assets/552398/6321026/6045d224-baef-11e4-9c42-75a8a8b36ed2.png){: .center-image }

_In this particular test - Python is 34 times slower than Swift._

## Conclusion

- Swift is really fast today for scripting *and* high computing purposes.
- Type inference is a must nowadays. 
- PyPy is real surprise for me - and i wonder why it is still not the reference Python implemenatation ?
- Swift faster than Go is really surprising too because Go is *3 years ahead of Swift in public development*.
- I can't wait for Chris Lattner to open-source Swift.
