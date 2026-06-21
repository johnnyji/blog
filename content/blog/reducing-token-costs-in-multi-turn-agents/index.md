---
title: "Reducing token costs in multi-turn agents"
date: "2026-06-21"
group: "On engineering leadership"
---

If you're building agentic AI systems with tool calling, you've probably noticed that input tokens dominate your cost. We traced a simple "create one invoice" task and found that 91% of the spend was input tokens. The LLM's actual output? 356 tokens. A single tool call.

The obvious fix is to trim your tool results, thus returning less data to the LLM (and that works up to a point). But we found that trimming alone doesn't address the deeper problem: some tool work is inherently multi-turn and exploratory, and that entire sub-conversation is what needs to be contained.

## The cost structure of multi-turn tool use

In a ReAct-style loop, every LLM call replays the full conversation history. Each tool result you add gets re-sent on every subsequent call.

If you have `n` tool-calling turns, and each tool result is `R` tokens:

- Turn 1 input: `S + R_1`
- Turn 2 input: `S + R_1 + R_2`
- Turn n input: `S + R_1 + R_2 + ... + R_n`

Each tool result doesn't cost you once — it costs you on every subsequent call for the rest of the conversation. Total input grows quadratically with conversation length.

We saw this in practice. Our LangGraph agent orchestrates QuickBooks Online API calls, and a straightforward "create an invoice" task took 4 LLM calls:

1. Search for the right API tools
2. Query customer and item records
3. Generate a write plan for human approval
4. Execute the API call

By the 4th call, the input had ballooned to 24,612 tokens:

| Component          | Tokens | Cost   | % of total |
| ------------------ | ------ | ------ | ---------- |
| Input (non-cached) | 16,216 | $0.049 | 86%        |
| Input (cache read) | 8,396  | $0.003 | 4%         |
| Output             | 356    | $0.005 | 10%        |

The LLM was doing almost no thinking — it was just reading the same bloated context over and over.

## The two kinds of tool work

When we looked at what was actually inflating the context, we found two distinct categories of tool use.

### Simple lookups: trim the result

Some tool calls are straightforward: call an API, get a response, use a value from it. The problem is that the response is bloated. The Quickbooks MCP returned full entity objects — every field, including currency preferences, billing settings, metadata timestamps, and balance history. In reality, all the LLM needed was `Customer ID: 162`.

The fix here is simple: **trim the tool result before it enters the conversation history.** Return only what the LLM needs. We cap our tool messages at ~160 characters using a `briefSummary` field and store the raw data separately in S3. The full response never touches the conversation history.

This is the right fix for any tool call where the work is one step: call, extract, move on.

### Exploratory work: subagent delegation

But not all tool work is a single call. Our QuickBooks read flow looks like this:

1. Search available API tools (returns ~34K chars of schemas and execution guidance)
2. Pick the right tools based on the search results
3. Query the customer record
4. Query the item catalog
5. Extract the relevant IDs from both responses

This is a multi-turn exploration — the agent is searching, deciding, querying, and parsing across several back-and-forth cycles. Even if you trim each individual tool result, you still have 5 turns of history accumulating in your parent context. And the parent doesn't need any of it. It just needs the answer: "Customer 'Acme Corp' is ID 162, Item 'Services' is ID 1."

This is where **subagent delegation** makes sense. You spawn a subagent with its own isolated context, let it do the messy multi-turn exploration, and return only the condensed findings to the parent.

```
Parent:
  → "Find the customer and item IDs for this invoice"

  Subagent (isolated context):
    → Search API tools (34K chars of schemas)
    → Query customer (full entity response)
    → Query item catalog (full entity response)
    → Extract: Customer ID 162, Item ID 1
    ← Context discarded after extraction

  ← "Customer 'Acme Corp' → ID 162, Item 'Services' → ID 1"
     (~100 chars enter parent history)

Parent:
  → Generate write plan (with ~100 chars of context, not 46K)
  ← Done
```

The subagent's bloated context is paid for once and thrown away. The parent never has to know how many API calls it took, what schemas were searched, or what dead ends were hit.

### The key difference

Trimming solves "the response is too big." Subagent delegation solves "the work is too messy."

If you only trim results, you still leak the shape of the exploration into the parent — every intermediate step, every query, every tool search. The parent's history still grows with each step the subagent would have handled.

If you only use subagents, you're adding unnecessary complexity to simple lookups that could be handled by returning fewer fields.

## The decision rule

When you're wiring up a new tool in your agent:

**Trim the result** when:

- The tool work is a single call-and-extract
- You can define upfront what fields the LLM needs
- The response is large but the work is simple

**Delegate to a subagent** when:

- The work requires multiple tool calls in sequence
- The agent needs to search, decide, then query (exploration)
- Intermediate results are high-volume but only the final answer matters to the caller
- The work might involve retries or branching paths

## The impact

After applying both strategies — trimming simple results and delegating exploratory reads to a subagent — our parent orchestrator's context stays flat regardless of how many tool operations it coordinates:

| Metric                       | Before (inline)             | After (trim + subagent)        |
| ---------------------------- | --------------------------- | ------------------------------ |
| Parent sees from tool search | ~34K chars of schemas       | Nothing (subagent handles it)  |
| Parent sees from API query   | ~12K chars of full entities | ~100 chars: IDs extracted      |
| History growth per turn      | Quadratic (compounds)       | Flat (~100-200 chars per task) |

The subagent still pays its own multi-turn cost internally, but that cost is bounded and ephemeral. It doesn't compound across the parent's lifetime.

## The takeaway

The quadratic cost of multi-turn tool calling is real, but "use subagents" isn't always the answer, and "trim your results" isn't always sufficient.

The distinction that matters is whether you're dealing with a **lookup** or an **exploration**. Lookups produce large responses that can be trimmed at the source. Explorations produce entire sub-conversations that need to be contained.

The next time a trace surprises you with its cost, look at the input breakdown. If 80-90% is input tokens, check what's being replayed. If it's bloated API responses, trim them. If it's an entire multi-turn workflow that the parent didn't need to witness, wrap it in a subagent and return only the answer.
