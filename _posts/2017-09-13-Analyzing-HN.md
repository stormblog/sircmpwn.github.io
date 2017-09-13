---
layout: post
title: "Analyzing HN moderation & censorship"
---

[Hacker News](https://news.ycombinator.com) is a popular
"[hacker](http://www.catb.org/jargon/html/H/hacker.html)" news board. One thing
I love about HN is that the moderation generally does an excellent job. The site
is free of spam and the conversations are usually respectful and meaningful (if
pessimistic at times). However, there is always room for improvement, and
moderation on Hacker News is no exception.

For some time now, I've been scraping the HN API and website to learn how the
moderators work, and to gather some interesting statistics about posts there
in general. Every 5 minutes, I take a sample of the front page, and every 30
minutes, I sample the top 500 posts (note that HN may return fewer than this
number). During each sample, I record the ID, author, title, URL, status
(dead/flagged/dupe/alive), score, number of comments, rank, and compute the rank
based on [HN's published algorithm](https://news.ycombinator.com/item?id=231209).
A note is made when the title, URL, or status changes.

[![](https://sr.ht/IFCA.png)](https://hn.0x2237.club/post/15217697)

The information gathered is publicly available at
[hn.0x2237.club](https://hn.0x2237.club) (sorry about the stupid domain, I just
picked one at random). You can search for any post here going back to
2017-04-14, as well as view recent
[title](https://hn.0x2237.club/title-changes) and
[url](https://hn.0x2237.club/url-changes) changes or [deleted
posts](https://hn.0x2237.club/deleted)
([score>10](https://hn.0x2237.club/deleted-10)). Raw data is available as JSON
for any post at `https://hn.0x2237.club/post/:id/json`. Feel free to explore the
site later, or [its shitty code](https://git.sr.ht/~sircmpwn/hnstats). For now,
let's dive into what I've learned from this data.

### Tools HN mods use

The main tools I'm aware of that HN moderators can use to perform their duties
are:

- Editing link titles or URLs
- Artificially influencing story rank
- Deleting posts
- Detaching off-topic or rulebreaking comment threads from their parents
- <abbr title="Banning them without making it known to them">Shadowbanning</abbr>
  misbehaving users

There are also automated tools for detecting spam and <abbr title="Posts
influenced by a group of early voters hoping to get it on the front page">voting
rings</abbr>, as well as automated de-emphasizing of posts based on certain
<abbr title="'Bitcoin' was known to at some point be one of these">secret
keywords</abbr> and controls to prevent flamewars. I don't yet have enough
insight into these tools to tell you more about how they work, but I can share
what I've learned of the others.

Here's an example of a fairly common moderator action:

![](https://sr.ht/PhJM.png)

[This post](https://hn.0x2237.club/post/15217697) had its title changed at
around 09-11-17 12:10 UTC, and had the rank artificially adjusted to push it
further down the front page. We can tell that the drop was artificial just by
correlating it with the known moderator action, but we can also compare it
against the computed base rank:

![](https://sr.ht/IJQI.png)

Note however that the base rank is often wildly different from the rank observed
in practice; the factors that go into adjusting it are rather complex. We can
also see that despite the action, the post's score continued to increase, even
at an accelerated pace:

![](https://sr.ht/FmNU.png)

This "title change and derank" is a fairly common action - here are some more
examples from the past few days:

[Betting on the Web - Why I Build PWAs](https://hn.0x2237.club/post/15219154)

[Silicon Valley is erasing individuality](https://hn.0x2237.club/post/15210767)

[Chinese government is working on a timetable to end sales of fossil-fuel cars](https://hn.0x2237.club/post/15208565)

Users can change their own post titles, which I'm unable to distinguish from
moderator changes. However, correlating them with a strange change in rank is
generally a good bet. Submitters also generally will edit their titles earlier
rather than later, so a later change may indicate that it was seen by a
moderator after it rose some distance up the page.

I also occasionally find what seems to be the opposite - artificially bumping a
post further up the page. Here's two examples:
[15213371](https://hn.0x2237.club/post/15213371) and
[15209377](https://hn.0x2237.club/post/15209377). Rank influencing in either
direction also happens without an associated title or URL change, but
automatically pinning such events down is a bit more subtle than my tools can
currently handle.

Moderators can also delete a post or indicate it as a dupe. The latter can be
(and is) detected by my tools, but the former is indistinguishable from the user
opting to delete posts themselves. In theory, posts that are deleted *after* the
author is no longer allowed to could be detected, but this happens rarely and my
tools don't track posts once they get old enough.

### Flagging

The users have some moderation tools at their disposal, too - downvotes,
flagging, and vouching. When a comment is downvoted, it is moved towards the
bottom of the thread and is gradually colored grayer to become less visible, and
can be reversed with upvotes. When a comment gets enough flags, it is removed
entirely unless you have showdead enabled in your profile. Flagged stories are
moved to the bottom of the ranked posts even if you have showdead enabled, but
can be seen in /new. Flagging can be reversed with the vouch feature, but
flagged stories are very infrequently vouched back into existence.

**Note**: detection of post flagged status is very buggy with my tools. The API
exposes a boolean for dead posts, so I have to fall back on scraping to
distinguish between different kinds of dead-ness. But this is pretty buggy, so I
encourage you to examine the post yourself when browsing my site if in doubt.

### Are these tools abused for censorship?

Well, with all of this data, was I able to find evidence of censorship? There
are two answers: yes and maybe. The "yes" is because users are *definitely*
abusing the flagging feature. The "maybe" is because moderator action leaves
room for interpretation. I'll get to that later, but let's start with flagging
abuse.

#### Censorship by users

The threshold for removing a story due to flags is rather low, though I don't
know the exact number. Here are some posts whose flags I consider questionable:

[Harvey, the Storm That Humans Helped Cause](https://hn.0x2237.club/post/15129859) (23 points)

[ES6 imports syntax considered harmful](https://hn.0x2237.club/post/15116132) (12 points)

[White-Owned Restaurants Shamed for Serving Ethnic Food](https://hn.0x2237.club/post/14415411) (33 points)

[The evidence is piling up – Silicon Valley is being destroyed](https://hn.0x2237.club/post/14152602) (27 points)

A good place to discover these sorts of events is to browse hnstats for posts
deleted with a score [>10 points](https://hn.0x2237.club/deleted-10). There are
also occasions where the flags seem to be due to a poor title, which is a
fixable problem for which flagging is a harsh solution:

[Poettering downvoted 5 (at time of this writing) times](https://hn.0x2237.club/post/14679207)

[Germany passes law restricting free speech on the internet](https://hn.0x2237.club/post/14676296)

The main issue with flags is that they're often used as an alternative to the
HN's (by design) lack of a downvoting feature. HN also gives users no guidelines
on *why* they should flag posts, which mixes poorly with automated removal of a
post given enough flags.

#### Censorship by moderators

Moderator actions are a bit more difficult to judge. Moderation on HN is a black
box - most of the time, moderators don't make the reasoning behind their actions
clear. Many of their actions (such as rank influence) are also subtle and easy
to miss. Thankfully they are often receptive to being asked why some moderation
occurred, but only as often as not.

Anecdotally, I also find that moderators occasionally moderate selectively, and
keep quiet in the face of users asking them why. Notably this is a problem for
<abbr title="links for which you have to pay money to read the
content">paywalled</abbr> articles, which are [against the
rules](https://news.ycombinator.com/newsfaq.html) but are often allowed to
remain.

### Conclusions

I should again emphasize that most moderator actions are benign and agreeable.
They do a great job on the whole, but striving to do even better would be
admirable. I suggest a few changes:

- Make a public audit log of moderation activity, or at least reach out to me to
  see what small changes could be done to help improve my statistics gathering.
- Minimize use of more subtle actions like rank influence, and when used,
- More frequently leave comments on posts where moderation has occurred
  explaining the rationale and opening an avenue for public discussion and/or
  appeal.
- Put flagged posts into a queue for moderator review and don't remove posts
  simply because they're flagged.
- Consider appointing one or two moderators from the community, ideally people
  with less bias towards SV or startup culture.

Hacker News is a great place for just that - hacker news. It has been for a long
time and I hope it continues to be. Let's work together on running it
transparently to the benefit of all.
