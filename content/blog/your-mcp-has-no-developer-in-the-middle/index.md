---
title: "Your MCP has no developer in the middle"
date: "2026-10-08"
group: "On engineering"
description: "An API had a developer in the middle who knew your customer's business. An MCP doesn't, so that context has to ship with it."
---

Have you ever been told an MCP is basically just a wrapper around your API? That's what a lot of engineers I talk to believe in 2026. FastMCP's OpenAPI converter is "[the most popular tool](https://www.jlowin.dev/blog/stop-converting-rest-apis-to-mcp) for auto-generating MCP servers from REST APIs" (even though its author's own post is titled "Stop Converting Your REST APIs to MCP"), and Speakeasy and Mintlify sell the same thing.

Your API gets away with being just endpoints because of who reads it. Your customer hires a developer, who learns how they run their business before writing a line, then turns "what should we make next month?" into the right API calls. With an MCP, your customer picks Claude or ChatGPT, and **that model shows up on day one knowing nothing about how they run things**. Nobody's in the middle to translate. It's like sending a temp in on their first day: they can press every button in your software, but nobody told them how this shop runs.

![Diagram: with an API, your customer's fuzzy ask goes to their developer, who learns how they plan and makes the right calls. With an MCP, the same ask goes to their model, which knows nothing on day one and sends your MCP a guess.](./no-developer-in-the-middle.png)

So the context that developer used to bring has to ship with your MCP. When it doesn't, the model guesses, and when the guess is wrong, it's your product's name on it.

## 1. Find where the model has to guess

Say two of your customers (made up for this example) ask your MCP the same thing:

> What should my production plan be for next month?

- Company A wants to use up inventory that's about to expire.
- Company B wants the most revenue.

Planning software leaves that call to each company: Microsoft's Dynamics 365 says "[By default, master plans don't consider shelf life](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/shelf-life)", and you switch it on plan by plan. In cannabis, [New York](https://www.metrc.com/wp-content/uploads/2026/05/NY_IB_0015_Sell-by-and-Expiration-Date-Requirements.pdf) and [Minnesota](https://www.metrc.com/wp-content/uploads/2026/05/MN_IB_0062_Expiration-Dates.pdf) made expiration dates mandatory in Metrc (the state's cannabis tracking system) this year. A tool that mirrors your production-planning endpoint gives the model no way to tell which company it's talking to.

Models are bad at that kind of guess. On Salesforce's [CRMArena-Pro](https://arxiv.org/abs/2505.18878) (sales, service and quoting tasks), leading agents in May 2025 finished about 58% of tasks in one turn, and about 35% over a longer conversation. In a 2026 study of data-science agents, they "[commit to plausible but unintended task framings](https://arxiv.org/abs/2605.09698)" on vague tasks instead of asking. The MCP spec does let your server ask the user mid-call, through [elicitation](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation), but only 17 of the 114 clients in the [community list](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/87993a68166cfec740ca4d6a99cbe661f7aed32c/docs/clients.mdx) (last updated May 2026) supported it!

Now picture when a user asks Claude "production plan for the next month", and it takes the wrong reading for Company A, and shipping from a fresh lot instead of the one about to expire. **The expiring lot sits on the shelf until it's worthless, and that loss lands in your customer's books, made through your MCP.**

The model has to guess wherever:

1. one question means different things to different customers
2. a workflow needs it to chain several calls
3. your terms (what a lot or a manifest means) only make sense with the help center open
4. a write happens before anyone checks what the customer meant

## 2. Ship the context with your MCP

For Company A and Company B, give the model a way to find out who it's talking to. At my company, our MCP has a `get-me` tool that reads the customer's own settings. So the model can plan expiry-first for Company A and revenue-first for Company B, from their settings instead of a guess. When the settings don't say, ask them, wherever the client supports elicitation.

For chained calls, build tools for the few workflows your customers run most. For an ERP, that's something like `calculate_inventory_costs` or `fulfill_sales_order`. Anthropic's [guide to writing tools](https://www.anthropic.com/engineering/writing-tools-for-agents) calls tools that "merely wrap existing software functionality or API endpoints" a common error, and suggests one `schedule_event` tool over separate `list_users`, `list_events` and `create_event` tools.

For better LLM understanding, put the API docs, MCP docs and help center behind one `search_docs` tool, with a description telling the agent when to call it. That's what our MCP does at my company (I wrote [a whole post on it](https://johnnyji.com/making-your-docs-work-for-ai-agents/)).

For writes, do what [Block's MCP playbook](https://engineering.block.xyz/blog/blocks-playbook-for-designing-mcp-servers) says: "If possible, don't mix read and write operations in the same tool." Then your customer can let reads run on their own and make `fulfill_sales_order` wait for their OK.

## 3. Leave the long tail generic

Microsoft went the other way with its own ERP. It launched its Dynamics 365 MCP with 13 fixed business tools, then [retired that server on October 1, 2026](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/copilot/copilot-mcp) for generic data, form and action tools that pick up each customer's customizations. Its reason: "[The set of available tools was fixed](https://www.microsoft.com/en-us/dynamics-365/blog/it-professional/2025/11/11/dynamics-365-erp-model-context-protocol/), updates required code changes or redeployments, and extending functionality took time." Cloudflare goes further and covers [every endpoint of its API with two tools](https://blog.cloudflare.com/code-mode-mcp/), on the bet that "[LLMs are better at writing code to call MCP, than at calling MCP directly](https://blog.cloudflare.com/code-mode/)".

I think they're right about the long tail. Nobody hand-builds a tool for every report a customer might want, so mirrored endpoints and generic tools are fine there. For the common workflows your customers run every week, I'd still build the tool on purpose (just not one giant one).

Each time you add a workflow tool, ask:

1. Where does the business context/nuances live?
2. Does the LLM have access to that, or know that it needs to ask?
3. Does your MCP provide the correct way for the LLM to access that context?

Company A and Company B each used to have a developer who knew how they planned. Now they have a model, and telling it is your MCP's job.
