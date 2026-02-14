import type { CaseStudy } from "./types";

const placeholder = "/case-studies/placeholders/frame.svg";

const paragraph = (text: string, primary = false) => [{ text, primary }];

export const caseStudies: CaseStudy[] = [
  {
    title: "niakai",
    slug: "niakai",
    summary: "niakai listens, understands, and acts for sales teams.",
    status: "live",
    blocks: [
      {
        id: "niakai-1",
        media: {
          kind: "image",
          src: "/case-studies/niakai/NiaKai 1.png",
          alt: "niakai case study placeholder media",
        },
        body: [
          paragraph(
            "niakai listens, understands, and acts - summarizing calls, tracking follow-ups, and helping sales teams close faster.",
          ),
          paragraph(
            "what started as a one-off project in october 2025 quickly evolved into a monthly retainer.",
          ),
          paragraph(
            "today, i work with aalim and the niakai team as their founding designer, supporting product design, website design, social media assets, and gtm execution.",
          ),
          [
            { text: "challenge: ", primary: true },
            { text: "design a product experience that felt effortless to use, while avoiding the generic look most saas tools fall into." },
          ],
          [
            { text: "outcome: ", primary: true },
            { text: "niakai now has a distinctive interface with personality. early users and investors responded positively to both usability and visual direction." },
          ],
          [
            { text: "hot news: ", primary: true },
            { text: "niakai has signed strategic partnerships with auream's leader circle (which influences 77% of the fortune 100) and catalyze to strengthen connections, execution, and fundraising momentum." },
          ],
          paragraph("the niakai journey is just getting started."),
        ],
      },
    ],
  },
  {
    title: "savari",
    slug: "savari",
    summary: "savari unifies transport operations in one platform.",
    status: "live",
    blocks: [
      {
        id: "savari-1",
        media: {
          kind: "image",
          src: placeholder,
          alt: "savari case study placeholder media",
        },
        caption: "replace with savari image/video in public/case-studies/savari/",
        body: [
          paragraph(
            "savari helps transport companies manage bookings, scheduling, routing, fleet maintenance, workshop workflows, and day-to-day operations in one unified platform.",
          ),
          paragraph(
            "this engagement began as a 3-day trial in october 2025 and quickly turned into a monthly retainer after early design progress and product clarity.",
          ),
          paragraph(
            "i partnered with the team to redesign key product flows and elevate the overall ux for the v2 launch on 26 jan 2026.",
          ),
          paragraph(
            "public response on x and linkedin was strong, but the real win came from the target users: stakeholders, demo audiences, and early customers gave consistently positive feedback on usability and clarity.",
          ),
          paragraph(
            "savari was also featured in a recent article and is now receiving attention from operators across multiple regions.",
          ),
          paragraph("excited for what this team ships next."),
        ],
      },
    ],
  },
  {
    title: "attenfi",
    slug: "attenfi",
    summary: "attenfi focuses on credible, transparent fundraising.",
    status: "live",
    blocks: [
      {
        id: "attenfi-1",
        media: {
          kind: "image",
          src: placeholder,
          alt: "attenfi case study placeholder media",
        },
        caption: "replace with attenfi image/video in public/case-studies/attenfi/",
        body: [
          paragraph(
            "attenfi helps legitimate founders raise support in a more credible and transparent way than traditional crowdfunding platforms.",
          ),
          paragraph(
            "this was a focused one-off engagement covering website design, product design, and brand direction.",
          ),
          [{ text: "challenge: ", primary: true }, { text: "how do we make attenfi feel trustworthy from the first impression?" }],
          paragraph("branding and web experience were critical levers for that trust."),
          [{ text: "results: ", primary: true }, { text: "the platform was well received by early users and testers." }],
          paragraph("the team strongly aligned with the logo and overall brand direction."),
          paragraph(
            "some details are under sharing restrictions, but i can discuss the process and decisions in more depth on a call.",
          ),
        ],
      },
    ],
  },
  {
    title: "shadow interviewer",
    slug: "shadow-interviewer",
    summary: "nda project focused on recruiter workflows and rapid iteration.",
    status: "live",
    blocks: [
      {
        id: "shadow-1",
        media: {
          kind: "image",
          src: placeholder,
          alt: "shadow interviewer case study placeholder media",
        },
        caption:
          "replace with shadow interviewer image/video in public/case-studies/shadow-interviewer/",
        body: [
          paragraph(
            "shadow interviewer (working title) is one of my favorite projects to date. across the engagement, we designed and iterated on 200+ screens.",
          ),
          paragraph("i am currently under nda, so i cannot share full product details yet."),
          [{ text: "what i can share: ", primary: true }, { text: "the founder is a 2x entrepreneur who raised millions in previous ventures." }],
          paragraph(
            "the engagement started as a one-week trial and expanded into a 3-month collaboration.",
          ),
          paragraph(
            "the team ran repeated user-testing cycles and fed insights into each iteration.",
          ),
          paragraph("the development team implemented the designs with strong visual fidelity."),
          paragraph(
            "the ui system was built on top of shadcn and heavily customized to match the product's design language.",
          ),
          paragraph("total design surface covered: 200+ screens."),
          paragraph("i should be able to share more publicly in the coming months."),
          paragraph("until then, i can walk through selected parts privately on calls."),
        ],
      },
    ],
  },
  {
    title: "shopninja",
    slug: "shopninja",
    summary: "shopninja helps teams manage shopify stores without code.",
    status: "live",
    blocks: [
      {
        id: "shopninja-1",
        media: {
          kind: "image",
          src: placeholder,
          alt: "shopninja case study placeholder media",
        },
        caption: "replace with shopninja image/video in public/case-studies/shopninja/",
        body: [
          paragraph(
            "shopninja is an ai-powered platform that helps teams manage and update their shopify stores without writing code.",
          ),
          paragraph("i collaborated with marco, shopninja's founder, for 2-3 months on a monthly engagement."),
          paragraph("scope included landing page design, product ux/ui, and foundational brand guidelines."),
          paragraph(
            "we designed the system from scratch using shadcn as a base, then customized components to align with the brand direction.",
          ),
          [{ text: "goal: ", primary: true }, { text: "make shopify onboarding feel effortless and non-intimidating." }],
          paragraph(
            "marco later showcased the website and product at multiple ai events in portugal, where the response from attendees was highly encouraging.",
          ),
          paragraph(
            "this was a rewarding build from zero to launch-ready direction, and we plan to collaborate again soon.",
          ),
        ],
      },
    ],
  },
  {
    title: "kismetai",
    slug: "kismetai",
    summary: "new case study coming soon.",
    status: "coming-soon",
    blocks: [],
  },
];
