import { useState, useEffect, useRef } from "react";

const ALL_QUESTIONS = [
  {
    id: 1,
    question: "A B2B SaaS company runs a generative AI campaign that produces personalized landing pages for each prospect. CTR improves by 34%, but pipeline velocity actually slows down. What's the most likely culprit?",
    options: [
      "The personalized pages are triggering spam filters and delaying email delivery",
      "Higher engagement is attracting lower-intent visitors who weren't previously clicking",
      "The AI is optimizing for click behavior, not conversion intent — misaligned objective function",
      "Personalization at the landing page level creates decision fatigue without proper CTA hierarchy",
    ],
    correct: 2,
    explanation: "This is a classic misaligned objective function problem. The AI succeeded at maximizing clicks — the wrong metric. It learned to produce compelling, curiosity-driving copy that gets people in the door without qualifying them or reinforcing purchase intent. Pipeline slows because sales is now working harder leads who weren't primed to buy. Optimizing a proxy metric instead of the business outcome is one of the most common and expensive AI marketing failure modes.",
  },
  {
    id: 2,
    question: "Which best describes the difference between a retrieval-augmented generation (RAG) system and fine-tuning, in a marketing context?",
    options: [
      "RAG updates the model's weights with brand-specific data; fine-tuning pulls from external sources at runtime",
      "Fine-tuning is better for real-time personalization; RAG is better for tone and voice consistency",
      "RAG grounds outputs in current, retrievable data without changing the model; fine-tuning bakes knowledge into weights but can't update dynamically",
      "They are functionally equivalent — the choice is purely a cost decision",
    ],
    correct: 2,
    explanation: "RAG retrieves relevant context at inference time and passes it into the prompt — no weight updates, always current. Fine-tuning modifies the model's weights during training — deeply embedded but static. The power move for brand applications is combining both: fine-tune for voice and domain reasoning, RAG for live knowledge like pricing, product specs, and inventory.",
  },
  {
    id: 3,
    question: "A CMO wants to use AI to scale content production 10x. Six months in, organic traffic is up but leads are flat and brand sentiment has quietly declined. What's the most likely strategic failure?",
    options: [
      "The AI content is being penalized by Google's Helpful Content system",
      "Content volume scaled but content differentiation didn't — the brand is producing more of what everyone else is producing",
      "The team failed to implement proper schema markup on AI-generated pages",
      "AI content inherently lacks the emotional resonance needed to convert at the bottom of the funnel",
    ],
    correct: 1,
    explanation: "When everyone uses the same LLMs trained on the same internet, you get content convergence — technically sound, topically relevant, utterly forgettable. Traffic goes up from covering more surface area. Leads stay flat because nothing is distinct enough to create preference. Brand sentiment dips because audiences feel the generic-ness. The fix isn't less AI — it's stronger editorial POV fed into the AI: proprietary data, contrarian angles, original frameworks.",
  },
  {
    id: 4,
    question: "What is the primary reason prompt injection is a critical security concern for AI systems deployed in customer-facing marketing applications?",
    options: [
      "It allows competitors to extract your proprietary system prompts and replicate your AI strategy",
      "It can cause the model to ignore its instructions and act on malicious input embedded in user-provided content",
      "It degrades model performance over time by poisoning the conversation history",
      "It exposes PII by forcing the model to repeat back sensitive training data",
    ],
    correct: 1,
    explanation: "Prompt injection is social engineering for AI systems. Malicious input can be embedded in form fields, chat inputs, or even scraped web content in a RAG pipeline — hijacking the model's behavior mid-conversation. In customer-facing marketing apps, this means a chatbot could be manipulated into offering unauthorized discounts, making false product claims, or leaking internal pricing. Brand and legal exposure, not just a security footnote.",
  },
  {
    id: 5,
    question: "An e-commerce brand deploys an AI personalization engine that increases revenue per visitor by 22%. However, a segment of their audience notices they're being shown different prices than friends. What is this an example of?",
    options: [
      "Dynamic pricing, which is legal and standard practice in e-commerce",
      "Algorithmic price discrimination, which raises ethical and potential regulatory concerns",
      "A/B testing gone wrong — the system should have been segmented by cohort, not individual",
      "Model overfitting causing inconsistent output across user sessions",
    ],
    correct: 1,
    explanation: "Dynamic pricing = prices change based on demand, time, or inventory. Algorithmic price discrimination = prices change based on who you are (or who the model thinks you are). The latter carries real regulatory exposure under the EU AI Act, FTC guidelines, and state consumer protection laws. When customers notice and compare, you also have a brand trust problem that can unwind that 22% revenue gain quickly. The ethics hinge on what signals the model uses — loyalty tier is generally acceptable; inferred income or vulnerability is dangerous territory.",
  },
  {
    id: 6,
    question: "Which metric is most likely to be a vanity metric when evaluating an AI chatbot deployed for B2B lead generation?",
    options: [
      "Conversation completion rate",
      "Number of conversations initiated",
      "Qualified leads handed off to sales",
      "Average session duration",
    ],
    correct: 1,
    explanation: "Conversations initiated tells you the widget is visible and getting clicked — that's it. It says nothing about quality, intent, or outcome. You could 10x that number tomorrow by making the widget more aggressive and likely hurt pipeline while the metric looks great. The only metric here that connects to business outcome is qualified leads handed off to sales. Any metric that can improve while business outcomes worsen is a vanity metric by definition.",
  },
  {
    id: 7,
    question: "A marketing team uses an LLM to analyze 5,000 customer support tickets and identify top pain points. The model surfaces 'pricing' as the #1 complaint. Before acting on this, what should the team do first?",
    options: [
      "Validate the finding with a separate NLP model to confirm classification accuracy",
      "Pressure test whether 'pricing' complaints reflect actual price sensitivity or a perceived value gap",
      "Expand the dataset to at least 50,000 tickets to achieve statistical significance",
      "Cross-reference against CSAT scores to ensure the sample isn't biased toward dissatisfied customers",
    ],
    correct: 1,
    explanation: "Customers say 'it's too expensive' when they actually mean 'I don't understand what I'm getting for the money' far more often than they mean 'lower the price and I'll buy.' Acting on the surface label leads you to discounting strategy and pricing page redesigns when the real fix might be better onboarding or stronger ROI proof points. Treat LLM-surfaced insights as hypotheses, not conclusions. The model is excellent at pattern recognition — it is not equipped to tell you what the pattern means without human strategic interpretation.",
  },
  {
    id: 8,
    question: "What does the attention mechanism refer to in transformer-based models, and why does it matter for marketing applications specifically?",
    options: [
      "The model's ability to prioritize recent tokens over older ones, making it better at short-form copy than long-form",
      "A weighting system that allows the model to assess relationships between all tokens in a sequence simultaneously, enabling context-aware output",
      "The layer that filters out irrelevant training data to reduce hallucination rates in brand-specific deployments",
      "A fine-tuning technique that directs model focus toward high-performing marketing copy in the training set",
    ],
    correct: 1,
    explanation: "Attention is why transformers can hold context across a long document and why a model can write a 2,000-word article that stays thematically coherent. The model isn't reading linearly — it's weighing relationships across the entire input simultaneously. The practical implication: prompt structure matters as much as prompt content, and context-rich prompts outperform keyword-stuffed ones because you're giving the model a relationship map to reason from.",
  },
  {
    id: 9,
    question: "A brand wants to implement AI-generated UGC-style video ads at scale. Beyond performance, what is the single most important non-technical risk to address before launching?",
    options: [
      "Platform detection algorithms that flag and suppress AI-generated content",
      "Disclosure and authenticity — FTC guidelines on AI-generated content and the erosion of consumer trust if deception is discovered",
      "Copyright ownership of AI-generated video assets across different jurisdictions",
      "Talent union regulations (SAG-AFTRA) around synthetic likeness usage",
    ],
    correct: 1,
    explanation: "SAG-AFTRA's AI likeness agreements are real and enforceable, making D a serious competing consideration. But B edges it out because it's universally applicable — it doesn't require a human likeness to be an issue, and the FTC has been explicitly aggressive about undisclosed AI-generated content in advertising. The consumer trust angle is also existential: you can settle a lawsuit, you can't always recover from a viral 'this brand faked their customers' moment. Disclose early, disclose clearly, and build disclosure into the creative concept itself.",
  },
  {
    id: 10,
    question: "In the context of LLM outputs used in marketing, what is 'groundedness' and why is it distinct from 'accuracy'?",
    options: [
      "Groundedness refers to factual correctness verified against external sources; accuracy refers to grammatical and stylistic precision",
      "Groundedness means the output is anchored to a specific source or context provided; accuracy means the output is factually true in an absolute sense — a response can be grounded but inaccurate, or accurate but ungrounded",
      "They are synonymous — both describe whether the model's output reflects real-world facts",
      "Groundedness is a RAG-specific term for retrieval relevance scoring; accuracy is a fine-tuning evaluation metric",
    ],
    correct: 1,
    explanation: "A model can be perfectly grounded to a source document that itself contains errors — grounded, not accurate. Conversely, it can produce a factually correct claim with no source citation — accurate, not grounded. In RAG-based marketing systems, both matter: you need outputs that correctly cite your actual brand content (groundedness) and that the brand content itself is factually correct (accuracy). Conflating the two leads to false confidence in either direction.",
  },
  {
    id: 11,
    question: "A marketing team is frustrated that their LLM 'forgets' context from earlier in long document analysis tasks. What's the most accurate technical explanation?",
    options: [
      "The model is hallucinating and replacing earlier context with invented content",
      "Attention degradation at the edges of the context window causes reduced weighting of distant tokens",
      "The model's temperature setting is too high, causing drift from source material",
      "The system prompt is competing with the document for available context space",
    ],
    correct: 1,
    explanation: "Often called the 'lost in the middle' problem — transformers tend to weight tokens at the beginning and end of context windows more heavily than the middle. Distant tokens receive reduced attention scores, not because they're forgotten, but because the attention mechanism naturally down-weights them in long sequences. D is also a real consideration (system prompts consume tokens), but it's a resource issue, not the core mechanism behind context degradation.",
  },
  {
    id: 12,
    question: "With third-party cookies deprecated, a brand wants to use AI to improve audience targeting. Which approach is most strategically sound?",
    options: [
      "Use a lookalike modeling algorithm trained on CRM data to find similar audiences",
      "License second-party data from a partner and feed it directly into your ad platform's AI",
      "Deploy predictive models on first-party behavioral data to build propensity scores for segmentation",
      "Use AI to scrape competitor social audiences and build targeting profiles",
    ],
    correct: 2,
    explanation: "First-party data is the durable asset in a cookieless world. Propensity scoring against your own behavioral data — purchase history, session depth, content consumption patterns — gives you targeting precision that doesn't depend on third-party infrastructure and compounds in value as you collect more. Lookalike modeling (A) is useful but derivative — you're only as good as your CRM quality. Second-party data (B) introduces dependency on a partner relationship. D is legally problematic in most jurisdictions.",
  },
  {
    id: 13,
    question: "A DTC brand's AI attribution model shows paid social driving 60% of conversions. Their last-click model showed 35%. What's the most likely explanation?",
    options: [
      "The AI model is over-crediting paid social due to recency bias in the training data",
      "The AI model is correctly identifying paid social's influence on earlier touchpoints that last-click misses",
      "The AI model has been trained on data that overrepresents paid social users",
      "The discrepancy indicates the AI model needs recalibration against a holdout group",
    ],
    correct: 1,
    explanation: "Last-click attribution systematically undercredits channels that operate earlier in the funnel — especially social, which is where awareness and consideration happen. Data-driven attribution models reconstruct the full conversion path and assign fractional credit across touchpoints. The jump from 35% to 60% is large but directionally consistent with social's actual role in DTC purchase journeys. D is good hygiene but doesn't explain the discrepancy — it would be a next step, not a diagnosis.",
  },
  {
    id: 14,
    question: "A brand deploys an LLM-powered FAQ bot without RAG. Which scenario represents the highest business risk?",
    options: [
      "The bot answers questions about the brand's history incorrectly",
      "The bot generates confident, plausible-sounding product specifications that don't exist",
      "The bot refuses to answer questions outside its training data",
      "The bot produces grammatically inconsistent responses",
    ],
    correct: 1,
    explanation: "A model hallucinating fabricated product specs with full confidence is a liability, compliance, and brand trust problem simultaneously. A customer acts on false specs, makes a purchase decision, and then discovers the product doesn't match — that's a return, a complaint, a negative review, and potentially a legal issue. The model has no grounding mechanism without RAG, so it fills gaps with statistically plausible fiction. C is actually the preferable failure mode — refusal is far safer than confident hallucination.",
  },
  {
    id: 15,
    question: "A content team notices their AI copywriter produces extremely predictable, formulaic output. Which parameter adjustment would most directly address this?",
    options: [
      "Max tokens — the outputs are being cut off too early",
      "Top-p (nucleus sampling) — it's limiting the probability distribution too narrowly",
      "Temperature — it's set too low, making outputs too deterministic",
      "Frequency penalty — repeated phrase patterns are suppressing creative variation",
    ],
    correct: 2,
    explanation: "Temperature is the primary lever for output diversity. At low temperatures (close to 0), the model almost always picks the highest-probability next token — maximally predictable. Increasing temperature expands the sampling distribution, introducing more variation. Top-p (B) is also a valid lever that controls the cumulative probability mass the model samples from — they work in concert. But temperature is the most direct and intuitive control for the 'too formulaic' problem.",
  },
  {
    id: 16,
    question: "Google's Helpful Content System specifically targets which type of content?",
    options: [
      "Content generated entirely by AI without human review",
      "Content created primarily for search engines rather than to genuinely help users",
      "Content that uses AI to stuff keywords unnaturally",
      "Content that fails to include proper schema markup",
    ],
    correct: 1,
    explanation: "Google has explicitly stated that AI-generated content is not inherently against its guidelines. The Helpful Content System evaluates intent and usefulness, not production method. Content created to manipulate rankings rather than serve readers — regardless of whether a human or AI wrote it — is what gets penalized. This is a critical nuance that most 'AI content is dead' takes get wrong. High-quality, genuinely useful AI-assisted content can and does rank.",
  },
  {
    id: 17,
    question: "A fashion brand wants to use multimodal AI to improve product discovery. Which use case has the highest proven commercial value?",
    options: [
      "Generating product descriptions from images automatically",
      "Visual search — allowing customers to upload a photo and find similar products",
      "AI-generated lookbook imagery replacing photoshoots",
      "Sentiment analysis of user-generated style photos",
    ],
    correct: 1,
    explanation: "Visual search has demonstrated measurable conversion lift in e-commerce contexts — Pinterest Lens, Google Lens, and ASOS's visual search all show that customers who use visual search convert at significantly higher rates. The intent signal is strong: a customer uploading a photo knows what they want. Auto-generating product descriptions (A) has value but is table stakes. Replacing photoshoots with AI (C) has a brand quality ceiling that premium fashion brands hit quickly.",
  },
  {
    id: 18,
    question: "An enterprise marketing team wants to implement AI governance. What is the most operationally critical first step?",
    options: [
      "Purchasing an AI monitoring platform to audit model outputs",
      "Establishing an AI use policy that defines acceptable use cases, data handling, and approval workflows",
      "Auditing all existing AI tools for compliance with the EU AI Act",
      "Training all marketing staff on prompt engineering best practices",
    ],
    correct: 1,
    explanation: "Without a policy, you don't know what you're monitoring for (A), what you're auditing against (C), or what you're training people to do within (D). Policy is the foundation: it defines what data can enter AI systems, who can approve new tools, what outputs require human review, and what the escalation path is when something goes wrong. Teams that skip to tooling or training before policy exists end up with fragmented, ungoverned AI adoption.",
  },
  {
    id: 19,
    question: "A creative director argues that AI-generated creative assets will never achieve brand differentiation because all brands have access to the same tools. This argument is:",
    options: [
      "Correct — commoditized tools produce commoditized output",
      "Partially correct — differentiation depends on the quality of inputs: brand strategy, creative direction, and proprietary data",
      "Incorrect — each model generates unique outputs so differentiation is inherent",
      "Incorrect — brand differentiation in AI creative comes from post-production human refinement",
    ],
    correct: 1,
    explanation: "Same tools, wildly different outputs — the differentiator is what you feed in. Proprietary brand guidelines, unique visual references, original strategic frameworks, specific stylistic constraints, and human creative direction are what separate generic AI output from distinctive brand creative. Garbage in, garbage out applies with extra force here. The CD is right that the tools are commoditized; they're wrong that differentiation is impossible — it just moved upstream.",
  },
  {
    id: 20,
    question: "Which metric is most appropriate for evaluating an LLM used for customer email response drafting?",
    options: [
      "Perplexity score",
      "BLEU score against a reference corpus of past emails",
      "Human evaluation of tone appropriateness and accuracy against a defined rubric",
      "Response latency in production",
    ],
    correct: 2,
    explanation: "BLEU and perplexity are NLP research metrics — useful for training but poor proxies for marketing quality. BLEU measures n-gram overlap with reference text, which punishes creative phrasing and rewards mimicry. Perplexity measures how surprised the model is by its own output — irrelevant to whether the email is actually good. Human evaluation against a rubric (tone, accuracy, resolution clarity, brand voice) is slower but the only method that captures what 'good' actually means in a customer communication context.",
  },
  {
    id: 21,
    question: "A brand uses AI to post at 'optimal times' based on historical engagement data. What critical assumption does this strategy fail to account for?",
    options: [
      "Platform algorithm changes that shift what content gets surfaced regardless of posting time",
      "The AI may not have enough data points to be statistically significant",
      "Optimal posting times shift as audience behavior evolves, making historical data increasingly stale",
      "AI scheduling tools don't have access to real-time platform API data",
    ],
    correct: 2,
    explanation: "Historical optimization is always backward-looking. Audience behavior drifts — work schedules change, platform usage patterns shift, seasonal factors compound. A model trained on last year's engagement data is optimizing for last year's audience. This is a distribution shift problem: the data the model learned from no longer reflects the environment it's operating in. A is also real but affects reach regardless of time; C is the specific failure mode of time-optimization strategies.",
  },
  {
    id: 22,
    question: "What is the primary limitation of using sentiment analysis alone to measure customer satisfaction in chatbot interactions?",
    options: [
      "Sentiment analysis models have low accuracy on short-form text",
      "Sentiment doesn't capture resolution — a customer can express neutral or positive sentiment while still being unsatisfied with the outcome",
      "Sentiment analysis can't process multilingual inputs reliably",
      "It requires human labeling to train, creating data bottlenecks",
    ],
    correct: 1,
    explanation: "A customer can respond 'ok thanks' with completely neutral sentiment after receiving a wrong answer that didn't resolve their issue. They're not angry — they're just going to churn quietly or call your competitor. Sentiment measures emotional tone; it doesn't measure whether the interaction achieved its purpose. Resolution rate, containment rate, and post-chat CSAT surveys are necessary complements. Sentiment alone gives you a false floor — you think things are fine because nobody's yelling.",
  },
  {
    id: 23,
    question: "A marketing AI trained on historical campaign data to predict high-value customers learns to de-prioritize certain zip codes. This is an example of:",
    options: [
      "Geographic targeting, which is standard practice in marketing",
      "Algorithmic bias — the model has learned and is perpetuating historical discrimination patterns in the data",
      "Market segmentation based on legitimate socioeconomic indicators",
      "Overfitting to training data that needs regularization",
    ],
    correct: 1,
    explanation: "Zip codes are notoriously effective proxies for race and income — this is called redlining, and its algorithmic version carries the same discriminatory outcomes even when no protected attribute was explicitly used as a feature. If historical campaigns underinvested in certain areas (for any reason), the model learns that those areas are 'low value' and perpetuates the underinvestment. The model isn't malicious — it's faithfully replicating a biased history. The fix requires auditing outcomes by demographic group, not just model accuracy.",
  },
  {
    id: 24,
    question: "The FTC's updated guidelines on endorsements most directly affect AI marketing practitioners in what way?",
    options: [
      "AI-generated ad copy must be reviewed by a licensed attorney before publication",
      "Material connections and AI-generated content in testimonials and endorsements must be clearly disclosed",
      "Brands must register AI tools used in advertising with the FTC",
      "AI-generated creative assets cannot be used in performance advertising without disclosure",
    ],
    correct: 1,
    explanation: "The FTC's 2023 endorsement guidelines explicitly address AI-generated reviews, synthetic testimonials, and undisclosed material connections. The core principle: consumers have a right to know when content that appears organic — a review, a testimonial, a recommendation — was generated or influenced by AI or paid for by the brand. The disclosure obligation applies to the platform and the brand. Violations can result in civil penalties, and the FTC has signaled aggressive enforcement intent.",
  },
  {
    id: 25,
    question: "Chain-of-thought prompting is most effective for which type of marketing task?",
    options: [
      "Generating high-volume short-form ad variations",
      "Multi-step strategic analysis such as competitive positioning or campaign planning",
      "Producing consistent brand voice across long-form content",
      "Extracting structured data from unstructured customer feedback",
    ],
    correct: 1,
    explanation: "Chain-of-thought prompting instructs the model to reason through intermediate steps before producing a final answer. This dramatically improves performance on tasks requiring sequential logic — analyzing a competitive landscape, working through a campaign budget allocation, or building a strategic framework. For high-volume short-form tasks (A), CoT adds latency and cost with minimal benefit. Brand voice (C) is better served by examples and style guides. Structured extraction (D) benefits more from few-shot formatting examples.",
  },
  {
    id: 26,
    question: "What is the 'cold start problem' in AI personalization, and why does it matter at product launch?",
    options: [
      "New models require extensive computational warm-up time before producing accurate outputs",
      "Without sufficient user interaction data, personalization models default to generic recommendations",
      "Cold weather months produce anomalous behavioral data that skews personalization models",
      "New user segments can't be targeted until they've completed at least one purchase cycle",
    ],
    correct: 1,
    explanation: "Personalization models learn from behavior — but new users have no behavior history, and new products have no interaction data. The model has nothing to differentiate on, so it falls back to popularity-based recommendations identical for everyone. This matters at launch because you're serving your most critical first impression with your weakest model performance. Mitigation strategies include content-based filtering (using item attributes instead of user history), explicit onboarding preference capture, and hybrid models that blend collaborative filtering with rule-based fallbacks.",
  },
  {
    id: 27,
    question: "A marketing team is choosing between a frontier model API and an open-source self-hosted model for internal content generation. What is the most important non-performance factor to evaluate?",
    options: [
      "Cost per token at their expected usage volume",
      "Data privacy — whether proprietary brand and customer data is used for provider model training",
      "The open-source community's update cadence for the chosen model",
      "Integration compatibility with their existing marketing stack",
    ],
    correct: 1,
    explanation: "Sending proprietary brand strategy, unreleased campaign concepts, pricing models, or customer data to a third-party API creates real IP and compliance exposure. Most enterprise providers offer data processing agreements that opt you out of training, but default terms often don't. For regulated industries (finance, healthcare) this becomes a compliance blocker entirely. Open-source self-hosted models eliminate this concern by design — your data never leaves your infrastructure. Cost matters, but a data leak or compliance violation costs more than tokens.",
  },
  {
    id: 28,
    question: "A brand uses AI to dynamically generate personalized subject lines. Open rates improve 18% but unsubscribes increase 12%. What does this most likely indicate?",
    options: [
      "The AI is generating clickbait-style subject lines that don't reflect email content — creating a bait-and-switch experience",
      "The increased open rate is attracting users who weren't previously engaged and are now opting out",
      "The personalization is too invasive, signaling to users that the brand knows too much about them",
      "The AI is overfitting to open-rate optimization, ignoring list health as a constraint",
    ],
    correct: 0,
    explanation: "Open rate up, unsubscribes up — the classic bait-and-switch pattern. The subject line got the click, but the email content didn't deliver on the implied promise. Users felt misled and removed themselves from the list. This is the same misaligned objective function problem applied to email: the AI was rewarded for opens, not for satisfied readers. The fix is evaluating subject lines against both open rate AND downstream engagement (click-through, time-to-conversion, unsubscribe rate) as a composite reward signal.",
  },
  {
    id: 29,
    question: "An AI predictive model claims 87% accuracy in predicting which leads will convert. Before trusting this number, what should you verify first?",
    options: [
      "The model's F1 score alongside accuracy to understand precision/recall tradeoff",
      "Whether the 87% was measured on training data or a held-out test set",
      "The training data's recency — models trained on old data don't reflect current market conditions",
      "Whether the model accounts for seasonality in conversion rates",
    ],
    correct: 1,
    explanation: "Measuring accuracy on training data is one of the most common ways ML metrics get inflated. The model has already seen that data — it's memorized patterns, not learned to generalize. Held-out test set performance on data the model has never seen is the only valid measure of real-world predictive ability. A and C are important second steps, but if the 87% is a training accuracy number, the rest of the analysis doesn't matter — the number isn't real.",
  },
  {
    id: 30,
    question: "AI Overviews (Google SGE) most directly threaten which type of content investment?",
    options: [
      "Long-form thought leadership and original opinion pieces",
      "Informational content targeting top-of-funnel, definition-style queries",
      "Product-focused transactional pages",
      "Video and visual content optimized for image search",
    ],
    correct: 1,
    explanation: "AI Overviews answer 'what is X,' 'how does Y work,' and 'best Z for beginners' queries directly in the SERP — killing the click before it happens. Top-of-funnel informational content that previously captured awareness traffic now feeds Google's AI rather than your site. The strategic response is to move investment toward content that AI Overviews can't replicate: original data and research, strongly opinionated POV pieces, proprietary frameworks, and product/conversion-focused content where the AI has nothing to sell.",
  },
  {
    id: 31,
    question: "What distinguishes an 'agentic' AI system from a standard LLM deployment in a marketing context?",
    options: [
      "Agentic systems use larger models with more parameters",
      "Agentic systems can take autonomous multi-step actions — browsing, writing, posting, optimizing — without human approval at each step",
      "Agentic systems are connected to real-time data sources, while standard LLMs operate on static training data",
      "Agentic systems require fine-tuning on brand-specific data to function effectively",
    ],
    correct: 1,
    explanation: "The key word is autonomous. A standard LLM responds to a prompt — you're in the loop at every step. An agentic system can plan, execute, observe results, and adapt across multiple steps without human intervention. In marketing, this means an agent could research a brief, draft copy, A/B test variations, monitor performance, and reallocate budget — all without a human approving each action. The power is significant; so is the risk. An agent that makes a bad decision compounds it rapidly before you can intervene.",
  },
  {
    id: 32,
    question: "A brand using AI-driven programmatic ad placement discovers their ads have been running alongside extremist content. The root cause is most likely:",
    options: [
      "The AI bidding algorithm prioritized CPM efficiency over content adjacency",
      "The brand safety keyword blocklist was insufficient for contextual understanding",
      "The DSP's AI classification system failed to correctly categorize the content",
      "All of the above are contributing factors, but keyword blocklists are the primary controllable failure point",
    ],
    correct: 3,
    explanation: "Brand safety failures in programmatic are almost always systemic — not a single point of failure. CPM-optimizing algorithms don't weigh adjacency unless explicitly constrained. Keyword blocklists are blunt instruments that miss context (a news article about terrorism isn't inherently unsafe, but a keyword block treats it the same as extremist content). And DSP classification systems have known gaps. The expert answer: layer all three defenses — algorithmic constraints, contextual intelligence tools (IAS, DoubleVerify), and inclusion lists over exclusion lists.",
  },
  {
    id: 33,
    question: "A global brand deploys one AI content system across all markets. Six months later, European audiences report the content feels 'off.' The most likely cause is:",
    options: [
      "The model wasn't trained on sufficient European language data",
      "Cultural nuance, communication norms, and regional idiom weren't accounted for in the prompt architecture",
      "Translation APIs introduced errors in the localization pipeline",
      "The model's training cutoff predates recent cultural shifts in European markets",
    ],
    correct: 1,
    explanation: "Localization isn't translation. European markets differ substantially in directness, formality register, humor conventions, and what constitutes trustworthy communication — and these differences vary even within Europe. An AI content system built with American prompting conventions and brand voice will feel tone-deaf in markets where those conventions don't apply. The fix is market-specific prompt architectures, local brand voice guidelines, and ideally native-speaker review baked into the content workflow.",
  },
  {
    id: 34,
    question: "A CMO asks you to prove the ROI of their AI marketing investment. The most rigorous approach is:",
    options: [
      "Calculate time saved by AI tools multiplied by average hourly employee cost",
      "Build a holdout test — compare AI-assisted campaign performance against a control group running without AI intervention",
      "Model the revenue impact of incremental performance improvements attributable to AI",
      "Survey the marketing team on perceived productivity gains",
    ],
    correct: 1,
    explanation: "Holdout testing is the gold standard because it isolates AI's causal impact from everything else happening simultaneously. Time-saved calculations (A) are directionally useful but ignore whether that saved time produces better outcomes. Revenue modeling (C) requires attribution assumptions that can be manipulated to tell any story. Surveys (D) measure perception, not performance. A holdout test — where matched cohorts run with and without AI intervention — is the only approach that establishes causality rather than correlation.",
  },
  {
    id: 35,
    question: "Which best describes why LLMs produce confident but factually incorrect claims?",
    options: [
      "LLMs are not connected to the internet and rely on outdated training data",
      "LLMs predict statistically likely token sequences without a grounded mechanism for verifying truth — confidence is a function of pattern, not fact",
      "LLMs lack the reasoning capability to distinguish between verified and unverified information",
      "LLMs are trained on internet data which contains significant misinformation",
    ],
    correct: 1,
    explanation: "Hallucination isn't a bug — it's an emergent property of how LLMs work. They're sequence prediction engines: given this context, what token comes next? If a plausible-sounding but false claim is the statistically likely completion, the model generates it with the same confidence it would generate a true one. There's no internal fact-checking mechanism, no 'confidence score' that reflects actual epistemic certainty. The model sounds authoritative because authoritative text is what it learned from — not because it knows it's right.",
  },
  {
    id: 36,
    question: "A brand maps AI interventions across the customer journey and finds AI outperforms at awareness and consideration but underperforms at decision and loyalty stages. The most likely explanation is:",
    options: [
      "AI models aren't trained on enough purchase behavior data to optimize conversion",
      "Decision and loyalty stages require trust signals and relational continuity that AI-generated touchpoints struggle to convey authentically",
      "The AI tools aren't integrated with CRM data, limiting personalization at lower funnel stages",
      "Attribution models are under-crediting AI's contribution to later funnel stages",
    ],
    correct: 1,
    explanation: "At awareness and consideration, content quality and relevance drive performance — AI is excellent at both at scale. At decision and loyalty, the purchase requires trust, and trust is built through perceived authenticity, consistency, and relationship. AI-generated touchpoints can feel transactional where a human or deeply personalized interaction would close the gap. C is a fixable implementation issue, not a structural one. B identifies the deeper strategic reality: AI amplifies reach, but human judgment still anchors conversion at high-stakes moments.",
  },
  {
    id: 37,
    question: "A startup uses AI to generate synthetic customer personas and survey responses in lieu of real consumer research. The primary risk is:",
    options: [
      "Synthetic data violates GDPR because it's derived from real user patterns",
      "The synthetic data will reflect the biases and limitations of the model that generated it, not actual consumer behavior",
      "AI-generated personas lack the demographic diversity needed for representative research",
      "The cost of generating high-quality synthetic data rivals real research at scale",
    ],
    correct: 1,
    explanation: "Synthetic research is circular: you're asking an AI trained on internet-scale data what consumers think, and it tells you what internet-scale data said consumers think. If real consumer behavior diverges from that distribution — which it always does in meaningful ways — your research is systematically wrong in ways you can't detect. You're not discovering what customers believe; you're discovering what the model's training data represents. High-stakes strategic decisions built on synthetic research have a quiet but serious validity problem.",
  },
  {
    id: 38,
    question: "A marketing leader asks you to choose between two AI writing tools: Tool A scores higher on ROUGE metrics; Tool B scores higher in blind human preference tests. Which do you recommend?",
    options: [
      "Tool A — objective metrics are more reliable than subjective human preference",
      "Tool B — human preference is the ultimate arbiter of marketing copy quality",
      "Neither — both metrics are inadequate for evaluating marketing-specific output quality",
      "Run both in production A/B tests and let conversion data decide",
    ],
    correct: 3,
    explanation: "ROUGE and human preference both measure proxies. ROUGE measures n-gram overlap with reference text — punishes creative phrasing, rewards mimicry. Human preference in lab settings doesn't predict real-world conversion behavior. The only metric that matters is whether the copy drives the business outcome you're optimizing for. A/B testing in production against conversion rate, revenue, or whatever your actual KPI is — that's the only evaluation that isn't a proxy. Lab metrics inform selection direction; live data confirms it.",
  },
  {
    id: 39,
    question: "B2B intent data platforms that use AI to identify in-market buyers are most valuable when combined with:",
    options: [
      "A high-volume automated outbound sequence triggered at the moment of intent signal",
      "Sales prioritization — using intent signals to focus human outreach on accounts most likely to convert now",
      "Retargeting campaigns that serve ads immediately upon intent signal detection",
      "AI-generated personalized proposals sent automatically to flagged accounts",
    ],
    correct: 1,
    explanation: "Intent signals are a prioritization tool, not a trigger for automation. The highest-value action on an in-market signal is getting a skilled human in front of that account while the intent window is open. Automated outbound (A) at the moment of intent signal often feels like surveillance, triggers spam filters, and destroys the very intent it's supposed to capture. Intent data's ROI compounds when it focuses scarce human attention — not when it feeds more automated noise into an already saturated buying committee.",
  },
  {
    id: 40,
    question: "A marketing agency is choosing an AI model for long-form thought leadership ghostwriting. Which factor should most heavily influence model selection?",
    options: [
      "Benchmark performance on standardized writing tasks",
      "Context window size and ability to maintain coherent narrative across 3,000+ words",
      "Cost per token given the volume of content they plan to produce",
      "Whether the model supports fine-tuning for brand voice consistency",
    ],
    correct: 1,
    explanation: "Thought leadership fails when it loses its thread — a 3,000-word piece that contradicts itself midway or forgets its thesis in section four is worse than useless. Context window size determines how much of its own output the model can 'see' as it continues writing, directly affecting long-form coherence. Benchmarks (A) are averages across tasks that don't reflect this specific use case. Cost (C) matters but is secondary to output quality. Fine-tuning (D) helps with voice but doesn't solve structural coherence.",
  },
  {
    id: 41,
    question: "A retailer uses AI for visual quality control of UGC before it appears in marketing. The primary technical challenge is:",
    options: [
      "UGC image resolution is typically too low for vision model analysis",
      "Defining 'quality' requires subjective aesthetic judgment that's difficult to encode as a consistent classification task",
      "Vision models can't reliably identify brand-inconsistent imagery across diverse product categories",
      "GDPR restrictions limit the use of customer-submitted images in AI training pipelines",
    ],
    correct: 1,
    explanation: "Quality is context-dependent, brand-dependent, and partially subjective — making it a genuinely hard classification problem. 'High quality' UGC for a luxury brand looks entirely different from 'high quality' UGC for a streetwear brand. The model needs to learn your specific aesthetic standard, not a general definition of quality, and that standard itself is fuzzy. Resolution (A) is a solved problem. Brand inconsistency (C) is a tractable classification task. The subjective aesthetic judgment problem is what actually requires careful dataset curation and ongoing human-in-the-loop review.",
  },
  {
    id: 42,
    question: "An AI tool automatically scrapes competitor websites, social channels, and review sites to build competitive intelligence reports. The most important legal consideration is:",
    options: [
      "Whether the scraped sites' terms of service prohibit automated data collection",
      "Whether the intelligence is being used to undercut competitors on pricing",
      "Whether the AI tool's outputs could be considered defamatory if shared publicly",
      "Whether the board has been informed that AI is being used for competitive intelligence",
    ],
    correct: 0,
    explanation: "The legality of web scraping is determined primarily by terms of service plus the Computer Fraud and Abuse Act (CFAA) in the US and equivalent statutes elsewhere. The hiQ v. LinkedIn case established some protections for scraping publicly available data, but ToS violations remain legally contested and many platforms aggressively pursue scrapers. Before deploying any automated collection tool, legal review of the target sites' ToS is essential — especially if the data is being used commercially or competitively.",
  },
  {
    id: 43,
    question: "A predictive churn model shows strong performance in testing but fails in production. The most common cause of this 'train-serve skew' is:",
    options: [
      "The production environment uses different hardware than the training environment",
      "Features available at training time aren't available at the same point in the prediction pipeline in production",
      "The model wasn't tested on enough edge cases during evaluation",
      "Production traffic volumes exceed what the model was optimized for",
    ],
    correct: 1,
    explanation: "Classic train-serve skew. At training time, you have the full historical record including what happened after the prediction point — features computed from future data leak into training and inflate performance metrics. In production, those features don't exist yet. The model learned to use information it can't actually access in real time. The fix is meticulous feature engineering that enforces temporal boundaries: only features available at the exact moment the prediction would be made in production can enter training.",
  },
  {
    id: 44,
    question: "A brand uses generative AI to create all visual brand assets going forward. The most likely strategic risk to materialize over 12–18 months is:",
    options: [
      "Legal uncertainty around copyright ownership of AI-generated assets",
      "Visual homogenization — the brand's aesthetic converges toward what AI systems produce most fluently, eroding distinctiveness",
      "Platform-specific rendering inconsistencies across digital and print",
      "Difficulty scaling the image generation pipeline to meet production demands",
    ],
    correct: 1,
    explanation: "Every brand using Midjourney or DALL-E with similar prompting conventions gets similar-looking output. The aesthetic of these systems has a gravity — certain visual styles, compositions, and rendering qualities emerge as defaults because they're statistically dominant in the training data. Without strong art direction pushing against that gravity, brands gradually drift toward the same visual language. The irony: AI promises to accelerate content production but can quietly homogenize brand identity if used without rigorous creative direction.",
  },
  {
    id: 45,
    question: "Marketing automation and AI are often conflated. The clearest distinction between them is:",
    options: [
      "Automation follows predefined rules; AI learns and adapts based on data patterns",
      "Automation is cheaper; AI delivers better results",
      "Automation handles email; AI handles paid media",
      "Automation is legacy technology; AI is its modern replacement",
    ],
    correct: 0,
    explanation: "Automation executes a predetermined logic: if X, do Y. It doesn't learn, adapt, or improve without human reprogramming. AI learns from data — it updates its behavior based on patterns, feedback, and outcomes without explicit rule-setting. The practical implication: automation is predictable but brittle (the logic breaks when conditions change); AI is adaptive but requires monitoring for drift. Many 'AI marketing' platforms are actually sophisticated rule engines with a layer of ML-based recommendation — the distinction matters when diagnosing what's actually making decisions.",
  },
  {
    id: 46,
    question: "A marketing AI performs well on average but significantly underperforms for users in lower-income zip codes. This is:",
    options: [
      "Acceptable performance variation due to data sparsity in those segments",
      "Disparate impact — technically neutral design producing unequal outcomes across demographic groups",
      "Geographic segmentation based on legitimate socioeconomic indicators",
      "A sign the model needs more training data from those segments before deployment",
    ],
    correct: 1,
    explanation: "Disparate impact doesn't require discriminatory intent — it's defined by the outcome, not the design. A model can use no protected attributes explicitly and still produce systematically worse results for protected groups if the features it uses are correlated with those attributes. This is a legal and ethical issue under fair lending laws, FTC consumer protection guidance, and increasingly the EU AI Act's non-discrimination provisions. D is a fair operational response but doesn't change the classification of what's happening right now.",
  },
  {
    id: 47,
    question: "Answer Engine Optimization (AEO) differs from traditional SEO primarily because:",
    options: [
      "AEO targets voice search while SEO targets text-based queries",
      "AEO optimizes for being cited as a source by AI systems, not just ranked in traditional SERPs",
      "AEO focuses on featured snippets while SEO focuses on organic rankings",
      "AEO requires structured data markup while SEO does not",
    ],
    correct: 1,
    explanation: "Traditional SEO optimizes for ranking position in a list of blue links. AEO optimizes for citation — being the source an AI system (ChatGPT, Perplexity, Google AI Overviews, Claude) quotes when answering a query. The success metric shifts from clicks to mentions. The content requirements also shift: LLM-extractable formatting matters — clear entity definitions, Q&A structure, concise factual summaries, authoritative sourcing. Ranking algorithms and citation algorithms have meaningful overlap but are not the same optimization target.",
  },
  {
    id: 48,
    question: "The primary risk of deploying autonomous AI agents for paid media management without human checkpoints is:",
    options: [
      "The agent may lack access to real-time auction data, causing suboptimal bid strategies",
      "Compounding errors — the agent can take rapid sequential actions that each seem locally reasonable but produce catastrophic outcomes before a human can intervene",
      "Platform APIs may rate-limit agent activity, causing campaign delivery gaps",
      "Agents can't effectively manage cross-channel budget allocation without unified attribution",
    ],
    correct: 1,
    explanation: "Agents operate at machine speed. A misconfigured bid strategy that a human would catch in a weekly review can burn a six-figure budget in hours if an agent is executing autonomously. Each individual decision can look reasonable in isolation while the compound effect is catastrophic — overbidding on a converting keyword, scaling spend, triggering budget reallocation, scaling further. This is why HITL (human-in-the-loop) checkpoints at key decision thresholds aren't optional for high-stakes agentic deployments — they're the circuit breaker.",
  },
  {
    id: 49,
    question: "Google has stated that AI-generated content isn't against its guidelines. What's the actual nuance that determines ranking impact?",
    options: [
      "AI content must be labeled with structured data markup to rank",
      "The guideline is about quality and helpfulness, not production method — low-quality AI content gets penalized the same as low-quality human content",
      "AI content can rank but is algorithmically demoted relative to human-written content",
      "AI content is permitted only if a human subject matter expert is listed as co-author",
    ],
    correct: 1,
    explanation: "Google's guidance is clear: it rewards content that demonstrates Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T) — the production method is irrelevant. A mediocre AI article gets the same treatment as a mediocre human article. An exceptionally well-researched, original, genuinely helpful AI-assisted article can rank. The confusion arises because most AI content published at scale is low-quality by nature — optimized for volume, not value — which created the association between AI content and ranking penalties. The penalty is for low quality, not for AI.",
  },
  {
    id: 50,
    question: "A brand asks you to implement 'AI everywhere' across their marketing stack in Q1. The most important thing to push back on is:",
    options: [
      "The timeline — AI implementation at scale takes longer than one quarter",
      "The framing — 'AI everywhere' prioritizes technology adoption over business problem-solving, which inverts the correct strategic order",
      "The budget — AI tools at enterprise scale are more expensive than most CMOs anticipate",
      "The talent gap — the team likely lacks the AI literacy to implement effectively",
    ],
    correct: 1,
    explanation: "All four are legitimate concerns, but B is the root issue. 'AI everywhere' is a technology-first strategy — deploy the tool, then find the problem. This is how you end up with expensive AI implementations that don't move business metrics, frustrated teams who adopted tools they don't understand, and a CMO wondering why ROI is flat. The correct order: identify the specific business problems creating friction, evaluate whether AI is the right solution, and then implement precisely. A, C, and D are consequences of getting B wrong.",
  },
];

const QUESTIONS_PER_SESSION = 10;

const TIERS = [
  {
    min: 10,
    max: 10,
    label: "Elite Practitioner",
    sub: "You're not reading about AI marketing — you're building it.",
    color: "#f5c842",
  },
  {
    min: 8,
    max: 9,
    label: "Practitioner",
    sub: "Solid strategic command. A few blind spots worth sharpening.",
    color: "#a3e635",
  },
  {
    min: 6,
    max: 7,
    label: "Informed Operator",
    sub: "You understand the tools. The frameworks need deepening.",
    color: "#60a5fa",
  },
  {
    min: 4,
    max: 5,
    label: "Surface-Level Fluent",
    sub: "You know the vocabulary. The substance needs work.",
    color: "#f97316",
  },
  {
    min: 0,
    max: 3,
    label: "Influencer, Not Practitioner",
    sub: "More LinkedIn than laboratory. Time to go deeper.",
    color: "#f43f5e",
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizApp() {
  const [phase, setPhase] = useState("intro"); // intro | quiz | results
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [animIn, setAnimIn] = useState(true);
  const [copied, setCopied] = useState(false);
  const topRef = useRef(null);

  const QUIZ_URL = "https://www.jamescannella.com/tools/ai-marketing-quiz";

  // Post height to parent for dynamic iframe resizing
  useEffect(() => {
    const postHeight = () => {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: "quizResize", height }, "*");
    };
    postHeight();
    const observer = new ResizeObserver(postHeight);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [phase, revealed, current]);

  function getShareText(score, tierLabel) {
    const scoreBar = Array.from({ length: 10 }, (_, i) =>
      i < score ? "█" : "░"
    ).join("");
    return `I just took the AI Marketing Practitioner Quiz — designed to separate influencers from practitioners.

Score: ${score}/10 — ${tierLabel}
${scoreBar}

10 questions. No buzzword bingo. No easy outs.

Think you can beat it? → ${QUIZ_URL}

(Quiz by @jamescannella — pragmatic AI marketing since 2018)`;
  }

  function handleCopyLinkedIn(score, tierLabel) {
    const text = getShareText(score, tierLabel);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleShareTwitter(score, tierLabel) {
    const tweet = `I scored ${score}/10 on the AI Marketing Practitioner Quiz — "${tierLabel}"\n\nDesigned to separate influencers from practitioners. No buzzword bingo.\n\nThink you can beat it?`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(QUIZ_URL)}`;
    window.open(url, "_blank");
  }

  function startQuiz() {
    const q = shuffle(ALL_QUESTIONS).slice(0, QUESTIONS_PER_SESSION);
    setQuestions(q);
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
    setAnimIn(true);
    setPhase("quiz");
  }

  function handleSelect(idx) {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
  }

  function handleNext() {
    const newAnswers = [
      ...answers,
      { correct: selected === questions[current].correct },
    ];
    setAnswers(newAnswers);

    if (current + 1 >= QUESTIONS_PER_SESSION) {
      setPhase("results");
    } else {
      setAnimIn(false);
      setTimeout(() => {
        setCurrent((c) => c + 1);
        setSelected(null);
        setRevealed(false);
        setAnimIn(true);
        topRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }

  const score = answers.filter((a) => a.correct).length;
  const tier =
    phase === "results"
      ? TIERS.find((t) => score >= t.min && score <= t.max)
      : null;

  const q = questions[current];
  const progress = ((current) / QUESTIONS_PER_SESSION) * 100;

  return (
    <div style={styles.root}>
      <style>{`
        .quiz-btn-primary:hover { opacity: 0.8 !important; }
        .quiz-btn-outline:hover { opacity: 0.8 !important; }
        .quiz-btn-primary { transition: opacity 400ms ease-out !important; }
        .quiz-btn-outline { transition: opacity 400ms ease-out !important; }
        .quiz-option-btn:not([data-revealed]):hover {
          border-color: rgba(196, 184, 232, 0.3) !important;
          background: rgba(196, 184, 232, 0.04) !important;
        }
      `}</style>
      <div style={styles.grain} />

      {/* INTRO */}
      {phase === "intro" && (
        <div style={styles.centered}>
          <div style={styles.introCard}>
            <div style={styles.badge}>2026 AI MARKETING AUDIT</div>
            <h1 style={styles.headline}>
              Take the<br />
              <span style={styles.accentGradient}>AI Marketing</span><br />
              Quiz
            </h1>
            <p style={styles.subline}>
              10 questions. No buzzword bingo. No participation trophies.<br />
              This separates the people who <em>talk</em> about AI marketing<br />
              from the ones who <em>build</em> it.
            </p>
            <div style={styles.ruleLine}>
              <span>10 questions per session</span>
              <span style={styles.dot}>·</span>
              <span>Drawn from a pool of 50</span>
              <span style={styles.dot}>·</span>
              <span>Scored at the end</span>
            </div>
            <button className="quiz-btn-primary" style={styles.startBtn} onClick={startQuiz}>
              Begin the Audit →
            </button>
            <p style={styles.credit}>
              By <a href="https://jamescannella.com" style={styles.creditLink} target="_blank" rel="noreferrer">James Cannella</a> — AI Marketing Practitioner since 2018
            </p>
          </div>
        </div>
      )}

      {/* QUIZ */}
      {phase === "quiz" && q && (
        <div style={styles.quizWrap} ref={topRef}>
          {/* Header */}
          <div style={styles.quizHeader}>
            <div style={styles.logoSmall}>2026 AI MARKETING AUDIT</div>
            <div style={styles.qCounter}>
              {current + 1} <span style={styles.qCounterOf}>/ {QUESTIONS_PER_SESSION}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>

          {/* Question card */}
          <div
            style={{
              ...styles.qCard,
              opacity: animIn ? 1 : 0,
              transform: animIn ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.25s ease, transform 0.25s ease",
            }}
          >
            <div style={styles.qLabel}>Question {current + 1}</div>
            <p style={styles.qText}>{q.question}</p>

            <div style={styles.options}>
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correct;
                const isSelected = i === selected;
                let bg = "transparent";
                let border = "1px solid rgba(255,255,255,0.1)";
                let labelColor = "#888";
                let textColor = "#ccc";

                if (revealed) {
                  if (isCorrect) {
                    bg = "rgba(163,230,53,0.08)";
                    border = "1px solid #a3e635";
                    labelColor = "#a3e635";
                    textColor = "#e8f8c8";
                  } else if (isSelected && !isCorrect) {
                    bg = "rgba(244,63,94,0.08)";
                    border = "1px solid #f43f5e";
                    labelColor = "#f43f5e";
                    textColor = "#ffd0d7";
                  }
                } else {
                  bg = "transparent";
                  border = "1px solid rgba(255,255,255,0.1)";
                }

                return (
                  <button
                    key={i}
                    className="quiz-option-btn"
                    data-revealed={revealed ? "true" : undefined}
                    style={{
                      ...styles.optionBtn,
                      background: bg,
                      border,
                      cursor: revealed ? "default" : "pointer",
                    }}
                    onClick={() => handleSelect(i)}
                  >
                    <span style={{ ...styles.optionLabel, color: labelColor }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span style={{ ...styles.optionText, color: textColor }}>
                      {opt}
                    </span>
                    {revealed && isCorrect && (
                      <span style={styles.checkmark}>✓</span>
                    )}
                    {revealed && isSelected && !isCorrect && (
                      <span style={styles.xmark}>✗</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {revealed && (
              <div style={styles.explanation}>
                <div style={styles.explanationLabel}>
                  {selected === q.correct ? "✓ Correct" : "✗ Incorrect"} — Here's why it matters:
                </div>
                <p style={styles.explanationText}>{q.explanation}</p>
                <button className="quiz-btn-outline" style={styles.nextBtn} onClick={handleNext}>
                  {current + 1 >= QUESTIONS_PER_SESSION
                    ? "See My Results →"
                    : "Next Question →"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {phase === "results" && tier && (
        <div style={styles.centered}>
          <div style={styles.resultsCard}>
            <div style={styles.badge}>AUDIT COMPLETE</div>

            <div style={styles.scoreDisplay}>
              <span style={styles.scoreBig}>
                {score}
              </span>
              <span style={styles.scoreOf}>/ 10</span>
            </div>

            <div style={{ ...styles.tierBadge, borderColor: tier.color, color: tier.color }}>
              {tier.label}
            </div>

            <p style={styles.tierSub}>{tier.sub}</p>

            <div style={styles.resultGrid}>
              {questions.map((q, i) => {
                const a = answers[i];
                return (
                  <div
                    key={q.id}
                    style={{
                      ...styles.resultItem,
                      borderColor: a?.correct
                        ? "rgba(163,230,53,0.3)"
                        : "rgba(244,63,94,0.3)",
                    }}
                  >
                    <div style={styles.resultItemQ}>Q{i + 1}</div>
                    <div
                      style={{
                        ...styles.resultDot,
                        background: a?.correct ? "#a3e635" : "#f43f5e",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* SHARE */}
            <div style={styles.shareBlock}>
              <div style={styles.shareLabel}>— Share your result —</div>
              <div style={styles.shareButtons}>
                <button
                  className="quiz-btn-primary"
                  style={styles.shareLinkedIn}
                  onClick={() => handleCopyLinkedIn(score, tier.label)}
                >
                  {copied ? "✓ Copied to clipboard" : "Copy LinkedIn Post"}
                </button>
                <button
                  className="quiz-btn-outline"
                  style={styles.shareTwitter}
                  onClick={() => handleShareTwitter(score, tier.label)}
                >
                  Post on X / Twitter
                </button>
              </div>
              {copied && (
                <p style={styles.copiedHint}>
                  Paste directly into a new LinkedIn post.
                </p>
              )}
            </div>

            <div style={styles.cta}>
              <p style={styles.ctaText}>
                Want to close the gaps? I work with marketers and brands navigating AI strategy without the hype.
              </p>
              <a
                href="https://jamescannella.com"
                className="quiz-btn-primary"
                style={styles.ctaBtn}
                target="_blank"
                rel="noreferrer"
              >
                jamescannella.com
              </a>
            </div>

            <button style={styles.retakeBtn} onClick={startQuiz}>
              Retake with New Questions →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#000000",
    color: "#e0e0e0",
    fontFamily: "'Georgia', serif",
    position: "relative",
    overflowX: "hidden",
  },
  grain: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
    backgroundRepeat: "repeat",
    backgroundSize: "128px 128px",
    pointerEvents: "none",
    zIndex: 0,
  },
  centered: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    position: "relative",
    zIndex: 1,
  },
  introCard: {
    maxWidth: 600,
    width: "100%",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    letterSpacing: "0.25em",
    color: "#9a9aaa",
    border: "1px solid rgba(180,180,210,0.2)",
    padding: "4px 14px",
    marginBottom: 32,
  },
  headline: {
    fontSize: "clamp(44px, 8vw, 78px)",
    fontWeight: 400,
    lineHeight: 1.08,
    letterSpacing: "-0.02em",
    margin: "0 0 28px",
    color: "#ffffff",
  },
  accentGradient: {
    fontStyle: "italic",
    background: "linear-gradient(135deg, #edb4cc 0%, #b4b8ec 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "inline-block",
  },
  accent: {
    fontStyle: "italic",
    background: "linear-gradient(135deg, #edb4cc 0%, #b4b8ec 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "inline-block",
  },
  subline: {
    fontSize: 17,
    lineHeight: 1.7,
    color: "#6e6e7e",
    marginBottom: 28,
  },
  ruleLine: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    letterSpacing: "0.1em",
    color: "#444455",
    marginBottom: 40,
    flexWrap: "wrap",
  },
  dot: { color: "#2a2a3a" },
  startBtn: {
    background: "linear-gradient(135deg, #edb4cc 0%, #b4b8ec 100%)",
    color: "#0a0a0a",
    border: "none",
    padding: "14px 40px",
    fontSize: 14,
    fontFamily: "'Courier New', monospace",
    letterSpacing: "0.08em",
    cursor: "pointer",
    fontWeight: 700,
    transition: "opacity 400ms ease-out",
    display: "block",
    margin: "0 auto 24px",
  },
  credit: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    color: "#333344",
    letterSpacing: "0.05em",
  },
  creditLink: {
    color: "#555566",
    textDecoration: "none",
  },

  // QUIZ
  quizWrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "32px 24px 60px",
    position: "relative",
    zIndex: 1,
  },
  quizHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logoSmall: {
    fontFamily: "'Courier New', monospace",
    fontSize: 10,
    letterSpacing: "0.2em",
    background: "linear-gradient(135deg, #edb4cc 0%, #b4b8ec 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  qCounter: {
    fontFamily: "'Courier New', monospace",
    fontSize: 22,
    color: "#e0e0e0",
    fontWeight: 700,
  },
  qCounterOf: {
    color: "#333344",
    fontSize: 16,
  },
  progressTrack: {
    height: 1,
    background: "#111118",
    marginBottom: 32,
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #edb4cc 0%, #b4b8ec 100%)",
  },
  qCard: {
    background: "#080810",
    border: "1px solid #16161e",
    padding: "36px 36px 32px",
  },
  qLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 10,
    letterSpacing: "0.2em",
    color: "#333344",
    marginBottom: 16,
    textTransform: "uppercase",
  },
  qText: {
    fontSize: 20,
    lineHeight: 1.55,
    color: "#f0f0f8",
    marginBottom: 28,
    fontWeight: 400,
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  optionBtn: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "14px 16px",
    textAlign: "left",
    transition: "border-color 0.15s, background 0.15s, opacity 400ms ease-out",
    width: "100%",
  },
  optionLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    fontWeight: 700,
    minWidth: 20,
    paddingTop: 2,
    flexShrink: 0,
  },
  optionText: {
    fontSize: 15,
    lineHeight: 1.5,
    flex: 1,
  },
  checkmark: {
    color: "#b4d4a0",
    fontSize: 16,
    fontWeight: 700,
    flexShrink: 0,
  },
  xmark: {
    color: "#d4808c",
    fontSize: 16,
    fontWeight: 700,
    flexShrink: 0,
  },
  explanation: {
    marginTop: 28,
    paddingTop: 24,
    borderTop: "1px solid #16161e",
  },
  explanationLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    letterSpacing: "0.1em",
    color: "#666677",
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 1.75,
    color: "#777788",
    marginBottom: 24,
  },
  nextBtn: {
    background: "transparent",
    color: "#c4b8e8",
    border: "1px solid rgba(196,184,232,0.3)",
    padding: "10px 24px",
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: "0.08em",
    cursor: "pointer",
    transition: "opacity 400ms ease-out",
  },

  // RESULTS
  resultsCard: {
    maxWidth: 560,
    width: "100%",
    textAlign: "center",
  },
  scoreDisplay: {
    margin: "24px 0 20px",
    lineHeight: 1,
  },
  scoreBig: {
    fontSize: 96,
    fontWeight: 400,
    letterSpacing: "-0.04em",
    background: "linear-gradient(135deg, #edb4cc 0%, #b4b8ec 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "inline-block",
  },
  scoreOf: {
    fontSize: 36,
    color: "#222230",
  },
  tierBadge: {
    display: "inline-block",
    border: "1px solid",
    padding: "6px 20px",
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    letterSpacing: "0.15em",
    marginBottom: 16,
    textTransform: "uppercase",
  },
  tierSub: {
    fontSize: 16,
    color: "#666677",
    lineHeight: 1.6,
    marginBottom: 32,
  },
  resultGrid: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 36,
  },
  resultItem: {
    border: "1px solid",
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  resultItemQ: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    color: "#444455",
  },
  resultDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
  },
  cta: {
    background: "#06060c",
    border: "1px solid #16161e",
    padding: "24px 28px",
    marginBottom: 20,
  },
  ctaText: {
    fontSize: 14,
    color: "#666677",
    lineHeight: 1.65,
    marginBottom: 16,
  },
  ctaBtn: {
    display: "inline-block",
    background: "linear-gradient(135deg, #edb4cc 0%, #b4b8ec 100%)",
    color: "#0a0a0a",
    padding: "10px 28px",
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: "0.08em",
    fontWeight: 700,
    textDecoration: "none",
    transition: "opacity 400ms ease-out",
  },
  retakeBtn: {
    background: "transparent",
    color: "#333344",
    border: "none",
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: "0.08em",
    cursor: "pointer",
    padding: "8px 0",
    transition: "opacity 400ms ease-out",
  },
  shareBlock: {
    marginBottom: 20,
    textAlign: "center",
  },
  shareLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 10,
    letterSpacing: "0.2em",
    color: "#333344",
    marginBottom: 14,
    textTransform: "uppercase",
  },
  shareButtons: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  shareLinkedIn: {
    background: "linear-gradient(135deg, #edb4cc 0%, #b4b8ec 100%)",
    border: "none",
    color: "#0a0a0a",
    padding: "10px 20px",
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    letterSpacing: "0.08em",
    cursor: "pointer",
    transition: "opacity 400ms ease-out",
    minWidth: 180,
    fontWeight: 700,
  },
  shareTwitter: {
    background: "transparent",
    border: "1px solid rgba(196,184,232,0.25)",
    color: "#9090a8",
    padding: "10px 20px",
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    letterSpacing: "0.08em",
    cursor: "pointer",
    transition: "opacity 400ms ease-out",
    minWidth: 180,
  },
  copiedHint: {
    fontFamily: "'Courier New', monospace",
    fontSize: 10,
    color: "#b4d4a0",
    marginTop: 10,
    letterSpacing: "0.08em",
  },
};
