---
title: "How to leverage AI for engineering teams"
date: "2024-03-06"
group: "On engineering leadership"
---

As of March 2024, AI (I’m referring to LLMs like ChatGPT when I say AI) have both come a long way and... not really.

I don’t believe we’re even close to AI replacing software engineers in building entire features and product lines. Mainly because:

1. Most code requires knowledge across a large domain of the product and how features affect each other — both of which AI in its current state doesn't do well.
2. In every successful attempt at AI writing production code that I've seen, the code has been isolated in a black box (a single function, specific web pages, etc…).
3. Even in isolated code, my experience is that AI tends to “hallucinate” and write code that is 80% there (and code needs to 100% work).

## So what can AI do for engineering teams?

I believe we’re at a stage where AI is really helpful with making the developer experience faster & more efficient. Here’s how we leverage AI at Distru's engineering team:

### Github Copilot

This is a no brainer. Copilot’s ability to auto-complete code I’m about to write has increased my speed by ~20%. I can also work on problems for longer because I don’t feel burnt out by writing as much boilerplate code.

### ChatGPT for upgrading React Components

This was a brilliant idea my Director of Engineering came up with. Take old class based React components and feed them into ChatGPT to rewrite them into functional components!

### ChatGPT for syntax error hunting

Missing a closing brace but not sure where? Pop it into ChatGPT, and know exactly where the syntax error is.

### ChatGPT for data parsing

When debugging issues, you often need to parse data out into more legible formats, such as:

1. Beautifying JSON
2. Finding diffs in 2 blobs of data
3. Timestamp timezone conversion
4. Timestamp formatting

### ChatGPT for simple but non-intuitive scripting

Sometimes we need to write one off scripts such as:

* Google Sheets AppScript
* Generating CSR for SSL certs
* JS transmog (yuck)

Rather than re-learning how to do these things every time you need to, popping it into ChatGPT is much easier.

---
<br>

As you can see, these all help enhance the developer experience. But at the end of the day, you still need great software engineers to do 80% of the heavy lifting.

[Here’s how to attract those great engineers (on a startup budget)!](/attracting-10x-engineers-on-a-startup-budget)
