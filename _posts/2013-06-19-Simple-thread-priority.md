---
title: Simple Thread Priority
layout: post
excerpt: For KnightOS, I was recently faced with the interesting challenge of how to handle thread priority.
thumbnail: /img/knightos.png
---

For [KnightOS](https://github.com/SirCmpwn/KnightOS), I was recently faced with the interesting challenge of how to
handle thread priority. Before, all threads had the same priority, but a few things have driven me to want to change
that. Keep in mind - the worst supported platform has got 6 MHz to share among all processes.

* I wanted to implement daemons
  * This made me bump the process cap to 32
  * More active processes == slower calculator

Mostly the last point is what drove me to want priority. I wanted some threads to be able to execute, without taking
up too much CPU time. This is helped by the fact that a thread can trigger a context switch early if it wants to, but
I also wanted a simpler mechanism that is less hassle for developers. I've documented the change in this
[GitHub issue](https://github.com/KnightSoft/kernel/issues/20), but I'll describe it again here.

The cheapest possible system I can think of involves four different priorities, 1-4. We'll split an octet from the
thread table into two nibbles and use them for two different purposes. The low nibble will be the user-specified
priority. Each priority level just has another bit set - so 1 is 0b0000, 2 is 0b0001, 3 is 0b0011, and 4 is 0b0111.
0b1111 is used to indicate a free slot in the thread table, and cannot be used as a priority.

The other nibble is the "priority state". This state is used to keep track of when the thread will next get switched
in. Every time a context switch runs, each thread's priority state is incremented, and a bitwise AND is done with its
priority nibble. When the priority state is zero, it gets executed. If it's not zero, it is skipped and the next thread
runs instead.

This is a cheap kind of scheduler (whereas the 
[old method](https://github.com/KnightSoft/kernel/blob/a53c2c720fcb40db028dc988ab08593b387738bc/src/00/interrupt.asm)
probably couldn't be justifiably called that), which should address our problem. I haven't implemented this change yet,
but when I do, I'll come update this blog post with the effectiveness of this simple scheduler and links to the updated
code.
