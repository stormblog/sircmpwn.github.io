---
layout: post
title: Building a "real" Linux distro
---

I recently saw a post on Hacker News: "[Build yourself a
Linux](https://github.com/MichielDerhaeg/build-linux)", a cool project
that guides you through building a simple Linux system. It's similar to Linux
from Scratch in that it helps you build a simple Linux system for personal use.
I'd like to supplement this with some insight into my experience with a more
difficult task: building a full blown Linux distribution. The result is
[agunix](https://agunix.org), the "silver unix" system.

For many years I've been frustrated with every distribution I've tried. Many of
them have compelling features and design, but there's always a catch. The
popular distros are stable and portable, but cons include bloat, frequent use of
GNU, systemd, and often apt. Some more niche distros generally have good points
but often have some combination of GNU, an init system I don't like, poor docs,
dynamic linking, or an overall amateurish or incomplete design. Many of them are
tolerable, but none have completely aligned with my desires.

I've also looked at not-Linux - I have plenty of beefs with the Linux kernel. I
like the BSD kernels, but I dislike the userspaces (though NetBSD is pretty good)
I like the microkernel design of Minix, but it's too unstable and has shit
hardware support. plan9/9front has the most elegant kernel and userspace design
ever made, but it's not POSIX and has shit hardware support. Though none of
these userspaces are for me, I intend to attempt a port of the agunix userspace
to all of their kernels at some point (a KFreeBSD port is underway).

After trying a great number of distros and coming away with a kind of
dissatisfaction unique to each one, I resolved to make a distro that embodied my
own principles about userspace design. It turns out this is a ton of work -
here's how it's done.

Let's distinguish a Linux "system" from a Linux "distribution". A Linux system
is anything that boots up from the Linux kernel. A Linux *distribution*, on the
other hand, is a Linux system that can be *distributed* to end users.  It's this
sort of system that I wanted to build. In my opinion, there are two core
requirements for a Linux system to become a Linux distribution:

1. It has a package manager (or some other way of staying up to date)
2. It is self-hosting (it can compile itself and all of the infrastructure runs
   on it)

The first order of business in creating a Linux distro is to fulfill these two
requirements. Getting to this stage is called *bootstrapping* your distribution -
everything else can come later. To do this, you'll need to port your package
manager to your current system, and start building the base packages with it.
If your new distro doesn't use the same architecture or libc as your current
system, you also need to build a cross compiler and use it for building your
new packages.

My initial approach was different - I used my cross compiler to fill up a chroot
with software without using my package manager, hoping to later bootstrap from
it. I used this approach on my first 3 attempts before deciding to make
base packages on the host system instead. With this approach, I started by
building packages that weren't necessarily self hosting - they used the
host-specific cross compiler builds and such - but produced working packages for
the new environment. I built packages for:

* my package manager
* musl libc
* bash
* busybox
* autotools
* make
* gcc (clang can't compile the Linux kernel)
* vim

I also had to package all of the dependencies for these. Once I had a system
that was reasonably capable of compiling arbitrary software, I transferred my
PKGBUILDs (scripts used to build packages) to my chroot and started tweaking
them to re-build packages from the new distro itself. This process took months to
get completely right - there are *tons* of edge cases and corner cases. Simply
getting this software to run in a new Linux system is only moderately difficult -
getting a system that can build itself is *much harder*. I was successful on
my 4th attempt, but threw it out and redid it to get a cleaner distribution with
the benefit of hindsight. This became agunix.

Once you reach this stage you can go ham on making packages for your system. The
next step for me was graduating from a chroot to dedicated hardware. I built out
an init system with runit and [agunix-init](http://git.agunix.org/init/) and
various other packages that are useful on a proper install. I also compiled a
kernel without support for loadable modules (on par with the static linking theme
of agunix). If you make your own Linux distribution you will probably have to
figure out modules yourself, likely implicating something like eudev.
Eventually, I was able to get agunix [running on my
laptop](https://sr.ht/OzCq.jpg), which has now become my primary agunix dev
machine (often via SSH from my dev desktop).

The next stage for me was getting agunix.org up and running on agunix. I
deliberately chose not to have a website until it could be hosted on agunix
itself. I deployed agunix to a VPS, then ported nginx and put the website up.
The rest of the infrastructure was a bit more difficult: cgit took me about 10
packages of work, and bugzilla was about 100 packages of work. Haven't started
working on mailman yet.

Then begins the eternal packaging phase. At this point you've successfully made
a Linux distribution, and now you just need to fill it with packages. This takes
*forever*. I have made 407 packages to date and I still don't have a desktop to
show for it (I'm *almost* there, just have to make a few dozen more packages
before [sway](https://github.com/SirCmpwn/sway) will run). At this point to have
success you need others to buy into your ideas and start contributing - it's
impossible to package everything yourself. Speaking of which, check out
[agunix.org](https://agunix.org) and see if you like it! I haven't been doing
much marketing for this distro yet, but I do have a little bit of help. If
you're interested in contributing in a new distro, we have lots of work for you
to do!
