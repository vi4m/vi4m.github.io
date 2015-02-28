---
title: Swift vs Go vs Python battle
layout: post
---

## Motivation

Swift is the new programming language brought to you by Apple last year. It brings freshness to the world of C, Python, Ruby, Rust, Go world with the new ideas. The language is *not* as beautiful as Python, and is *not* as fast as raw C, and compile speed is noting to compete with Go. But the Swift's motivation was to hit the sweet spot between C , Python and go. I strongly recommend to read the Swift Book [for example here](https://dl.dropboxusercontent.com/u/20996794/Swift%20Programming%20Language.pdf)

Apple put Swift side by side with Python during the presentation. Why?

- both languages share the same language simplicity (for example print is the keyword, OOP programming is optional)
- both are great interactive interpreters( `swift` vs `swiftc`)
- both can be used for scripting purposes (`#!/usr/bin/xcrun swift`)
- but the performance differs between these languages and
- Swift is not Open Source yet, Booo!

![wcdxk-2](https://cloud.githubusercontent.com/assets/552398/6324247/b2d2f7cc-bb37-11e4-91b8-dc7c33b5fef3.jpg){: .center-image }


Swift underlaying technology is based on LLVM, which handles all of the data structures, all compiling and optimization tasks on its own. LLVM is used also by PyPy, CLang and other languages as well.

## Is it really as fast as advertised?

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
As you can see, the Go code is the longest one, but not much longer that the others. The source code is fairly short whatsover. But that mandatory `package()` and `main` function requirement is enforced. The weird part of Go is that the Rob Pike decided to not make `Print` a keyword, but rather library function. That's why you should import `fmt` module. Appart from this, array functions are quite limited in comparison to Python and Swift. By default, *Go's arrays are not resizable - as in C*. They provide `append` keyword for resizing arrays but don't agree on single vectors implementation. For example you can use [Slices pattern](http://golang.org/doc/effective_go.html#slices). WTF. After 30 years language designers should provide *one* efficient generics implementation! But let's go on. The way we declare the variable is bizzare - inside `for` loops declare local variable without `var`. But you can use `a := 1` and `var a = 1` the same way. Really messy.
The good part is the _compiler speed_ - it's the fastest compiler i have ever seen. Basically it feels like an interpreter(but it's not interactive). You can even run `go run` to hide compiling step.

# Swift
Swift has as well type inference everywhere, hence the short syntax for type definitions.
`append()` is a method, not keyword, just like in Python. The thing i love is an optional OOP not enforced on you. 
No package, no module, not even main function required. Furthermore - adding header `#!/usr/bin/xcrun swift` followed by `chmod +x test.swift` allows us to do just run `./test.swift` without compilation, just like Python. *Wow*. 
What else... Println and print - are a keywords, your fingers will appreciate it. I really like the Range operators which are lazy evaluated, and handle custom iterations steps in performant manner. Arrays works as expected, and live interpreter has nifty editing capabilities better than Python(multiline handling) and even code completion inffered from types(uuh).

# Python
I really love Python, but the lack of optional typing, type inference, and compilation is lacking here. 
But where the language shines is - the source code is the shortest and the cleanest. `var y: Array<Int> = []` looks really iffy in comparison to the simple `y = []` in Python. But on the other hand, in Swift we can deal with that writing `var y : [Int] = []` which is slighty better on the eyes. I really love the Python clarity here. `xrange` operator is here with the similar purpose as `Range<Int>` in Swift.

## Performance

I run loop 30 times. The results are mixed. 
CPython required 35x more time to finish the benchmark. Yes, it was 35 slower than Swift! On the other hand, Swift and Go comes so close, it doesn't matter - but in this particular microbenchmark Swift was 60% faster than Go. 
Pypy amazed my how performant it was - more than 5 times faster than ordinar CPython implementation. Wow. 
The performance difference is so big, you can image, when swift/go finish the program in one day, and the CPython counterpart needs a *MONTH* to do the same thing.

The run times for all implementations:

![second](https://cloud.githubusercontent.com/assets/552398/6321023/5160183c-baef-11e4-9deb-48cdd9689155.png){: .center-image }

Let's compare it to the fastes implementation.

![third](https://cloud.githubusercontent.com/assets/552398/6321026/6045d224-baef-11e4-9c42-75a8a8b36ed2.png){: .center-image }

_In this particular test - Python is 34 times slower than Swift._

## Conclusions

- It's just one simple benchmark, the real life is another story, BUT:
- Swift performance looks like a good fit not only for scripting, but high computing purposes also.
- I liked its type inference.
- PyPy's performance is better than expected. It's just 6x slower than Swift, but also 6x faster than generic CPython. Why it's not the default Python interpreter ;-) ? 
- Swift being faster than Go is quite surprising too because Go is *3 years ahead of Swift in public development*.
- I can't wait for [Chris Lattner][http://nondot.org/sabre/] to open-source Swift.
- Swift is so young (6 months) that it has still some nasty bugs, rough edges. I will write it another story.
