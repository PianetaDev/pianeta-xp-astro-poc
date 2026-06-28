---
title: "Behavioral and neural prediction: why we use them together"
description: "Two families of AI for validating video creative — audience simulation and brain response prediction. The literature treats them separately. We use them in parallel during production. Here's why, and what changes."
date: 2026-06-26
updated: 2026-06-26
authors: ["Pianeta.Studio"]
cover: "/og/bollettino-swarm.png"
ogImage: "/og/bollettino-swarm.png"
tags: ["neuromarketing", "ai-validation", "research", "swarm", "neural-prediction"]
readingTime: "10 min"
locale: en
draft: false
type: bulletin
relatedWork: ["eclag"]
category: "Root"
---

**TL;DR.** Two families of artificial intelligence exist for validating a video creative before producing it: audience simulation (multi-agent panels) and brain-response prediction (AI models trained on fMRI data). The academic literature treats them as separate traditions. We use them in parallel, during production — not after. This piece explains the scientific root of the method, not a case. For the case, see the [bulletin on the ECLAG campaign](/bulletin/validare-una-campagna-prima-di-produrla).

## Two distinct families of AI tools

Over the past five years, two traditions of AI applied to creative validation have matured in parallel, but they barely speak to one another.

The first is **audience simulation**, or swarm intelligence applied to testing. The idea is simple: instead of interviewing a hundred real people, you generate a hundred synthetic agents with different demographic and psychographic profiles, show them the stimulus, and gather reactions, votes, and motivations. It's an evolution of the focus group: fast, iterable, scalable. Known players on the market: Unanimous AI (operating since 2017 with clients like Disney), Artificial Societies (YC W25, 2.5 million personas), Limbik. All operate at the **behavioral level**: what people *would do* in front of the stimulus.

The second is **brain-response prediction**, or in-silico neuroscience. AI models trained on large volumes of fMRI data learn to predict how the cortex of an average subject would respond to a video or audio stimulus, without needing to put people in a scanner. Established commercial players in the market: Neurons Inc (attention and cognition), Neurensics (real fMRI on storyboards), Brainsight (predictive eye-tracking). All operate at the **neural level**: how the brain *processes* the stimulus.

The two families measure different things, at different levels, and neither one gives the full answer. The literature treats them as distinct. That distinction matters when explaining why it makes sense to use them together.

## What the literature says — the evidence that they work

The idea that brain responses predict real-world behavior isn't speculative. It's a line of research with twenty years of work behind it.

**Falk, Berkman & Lieberman (2012, *Psychological Science*)** showed that the neural response of a small group of participants to an anti-smoking ad predicts the volume of calls to a help line *better* than self-reported intentions collected through questionnaires. The lift ranges from 2.8 to 32 times, depending on the message.

**Knutson & Genevsky (2018)** formalized the "neuroforecasting" framework, identifying two brain regions — the nucleus accumbens and the medial prefrontal cortex — as predictors of choice at the population level, not just at the individual level.

**Genevsky, Västfjäll, Slovic & Knutson (2013, *Journal of Neuroscience*)** found that the lift in donations driven by the image of an identifiable victim isn't driven by guilt, but by a positive response in the nucleus accumbens. A counterintuitive result that changed how fundraising campaigns are thought about.

**Zito et al. (2021, *Frontiers in Psychology*)** applied neuromarketing tools to UNICEF legacy giving campaigns at IULM in Milan, showing that NGO campaigns have specific neurophysiological dynamics — greater intensity of emotional processing, stronger trust dependencies — that make neural validation particularly relevant in that sector.

The point across this body of work: the brain response of an average subject in attentive viewing is a *measurable and predictive* indicator of how a stimulus will travel in the world. It's not the only indicator. But it's one that works.

## Why combine behavioral and neural

The two families answer different questions, and the answers reinforce one another when they agree.

Behavioral prediction asks: *what would this person do with the content?* Would they share it, ignore it, donate, change their mind? It's useful for choosing between two or three possible creative directions, because it simulates the judgment of audiences with different values and habits.

Neural prediction asks: *what does the cortex process during exposure?* How much attention, what emotional valence, how much social engagement. It's useful for calibrating the details — the score, the edit, the audio mix — because it measures an involuntary response the person, if interviewed, wouldn't be able to describe.

When the two predictions converge, the evidence is stronger than what either could provide alone. When they diverge, you've learned something: either the stimulus is processed well but doesn't drive action, or the opposite. Both situations are informative for deciding whether to go into production, and with what corrections.

This logic — *convergent evidence is stronger than single evidence* — is the principle that scientifically justifies integrating the two families.

## What changes if you use them in production, not after

Here lies the operational point that, as far as we know from the public literature and documented agency practice, isn't yet documented as standard.

The dominant paradigm in neuromarketing is the **post-test**. You finish the campaign, send it to the lab, receive the report. If something doesn't work, it's too late: the cut is locked, the budget spent. For NGOs and public-interest organizations — which work on slower cycles with costly revisions — that means neural validation, in practice, doesn't guide development. It certifies it at the finish line.

**Scholte, van der Leij & Lamme (2022)** argued that testing should shift to the *storyboard stage*, before expensive decisions have been made. A sensible argument. But real fMRI on storyboards costs between €5,000 and €20,000 per session and takes days. It remains a single shot, not iterative.

The 2026 evolution is that AI models trained on fMRI data have reached a coverage level — around 70,000 cortical voxels across 700+ subjects, in the most recent models released by international academic and industrial research — that allows you to replace the scanner with compute. The cost of a test becomes minutes of GPU. Speed becomes five to ten minutes per cycle. And so it becomes possible to *iterate* during production, instead of testing once.

Combined with a multi-agent panel that works at the same rhythm, this means that while the editor works — picks a music track, tries another, trims three seconds, swaps the voiceover — the pair of tools runs in parallel. Every decision that would otherwise be made on instinct gets paired with a second quantitative opinion. *Before* the render, *before* going into production.

This is the leap. It's not the replacement of creative judgment: it's an integration into the standard iterative cycle, where before there was only instinct.

## What we don't promise

What's true for any predictive validation tool is true for this method.

The method **doesn't predict behavioral metrics** like watch-through rate, share, conversion, or donation. It predicts a *brain response of an average subject in attentive viewing conditions*, which is a necessary but not sufficient condition for real-world success. Success also depends on platform algorithm, targeting, paid distribution, timing, and social context.

The multi-agent panel **doesn't replace real focus groups with real people**. It allows you to iterate quickly, discard obviously wrong choices, calibrate prompts and briefs. For the final validation of an important strategic decision, real people remain the standard, and should stay that way.

And one honest point: **the combined integration in production is a recent methodological evolution**. Our accumulated experience covers a handful of projects, not hundreds. We're sharing what we've seen work; we're not offering industrial-scale statistical guarantees.

## Why we make it accessible

Historically, neural validation has meant university labs, weeks of waiting, tens of thousands of euros. Inaccessible for most NGOs, cultural organizations, and small agencies.

The shift from real fMRI to computational prediction changes the unit cost of a test by three or four orders of magnitude. For us this means it's realistic to include validation in the standard creative process, without a separate line item on the invoice, on video projects of normal scale. That's what we do on our projects.

It isn't just a technical choice. It's a positioning choice: people working on sensitive topics without a global brand budget should have access to the same level of rigor.

## FAQ

**What does the neural model actually measure?**
The predicted response of various cortical areas to a video or audio stimulus: attention, emotional valence, social processing, speech comprehension, default mode network activation. Numerical outputs per area, per moment. It lets you see where the stimulus "loses" and where it "holds."

**How does the multi-agent panel work?**
A population of thirty or more synthetic agents, each with a defined demographic and psychographic profile (age, profession, values, media consumption habits), is exposed to the stimulus. Each agent gives a motivated judgment. We aggregate resonances, frictions, divergences. It's similar to a simulated focus group — useful for choosing between directions, not for certifying.

**How generalizable is the predicted response?**
It's the response of an *average subject in attentive viewing*. It works well for stimuli aimed at a broad audience and for messages that don't require highly specialized cultural knowledge. It works less well for hyper-niche audiences, where validation with real people remains the standard.

**What sets this approach apart from traditional neuromarketing tools?**
Speed and integration. Traditional tools take a single snapshot at the finish line. Here the test runs during production, in parallel with the editor, and guides decisions as they're being made.

**Where can I see an applied case?**
The [bulletin on the ECLAG campaign](/bulletin/validare-una-campagna-prima-di-produrla) covers the first case we've documented publicly: three videos on children's online rights, validated with this method, produced in three weeks with eighteen iterations.

## Cases and links

→ [Choose to See Them — ECLAG](/work/eclag): the applied case study.
→ [Validating a video campaign before producing it](/bulletin/validare-una-campagna-prima-di-produrla): the operational story, the seven lessons, what we'll apply to the next projects.
→ [Creativity and neuromarketing](/services/neuromarketing-lab): the service.

## References

- Falk, E. B., Berkman, E. T., & Lieberman, M. D. (2012). From neural responses to population behavior. *Psychological Science*, 23(5), 439–445.
- Genevsky, A., Västfjäll, D., Slovic, P., & Knutson, B. (2013). Neural underpinnings of the identifiable victim effect. *Journal of Neuroscience*, 33(43), 17188–17196.
- Knutson, B., & Genevsky, A. (2018). Neuroforecasting aggregate choice. *Current Directions in Psychological Science*, 27(2), 110–115.
- Scholte, H. S., van der Leij, A. R., & Lamme, V. A. F. (2022). Evaluating advertising effectiveness with neuroimaging. *Frontiers in Neuroscience*.
- Zito, M., Fici, A., Bilucaglia, M., et al. (2021). Assessing the emotional response in social communication: the case of legacy giving campaigns. *Frontiers in Psychology*, 12.
