import { useState } from 'react'
import skillTexts from '../skill-texts.json'
import {
  Zap, Coins, Code, Bot, Cpu, Layers,
  ChevronDown, ChevronUp, BookOpen, Terminal,
  Shield, Eye, FileText, Brain,
  Search, Target, Lightbulb, ArrowRight,
  CheckCircle, XCircle, Star,
  Menu, X, FileCode
} from 'lucide-react'

// ============================================================
// TYPES
// ============================================================

type SkillCategory =
  | 'core-scope'
  | 'prompt-token'
  | 'architecture'
  | 'research'
  | 'analysis'
  | 'context'
  | 'writing'

interface PKDSkill {
  id: string
  command: string
  namespace: 'plan' | 'write'
  character: string
  novel: string
  purpose: string
  whyThisCharacter: string
  category: SkillCategory
  level: 'beginner' | 'intermediate' | 'advanced'
  stage: number | 'research' | 'any'
  isCore: boolean
  isGate: boolean
  storyHook: string
  caption: string
  prevents: string[]
}

interface FailureMode {
  id: string
  name: string
  scenario: string
  symptoms: string[]
  rootCause: string
  skippedStage: number
  fixSkillIds: string[]
}

interface WorkflowStage {
  number: number
  name: string
  goal: string
  skillIds: string[]
  minComplexity: 1 | 2 | 3
}

interface GlossaryTerm {
  term: string
  definition: string
}

interface TriggerPhrase {
  thought: string
  skill: string
  command: string
}

// ============================================================
// DATA
// ============================================================

const CATEGORIES: Record<SkillCategory, { name: string; description: string }> = {
  'core-scope': { name: 'Core & Scope', description: 'Freeze scope, cut slices, enforce gates' },
  'prompt-token': { name: 'Prompt & Token', description: 'Optimize prompts and token economy' },
  'architecture': { name: 'Architecture', description: 'Design systems, plan execution' },
  'research': { name: 'Research', description: 'Analyze corpora, build curricula' },
  'analysis': { name: 'Analysis', description: 'Audit failures, run retrospectives' },
  'context': { name: 'Context', description: 'Reframe problems, generate briefings' },
  'writing': { name: 'Writing', description: 'Evaluate writing, audit UX, check style' },
}

const SKILLS: PKDSkill[] = [
  // === CORE & SCOPE (5) ===
  {
    id: 'joe-chip-scope',
    command: '/plan-joe-chip-scope',
    namespace: 'plan',
    character: 'Joe Chip',
    novel: 'Ubik',
    purpose: 'Freeze project scope before building',
    whyThisCharacter: 'In Ubik, Joe Chip watches reality decay around him. Doors demand payment to open, cigarettes crumble, coins corrode. Without constant maintenance, everything falls apart. Your project scope works the same way \u2014 without freezing it, every conversation degrades the original idea until it\'s unrecognizable.',
    category: 'core-scope',
    level: 'beginner',
    stage: 1,
    isCore: true,
    isGate: true,
    storyHook: 'Joe Chip\'s door won\'t open until he inserts a scope definition. He has exactly one coin.',
    caption: 'The door won\'t open until you pay with a scope definition. Joe has exactly one coin.',
    prevents: ['scope-explosion'],
  },
  {
    id: 'runciter-slice',
    command: '/plan-runciter-slice',
    namespace: 'plan',
    character: 'Glen Runciter',
    novel: 'Ubik',
    purpose: 'Design vertical slices with hard acceptance gates',
    whyThisCharacter: 'Glen Runciter is dead \u2014 but he keeps sending messages. Brief, urgent, practical messages that cut through confusion. "This is Runciter. I am alive. You are not." His skill has that same energy: cut the ambition, cut the features, cut everything that isn\'t the thinnest possible working path.',
    category: 'core-scope',
    level: 'beginner',
    stage: 4,
    isCore: true,
    isGate: true,
    storyHook: 'Half the room is solid (Slice 1). The other half is dissolving (Slice 4). Runciter sprays UBIK on what matters.',
    caption: 'Reality holds together where you build foundations first. Everything else is half-life decay.',
    prevents: ['scope-explosion', 'premature-coding'],
  },
  {
    id: 'deckard-boundary',
    command: '/plan-deckard-boundary',
    namespace: 'plan',
    character: 'Rick Deckard',
    novel: 'Do Androids Dream of Electric Sheep?',
    purpose: 'Map deterministic vs. LLM task boundaries',
    whyThisCharacter: 'Deckard\'s entire job is administering the Voigt-Kampff test \u2014 drawing the line between human and machine. His skill applies the same test to your project: which tasks require the irreducibly human quality of reasoning (use the LLM) and which are mechanical (use code)?',
    category: 'core-scope',
    level: 'beginner',
    stage: 3,
    isCore: true,
    isGate: false,
    storyHook: 'Deckard administers the Voigt-Kampff test to parseJSON(). The needle reads: DETERMINISTIC. In the waiting room, generateSummary() waits nervously.',
    caption: 'The Voigt-Kampff test for code: does this function need judgment, or just instructions?',
    prevents: ['llm-overuse'],
  },
  {
    id: 'steiner-gate',
    command: '/plan-steiner-gate',
    namespace: 'plan',
    character: 'Manfred Steiner',
    novel: 'Martian Time-Slip',
    purpose: 'Verify acceptance criteria before moving to the next phase',
    whyThisCharacter: 'Manfred Steiner is the boy who sees the future \u2014 and what he sees is decay. His precognition makes him the perfect gatekeeper: he can tell you whether your current phase is complete enough to survive what comes next.',
    category: 'core-scope',
    level: 'beginner',
    stage: 7,
    isCore: true,
    isGate: true,
    storyHook: 'Steiner sees the future of your project. If the gate fails, he shows you what decays first.',
    caption: 'The boy who sees the future says: your phase isn\'t done yet.',
    prevents: ['premature-coding'],
  },
  {
    id: 'mayerson-prereq',
    command: '/plan-mayerson-prereq',
    namespace: 'plan',
    character: 'Barney Mayerson',
    novel: 'The Three Stigmata of Palmer Eldritch',
    purpose: 'Verify environment prerequisites before starting',
    whyThisCharacter: 'Barney Mayerson is precognitive \u2014 he checks what\'s coming before it arrives. His skill checks your environment before you start building: are the tools installed? Is the data available? Are the dependencies met?',
    category: 'core-scope',
    level: 'beginner',
    stage: 'any',
    isCore: false,
    isGate: false,
    storyHook: 'Mayerson looks into the future and sees your build failing because Node isn\'t installed.',
    caption: 'The precog says: check your environment before you check your ambition.',
    prevents: ['premature-coding'],
  },

  // === PROMPT & TOKEN (4) ===
  {
    id: 'isidore-tokens',
    command: '/plan-isidore-tokens',
    namespace: 'plan',
    character: 'John Isidore',
    novel: 'Do Androids Dream of Electric Sheep?',
    purpose: 'Optimize token economy in prompts and workflows',
    whyThisCharacter: 'John Isidore is classified as a "chickenhead" \u2014 reduced cognitive capacity. But he\'s resourceful within his limits. His skill optimizes your token economy: doing more with fewer tokens, because waste is the enemy of reliability.',
    category: 'prompt-token',
    level: 'intermediate',
    stage: 2,
    isCore: false,
    isGate: false,
    storyHook: 'Isidore sorts kipple into KEEP and KIPPLE boxes. The counter reads: TOKENS REMAINING: 847.',
    caption: 'Kipple drives out non-kipple. Unless you sort it, your context window fills with noise.',
    prevents: ['token-waste'],
  },
  {
    id: 'fat-compress',
    command: '/plan-fat-compress',
    namespace: 'plan',
    character: 'Horselover Fat',
    novel: 'VALIS',
    purpose: 'Compress dense concepts into reusable prompt components',
    whyThisCharacter: 'Horselover Fat receives an overwhelming blast of divine information \u2014 a firehose of knowledge too dense to process. He spends the novel trying to compress it into something transmittable. His skill does the same with your context.',
    category: 'prompt-token',
    level: 'intermediate',
    stage: 5,
    isCore: false,
    isGate: false,
    storyHook: 'Fat holds a prism that refracts pink light into structured blocks: CONCEPT, EXAMPLE, ARTIFACT, HOOK.',
    caption: 'The pink light contains everything. The prism makes it usable.',
    prevents: ['token-waste'],
  },
  {
    id: 'kevin-pipeline',
    command: '/plan-kevin-pipeline',
    namespace: 'plan',
    character: 'Kevin',
    novel: 'VALIS',
    purpose: 'Break giant prompts into staged pipelines',
    whyThisCharacter: 'Kevin is Fat\'s practical friend \u2014 the one who takes Fat\'s visions and asks "okay, but what do we actually do with this?" His skill breaks monolithic prompts into pipelines of smaller, sequential prompts.',
    category: 'prompt-token',
    level: 'intermediate',
    stage: 5,
    isCore: false,
    isGate: false,
    storyHook: 'Kevin cuts Fat\'s enormous speech bubble into four manageable steps: 1. Extract, 2. Map, 3. Generate, 4. Validate.',
    caption: 'Fat has one giant idea. Kevin has four manageable steps.',
    prevents: ['token-waste'],
  },
  {
    id: 'buckman-critic',
    command: '/plan-buckman-critic',
    namespace: 'plan',
    character: 'Inspector Buckman',
    novel: 'Flow My Tears, the Policeman Said',
    purpose: 'Evaluate and improve prompts before execution',
    whyThisCharacter: 'Inspector Buckman investigates evidence and finds what\'s missing. His skill reads your prompt through a magnifying glass, revealing hidden problems: ambiguity, missing constraints, scope tangles.',
    category: 'prompt-token',
    level: 'intermediate',
    stage: 'any',
    isCore: false,
    isGate: false,
    storyHook: 'Buckman\'s magnifying glass reveals stamps on your prompt: AMBIGUOUS, MISSING CONSTRAINT, SCOPE TANGLE.',
    caption: 'Every prompt is a crime scene. Buckman finds what\'s missing.',
    prevents: ['token-waste'],
  },

  // === ARCHITECTURE & EXECUTION (5) ===
  {
    id: 'eldritch-swarm',
    command: '/plan-eldritch-swarm',
    namespace: 'plan',
    character: 'Palmer Eldritch',
    novel: 'The Three Stigmata of Palmer Eldritch',
    purpose: 'Define multi-agent system roles and communication',
    whyThisCharacter: 'Palmer Eldritch infects everything he touches. His presence spreads through the three stigmata. That\'s what happens when you launch agents without defined roles: Eldritch-contamination, where each agent\'s behavior bleeds into the others.',
    category: 'architecture',
    level: 'advanced',
    stage: 6,
    isCore: false,
    isGate: false,
    storyHook: 'Eldritch stands at the center of a web. At each node: a labeled agent. He doesn\'t do the work \u2014 he defines who does.',
    caption: 'Eldritch doesn\'t manipulate reality himself. He designs the system that does.',
    prevents: ['agent-chaos'],
  },
  {
    id: 'buckman-execute',
    command: '/plan-buckman-execute',
    namespace: 'plan',
    character: 'Felix Buckman',
    novel: 'Flow My Tears, the Policeman Said',
    purpose: 'Translate designs into concrete repo actions',
    whyThisCharacter: 'Felix Buckman is a police general \u2014 someone who turns policy into operations. His skill converts your abstract design into a concrete execution plan: which files, which order, which dependencies.',
    category: 'architecture',
    level: 'intermediate',
    stage: 6,
    isCore: false,
    isGate: false,
    storyHook: 'Buckman converts a conspiracy board into a clean police report with numbered action items.',
    caption: 'Ideas are evidence. Buckman turns evidence into actionable cases.',
    prevents: ['agent-chaos'],
  },
  {
    id: 'rosen-artifact',
    command: '/plan-rosen-artifact',
    namespace: 'plan',
    character: 'Rachel Rosen',
    novel: 'Do Androids Dream of Electric Sheep?',
    purpose: 'Generate structured, machine-readable artifacts',
    whyThisCharacter: 'Rachel Rosen lives in the Rosen Association headquarters, surrounded by perfectly designed androids. Each one is structured, labeled, inspectable. Her skill forces your outputs into machine-readable artifacts \u2014 not vague descriptions.',
    category: 'architecture',
    level: 'advanced',
    stage: 'any',
    isCore: false,
    isGate: false,
    storyHook: 'Rosen inspects artifacts like androids. One has a red tag: NO SCHEMA DEFINED.',
    caption: 'If it\'s not machine-readable, it\'s not really designed.',
    prevents: ['complexity-creep'],
  },
  {
    id: 'bulero-refactor',
    command: '/plan-bulero-refactor',
    namespace: 'plan',
    character: 'Leo Bulero',
    novel: 'The Three Stigmata of Palmer Eldritch',
    purpose: 'Simplify systems that grew too large',
    whyThisCharacter: 'Leo Bulero is a corporate manager who reorganizes reality itself. His skill takes sprawling architectures and cuts them down: fewer files, fewer abstractions, same functionality.',
    category: 'architecture',
    level: 'intermediate',
    stage: 8,
    isCore: false,
    isGate: false,
    storyHook: 'Bulero holds giant scissors, cutting an org chart from 50 boxes to 8. Cut pieces: AbstractFactoryManagerServiceProvider.',
    caption: 'When the org chart is bigger than the org, it\'s time for Bulero.',
    prevents: ['complexity-creep'],
  },
  {
    id: 'regan-simplify',
    command: '/plan-regan-simplify',
    namespace: 'plan',
    character: 'Sam Regan',
    novel: 'The Three Stigmata of Palmer Eldritch',
    purpose: 'Review changed code for reuse, quality, efficiency',
    whyThisCharacter: 'Sam Regan is a colonist focused on practical survival on Mars. No abstractions, no over-engineering \u2014 just what works. His skill reviews code for unnecessary complexity.',
    category: 'architecture',
    level: 'intermediate',
    stage: 8,
    isCore: false,
    isGate: false,
    storyHook: 'Regan on Mars, stripping a shelter to essentials. "Does this wall need to be here? No? Remove it."',
    caption: 'On Mars, you don\'t build what you don\'t need.',
    prevents: ['complexity-creep'],
  },

  // === RESEARCH & KNOWLEDGE (4) ===
  {
    id: 'lampton-corpus',
    command: '/plan-lampton-corpus',
    namespace: 'plan',
    character: 'Eric Lampton',
    novel: 'Radio Free Albemuth',
    purpose: 'Analyze research document collections',
    whyThisCharacter: 'Lampton is an enigmatic authority over hidden knowledge in Radio Free Albemuth. His skill analyzes collections of documents \u2014 PDFs, archival texts, datasets \u2014 and produces structured inventories.',
    category: 'research',
    level: 'advanced',
    stage: 'research',
    isCore: false,
    isGate: false,
    storyHook: 'Lampton\'s radio turntable plays PDFs. The speakers emit structured data: entities, topics, relations.',
    caption: 'The signal is in the documents. Lampton tunes the receiver.',
    prevents: [],
  },
  {
    id: 'brady-graph',
    command: '/plan-brady-graph',
    namespace: 'plan',
    character: 'Nicholas Brady',
    novel: '\u2014',
    purpose: 'Structure scholarly material into knowledge graphs',
    whyThisCharacter: 'Nicholas Brady navigates complex hidden systems. His skill structures domain knowledge into entity relationships \u2014 what connects to what, and how.',
    category: 'research',
    level: 'advanced',
    stage: 3,
    isCore: false,
    isGate: false,
    storyHook: 'Brady connects glowing nodes in a dark room. Orphan nodes glow dim \u2014 concepts that can\'t teach you anything yet.',
    caption: 'Every orphan node is a concept that can\'t teach you anything yet.',
    prevents: [],
  },
  {
    id: 'taverner-curriculum',
    command: '/plan-taverner-curriculum',
    namespace: 'plan',
    character: 'Jason Taverner',
    novel: 'Flow My Tears, the Policeman Said',
    purpose: 'Convert research systems into structured teaching material',
    whyThisCharacter: 'Jason Taverner is a famous entertainer who must reconstruct his identity through knowledge. His skill converts knowledge systems into learning sequences, prerequisite maps, and assessment designs.',
    category: 'research',
    level: 'advanced',
    stage: 'research',
    isCore: false,
    isGate: false,
    storyHook: 'Taverner arranges lesson cards on his TV show set. One audience member\'s screen glows: prerequisite completed.',
    caption: 'You can\'t teach the ending before the beginning. Even if the ending is more exciting.',
    prevents: [],
  },
  {
    id: 'pris-pedagogy',
    command: '/plan-pris-pedagogy',
    namespace: 'plan',
    character: 'Pris Stratton',
    novel: 'Do Androids Dream of Electric Sheep?',
    purpose: 'Map complex concepts to game-based learning mechanics',
    whyThisCharacter: 'Pris Stratton is disruptive energy and adaptation. Her skill maps complex concepts to game-based teaching tools: decision labs, strategy simulations, interactive scenarios.',
    category: 'research',
    level: 'advanced',
    stage: 'research',
    isCore: false,
    isGate: false,
    storyHook: 'Pris does a backflip. At each rotation point: Recognize the pattern, Calculate the odds, Commit, Evaluate.',
    caption: 'The game isn\'t a metaphor for learning. The game IS the learning.',
    prevents: [],
  },

  // === ANALYSIS & REFLECTION (4) ===
  {
    id: 'runciter-audit',
    command: '/plan-runciter-audit',
    namespace: 'plan',
    character: 'Glen Runciter',
    novel: 'Ubik',
    purpose: 'Analyze failure modes and anti-patterns',
    whyThisCharacter: 'Runciter\'s face appears on coins as reality decays in Ubik. Hold his diagnostic coin up to your system and it reveals: FAILURE MODE, DETECTION, IMPACT. The coin glows red for high-risk.',
    category: 'analysis',
    level: 'intermediate',
    stage: 8,
    isCore: false,
    isGate: false,
    storyHook: 'Runciter\'s face on a diagnostic coin. Hold it up to your system: it glows red, yellow, or green.',
    caption: 'If Runciter\'s face is on your error handling, reality is already decaying.',
    prevents: ['complexity-creep'],
  },
  {
    id: 'arctor-retro',
    command: '/plan-arctor-retro',
    namespace: 'plan',
    character: 'Bob Arctor',
    novel: 'A Scanner Darkly',
    purpose: 'Run a project retrospective',
    whyThisCharacter: 'Bob Arctor is an undercover narcotics agent surveilling himself. He watches his own behavior through a scramble suit. His skill turns that unsettling self-observation into something productive: a structured review of your own session.',
    category: 'analysis',
    level: 'beginner',
    stage: 9,
    isCore: false,
    isGate: false,
    storyHook: 'Arctor watches himself on a surveillance screen. Notes: "WORKED: vertical slices. FAILED: skipping to UI."',
    caption: 'You can\'t investigate yourself honestly. But you have to try.',
    prevents: [],
  },
  {
    id: 'fatmode-growth',
    command: '/plan-fatmode-growth',
    namespace: 'plan',
    character: 'Philip K. Dick',
    novel: 'VALIS',
    purpose: 'Align projects with personal learning goals',
    whyThisCharacter: 'Philip K. Dick in Fat Mode is the meta-level thinker \u2014 the author inside the novel, examining himself examining himself. His skill connects the project to your longer-term learning trajectory.',
    category: 'analysis',
    level: 'intermediate',
    stage: 9,
    isCore: false,
    isGate: false,
    storyHook: 'Split panel: Dick writes "PROJECT PLAN," Fat reads "LEARNING PLAN." They\'re the same document.',
    caption: 'Fat asks: what are you learning? Dick asks: what are you building? Same question.',
    prevents: [],
  },
  {
    id: 'abendsen-parking',
    command: '/plan-abendsen-parking',
    namespace: 'plan',
    character: 'Hawthorne Abendsen',
    novel: 'The Man in the High Castle',
    purpose: 'Park ideas without expanding current scope',
    whyThisCharacter: 'Hawthorne Abendsen wrote a novel-within-a-novel \u2014 an entire alternate reality kept separate from the world he lived in. His skill gives your exciting-but-distracting ideas their own space where they can exist without contaminating the build.',
    category: 'analysis',
    level: 'beginner',
    stage: 1,
    isCore: true,
    isGate: false,
    storyHook: 'Abendsen peacefully files books on shelves. Each book is an idea. On his desk: one open book labeled CURRENT PROJECT.',
    caption: 'The ideas are safe. They\'re not going anywhere. Now focus.',
    prevents: ['scope-explosion'],
  },

  // === CONTEXT & FRAMING (4) ===
  {
    id: 'bohlen-constraint',
    command: '/plan-bohlen-constraint',
    namespace: 'plan',
    character: 'Jack Bohlen',
    novel: 'Martian Time-Slip',
    purpose: 'Rewrite vague requests as constraint-bounded specs',
    whyThisCharacter: 'Jack Bohlen is a repairman on Mars who understands systems by understanding what\'s broken. His skill takes vague wishes and reformulates them as specs defined by what they can\'t do. Constraints are more honest than aspirations.',
    category: 'context',
    level: 'intermediate',
    stage: 2,
    isCore: false,
    isGate: false,
    storyHook: 'Bohlen examines a broken machine. He doesn\'t ask "what should it do?" He asks "what are its limits?"',
    caption: 'The repairman doesn\'t fix dreams. He fixes constraints.',
    prevents: ['scope-explosion'],
  },
  {
    id: 'mercer-reframe',
    command: '/plan-mercer-reframe',
    namespace: 'plan',
    character: 'Wilbur Mercer',
    novel: 'Do Androids Dream of Electric Sheep?',
    purpose: 'Challenge the mental model behind a feature request',
    whyThisCharacter: 'Wilbur Mercer is the shared experience that reframes perception. His skill challenges the assumptions behind your feature request \u2014 maybe the problem isn\'t what you think it is.',
    category: 'context',
    level: 'intermediate',
    stage: 'any',
    isCore: false,
    isGate: false,
    storyHook: 'Mercer climbs the hill endlessly. "You think you\'re building a search feature. You\'re actually building a navigation problem."',
    caption: 'The hill is real. Your assumptions about why you\'re climbing it might not be.',
    prevents: [],
  },
  {
    id: 'tagomi-briefing',
    command: '/plan-tagomi-briefing',
    namespace: 'plan',
    character: 'Mr. Tagomi',
    novel: 'The Man in the High Castle',
    purpose: 'Generate a structured project briefing',
    whyThisCharacter: 'Mr. Tagomi sees across parallel realities \u2014 he can hold multiple versions of the world in his mind simultaneously. His skill generates a briefing that captures the complete state of your project for a new conversation.',
    category: 'context',
    level: 'beginner',
    stage: 'any',
    isCore: false,
    isGate: false,
    storyHook: 'Tagomi holds a silver triangle and sees your project from another reality\'s perspective.',
    caption: 'To see your project clearly, sometimes you need to see it from another world.',
    prevents: [],
  },
  {
    id: 'freck-narrative',
    command: '/plan-freck-narrative',
    namespace: 'plan',
    character: 'Charley Freck',
    novel: 'A Scanner Darkly',
    purpose: 'Convert technical work into compelling narrative',
    whyThisCharacter: 'Charley Freck is struggling to understand his own situation. He rewrites a technical architecture doc as a story on a napkin \u2014 and the napkin version is shorter and clearer.',
    category: 'context',
    level: 'intermediate',
    stage: 'any',
    isCore: false,
    isGate: false,
    storyHook: 'Freck rewrites an architecture doc on a napkin: "Once there was a system that ate documents and turned them into knowledge..."',
    caption: 'If you can\'t explain it on a napkin, you don\'t understand it yet.',
    prevents: [],
  },

  // === WRITING (7) ===
  {
    id: 'dominic-template',
    command: '/write-dominic-template',
    namespace: 'write',
    character: 'Mary Anne Dominic',
    novel: 'Confessions of a Crap Artist',
    purpose: 'Generate structured writing templates',
    whyThisCharacter: 'Mary Anne Dominic is the writer character \u2014 she gives structure to formless experience. Her skill generates templates for any writing format.',
    category: 'writing',
    level: 'intermediate',
    stage: 'any',
    isCore: false,
    isGate: false,
    storyHook: 'Dominic arranges blank pages into a structure. "First the hook, then the problem, then the evidence."',
    caption: 'A blank page is chaos. A template is a map.',
    prevents: [],
  },
  {
    id: 'archer-evaluate',
    command: '/write-archer-evaluate',
    namespace: 'write',
    character: 'Fred/Bob Arctor',
    novel: 'A Scanner Darkly',
    purpose: 'Evaluate writing quality against structured criteria',
    whyThisCharacter: 'Fred Arctor evaluates Bob Arctor \u2014 the same person, split into observer and observed. His skill evaluates your writing with the same double vision: both sympathetic and ruthless.',
    category: 'writing',
    level: 'intermediate',
    stage: 'any',
    isCore: false,
    isGate: false,
    storyHook: 'Arctor reads his own writing through the scramble suit. "This paragraph thinks it\'s clever. It isn\'t."',
    caption: 'The scramble suit shows you what your writing really looks like.',
    prevents: [],
  },
  {
    id: 'isidore-critique',
    command: '/write-isidore-critique',
    namespace: 'write',
    character: 'Jack Isidore',
    novel: 'Confessions of a Crap Artist',
    purpose: 'Deep critique of logic, argument, and rhetoric',
    whyThisCharacter: 'Jack Isidore is an unreliable narrator \u2014 he forces you to scrutinize every claim. His skill applies that same scrutiny to your writing: is the logic sound? Are the arguments valid?',
    category: 'writing',
    level: 'intermediate',
    stage: 'any',
    isCore: false,
    isGate: false,
    storyHook: 'Isidore reads your argument and says "I believe this completely." That\'s how you know it needs work.',
    caption: 'If the unreliable narrator believes you, check your logic.',
    prevents: [],
  },
  {
    id: 'dekany-style',
    command: '/write-dekany-style',
    namespace: 'write',
    character: 'Leo Dekany',
    novel: '\u2014',
    purpose: 'Check writing for style consistency',
    whyThisCharacter: 'Leo Dekany is the voice behind multiple identities \u2014 he maintains consistency across different personas. His skill checks your writing for style consistency across a document or collection.',
    category: 'writing',
    level: 'intermediate',
    stage: 'any',
    isCore: false,
    isGate: false,
    storyHook: 'Dekany reads three documents and says: "These were written by three different people. Pick one voice."',
    caption: 'One voice, or you\'re just noise.',
    prevents: [],
  },
  {
    id: 'runciter-ux',
    command: '/write-runciter-ux',
    namespace: 'write',
    character: 'Glen Runciter',
    novel: 'Ubik',
    purpose: 'Paired audit of website functionality and design/UX',
    whyThisCharacter: 'Runciter holds reality together in Ubik. In UX mode, he holds your website together \u2014 auditing both functional behavior and design coherence simultaneously.',
    category: 'writing',
    level: 'intermediate',
    stage: 'any',
    isCore: false,
    isGate: false,
    storyHook: 'Runciter sprays UBIK on your website. The parts that dissolve are the UX problems.',
    caption: 'If Runciter\'s spray can\'t save your UX, nothing can.',
    prevents: [],
  },
  {
    id: 'chip-copy',
    command: '/write-chip-copy',
    namespace: 'write',
    character: 'Joe Chip',
    novel: 'Ubik',
    purpose: 'Review all user-facing text in a website or application',
    whyThisCharacter: 'Joe Chip in UX mode \u2014 he reviews every piece of microcopy in your interface. Button labels, error messages, tooltips, placeholder text. If it faces the user, Chip reads it.',
    category: 'writing',
    level: 'intermediate',
    stage: 'any',
    isCore: false,
    isGate: false,
    storyHook: 'Chip tries to use your app. The door says "Click here." Chip says: "Click here to do WHAT?"',
    caption: 'Your button says "Submit." Submit what? To whom? Joe Chip demands answers.',
    prevents: [],
  },
  {
    id: 'rachael-aesthetic',
    command: '/write-rachael-aesthetic',
    namespace: 'write',
    character: 'Rachael Rosen',
    novel: 'Do Androids Dream of Electric Sheep?',
    purpose: 'Audit visual design logic',
    whyThisCharacter: 'Rachael Rosen is the perfectly designed being \u2014 every detail intentional. Her skill audits your visual design not for prettiness, but for communication: does every visual element earn its place?',
    category: 'writing',
    level: 'advanced',
    stage: 'any',
    isCore: false,
    isGate: false,
    storyHook: 'Rachael examines your design the way Deckard examines androids: is every element designed, or just present?',
    caption: 'A perfectly designed being doesn\'t have decorative elements. Neither should your UI.',
    prevents: [],
  },
]

const FAILURE_MODES: FailureMode[] = [
  {
    id: 'scope-explosion',
    name: 'Scope Explosion',
    scenario: 'You asked Claude to build a todo app. Three hours later you have half a project management suite, none of it works, and you\'ve burned through your entire context window.',
    symptoms: ['Enormous prompts', 'Requirements that expand every conversation turn', 'Features breeding new features'],
    rootCause: 'Skipped Stage 1 (Project Intake)',
    skippedStage: 1,
    fixSkillIds: ['joe-chip-scope', 'abendsen-parking'],
  },
  {
    id: 'token-waste',
    name: 'Token Waste',
    scenario: 'Your system prompt is 2,000 tokens of accumulated context, half of it contradictory. Every message re-explains what the project is. Claude keeps forgetting things because the important stuff is buried.',
    symptoms: ['Repeated explanations', 'Redundant context', 'Prompts that re-state the same information'],
    rootCause: 'Skipped Stage 2 (Constraints) and Stage 5 (Prompt Design)',
    skippedStage: 2,
    fixSkillIds: ['isidore-tokens', 'fat-compress'],
  },
  {
    id: 'premature-coding',
    name: 'Premature Coding',
    scenario: 'You started writing React components before deciding on a data model. The database schema changed three times. Every change broke the frontend. You spent more time fixing integration bugs than building features.',
    symptoms: ['Writing UI before data structures exist', 'Scripts without architecture', 'Constant integration bugs'],
    rootCause: 'Skipped Stage 7 (Implementation Gate)',
    skippedStage: 7,
    fixSkillIds: ['steiner-gate', 'deckard-boundary'],
  },
  {
    id: 'llm-overuse',
    name: 'LLM Overuse',
    scenario: 'You\'re using Claude to format dates, sort arrays, and validate emails. These are five-line functions. Instead, you\'re burning API calls and getting occasional wrong answers for problems that have one right answer.',
    symptoms: ['AI solving problems that have deterministic solutions', 'Inconsistent results for mechanical tasks', 'Unnecessary API costs'],
    rootCause: 'Skipped Stage 3 (Architecture Definition)',
    skippedStage: 3,
    fixSkillIds: ['deckard-boundary'],
  },
  {
    id: 'agent-chaos',
    name: 'Agent Chaos',
    scenario: 'You have three agents running. One generates content, one reviews it, one publishes. The reviewer keeps contradicting the generator. The publisher posts half-reviewed content. Nobody knows whose job is what.',
    symptoms: ['Multi-agent workflows producing contradictory results', 'Agents duplicating work', 'No clear ownership of tasks'],
    rootCause: 'Skipped Stage 6 (Execution Planning)',
    skippedStage: 6,
    fixSkillIds: ['eldritch-swarm', 'buckman-execute'],
  },
  {
    id: 'complexity-creep',
    name: 'Complexity Creep',
    scenario: 'Your project started as three files. Now it\'s forty-seven files across twelve directories. You need to touch five files to change a button color. You\'re not sure what half the files do anymore.',
    symptoms: ['Systems slowly becoming harder to maintain', 'Every change touches many files', 'Abstractions that add complexity without value'],
    rootCause: 'Skipped Stage 8 (Failure Mode Analysis)',
    skippedStage: 8,
    fixSkillIds: ['bulero-refactor', 'runciter-audit'],
  },
]

const WORKFLOW_STAGES: WorkflowStage[] = [
  { number: 1, name: 'Intake', goal: 'Separate ideas from scope', skillIds: ['abendsen-parking', 'joe-chip-scope'], minComplexity: 1 },
  { number: 2, name: 'Constraints', goal: 'Define boundaries', skillIds: ['bohlen-constraint', 'isidore-tokens'], minComplexity: 2 },
  { number: 3, name: 'Architecture', goal: 'Code vs. AI boundary', skillIds: ['deckard-boundary', 'brady-graph'], minComplexity: 1 },
  { number: 4, name: 'Vertical Slice', goal: 'Smallest working version', skillIds: ['runciter-slice'], minComplexity: 1 },
  { number: 5, name: 'Prompt Design', goal: 'Modular prompts', skillIds: ['kevin-pipeline', 'fat-compress'], minComplexity: 2 },
  { number: 6, name: 'Execution', goal: 'Agent roles & plan', skillIds: ['buckman-execute', 'eldritch-swarm'], minComplexity: 3 },
  { number: 7, name: 'Gate', goal: 'Ready to build?', skillIds: ['steiner-gate'], minComplexity: 1 },
  { number: 8, name: 'Audit', goal: 'Find weaknesses', skillIds: ['runciter-audit', 'bulero-refactor'], minComplexity: 2 },
  { number: 9, name: 'Retrospective', goal: 'Learn from the session', skillIds: ['arctor-retro', 'fatmode-growth'], minComplexity: 2 },
]

const TRIGGER_PHRASES: TriggerPhrase[] = [
  { thought: '"Let me also add..."', skill: 'Abendsen', command: '/plan-abendsen-parking' },
  { thought: '"I\'ll just start coding"', skill: 'Joe Chip', command: '/plan-joe-chip-scope' },
  { thought: '"The AI should figure this out"', skill: 'Deckard', command: '/plan-deckard-boundary' },
  { thought: '"I\'ll skip to the fun part"', skill: 'Steiner', command: '/plan-steiner-gate' },
  { thought: '"This is getting complicated"', skill: 'Bulero', command: '/plan-bulero-refactor' },
  { thought: '"My prompt is too long"', skill: 'Kevin', command: '/plan-kevin-pipeline' },
  { thought: '"What was I building again?"', skill: 'Tagomi', command: '/plan-tagomi-briefing' },
  { thought: '"Same mistake as last time"', skill: 'Arctor', command: '/plan-arctor-retro' },
]

const GLOSSARY: GlossaryTerm[] = [
  { term: 'Vertical slice', definition: 'The thinnest possible working version of a system \u2014 real data in, real output out, one complete path through all layers.' },
  { term: 'Token', definition: 'The basic unit LLMs use to process text. Roughly 4 characters or \u00BE of a word. More tokens = more cost and slower responses.' },
  { term: 'Context window', definition: 'The maximum amount of text an LLM can consider at once. Exceed it and earlier information gets lost.' },
  { term: 'Deterministic task', definition: 'A task with one right answer that code can compute reliably (sorting, formatting, math). No AI needed.' },
  { term: 'Probabilistic task', definition: 'A task requiring judgment, interpretation, or generation \u2014 the kind of work LLMs are good at.' },
  { term: 'Scope creep', definition: 'When a project gradually expands beyond its original boundaries until it becomes unmanageable.' },
  { term: 'Agent', definition: 'An AI instance given a specific role and set of tools to accomplish a task autonomously.' },
  { term: 'Parking lot', definition: 'A document that captures ideas worth exploring later without letting them expand the current project.' },
  { term: 'Acceptance criteria', definition: 'Specific, testable conditions that define when a feature or slice is "done."' },
  { term: 'Slash command', definition: 'A reusable prompt template you invoke by typing / followed by a name in Claude Code. It runs a structured analysis and produces an artifact.' },
  { term: 'System prompt', definition: 'Hidden instructions given to an LLM at the start of a conversation that shape its behavior.' },
  { term: 'Gate', definition: 'A checkpoint that verifies criteria are met before you move to the next phase. Firm but overridable.' },
]

const FAILURE_MODE_ICONS: Record<string, typeof Zap> = {
  'scope-explosion': Zap,
  'token-waste': Coins,
  'premature-coding': Code,
  'llm-overuse': Cpu,
  'agent-chaos': Bot,
  'complexity-creep': Layers,
}

// ============================================================
// HELPER COMPONENTS
// ============================================================

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-hand text-4xl md:text-5xl text-gray-900 mb-6 scroll-mt-20">
      {children}
    </h2>
  )
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'core' | 'gate' | 'plan' | 'write' | 'level' }) {
  const styles: Record<string, string> = {
    default: 'bg-gray-100 text-gray-700',
    core: 'bg-pkd-100 text-pkd-700 font-semibold',
    gate: 'bg-amber-100 text-amber-700',
    plan: 'bg-pkd-50 text-pkd-600',
    write: 'bg-purple-50 text-purple-600',
    level: 'bg-gray-50 text-gray-500',
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${styles[variant]}`}>
      {children}
    </span>
  )
}

function SkillCard({ skill, isExpanded, onToggle }: { skill: PKDSkill; isExpanded: boolean; onToggle: () => void }) {
  const failureModeNames = FAILURE_MODES.filter(fm => skill.prevents.includes(fm.id)).map(fm => fm.name)
  const [showFullPrompt, setShowFullPrompt] = useState(false)
  const fullText = (skillTexts as Record<string, string>)[skill.command.replace(/^\//, '')]

  return (
    <div
      className={`skill-card border-wobbly bg-white p-5 cursor-pointer ${skill.isCore ? 'ring-2 ring-pkd-300' : ''}`}
      onClick={onToggle}
      role="button"
      aria-expanded={isExpanded}
      aria-label={`${skill.character} — ${skill.purpose}. Click to ${isExpanded ? 'collapse' : 'expand'} details.`}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-hand text-2xl text-gray-900">{skill.character}</h3>
            {skill.isCore && <Badge variant="core"><Star className="w-3 h-3 inline -mt-0.5 mr-0.5" />Essential</Badge>}
            {skill.isGate && <Badge variant="gate"><Shield className="w-3 h-3 inline -mt-0.5 mr-0.5" />Gate</Badge>}
          </div>
          <p className="text-sm text-gray-500 italic mb-2">{skill.novel}</p>
          <code className="text-sm bg-gray-100 px-2 py-0.5 rounded text-pkd-600">{skill.command}</code>
          <p className="text-gray-700 mt-2">{skill.purpose}</p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            <Badge variant={skill.namespace === 'plan' ? 'plan' : 'write'}>{skill.namespace.toUpperCase()}</Badge>
            <Badge variant="level">{skill.level}</Badge>
          </div>
        </div>
        <div className="text-gray-400 mt-1 shrink-0">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4" onClick={e => e.stopPropagation()}>
          <div>
            <h4 className="font-hand text-xl text-pkd-600 mb-1">Why This Character?</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{skill.whyThisCharacter}</p>
          </div>

          <div className="bg-pkd-50 border-wobbly-light p-3">
            <p className="font-hand text-lg text-pkd-700 italic">"{skill.caption}"</p>
          </div>

          <div>
            <h4 className="font-hand text-xl text-pkd-600 mb-1">The Scene</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{skill.storyHook}</p>
          </div>

          {failureModeNames.length > 0 && (
            <div>
              <h4 className="font-hand text-lg text-gray-700 mb-1">Prevents:</h4>
              <div className="flex gap-1.5 flex-wrap">
                {failureModeNames.map(name => (
                  <Badge key={name} variant="gate">{name}</Badge>
                ))}
              </div>
            </div>
          )}

          {fullText && (
            <div>
              <button
                onClick={e => { e.stopPropagation(); setShowFullPrompt(!showFullPrompt) }}
                className="flex items-center gap-2 text-sm font-medium text-pkd-600 hover:text-pkd-800 transition-colors border border-pkd-200 rounded-lg px-3 py-2 hover:bg-pkd-50"
              >
                <FileCode className="w-4 h-4" />
                {showFullPrompt ? 'Hide Full Prompt' : 'View Full Prompt'}
                {showFullPrompt ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {showFullPrompt && (
                <pre className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">{fullText}</pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FailureModeCard({ mode }: { mode: FailureMode }) {
  const Icon = FAILURE_MODE_ICONS[mode.id] || Zap
  const fixSkills = SKILLS.filter(s => mode.fixSkillIds.includes(s.id))

  return (
    <div className="border-wobbly bg-white p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-red-500" />
        </div>
        <h3 className="font-hand text-2xl text-gray-900">{mode.name}</h3>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-3">{mode.scenario}</p>
      <div className="flex gap-1.5 flex-wrap">
        <span className="text-xs text-gray-500 mr-1">Fix:</span>
        {fixSkills.map(s => (
          <Badge key={s.id} variant="core">{s.character}</Badge>
        ))}
      </div>
    </div>
  )
}

function WorkflowNode({ stage, isVisible }: { stage: WorkflowStage; isVisible: boolean }) {
  if (!isVisible) return null
  const stageSkills = SKILLS.filter(s => stage.skillIds.includes(s.id))

  return (
    <div className="border-wobbly bg-white p-4 text-center min-w-[140px] hover:ring-2 hover:ring-pkd-300 transition-all">
      <div className="font-hand text-3xl text-pkd-600 mb-0.5">{stage.number}</div>
      <div className="font-hand text-xl text-gray-900 mb-1">{stage.name}</div>
      <p className="text-xs text-gray-500 mb-2">{stage.goal}</p>
      <div className="flex gap-1 flex-wrap justify-center">
        {stageSkills.map(s => (
          <span key={s.id} className="text-[10px] bg-pkd-50 text-pkd-600 px-1.5 py-0.5 rounded-full">{s.character.split(' ')[0]}</span>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// QUIZ DATA
// ============================================================

interface QuizQuestion {
  question: string
  options: { label: string; skills: string[] }[]
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Where are you in the project?',
    options: [
      { label: 'Just had an idea', skills: ['joe-chip-scope', 'abendsen-parking'] },
      { label: 'Planning the build', skills: ['deckard-boundary', 'runciter-slice'] },
      { label: 'Already coding', skills: ['steiner-gate', 'runciter-audit'] },
      { label: 'Finished, looking back', skills: ['arctor-retro', 'fatmode-growth'] },
    ],
  },
  {
    question: 'What\'s your biggest problem right now?',
    options: [
      { label: 'Too many ideas, no focus', skills: ['joe-chip-scope', 'abendsen-parking'] },
      { label: 'Prompts are too long or messy', skills: ['isidore-tokens', 'kevin-pipeline'] },
      { label: 'Not sure what needs AI vs. code', skills: ['deckard-boundary'] },
      { label: 'Code is getting tangled', skills: ['bulero-refactor', 'regan-simplify'] },
    ],
  },
  {
    question: 'How complex is the project?',
    options: [
      { label: 'Simple (one feature, one session)', skills: ['joe-chip-scope', 'runciter-slice'] },
      { label: 'Medium (multiple features, few days)', skills: ['joe-chip-scope', 'deckard-boundary', 'runciter-slice', 'steiner-gate'] },
      { label: 'Complex (multi-agent, research, weeks)', skills: ['joe-chip-scope', 'deckard-boundary', 'runciter-slice', 'eldritch-swarm', 'buckman-execute'] },
    ],
  },
]

// ============================================================
// MINI-GAME DATA
// ============================================================

interface GameScenario {
  scenario: string
  correctId: string
  options: string[]
}

const GAME_SCENARIOS: GameScenario[] = [
  {
    scenario: 'You\'re three hours in. Your prompt is 2,000 tokens of contradictory instructions. Claude keeps forgetting your requirements.',
    correctId: 'token-waste',
    options: ['scope-explosion', 'token-waste', 'premature-coding'],
  },
  {
    scenario: 'You asked for a recipe app. Now you\'re building user accounts, a social feed, a recommendation engine, and a meal planner. The recipe display page still doesn\'t work.',
    correctId: 'scope-explosion',
    options: ['scope-explosion', 'llm-overuse', 'complexity-creep'],
  },
  {
    scenario: 'You\'re using Claude to sort an array of numbers, format dates, and validate email addresses with regex. Each API call costs money and occasionally gives wrong answers.',
    correctId: 'llm-overuse',
    options: ['token-waste', 'llm-overuse', 'agent-chaos'],
  },
  {
    scenario: 'Your three agents keep contradicting each other. The content generator writes one thing, the reviewer rewrites it, and the publisher posts the original anyway.',
    correctId: 'agent-chaos',
    options: ['agent-chaos', 'complexity-creep', 'premature-coding'],
  },
  {
    scenario: 'You started coding React components on day one. Now you\'re on your third database schema rewrite. Every schema change breaks the frontend.',
    correctId: 'premature-coding',
    options: ['premature-coding', 'scope-explosion', 'complexity-creep'],
  },
  {
    scenario: 'Your project started as three files. It\'s now forty-seven files in twelve directories. You need to edit five files to change a button color.',
    correctId: 'complexity-creep',
    options: ['complexity-creep', 'agent-chaos', 'token-waste'],
  },
]

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all')
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null)
  const [complexity, setComplexity] = useState(2)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Quiz state
  const [quizStep, setQuizStep] = useState(0)
  const [quizScores, setQuizScores] = useState<Record<string, number>>({})
  const [quizDone, setQuizDone] = useState(false)

  // Mini-game state
  const [gameIndex, setGameIndex] = useState(0)
  const [gameAnswer, setGameAnswer] = useState<string | null>(null)
  const [gameScore, setGameScore] = useState(0)
  const [gameDone, setGameDone] = useState(false)

  // Filter skills by category
  const filteredSkills = activeCategory === 'all'
    ? SKILLS
    : SKILLS.filter(s => s.category === activeCategory)

  // Quiz handlers
  function handleQuizAnswer(skillIds: string[]) {
    const newScores = { ...quizScores }
    skillIds.forEach(id => { newScores[id] = (newScores[id] || 0) + 1 })
    setQuizScores(newScores)
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(quizStep + 1)
    } else {
      setQuizDone(true)
    }
  }

  function getQuizResults(): PKDSkill[] {
    const sorted = Object.entries(quizScores).sort((a, b) => b[1] - a[1])
    const topIds = sorted.slice(0, 5).map(([id]) => id)
    return SKILLS.filter(s => topIds.includes(s.id))
  }

  function resetQuiz() {
    setQuizStep(0)
    setQuizScores({})
    setQuizDone(false)
  }

  // Game handlers
  function handleGameAnswer(modeId: string) {
    setGameAnswer(modeId)
    if (modeId === GAME_SCENARIOS[gameIndex].correctId) {
      setGameScore(gameScore + 1)
    }
  }

  function nextGameQuestion() {
    if (gameIndex < GAME_SCENARIOS.length - 1) {
      setGameIndex(gameIndex + 1)
      setGameAnswer(null)
    } else {
      setGameDone(true)
    }
  }

  function resetGame() {
    setGameIndex(0)
    setGameAnswer(null)
    setGameScore(0)
    setGameDone(false)
  }

  const navLinks = [
    { href: '#problem', label: 'The Problem' },
    { href: '#workflow', label: 'The System' },
    { href: '#skills', label: 'Skills' },
    { href: '#quickstart', label: 'Quick Start' },
    { href: '#antidotes', label: 'Antidotes' },
    { href: '#daily', label: 'Daily Workflow' },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ==================== NAV ==================== */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#" className="font-hand text-2xl text-pkd-600 hover:text-pkd-700">PKD Skills</a>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-6">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="text-sm text-gray-600 hover:text-pkd-600 transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="block text-sm text-gray-600 hover:text-pkd-600 py-1" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="bg-gradient-to-br from-pkd-800 via-pkd-700 to-pkd-900 text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-hand text-5xl md:text-7xl mb-4 leading-tight">
            Stop Building the Wrong Thing Faster
          </h1>
          <p className="text-pkd-200 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
            You know that feeling. You start building with AI &mdash; vibes are good, code is flowing, ideas are expanding. Two hours later you&rsquo;ve got 15 files, nothing connects, and you&rsquo;re not sure what you were building anymore.
          </p>
          <p className="text-white text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
            <strong>The PKD skill system</strong> is 33 Claude Code slash commands that prevent this. Each one is a short, focused check &mdash; a moment where you clarify what you&rsquo;re building before you build more of it.
          </p>
          <p className="text-pkd-200 text-lg mb-10 max-w-2xl leading-relaxed">
            They&rsquo;re named after characters from Philip K. Dick&rsquo;s science fiction novels, because Dick&rsquo;s characters are always asking the right question: <em>is this real, or am I fooling myself?</em>
          </p>
          <a href="#quickstart" className="inline-flex items-center gap-2 bg-white text-pkd-700 font-semibold px-6 py-3 rounded-full hover:bg-pkd-50 transition-colors border-wobbly">
            Start with the 5 Essential Skills <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ==================== WHY PKD ==================== */}
      <section className="py-16 px-4 bg-pkd-50">
        <div className="max-w-4xl mx-auto">
          <SectionTitle id="why-pkd">Why Philip K. Dick?</SectionTitle>
          <div className="border-wobbly bg-white p-6 md:p-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              Every skill is named after a character from Philip K. Dick&rsquo;s novels. This is not decoration &mdash; it&rsquo;s a <strong>mnemonic system</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Dick&rsquo;s characters are defined by their relationship to reality. They question what&rsquo;s real, what&rsquo;s simulated, and what&rsquo;s worth building. AI engineering has the same problem: LLMs produce confident-sounding output that may or may not correspond to anything workable. The skills are named to remind you of that tension.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { char: 'Joe Chip', novel: 'Ubik', hook: 'lives in a world where reality decays. His skill freezes scope before entropy sets in.' },
                { char: 'Rick Deckard', novel: 'Do Androids Dream?', hook: 'tests what\u2019s human and what\u2019s machine. His skill draws the line between LLM tasks and code tasks.' },
                { char: 'Glen Runciter', novel: 'Ubik', hook: 'sends urgent messages from the other side of death. His skill cuts through overengineered plans.' },
                { char: 'Palmer Eldritch', novel: 'Three Stigmata', hook: 'is a figure of distributed presence. His skill designs multi-agent systems with clear roles.' },
              ].map(item => (
                <div key={item.char} className="border-wobbly-light p-4">
                  <span className="font-hand text-xl text-pkd-600">{item.char}</span>
                  <span className="text-sm text-gray-400 ml-2">({item.novel})</span>
                  <p className="text-sm text-gray-600 mt-1">&hellip;{item.hook}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-4 italic">You don&rsquo;t need to know the novels. But if you do, the names stick.</p>
          </div>
        </div>
      </section>

      {/* ==================== BEFORE/AFTER ==================== */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle id="comparison">What Changes</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-wobbly bg-red-50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-hand text-2xl text-red-700">Without PKD Skills</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                You want to build a recipe app. You tell Claude to start. It generates a database schema, three API routes, and a React frontend. You realize you wanted it mobile-first, so you change direction. Claude regenerates. Now you want user accounts, so the schema changes again. The frontend breaks. You add search. Three hours in, you have code that almost works but has no clear architecture.
              </p>
            </div>
            <div className="border-wobbly bg-green-50 p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-hand text-2xl text-green-700">With PKD Skills</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                You type <code className="bg-green-100 px-1">/plan-joe-chip-scope</code>. What&rsquo;s in? Recipe display and search. What&rsquo;s out? User accounts (parked). You type <code className="bg-green-100 px-1">/plan-deckard-boundary</code>. Search is AI. Everything else is code. You type <code className="bg-green-100 px-1">/plan-runciter-slice</code>. Smallest version: one page displaying recipes from JSON with search. You build that in 45 minutes. It works.
              </p>
            </div>
          </div>
          <p className="text-center text-gray-500 mt-4 font-hand text-xl">Same idea. One version drowns in scope. The other ships.</p>
        </div>
      </section>

      {/* ==================== READING PATHS ==================== */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <SectionTitle id="start-here">Start Here</SectionTitle>
          <p className="text-gray-600 mb-6">Pick the path that fits:</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Just Starting with AI Coding?', desc: 'Read the Quick Start, then skim the Failure Modes. Try the skill it recommends.', link: '#quickstart', icon: Lightbulb },
              { title: 'Building Regularly?', desc: 'Read the Quick Start, then the Nine-Stage Workflow. Start with the first three stages.', link: '#workflow', icon: Target },
              { title: 'Experienced Engineer?', desc: 'Jump to the Workflow and the Skill Browser. You\'ll want the full system.', link: '#skills', icon: Brain },
              { title: 'Just Browsing?', desc: 'Read Why PKD for the concept, then Failure Modes for the practical value. Takes 5 minutes.', link: '#problem', icon: Search },
            ].map(path => (
              <a key={path.title} href={path.link} className="border-wobbly bg-white p-5 hover:ring-2 hover:ring-pkd-300 transition-all block">
                <div className="flex items-center gap-2 mb-2">
                  <path.icon className="w-5 h-5 text-pkd-500" />
                  <h3 className="font-hand text-xl text-gray-900">{path.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{path.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== THE PROBLEM ==================== */}
      <section className="py-16 px-4" id="problem">
        <div className="max-w-5xl mx-auto">
          <SectionTitle id="failure-modes">Six Failure Modes the Skills Prevent</SectionTitle>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Every one of these is a predictable AI engineering failure. If you recognize the symptoms, you know which skill to reach for.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FAILURE_MODES.map(mode => (
              <FailureModeCard key={mode.id} mode={mode} />
            ))}
          </div>
          <p className="text-center text-pkd-600 font-hand text-2xl mt-8">
            Every one of these has a specific antidote. That&rsquo;s what the PKD system provides.
          </p>
        </div>
      </section>

      {/* ==================== WORKFLOW ==================== */}
      <section className="py-16 px-4 bg-gray-50" id="workflow">
        <div className="max-w-5xl mx-auto">
          <SectionTitle id="the-system">The Nine-Stage Workflow</SectionTitle>
          <p className="text-gray-600 mb-4 max-w-2xl">
            Not every session uses all nine stages. Use the slider to see what&rsquo;s needed for your project size.
          </p>

          {/* Complexity slider */}
          <div className="flex items-center gap-4 mb-8 max-w-md">
            <span className="text-sm text-gray-500 whitespace-nowrap">Simple</span>
            <input
              type="range"
              min={1}
              max={3}
              value={complexity}
              onChange={e => setComplexity(Number(e.target.value))}
              className="flex-1 accent-pkd-500"
              aria-label="Project complexity: 1 for simple, 2 for medium, 3 for full pipeline"
              aria-valuemin={1}
              aria-valuemax={3}
              aria-valuenow={complexity}
              aria-valuetext={complexity === 1 ? 'Simple' : complexity === 2 ? 'Medium' : 'Full Pipeline'}
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">Full Pipeline</span>
          </div>

          {/* Flow diagram */}
          <div className="hidden md:flex md:flex-nowrap items-center gap-0 justify-center mb-8">
            {WORKFLOW_STAGES.map((stage, i) => {
              const visible = stage.minComplexity <= complexity
              return (
                <div key={stage.number} className="flex items-center">
                  <WorkflowNode stage={stage} isVisible={visible} />
                  {i < WORKFLOW_STAGES.length - 1 && visible && WORKFLOW_STAGES[i + 1].minComplexity <= complexity && (
                    <div className="flow-arrow px-1" />
                  )}
                </div>
              )
            })}
          </div>
          {/* Mobile flow — vertical with arrow connectors */}
          <div className="flex md:hidden flex-col items-center gap-0 mb-8">
            {WORKFLOW_STAGES.map((stage, i) => {
              const visible = stage.minComplexity <= complexity
              if (!visible) return null
              const nextVisible = WORKFLOW_STAGES.slice(i + 1).some(s => s.minComplexity <= complexity)
              return (
                <div key={stage.number} className="flex flex-col items-center w-full max-w-xs">
                  <WorkflowNode stage={stage} isVisible={true} />
                  {nextVisible && (
                    <div className="text-pkd-500 font-hand text-2xl font-bold py-1">&darr;</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* MVP tiers */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {[
              { tier: 'Quick Task', desc: '1 feature, 1 session', skills: '/plan-joe-chip-scope\n/plan-runciter-slice', highlight: complexity === 1 },
              { tier: 'Medium Project', desc: 'Multiple features, few days', skills: '/plan-joe-chip-scope\n/plan-deckard-boundary\n/plan-runciter-slice\n/plan-steiner-gate', highlight: complexity === 2 },
              { tier: 'Full Pipeline', desc: 'Multi-agent, research, weeks', skills: 'All 9 stages\n+ research skills\n+ agent architecture', highlight: complexity === 3 },
            ].map(t => (
              <div key={t.tier} className={`border-wobbly p-4 ${t.highlight ? 'bg-pkd-50 ring-2 ring-pkd-300' : 'bg-white'}`}>
                <h3 className="font-hand text-xl text-gray-900 mb-1">{t.tier}</h3>
                <p className="text-xs text-gray-500 mb-2">{t.desc}</p>
                <pre className="text-xs text-pkd-600 bg-gray-50 p-2 rounded whitespace-pre-wrap">{t.skills}</pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SKILL BROWSER ==================== */}
      <section className="py-16 px-4" id="skills">
        <div className="max-w-5xl mx-auto">
          <SectionTitle id="skill-browser">All 33 Skills</SectionTitle>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap mb-8" role="tablist" aria-label="Filter skills by category">
            <button
              role="tab"
              aria-selected={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors border-wobbly-light ${activeCategory === 'all' ? 'bg-pkd-500 text-white border-pkd-500' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              All ({SKILLS.length})
            </button>
            {(Object.entries(CATEGORIES) as [SkillCategory, { name: string }][]).map(([key, cat]) => {
              const count = SKILLS.filter(s => s.category === key).length
              return (
                <button
                  role="tab"
                  aria-selected={activeCategory === key}
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors border-wobbly-light ${activeCategory === key ? 'bg-pkd-500 text-white border-pkd-500' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  {cat.name} ({count})
                </button>
              )
            })}
          </div>

          {/* Skill cards grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredSkills.map(skill => (
              <SkillCard
                key={skill.id}
                skill={skill}
                isExpanded={expandedSkill === skill.id}
                onToggle={() => setExpandedSkill(expandedSkill === skill.id ? null : skill.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== QUICK START ==================== */}
      <section className="py-16 px-4 bg-gray-50" id="quickstart">
        <div className="max-w-4xl mx-auto">
          <SectionTitle id="quick-start">Quick Start</SectionTitle>

          {/* Prerequisites */}
          <div className="border-wobbly bg-white p-6 mb-8">
            <h3 className="font-hand text-2xl text-gray-900 mb-3">Before You Start</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <Terminal className="w-4 h-4 text-pkd-500 mt-1 shrink-0" />
                <span><strong>Claude Code</strong> installed and running</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-pkd-500 mt-1 shrink-0" />
                <span><strong>The PKD skill set</strong> installed in your Claude Code environment</span>
              </li>
              <li className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-pkd-500 mt-1 shrink-0" />
                <span>Type <code className="bg-gray-100 px-1">/</code> in a session to see available slash commands</span>
              </li>
            </ul>
            <p className="text-sm text-gray-500 mt-3 italic">
              A slash command is a reusable prompt template. When you type <code className="bg-gray-100 px-1">/plan-joe-chip-scope</code>, Claude runs a structured analysis and produces an artifact &mdash; a scope document, a boundary map, or a constraint spec.
            </p>
          </div>

          {/* The Essential 5 */}
          <h3 className="font-hand text-3xl text-pkd-600 mb-4">The 5 Essential Skills</h3>
          <p className="text-gray-600 mb-6">If you only learn five skills, learn these:</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {SKILLS.filter(s => s.isCore).map(skill => (
              <div key={skill.id} className="border-wobbly-accent bg-pkd-50 p-5">
                <h4 className="font-hand text-2xl text-pkd-700">{skill.character}</h4>
                <code className="text-xs text-pkd-500">{skill.command}</code>
                <p className="text-sm text-gray-700 mt-2">{skill.purpose}</p>
                <p className="text-xs text-gray-500 mt-2 italic">&ldquo;{skill.caption}&rdquo;</p>
              </div>
            ))}
          </div>

          {/* First session walkthrough */}
          <h3 className="font-hand text-3xl text-pkd-600 mb-4">Your First Session</h3>
          <div className="space-y-4">
            {[
              { step: 1, cmd: null, text: 'Open Claude Code in your project directory.' },
              { step: 2, cmd: '/plan-joe-chip-scope', text: 'Describe your idea. Joe Chip freezes the scope \u2014 what\u2019s in, what\u2019s out, what gets parked.' },
              { step: 3, cmd: '/plan-deckard-boundary', text: 'Deckard draws the line: which tasks need LLM reasoning, which should be code.' },
              { step: 4, cmd: '/plan-runciter-slice', text: 'Runciter designs the smallest vertical slice \u2014 real data, real output, one session.' },
              { step: 5, cmd: null, text: 'Build Slice 1. Focus on completing it before adding anything else.' },
              { step: 6, cmd: '/plan-steiner-gate', text: 'Before moving on, Steiner verifies: is the slice done? Did it meet its criteria?' },
            ].map(item => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-pkd-500 text-white flex items-center justify-center shrink-0 font-hand text-lg">
                  {item.step}
                </div>
                <div className="flex-1">
                  {item.cmd && (
                    <code className="block bg-gray-900 text-green-400 px-3 py-1.5 rounded text-sm mb-1 font-mono">
                      {item.cmd}
                    </code>
                  )}
                  <p className="text-gray-700 text-sm">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ANTIDOTE MAPPING ==================== */}
      <section className="py-16 px-4" id="antidotes">
        <div className="max-w-5xl mx-auto">
          <SectionTitle id="antidote-map">Failure Mode Antidotes</SectionTitle>

          {/* Cross-reference table */}
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2 px-3 font-hand text-lg">Failure Mode</th>
                  <th className="text-left py-2 px-3 font-hand text-lg">Root Cause</th>
                  <th className="text-left py-2 px-3 font-hand text-lg">Antidote Skills</th>
                </tr>
              </thead>
              <tbody>
                {FAILURE_MODES.map(mode => {
                  const fixSkills = SKILLS.filter(s => mode.fixSkillIds.includes(s.id))
                  return (
                    <tr key={mode.id} className="border-b border-gray-100">
                      <td className="py-3 px-3 font-semibold text-gray-800">{mode.name}</td>
                      <td className="py-3 px-3 text-gray-600">{mode.rootCause}</td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1.5 flex-wrap">
                          {fixSkills.map(s => (
                            <code key={s.id} className="text-xs bg-pkd-50 text-pkd-600 px-2 py-0.5 rounded">{s.command}</code>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Trigger phrases */}
          <h3 className="font-hand text-3xl text-gray-900 mb-4">When You Think This, Run That</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {TRIGGER_PHRASES.map(tp => (
              <div key={tp.thought} className="border-wobbly-light bg-white p-4 flex items-center gap-3">
                <div className="text-gray-600 text-sm italic flex-1">{tp.thought}</div>
                <ArrowRight className="w-4 h-4 text-pkd-400 shrink-0" />
                <code className="text-xs text-pkd-600 bg-pkd-50 px-2 py-1 rounded whitespace-nowrap">{tp.command}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== QUIZ ==================== */}
      <section className="py-16 px-4 bg-pkd-50">
        <div className="max-w-3xl mx-auto">
          <SectionTitle id="quiz">Which Skill Do I Need?</SectionTitle>

          {!quizDone ? (
            <div className="border-wobbly bg-white p-6">
              <div className="text-sm text-gray-400 mb-2">Question {quizStep + 1} of {QUIZ_QUESTIONS.length}</div>
              <h3 className="font-hand text-2xl text-gray-900 mb-4">{QUIZ_QUESTIONS[quizStep].question}</h3>
              <div className="space-y-2">
                {QUIZ_QUESTIONS[quizStep].options.map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => handleQuizAnswer(opt.skills)}
                    className="w-full text-left border-wobbly-light p-3 hover:bg-pkd-50 transition-colors text-gray-700"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="border-wobbly bg-white p-6">
              <h3 className="font-hand text-2xl text-pkd-600 mb-4">Your Recommended Skills</h3>
              <div className="space-y-3 mb-4">
                {getQuizResults().map(skill => (
                  <div key={skill.id} className="border-wobbly-light p-3 flex items-center gap-3">
                    <div>
                      <span className="font-hand text-lg text-gray-900">{skill.character}</span>
                      <code className="ml-2 text-xs text-pkd-500">{skill.command}</code>
                      <p className="text-sm text-gray-600">{skill.purpose}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={resetQuiz} className="text-sm text-pkd-600 hover:text-pkd-700 underline">Take the quiz again</button>
            </div>
          )}
        </div>
      </section>

      {/* ==================== MINI-GAME ==================== */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionTitle id="game">Name That Failure</SectionTitle>
          <p className="text-gray-600 mb-6">Read the scenario. Pick the failure mode. Learn the fix.</p>

          {!gameDone ? (
            <div className="border-wobbly bg-white p-6">
              <div className="text-sm text-gray-400 mb-2">Scenario {gameIndex + 1} of {GAME_SCENARIOS.length}</div>
              <p className="text-gray-800 leading-relaxed mb-6 italic">&ldquo;{GAME_SCENARIOS[gameIndex].scenario}&rdquo;</p>

              <div className="space-y-2 mb-4">
                {GAME_SCENARIOS[gameIndex].options.map(optId => {
                  const mode = FAILURE_MODES.find(m => m.id === optId)!
                  const isCorrect = optId === GAME_SCENARIOS[gameIndex].correctId
                  const isSelected = gameAnswer === optId
                  let btnClass = 'border-wobbly-light p-3 w-full text-left transition-colors '
                  if (gameAnswer) {
                    if (isCorrect) btnClass += 'bg-green-50 border-green-400'
                    else if (isSelected) btnClass += 'bg-red-50 border-red-400'
                    else btnClass += 'opacity-50'
                  } else {
                    btnClass += 'hover:bg-gray-50'
                  }

                  return (
                    <button
                      key={optId}
                      onClick={() => !gameAnswer && handleGameAnswer(optId)}
                      className={btnClass}
                      disabled={!!gameAnswer}
                    >
                      <span className="font-semibold text-gray-800">{mode.name}</span>
                      {gameAnswer && isCorrect && (
                        <div className="mt-2 text-sm text-green-700">
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Fix: {SKILLS.filter(s => mode.fixSkillIds.includes(s.id)).map(s => s.command).join(', ')}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {gameAnswer && (
                <button onClick={nextGameQuestion} className="bg-pkd-500 text-white px-4 py-2 rounded-full text-sm hover:bg-pkd-600 transition-colors">
                  {gameIndex < GAME_SCENARIOS.length - 1 ? 'Next Scenario' : 'See Results'}
                </button>
              )}
            </div>
          ) : (
            <div className="border-wobbly bg-white p-6 text-center">
              <div className="font-hand text-5xl text-pkd-600 mb-2">{gameScore}/{GAME_SCENARIOS.length}</div>
              <p className="text-gray-600 mb-4">
                {gameScore === GAME_SCENARIOS.length ? 'Perfect! You know your failure modes.' :
                  gameScore >= 4 ? 'Strong! You can spot most patterns.' :
                    'Keep practicing \u2014 pattern recognition is the skill.'}
              </p>
              <button onClick={resetGame} className="text-sm text-pkd-600 hover:text-pkd-700 underline">Play again</button>
            </div>
          )}
        </div>
      </section>

      {/* ==================== DAILY WORKFLOW ==================== */}
      <section className="py-16 px-4 bg-gray-50" id="daily">
        <div className="max-w-4xl mx-auto">
          <SectionTitle id="daily-workflow">A Typical Working Session</SectionTitle>
          <p className="text-gray-600 mb-8">Ten minutes of planning bookends save hours of rework.</p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-wobbly bg-white p-5">
              <h3 className="font-hand text-2xl text-pkd-600 mb-3">Start of Session</h3>
              <p className="text-xs text-gray-500 mb-3">5 minutes</p>
              <div className="space-y-1.5">
                {['/plan-joe-chip-scope', '/plan-deckard-boundary', '/plan-runciter-slice'].map(cmd => (
                  <code key={cmd} className="block text-xs bg-gray-900 text-green-400 px-2 py-1 rounded">{cmd}</code>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-3">Frozen scope, clear boundaries, a vertical slice.</p>
            </div>

            <div className="border-wobbly bg-pkd-50 p-5 flex flex-col items-center justify-center">
              <Eye className="w-8 h-8 text-pkd-500 mb-2" />
              <h3 className="font-hand text-2xl text-pkd-600 mb-1">Build</h3>
              <p className="text-xs text-gray-600 text-center">Focus on completing Slice 1. If new ideas emerge, use <code className="bg-white px-1">/plan-abendsen-parking</code>.</p>
            </div>

            <div className="border-wobbly bg-white p-5">
              <h3 className="font-hand text-2xl text-pkd-600 mb-3">End of Session</h3>
              <p className="text-xs text-gray-500 mb-3">5 minutes</p>
              <div className="space-y-1.5">
                {['/plan-runciter-audit', '/plan-arctor-retro'].map(cmd => (
                  <code key={cmd} className="block text-xs bg-gray-900 text-green-400 px-2 py-1 rounded">{cmd}</code>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-3">Catch what went wrong. Capture what you learned.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CORE PHILOSOPHY ==================== */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionTitle id="philosophy">Core Philosophy</SectionTitle>
          <div className="space-y-6">
            {[
              {
                title: 'Planning errors compound faster than coding errors.',
                body: 'A wrong architecture decision costs the time to write bad code, debug it, realize the approach is wrong, tear it out, and rebuild. With LLMs, this cycle burns tokens at every step. A 10-minute planning skill can save hours.',
              },
              {
                title: 'LLMs reward structure.',
                body: 'When reasoning is externalized into discrete, named steps, LLMs produce more consistent output. "Identify the deterministic tasks" gets better results than "plan the architecture." Structure is leverage.',
              },
              {
                title: 'Creative systems still need friction.',
                body: 'The PLAN skills intentionally insert pauses. They force you to answer questions before proceeding. This prevents the most expensive mistake in AI engineering: building the wrong thing confidently.',
              },
            ].map(item => (
              <div key={item.title} className="border-wobbly bg-white p-6">
                <h3 className="font-hand text-2xl text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 mt-6 text-sm max-w-2xl">
            Think of the PKD system as a lightweight cognitive operating system layered over Claude Code. Your strengths &mdash; conceptual synthesis, cross-domain analogies, ambitious architectures &mdash; remain intact. The system adds guardrails against runaway scope, token waste, and premature building.
          </p>
        </div>
      </section>

      {/* ==================== GLOSSARY ==================== */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <SectionTitle id="glossary">Glossary</SectionTitle>
          <div className="grid md:grid-cols-2 gap-3">
            {GLOSSARY.map(item => (
              <div key={item.term} className="border-wobbly-light bg-white p-4">
                <dt className="font-hand text-xl text-pkd-600 mb-1">{item.term}</dt>
                <dd className="text-sm text-gray-600">{item.definition}</dd>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SYSTEM PROMPT ==================== */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionTitle id="system-prompt">Embed the Checklist</SectionTitle>
          <p className="text-gray-600 mb-4">
            Add this to your <code className="bg-gray-100 px-1">CLAUDE.md</code> to make Claude remind you about planning:
          </p>
          <pre className="bg-gray-900 text-green-400 p-6 rounded-lg text-sm overflow-x-auto leading-relaxed border-wobbly">
{`When working on any software engineering task:
1. Check whether a PLAN skill should be invoked.
2. Prefer planning skills before implementation.
3. If the user begins coding prematurely, recommend:
   /plan-joe-chip-scope
   /plan-runciter-slice
   /plan-deckard-boundary
4. Always check for token economy and scope discipline.
5. Encourage vertical slice development before full builds.
6. At project completion recommend:
   /plan-arctor-retro
   /plan-fatmode-growth`}
          </pre>
          <p className="text-sm text-gray-500 mt-3">This turns Claude into a process-aware partner that nudges you toward planning before building.</p>
        </div>
      </section>

      {/* ==================== CLOSING ==================== */}
      <section className="py-16 px-4 bg-pkd-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-hand text-4xl md:text-5xl mb-4">Discipline Without Killing Creativity</h2>
          <p className="text-pkd-200 text-lg max-w-2xl mx-auto leading-relaxed mb-6">
            The PKD system enforces a rhythm: <strong className="text-white">imagination &rarr; constraint &rarr; architecture &rarr; build &rarr; reflection</strong>.
            Each step is short. Each step has a named skill. Each skill produces a concrete artifact &mdash; not a feeling of readiness, but a document you can point to.
          </p>
          <p className="text-pkd-300 text-sm max-w-xl mx-auto">
            The skills are named after characters who questioned reality. Use them to question your own assumptions before you build on them.
          </p>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-hand text-xl text-pkd-400">PKD Planning Skills</div>
          <div className="flex gap-4 text-sm">
            <a href="#skill-browser" className="hover:text-white transition-colors">Skill Reference</a>
            <a href="#glossary" className="hover:text-white transition-colors">Glossary</a>
            <a href="#quiz" className="hover:text-white transition-colors">Skill Quiz</a>
          </div>
          <p className="text-xs text-gray-500">
            A cognitive operating system for AI-assisted engineering.
          </p>
        </div>
      </footer>
    </div>
  )
}
