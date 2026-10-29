# GTM Strategy Generator

A satire site. You type a product name and one line about it, and it builds a consultant-grade go-to-market deck on one long page: a TAM, SAM and SOM funnel ($4.2 trillion, then "you and your mom"), an ideal customer profile of "everyone, but especially people", a 2x2 with your product alone in the top right, three personas drawn as shapes, a pricing slide titled "Charge less. No, more.", and a 90-day plan of 12 workstreams where only one item is real. That item is "Tell your customers what you shipped", and it links to [merge.tel](https://merge.tel).

Every slide downloads as a 1600x900 PNG. The footer strip on each one says "CONFIDENTIAL (made up)", the cover carries a stamp that says the same, and the personas are watermarked NOT A REAL PERSON. Those tells are drawn into the image, so they survive a screenshot.

It's one of the satire sites that point at [Merge & Tell](https://merge.tel). The source for that lives in `jfreal/mergetel`. This repo is `mergetel/gtmgen`.

## How it works

The page is static HTML, CSS and plain JavaScript with no build step and no dependencies.

- `index.html` and `assets/app.js` are the generator. The URL hash holds the product name (`n`), the description (`d`) and a reroll count (`r`). The seed is a hash of all three, so a link always rebuilds the same deck, and "Ask a different consultant" bumps `r`.
- `assets/common.js` has the shared drawing code, the seeded random number generator, and the site's own TAM in the header. That TAM starts at $4.2 trillion on 2026-10-28 and grows 0.42% a day, computed from the date. Nothing stores it.
- `frameworks/index.html` is the back catalogue at `/frameworks`.
- `data/frameworks.json` holds every framework of the week. The homepage shows the newest one.

## Framework of the week

`.github/workflows/framework-of-the-week.yml` runs every Monday at 15:17 UTC. It runs `scripts/new-framework.mjs`, which makes up a named framework (things like "The SPARK-10 Canvas" or "The Pyramid of Pyramids") with its own 2x2, stages and a one-paragraph explainer in consultant voice, and appends it to `data/frameworks.json`. The workflow then opens a PR titled with the framework's name and squash-merges it.

The seed is the ISO week, so a second run in the same week does nothing. Run it by hand from the Actions tab with "force" ticked to add another one anyway.

To try the script locally:

```sh
node scripts/new-framework.mjs          # no-op if this week already has one
FORCE=1 node scripts/new-framework.mjs  # adds one regardless
git checkout data/frameworks.json       # throw it away
```

The workflow needs one repo setting. Under Settings, Actions, General, turn on "Allow GitHub Actions to create and approve pull requests". If `main` is protected with required reviews or checks, the bot's merge will fail. In that case either relax the rule for this repo or add a `BOT_TOKEN` secret (a fine-grained token with contents and pull request write access on this repo). The workflow uses `BOT_TOKEN` when it exists and the default token when it doesn't. A PR merged with `BOT_TOKEN` also triggers other workflows, which the default token can't do.

Everything the script can produce comes from the word banks at the top of the file. Keep them generic. No real frameworks, companies or people.

## Run it locally

The pages fetch `data/frameworks.json`, so open them through a server, not from the file system:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

GitHub Pages serves the site. `.github/workflows/pages.yml` publishes the repo root on every push to `main` and after every framework-of-the-week run. The bot's merges use the default token, and pushes made with it don't start other workflows, so the deploy also listens for the framework workflow finishing.

To turn it on, go to Settings, Pages, and set Source to "GitHub Actions". The site is then at https://mergetel.github.io/gtmgen/.

Every link and fetch in the pages is relative, so the site works under `/gtmgen/` now and at the root of a custom domain later. `404.html` is the exception, because GitHub serves it for a missing path at any depth. It works out the root from the URL instead.

## Set the domain

The domain is still being bought. When it is, two things change:

1. In `assets/common.js`, set `SITE` to the new domain. That constant is the only place the domain lives, and it's what every slide prints in its footer. Until then it says merge.tel.
2. In Settings, Pages, enter it under Custom domain, and point the domain's DNS at GitHub Pages. A Pages site deployed by a workflow doesn't need a `CNAME` file.

## Rules for this site

- Obviously fake, and the image says so. Every downloadable slide carries its tells inside the PNG.
- Mock the genre, never a name. No real companies, products, people or their branding. The competitors on the 2x2 are things like "Spreadsheets" and "Doing nothing".
- No email capture. Nothing on the site collects or stores an address.
- The parody copy is overblown consultant voice on purpose. The "Why this exists" footer is John, in the first person, and links to merge.tel.
