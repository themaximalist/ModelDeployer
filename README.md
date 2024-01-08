# Model Deployer
> deploy AI models for your apps

Model Deployer is the simplest way to deploy AI models for your applications.

**Features:**

* Rate-limit users based on pre-defined limits
* Free, credits, and recurring subscriptions are supported

* A single interface to dozens of local and remote models
* Easily view usage history for each app user




## Why does Model Deployer exist?

I built [LLM.js](https://github.com/themaximal1st/llm.js) because I wanted to give people control over how they use AI models in their apps.

It's great to use GPT-4 and Claude, but it sucks to get locked in. And it's hard to use local models.

LLM.js solves these problems, by creating a single simple interface that works with dozens of popular models.

As great as it is, it doesn't fully solve the problem.

Bundling an app with a local model is not practical, the binaries are hundreds of MBs or even GBs.

Downloading the model on first start also isn't practical. Some users will patiently sit through this, but most won't. The first 10 seconds mean everything on a new app—making users wait will not work.

How do you offer the power of server models, with the flexibility of local open-source models?

Model Deployer is the solution. It's an open-source server to manage models for your users. It trades a little bit of privacy for user experience.

Importantly, it's built on a 100% open stack. So for users who care, (if you're reading this you probably care), there are ways to go fully local, and self hosted.

This accomplishes the best of both worlds. Free, open-source, MIT licensed model deployment tech that integrates into the existing remote/local AI toolchain.



- Open-Source
- Hosted Service
    - Free hourly/daily/weekly/monthly credits (require email verification)
    - Free using your own API key
    - Pre-pay with credits
    - Monthly subscription 
- Features
    - Proxy to hundreds of local and remote AI models (LLM, stable diffusion, vectordbs)
    - Automatically manage usage for different tiers (free, paid, pro)
    - View usage history
    - Prevent free users from consuming your API tokens
- Future
    - pow ddos prevention
    - caching
    - Advertising Faucet supported
