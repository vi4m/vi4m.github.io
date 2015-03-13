---
title: Swift vs Go vs Python battle
layout: post
---

## Sweet spot

Swift is the new programming language brought to you by Apple last year. It brings a refreshing air of novelty to the world of C, Python, Ruby, Rust and Go. The language is neither as beautiful as Python nor as fast as raw C, and the compile speed cannot compete with Go. But the motivation behind Swift was to **hit the sweet spot between C, Python and Go**. I strongly recommend reading the Swift Book [for example here](https://dl.dropboxusercontent.com/u/20996794/Swift%20Programming%20Language.pdf).

Apple prepared a thorough comparison of Swift and Python during the presentation. Much as they are similar, they are different by two yet essential characteristic features:

- both languages share the same language simplicity (for example, `print` is the keyword, OOP programming is optional)
- both are great interactive interpreters( `swift` vs `swiftc`)
- both can be used for scripting purposes (`#!/usr/bin/xcrun swift`)

- but the performance differs between these languages and
- Swift is not Open Source yet. Booo!

![wcdxk-2](https://cloud.githubusercontent.com/assets/552398/6324247/b2d2f7cc-bb37-11e4-91b8-dc7c33b5fef3.jpg){: .center-image }


Technology underlying Swift is based on LLVM, which handles all of the data structures, all compiling and optimization tasks on its own. LLVM is used also by PyPy, CLang, and other languages as well.

## Is it really as fast as advertised?

Last week Swift 1.2 was released so I decided to write a small benchmark game for:

- Swift 1.2
- Google's Go 1.4.2
- CPython 2.7.9
- PyPy 2.5.0 - Python 2.7.8

It was delightfull to simultanously write the code for 4 platforms in multisplit code editor window :-)
The alghorithm is fairly easy - creating 1M array and filling it with the incremented integers(64 bit ints). Then, creating another array, which consits of sum of every 2 elements from the first array. De facto it tests memory read / write access time. Then comes the next step: summing up every 100th element of the array - it should be very difficult to inline it properly, but who knows what Swift can do ? :-> 

* Note: I haven't used the list comprehensions, not to favor any language. I will prepare this variant later.

![first](https://cloud.githubusercontent.com/assets/552398/6321021/40071842-baef-11e4-8a9e-c825642ca15c.png){: .center-image }

## Code differences

# Go
As you can see, the Go code is the longest one, but not much longer that the others. The source code is fairly short whatsoever. But that mandatory `package()` and `main` functions requirement is enforced. The weird part of Go is that Rob Pike decided not to make `Print` a keyword, but rather a library function. That's why you should import `fmt` module. Appart from that, array functions are quite limited in comparison to Python and Swift. By default, *Go's arrays are not resizable - as in C*. Go language provides `append` keyword for resizing arrays but the creator of Go couldn't make up his mind how to implement single vectors. For example, you can use [Slices pattern](http://golang.org/doc/effective_go.html#slices). WTF. After 30 years language designers should provide *one* efficient generics implementation! But let's move on. The way we declare the variable is bizzare - inside `for` loops you declare local variable without `var`. On the other hand, outside the loop you can still use two options interchangeably, `a := 1` or `var a = 1`. As you can see, it is pretty incoherent.
The good part is that the _compiler is fast_ - it's the fastest compiler I've ever seen. Basically, it feels like an interpreter(but it's not interactive). You can even run `go run` to hide the compiling step.

# Swift
Swift has type inference everywhere as well, hence the short syntax for type definitions.
`append()` is a method, not a keyword, just like in Python. The thing I love is that an optional OOP is not enforced on you. 
No package, no module, not even main function required. Furthermore, adding a header `#!/usr/bin/xcrun swift` followed by `chmod +x test.swift` allows us to run `./test.swift` without compilation, just like in Python. *Wow*. 
What else? `Println` and `print` are keywords. Your fingers will appreciate it for sure. I really like the `Range` operators, which are lazy evaluated, and handle custom iterations steps in performant manner. Arrays work as expected and live interpreter has nifty editing capabilities, which is so much better than in Python (multiline handling). 
Editing capabilities are even better thanks to excellent type inference.

# Python
I really love Python, but the lack of optional typing, type inference, and compilation is definitely lacking here. 
But here is where the language shines - the source code is the shortest of all and the cleanest of many. `var y: Array<Int> = []` looks really iffy in comparison to the simple `y = []` in Python. But in Swift we can emulate that writing `var y : [Int] = []`, which is slighty better on the eyes. I really love the Python clarity here. `xrange` operator is here with a similar purpose as `Range<Int>` in Swift.

## Performance

I've run loop 30 times. The results are mixed. 
CPython required 35x more time to finish the benchmark. Yes, it was 35x slower than Swift! On the other hand, Swift and Go come so close in results that it doesn't matter - but in this particular microbenchmark Swift was 60% faster than Go. 
It trully amazed me how performant `PyPy` was - more than 5x faster than generic CPython implementation. Wow. 

The run times for all implementations:

![second](https://cloud.githubusercontent.com/assets/552398/6321023/5160183c-baef-11e4-9deb-48cdd9689155.png){: .center-image }

Let's put the results together:

![third](https://cloud.githubusercontent.com/assets/552398/6321026/6045d224-baef-11e4-9c42-75a8a8b36ed2.png){: .center-image }

_In this particular test - Python is 34x slower than Swift._

## Conclusions

- It's just one simple benchmark, real life is another story, BUT:
- Swift performance looks like a good fit not only for scripting, but high computing purposes too.
- I liked its type inference.
- PyPy's performance is better than expected. It's just 6x slower than Swift, but also 6x faster than generic CPython. If it is so fast perhaps we should ask why it's not the default Python interpreter ;-) 
- Swift being faster than Go is quite surprising because Go is *3 years ahead of Swift in public development*.
- I can't wait to see [Chris Lattner][http://nondot.org/sabre/] open-source Swift.
- Swift is so young (6 months) that it still has some nasty bugs and rough edges. I will write about it another day.
