#!/bin/bash

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

wget https://dist.ipfs.io/go-ipfs/v0.4.13/go-ipfs_v0.4.13_linux-amd64.tar.gz
tar zxf go-ipfs_v0.4.13_linux-amd64.tar.gz
cd go-ipfs
sudo bash install.sh
