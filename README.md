# Model Deployer
> deploy AI models for your apps

Model Deployer is the simplest way to deploy AI models for your applications.

**Features:**

* Proxy to hundreds of local and remote AI models (LLM, stable diffusion, vectordbs)
* A single interface to all models, built on [LLM.js](https://github.com/themaximal1st/llm.js)
* Easily view usage history for each app user
* Rate-limit users based on pre-defined limits
* Track cost and usage cross hundreds of AI models
* Free, paid, and user-provided API key are supported
* Prevent free users from consuming your API tokens
* Pre-pay with credits *(coming soon)*
* Monthly subscription *(coming soon)*
* Self-hosted or hosted [modeldeployer.com](https://modeldeployer.com)
* MIT License



## Getting started

You'll need a Postgres DB setup. Then in your shell:

```bash
npm install @themaximalist/modeldeployer
cd modeldeployer
npm install
cp .env.template .env # edit DB connection
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and you'll see Model Deployer.

You should be able to create a user, a model, and an API key.

Then you can use `LLM.js` to interact with your API:

```javascript
import LLM from "@themaximalist/llm.js"
await LLM("what color is the sky?", { model: "modeldeployer://api-key-goes-here" });
```

More documentation is coming soon!




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



## Author

-   [The Maximalist](https://themaximalist.com/)
-   [@themaximal1st](https://twitter.com/themaximal1st)



## License

MIT
