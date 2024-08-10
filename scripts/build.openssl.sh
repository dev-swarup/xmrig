#!/bin/sh -e

OPENSSL_VERSION="1.1.1s"

mkdir -p deps
mkdir -p deps/include
mkdir -p deps/lib

mkdir -p build && cd build

wget https://www.openssl.org/source/openssl-${OPENSSL_VERSION}.tar.gz -O openssl-${OPENSSL_VERSION}.tar.gz
tar -xzf openssl-${OPENSSL_VERSION}.tar.gz

cd openssl-${OPENSSL_VERSION}
./config shared -fPIC
make -j$(nproc || sysctl -n hw.ncpu || sysctl -n hw.logicalcpu)
cp -fr include ../../deps
cp libcrypto.so ../../deps/lib
cp libssl.so ../../deps/lib
cd ..
