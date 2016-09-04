---
layout: post
title: "Swift 3 on Linux tutorial - part 2"
tags: swift
---


# Swift 3 Linux tutorial - part 2

In this tutorial we will continue exploring Zewo framewrok, focusing this time on:

* JSON handling
* coroutines


## Coroutines

Unlike Go, Swift 3 does not come with coroutines out of the box, but uses separate library called [VeniceX](https://github.com/VeniceX). Worry no, the usage is quite similar to go, and performance is great, scaling up to milions coroutines on single host. 

Zewo follows CSP model, similar to Golang implementing [CSP model](https://en.wikipedia.org/wiki/Communicating_sequential_processes) coroutines incorporting wonderful [libmill](http://libmill.org) C library.



## Example coroutines

This code runs in the "background" as a lightweight coroutine. Unlike threads, you can run literally milions of these on the modern hardware, it's so performant.

```swift
import Venice

for i in 1...100 {
	co {
		print("Spawned \(i) coroutine! I'm so asynchronous!")
	}
}
```

To comunicate with the coroutine, we use channels, for sending / recieving values of specific type(for example Int):

```swift
import Venice

let channel = Channel<Int>()

co {
	nap(for: 1.second)
	channel.send(1)
}

print("Waiting for the result...")
let value = channel.receive()
print("Got \(value) !")

```

Run it and:

```
Waiting for the result...
Got Optional(1) !
```
Keep in mindrecieving 


## DIY - worker
		
In the first part of the tutorial, we've built synchronous http service which immediately returned a value. In this tutorial, we will try to make prime numbers web-service! Computing of prime numbers takes a lot time, and we don't want to have API HTTP timeouts. That's why we cannot do it synchronusly. We will defer computation tasks to the background instead. 

How to do it? Do we need some worker solution, similar to Python RQ, Celery, threads, Redis or something? The answer is - not at all! Zewo with Swift does the trick without any other components!

Let's begin with the endpoints:


* `/task/start?value=[number]` endpoint will schedule long-running computation in the background. The only thing returned synchronusly is task id as a JSON
* `/task/[uid]` - this endpoint will be used by the clients, while waiting for the result.


### The code

File main.swift:


```swift

import Router
import HTTPServer
import JSON
import UUID


var messages:[String:Channel<Int>] = [:]


let app = Router { route in
    route.post("/task/new") { request in 
        let taskId = UUID().description

        let channel = Channel<Int>()

        let json: JSON = [
            "taskId": .string(taskId)
        ]
        co {
            let result = nextPrime(123333)
        
            channel.send(result)
        }
        messages[taskId] = channel

        return Response(body: JSONSerializer().serializeToString(json: json).data, 
            headers: ["Content-type": "application/json"])
    }
    
    route.get("/task/:taskid") { request in
        guard let taskid = request.pathParameters["taskid"] else {
            print("Internal")
            return Response(status: .internalServerError)
        }
        guard let channel = messages[taskid] else {
            print("channel")
            return Response(body: "Routine not found", status: .notFound)
        }
        var response: Response?
        select { when in
            when.received(valueFrom: channel) { message in
                response = Response(body: "Result: \(message)")
                messages[taskid] = nil
            }
            when.otherwise {
                response = Response(body: "Still computing.")
            }
        }
        print("koniec")
        return response!
    }
}

try Server(host: "0.0.0.0", port: 8080, reusePort: true, responder: app).start()
```


Create file `computation.swift`:

```swift

/// Returns true if number is prime number, false otherwise
func isPrime(_ number: Int) -> Bool {
    guard number != 1 else {
        return false 
    }
    var prime = true
    var i = 2
    while i < number {
        if number % i == 0 {
            prime = false
            break
        }
        i = i + 1
    }
    return prime
}

/// Returns the first next prime number greater than given number
func nextPrime(_ curentCandidate: Int) -> Int {
	var found = false
	while found == false {
	    currentCandidate += 1
	    if prime(currentCandidate) == true {
	        found = true
	    }
	}
	print(primeNumber)

```


Both files(main.swift, computation.swift) share common namespace, without a need for importing files each other. 

Now, compile the code and let's try our computation. 



```
curl -XPOST http://localhost:8080//task/start?value=198491329

```



	
