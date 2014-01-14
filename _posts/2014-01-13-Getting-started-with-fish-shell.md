---
layout: post
title: Getting started with fish shell
---

There's a cool shell called [fish](http://fishshell.com) that I think is pretty damn good. However, the documentation
leaves something to be desired for new users and I found it a little difficult to get into it simply because there wasn't a lot
written about it. So here I am, writing about fish. Consider this a pitch for why you should be using it instead of whatever
else you're using now (bash, probably).

<script type="text/javascript" src="http://asciinema.org/a/7169.js" id="asciicast-7169" async="async"></script>

<a href="http://fishshell.com/#platform_tabs">Install it here!</a>

## Basics

Fish works pretty much how you'd expect for basic usage. Redirection and piping and such is the same as bash, with one
minor change: you can redirect stderr with ^.

<script type="text/javascript" src="http://asciinema.org/a/7173.js" id="asciicast-7173" async="async"></script>

Unlike bash (which uses `$(subcommand)`), you can run a subcommand with bare parens: `echo (seq 1 10)`.

You can also skip `cd` and just type the name of the directory you want to change to, though I personally can't untrain
myself from using `cd`.

## Typeahead

When you first install fish, you won't notice this feature too much. But the longer you use it for, the more and more useful it'll
be. Bash has Ctrl+R, but fish takes it a step further. You see your older commands ahead of your cursor, and you can just tap Ctrl+F
to complete the one shown ahead of you. You can hit up and down to seek through older and older commands that match the same string
you've already typed in.

<script type="text/javascript" src="http://asciinema.org/a/7171.js" id="asciicast-7171" async="async"></script>

## Fish parses your man pages for completion

<script type="text/javascript" src="http://asciinema.org/a/7177.js" id="asciicast-7177" async="async"></script>

<small>Try <a href="https://github.com/MediaCrush/MediaCrush-cli">MediaCrush-cli</a> today, available in the
<a href="https://aur.archlinux.org/packages/mediacrush-cli">AUR</a></small>

## Scripting

Fish also has a scripting syntax that isn't horrible to use. Here's how you use it:

<script type="text/javascript" src="http://asciinema.org/a/7174.js" id="asciicast-7174" async="async"></script>

Keywords: if, else, else if, end, for, while, etc. The usual suspects. Note that fish is indenting for me, I didn't have to hit tab
or anything.

## Why can't I do sudo !!

[Express support for it here, please](https://github.com/fish-shell/fish-shell/issues/288)

## My .bashrc shows my git branch and I want fish to do that

    # ~/.config/fish/config.fish

    set fish_greeting # Suppresses the greeting message new users see
    function parse_git_branch
        git branch ^ /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ ⎇  \1/'
    end
    function fish_prompt --description 'Write out the prompt'
        # Just calculate these once, to save a few cycles when displaying the prompt
        if not set -q __fish_prompt_hostname
            set -g __fish_prompt_hostname (hostname|cut -d . -f 1)
        end
        if not set -q __fish_prompt_normal
            set -g __fish_prompt_normal (set_color normal)
        end
        switch $USER
            case root
            if not set -q __fish_prompt_cwd
                if set -q fish_color_cwd_root
                    set -g __fish_prompt_cwd (set_color $fish_color_cwd_root)
                else
                    set -g __fish_prompt_cwd (set_color $fish_color_cwd)
                end
            end
            echo -n -s "$USER" @ "$__fish_prompt_hostname" ' ' "$__fish_prompt_cwd" (prompt_pwd) "$__fish_prompt_normal" '# '
            case '*'
            if not set -q __fish_prompt_cwd
                    set -g __fish_prompt_cwd (set_color $fish_color_cwd)
            end
            echo -n -s "$USER" @ "$__fish_prompt_hostname" ' ' "$__fish_prompt_cwd" (prompt_pwd) "$__fish_prompt_normal" (parse_git_branch) '> '
        end
    end

<script type="text/javascript" src="http://asciinema.org/a/7175.js" id="asciicast-7175" async="async"></script>
