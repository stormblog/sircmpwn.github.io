---
# vim: tw=80
title: Understanding your compiler
layout: post
---

Compilers are an interesting subject for me. The feature I value most highly in
a programming language is elegance. I'm also a tinkerer and I like to dig into
the things I work with. When I dig into the internals of a programming language
and I find the internals to be just as elegant as the language itself, it turns
a great programming language into an excellent one. This blog post will start by
giving a broader introduction to the C compiler toolchain and what each piece
does, and I'll go into deeper detail on each in the upcoming posts.

If you're used to writing in higher level programming langauges, don't be scared
about this stuff. Even the internals of Python are fun to dig into (and maybe
someday I'll write about that, too). I don't think that this post will assume
too much about the reader, so you should be fine (and hopefully learn
something).

This is mostly from my experiences putting together a C toolchain for my own
operating system. It involved writing an assembler and linker, and I forked a C
compiler and started making changes to support my needs. This is what gave me a
deeper understanding of C internals.

## High level overview

No matter what programming langauge you use, eventually you'll find that machine
code is involved. Compiled langauges compile into machine code, and interpreted
languages use a runtime that is itself compiled into machine code. Machine code
is the stereotypical "ones and zeros" that make a computer tick. Programs are
loaded into RAM as machine code, and then the CPU reads the machine code and
performs instructions based on what they find. CPUs are basically hardware
implementations of machine code interpreters.

Let's break down a simple example. I'm going to compile this C code to z80
machine code:

{% highlight c %}
int main() {
    return 0;
}
{% endhighlight %}

First, I'll compile it to assembly. The output is here (I've modified it for
clarity and conciseness):

{% highlight nasm %}
;Lines beginning with ; are comments
    .globl _main
    .area _CODE
;main.c:1: int main() {
_main_start:
_main:
;main.c:2: return 0;
    ld hl,0x0000
    ret
_main_end:
; }
.function	_main, _main_start, _main_end
{% endhighlight %}

**Note**: GCC still supports outputting as assembly. Use `gcc -S example.c -o
example.S` to try it yourself.

Then, I can compile this to machine code, which produces a binary file. Here's a
hex dump of that file:

    00000000  21 00 00 c9                                       |!...|

**Note**: I'm using [hexdump(1)](http://linuxcommand.org/man_pages/hexdump1.html)
to generate my hex dumps. The first column is the address. Then there are 16
octets of data, and finally, the same data interprted as ASCII characters.

The output from the compiler is *assembly code*. This is the lowest level
programming language that exists, and it's simply a way of representing machine
code with words instead of numbers (plus some helpful additions). This assembly
code is passed into the *assembler*, which is very similar to a compiler. In
this example, it produces the final machine code directly.

The assembler reads the file looking for instructions. In this case, we have two
instructions: `ld` and `ret`. The rest of the assembly is mostly metadata, and
not important yet. This code will uses `ld` to "load" the value `0x0000` into
the register `HL`. Then `ret` exits the program. I'll explain that in a little
more detail.

The CPU is a very simple machine. It reads numbers out of memory (in this case,
`21 00 00 C9`, in that order), and interprets them as instructions. It allows
you two means of storing "variables" - in memory or in registers. The CPU has a
fixed set of registers that act like global variables. They are integers, and on
the z80 they are 16-bit integers (for the most part). HL is one such register,
and it can be used for any purpose. This C compiler uses it to store the return
value of functions. Registers are global - to the entire machine, not to your
program. Most operating systems will provide a means of giving your program
exclusive use of the registers while it's running.

So, the goal of the assembler is to convert the human-readable instructions into
machine code. `ld hl, 0x0000` becomes `21 00 00`. `21` is the machine code for
`ld hl` and the second argument is copied in straight up: `00 00`. The next
instruction is `ret`, which is `C9` in machine code. Simple enough, right? You
load this into memory and point the CPU at it and it'll exit with a status of 0.

## More functions and more machine code

TODO

## Linking

The example we just walked through is missing a critical piece - the linker. The
linker is one of the reasons that C is one of my favorite languages. This tool
is often used by your compiler without your involvement, but you can learn about
it yourself through `man ld`. This step exists between assembly and machine
code, and allows you to do some really cool things before your code becomes
machine code.

In C, let's consider this code:

{% highlight c %}
void example();

int main() {
	example();
	return 0;
}
{% endhighlight %}

If I compile this again into assembly, we see this output:

{% highlight nasm %}
;main.c:3: int main() {
_main_start:
_main:
;main.c:4: example();
    call _example
;main.c:5: return 0;
    ld hl,0x0000
    ret
; }
_main_end:
.function	_main, _main_start, _main_end
{% endhighlight %}

**Note**: you probably guessed this, but `call` is the z80's instruction for
calling another function.

Running this through the compiler gives me no errors. However, `example` does
not exist! If I try to assemble this into machine code, we get this error:

    main.asm:54:0: error #5: Unknown symbol
        call _example 

Well, this is fair. We can't convert it to machine code if we don't know what
`_example` is. So instead, we can ask the assembler to convert it into an object
file for "linking" at a later time.
