#!/bin/bash

mkdir -p 2022/$1
cp 2022/1/1.ts 2022/$1/1.ts

curl -o 2022/$1/input.txt -H "Cookie: ${AOC_COOKIE}" https://adventofcode.com/2022/day/$1/input

./test.sh $1 1