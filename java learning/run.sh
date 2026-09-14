#!/bin/bash

mkdir -p out

javac -cp "lib/*" -d out src/Main.java

java -cp "out:lib/*" src.Main "$1"