# AIngle Developer KIT for installation

- ​	Hardware requirements for Development Environment
- ​	2 GB RAM at least (more than 4 GB recommended)
- ​	2 CPUs at least (more than 4 CPUs recommended)
- ​	More than 15 GB of available on-disk space
- ​	Internet connection

## Linux and Windows Linux subSystem

### Install nix Package

Use the Nix toolkit to manage the installation for development tools, thus avoiding incompatibility of packages and compilers:

```
`sh <(curl -L https://nixos.org/nix/install)`
```

After installing Nix, it is recommended to restart the computer and run the following command:

```
`. ~/.nix-profile/etc/profile.d/nix.sh`
```

Check that it was installed correctly by running:

```
`nix-shell --version`
```

Then, It must be displayed:

```
`nix-shell (Nix) 3.X.X` 
```



### Installing the AIngle development tools

Now that you have installed Nix, you can proceed to install and run a development shell containing all the prerequisites, including the correct versions of Rust and Node.js and the AIngle tools. This shell will not interfere with the current system configuration.

Use this line delineator to install **Ainglenix**:

```
`nix-shell https://install.AIngle.ai`
```

In this process the AIngle Binaries will be compiled. Once this is finished, you will be in the **ainglenix** shell with all the development tools at your disposal. You will see a new bash message that looks like this:

```
`[nix-shell:~]$`
```

Use the following command to test the AIngle execution:

```
`AIngle --version`
```

Then, It must be displayed:

```
`AIngle Beta-0.0.1` 
```

Use the command `exit` to close the shell.

### `Use` of AIngle development tools

You can Upgrade the AIngle version with the **Ainglenix** shell with the same command you used to install it:

```
`nix-shell https://install.AIngle.ai`
```

This command always keep you up to date with the latest stable version of AIngle and development tools. 

## MacOS

### Pre-installed software (link):

[XCode developers tool](https://apps.apple.com/us/app/xcode/id497799835?mt=12)

### Install nix Package

We use the Nix toolkit to manage the installation of our development tools, thus avoiding incompatibility of packages and compilers:

#### macOS 10.15 Catalina and superior version

```
ssh <(curl -L https://nixos.org/nix/install) --darwin-use-unencrypted-nix-store-volume
```



####  macOS 10.14 Mojave y previous versions[¶](https://developer.holochain.org/docs/install/#macos-1014-mojave-and-earlier)

```
`sh <(curl -L https://nixos.org/nix/install)`
```

After installing Nix, it is recommended to restart the computer and run the following command:

```
`. ~/.nix-profile/etc/profile.d/nix.sh`
```

Check that it was installed correctly by running:

```
`nix-shell --version`
```

You should see something like this:

```
`nix-shell (Nix) 3.X.X` 
```



### Use of AIngle development tools

Now that you have installed Nix, you can install and run a development shell containing all the prerequisites, including the correct versions of Rust and Node.js and the AIngle tools. This shell will not interfere with the current system configuration.

Use this line delineator to install Ainglenix:

```
`nix-shell https://install.AIngle.ai`
```

In this process the AIngle Binaries will be compiled. Once it is finished, you will be in the ainglenix shell with all the development tools at your disposal. You will see a new bash message that looks like:

```
`[nix-shell:~]$`
```

Use the following command to test the AIngle execution:

```
`AIngle --version`
```

You should see something like this:

```
`AIngle Beta-0.0.1`
```

## Generate AIngle IDs in javascript. A thin wrapper around rust compiled to WASM

### Installation

This package is distributed via npm and can be installed using:

```javascript
npm install @AIngle/ai-id-js
```

Usage

This module exports a class called Encoding which can be used to construct an encoding for the different types of AIngle identifiers. Each of these identifiers are given a three character prefix:

```javascript
AgentID (from signing key) : 'ais'
```

Depending on if you are using the module in node.js or the browser the calling syntax is slightly different. This is because in the browser the WASM must be asynchronously compiled and instantiated to prevent blocking the main thread. As a result, all of the constructor returns a promises in the browser but not in node.

```javascript
const publicKey = [...] // UInt8Array of bytes of public key

const enc = new Encoding('ais0') // node.js

const enc = await new Encoding('ais0') // browser

const agentId = enc.encode(publicKey)

const restoredPublicKey = enc.decode(id)
```

### Building

From the root of the repo (ai-id) the package can be build using

```shell
make build
```

and tests run using

```shell
make test
```

Note this runs browser tests which may fail if you do not have both firefox and chrome installed. On linux set the environment variable `CHROME_BIN=chromium.`  



## Python

### Test

```shell
$ git clone https://github.com/AingleLab/RustPython

$ cd RustPython 
```

--release is needed (at least on windows) to prevent stack overflow

```rust
$ cargo run --release demo.py
```

`Hello, RustPython!` 

### Install

```python
rustpython --install-pip 
```

### Install conda

```python
conda install rustpython -c conda-forge 
```

### Run

```rust
cargo build --release --target wasm32-wasi --features="dog-suit" 
```

Create Documentation AIngle – Python

```rust
$ cargo doc # Including documentation for all dependencies

$ cargo doc --no-deps --all # Excluding all dependencies 
```

## JAVA & C++

### Run AIngle

```c++
aishell -w 8888
```

#### Create AIngle instance

```c++
var safHash = Container.installedApps()[0]

var app = Container.instantiate(safHash)// app is actually a C++ and Java object that wraps the Rust AIngle instanceapp.name() // -> 

App name defined in SAFapp.start() // starts the instance's event loop and later will start the network node and SGD

var result = app.call("core name", "capability name", "function name", "parameters") // runs the zome function which involves interpreting the app's WASM code 
```

#### Websockets

```c++
apt-get update && apt-get install --yes \

qtdeclarative5-dev \l

ibqt5websockets5-dev \

libreadline6-dev 
```

#### Compile and build

```rust
cargo build 
```

#### Qt Build Option

```shell
cd bindings

qmake # or with CONFIG+=debug

make

cd ..
```

