---
layout: post
title: Swift 3 on linux tutorial
---


# Swift 3 Linux tutorial - part 1

This tutorial shows how to make Server Side Swift HTTP service using Zewo framework.


## Swiftenv

Swiftenv allows using different swift versions, alongside different projects. Swiftenv wraps `swift` commandline to always point to the specifi swift version defined in .swiftenv file.

First, install it from [here](https://github.com/kylef/swiftenv).
 
Then, make sture to install Swift 3 snapshot which is stable enough to use with Zewo. I recommend to use 07-25 snapshot.

	swiftenv install DEVELOPMENT-SNAPSHOT-2016-07-25-a

"swiftenv versions" presents all installed snapshots available, asterisk points to the global default version:

	3.0-dev
	DEVELOPMENT-SNAPSHOT-2016-05-31-a
	DEVELOPMENT-SNAPSHOT-2016-06-20-a
	*DEVELOPMENT-SNAPSHOT-2016-07-25-a (set by .swiftenv/version)
	3.0
	2.2



## SPM - swift package manager. 

SPM is official package manager for Swift, which is really simple and useful.
It follows convention over configuration, and strictly follows SemVer as a versioning schema, and GIT as a storage solution. It presents decentralized approach to package indexing, so you always point complete http/git url to the repository. 

In addition - it is installed with the swift distribution itself, so nothing to install.

Extra features:

* can compile c code, integrates with apt-get and homebrew
* manifests are written in pure-swift, and are easly readable
* can generate xcode project file (snapshot version needs workaround, because it has a bug)


### Using SPM

Overview:

	OVERVIEW: Perform operations on Swift packages

	USAGE: swift package [command] [options]
	
	COMMANDS:
	  init [--type <type>]                   Initialize a new package
	                                         (type: library|executable|system-module)
	  fetch                                  Fetch package dependencies
	  update                                 Update package dependencies
	  generate-xcodeproj [--output <path>]   Generates an Xcode project
	  show-dependencies [--format <format>]  Print the resolved dependency graph
	                                         (format: text|dot|json)
	  dump-package [--input <path>]          Print parsed Package.swift as JSON
	
	OPTIONS:
	  -C, --chdir <path>        Change working directory before any other operation
	  --color <mode>            Specify color mode (auto|always|never)
	  -v, --verbose             Increase verbosity of informational output
	  --version                 Print the Swift Package Manager version
	  -Xcc <flag>               Pass flag through to all C compiler invocations
	  -Xlinker <flag>           Pass flag through to all linker invocations
	  -Xswiftc <flag>           Pass flag through to all Swift compiler invocations
	
	NOTE: Use `swift build` to build packages, and `swift test` to test packages
	
	

## Hello world app

Now, let's writing simple http service / web app. 

Create your project dir:

	> mkdir hello && cd hello
	
Choose swift version to use:
	> swiftenv install DEVELOPMENT-SNAPSHOT-2016-07-25-a
	> swiftenv local DEVELOPMENT-SNAPSHOT-2016-05-31-a
	
.swift-version in current dir will point to:

	> cat .swift-version 
	DEVELOPMENT-SNAPSHOT-2016-05-31-a
	
Now generate barebones of the package:

	> swift package init --type executable
	
	Creating executable package: hello
	Creating Package.swift
	Creating .gitignore
	Creating Sources/
	Creating Sources/main.swift
	Creating Tests/
	

Sources dir is opinionated name. When main.swift is located in the dir, it's used as executable target, not library. The simple logic is located here:
	
	> cat Sources/main.swift
	print("Hello, world!")


Now build the hello world app - 

	> swift build 
	
	Compile Swift Module 'hello' (1 sources)

Hurray! Hello world app is ready.
Output executable, with debug symbols is located here:	
	> ls .build/debug
	
	ModuleCache       hello.build       hello.swiftdoc    hello.swiftmodule 	helloTests.xctest


Run it:

	> ./.build/debug/hello
	Hello, world!
	
When ready to release, you can compile it without debugging symbols(faster, and smaller executable)

	> swift build --configuration release
	

## Writing http server

We will use Zewo framework, which is reusable, server-side components.

	> cat Packages.swift
	
	import PackageDescription

	let package = Package(
		name: "hello"
	)
	
We will use various Zewo components in separation. But remember:

> Try to use the same (0.7 for example) package version for all used Zewo modules. Mixing different versions of Zewo components might create a dependency hell.

We will create simple http server app, using JSON, routers, and creating some files.

Update your Package.swift file with:

	import PackageDescription
	
	let package = Package(
	    name: "hello", 
	    dependencies: [
	        .Package(url: "https://github.com/Zewo/Router.git", majorVersion: 0, minor: 7),
	        .Package(url: "https://github.com/VeniceX/HTTPServer.git", majorVersion: 0, minor: 7),
	        .Package(url: "https://github.com/Zewo/JSON.git", majorVersion: 0, minor: 9),
	        .Package(url: "https://github.com/VeniceX/File.git", majorVersion: 0, minor: 7)
	    ]
	)

Now let's write full-featured http app with routing:


	import Router
	import HTTPServer
	
	let app = Router { route in
	    route.get("/hello/:name") { request in
	        guard let name = request.pathParameters["name"] else {
	            return Response(status: .internalServerError)
	        }
	        return Response(body: "Nice to meet you, \(name)!")
	    }
	}
	
	try Server(app).start()
	
	
Read more about the routes [here](https://github.com/Zewo/Router)

To build your packages, type: `swift build`. Dependencies are downloaded into Packages directory, as a git checked out for given git tags. 

	ls Packages/
	C7-0.8.1                      HTTPParser-0.7.4              POSIX-0.5.1                   String-0.7.3
	CHTTPParser-0.5.0             HTTPSerializer-0.7.2          POSIXRegex-0.7.0              StructuredData-0.8.3
	CLibvenice-0.5.0              HTTPServer-0.7.2              PathParameterMiddleware-0.7.0 TCP-0.7.4
	CURIParser-0.5.0              IP-0.7.0                      RegexRouteMatcher-0.7.0       TrieRouteMatcher-0.7.1
	File-0.7.5                    JSON-0.9.0                    Router-0.7.2                  URI-0.8.1
	HTTP-0.7.2                    MediaType-0.8.0               S4-0.8.0                      Venice-0.7.2

> Tip: You can make modifications to the Packages/ dir, and push it back to the repo.

Now point your browser to: `http://localhost:8080/hello/zewo`

Hurray, it's your first Zewo / Swift app!

# Tagging app

To share your app/library with others, you just simply put the repo somewhere (to the github for example) and make ordinary git tag (SemVer). 

For example:

	git tag 0.1.0
	git push origin master
	git push origin --tags
	
You can use this repo in other projects with simple:

	        .Package(url: "https://github.com/user/hello.git", majorVersion: 0, minor: 1)
	        


	
# Performance
	
Zewo framework is very performant, it uses the same strategy as Go framework, using CSP coroutines. 

By default it uses only one core, but you can change it very easily with 'reusePort' parametere. It balances incoming requests between many zewo processes. Remember to run as many processes as needed.

	try Server(host: "0.0.0.0", port: 8080, reusePort: true, responder: app).start()

# Part 2

Don't miss part 2 of tutorial!
We will use File manipulation, coroutines, String manipulation, and JSON usage.

	
