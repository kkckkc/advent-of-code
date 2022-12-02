#!/bin/bash

mkdir -p 2022/$1
cp 2022/1/1.ts 2022/$1/1.ts

AOC_COOKIE='session=53616c7465645f5f9e8f2fa5e6873e190e35767ef1d497f05874ca273306506cefc59c632e1cac133f0c47b0e40a6045c7ee3916030a32fe75561e0405cee212'
curl -o 2022/$1/input.txt -H "Cookie: ${AOC_COOKIE}" https://adventofcode.com/2022/day/$1/input

./test.sh $1 1