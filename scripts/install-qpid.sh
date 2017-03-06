#!/bin/bash

# Prepare build env
cd ~
mkdir qpid-build
sudo apt-get update
sudo apt-get install -y htop build-essential libboost-all-dev uuid-dev libparted-dev cmake

# Download and build qpid-proton
cd ~/qpid-build/
wget http://www.apache.org/dyn/closer.lua/qpid/proton/0.16.0/qpid-proton-0.16.0.tar.gz
tar -zxf qpid-proton-0.16.0.tar.gz

sudo apt-get install -y libssl-dev libsasl2-2 libsasl2-dev #emscripten
sudo apt-get install -y swig python-dev ruby-dev libperl-dev php5-dev

cd qpid-proton-0.16.0/
cmake . -DCMAKE_INSTALL_PREFIX=/usr -DSYSINSTALL_BINDINGS=ON
make all
sudo make install

# Download qpid
cd ~/qpid-build/
#wget http://www.apache.org/dyn/closer.lua/qpid/cpp/1.36.0/qpid-cpp-1.36.0.tar.gz
#tar -xzf qpid-cpp-1.36.0.tar.gz
#cd qpid-cpp-1.36.0/
wget https://github.com/apache/qpid-cpp/archive/master.tar.gz
tar -xzf master.tar.gz
cd qpid-cpp-master/

# Download build packages
sudo apt-get install -y libdb++-dev libaio-dev

# Build
cmake .
make all

# Install
sudo make install

# Build Python messaging
cd ~/qpid-build/
wget http://apache.xl-mirror.nl/qpid/python/1.35.0/qpid-python-1.35.0.tar.gz

tar -xzf qpid-python-1.35.0.tar.gz
cd qpid-python-1.35.0/

sudo ./setup.py install
