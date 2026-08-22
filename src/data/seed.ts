import type {
  Skill,
  ResumeClaim,
  Project,
  Question,
  Flashcard,
  LearningResource,
  LearningTopic,
  ProgressSnapshot,
  ProgressStats,
  AnswerEvaluation,
} from '@/types';

// Fictional candidate: "Alex Chen" — backend-focused full-stack engineer.
// All data is invented for the prototype.

export const seedSkills: Skill[] = [
  // Top-level languages
  {
    id: 'skill-java',
    name: 'Java',
    category: 'language',
    mastery: 82,
    targetMastery: 90,
    parentId: null,
    relatedConcepts: ['OOP', 'JVM', 'Collections', 'Concurrency', 'Memory model'],
    weakAreas: ['Concurrency primitives', 'GC tuning'],
    resumeExcerpt: '3+ years building backend services in Java and Spring Boot.',
  },
  {
    id: 'skill-python',
    name: 'Python',
    category: 'language',
    mastery: 71,
    targetMastery: 80,
    parentId: null,
    relatedConcepts: ['Scripting', 'Data processing', 'asyncio', 'typing'],
    weakAreas: ['asyncio internals'],
    resumeExcerpt: 'Python scripting for data pipelines and automation.',
  },
  {
    id: 'skill-typescript',
    name: 'TypeScript',
    category: 'language',
    mastery: 66,
    targetMastery: 80,
    parentId: null,
    relatedConcepts: ['Type system', 'Generics', 'DX', 'Build tooling'],
    weakAreas: ['Conditional types', 'Module resolution'],
    resumeExcerpt: 'TypeScript across frontend and backend codebases.',
  },

  // Java children
  {
    id: 'skill-oop',
    name: 'OOP',
    category: 'concept',
    mastery: 88,
    targetMastery: 90,
    parentId: 'skill-java',
    relatedConcepts: ['Encapsulation', 'Polymorphism', 'SOLID'],
    weakAreas: [],
  },
  {
    id: 'skill-collections',
    name: 'Collections',
    category: 'concept',
    mastery: 80,
    targetMastery: 88,
    parentId: 'skill-java',
    relatedConcepts: ['List', 'Map', 'Set', 'Iterator'],
    weakAreas: ['Concurrent collections'],
  },
  {
    id: 'skill-concurrency',
    name: 'Concurrency',
    category: 'concept',
    mastery: 52,
    targetMastery: 80,
    parentId: 'skill-java',
    relatedConcepts: ['Threads', 'Locks', 'Executors', 'volatile', 'happens-before'],
    weakAreas: ['volatile semantics', 'Executor tuning', 'Deadlock prevention'],
  },

  // Spring
  {
    id: 'skill-spring-boot',
    name: 'Spring Boot',
    category: 'framework',
    mastery: 74,
    targetMastery: 85,
    parentId: 'skill-java',
    relatedConcepts: ['DI', 'Auto-configuration', 'Actuator', 'Profiles'],
    weakAreas: ['Auto-configuration internals'],
    resumeExcerpt: 'Built REST APIs and microservices with Spring Boot.',
  },
  {
    id: 'skill-spring-security',
    name: 'Spring Security',
    category: 'framework',
    mastery: 57,
    targetMastery: 80,
    parentId: 'skill-spring-boot',
    relatedConcepts: ['Filters', 'OAuth2', 'JWT', 'CSRF', 'RBAC'],
    weakAreas: ['Filter chain ordering', 'OAuth2 flows'],
  },
  {
    id: 'skill-spring-jpa',
    name: 'Spring Data JPA',
    category: 'framework',
    mastery: 70,
    targetMastery: 82,
    parentId: 'skill-spring-boot',
    relatedConcepts: ['Repositories', 'Entities', 'N+1', 'Transactions'],
    weakAreas: ['N+1 detection', 'Cascade types'],
  },

  // Frontend
  {
    id: 'skill-react',
    name: 'React',
    category: 'frontend',
    mastery: 48,
    targetMastery: 70,
    parentId: null,
    relatedConcepts: ['Hooks', 'State', 'Reconciliation', 'Suspense'],
    weakAreas: ['Reconciliation', 'Concurrent features'],
    resumeExcerpt: 'React + TypeScript dashboards for internal tooling.',
  },

  // Cloud
  {
    id: 'skill-aws',
    name: 'AWS',
    category: 'cloud',
    mastery: 61,
    targetMastery: 82,
    parentId: null,
    relatedConcepts: ['Regions', 'IAM', 'Pricing', 'Managed services'],
    weakAreas: ['IAM policies', 'Cost optimization'],
    resumeExcerpt: 'Production AWS experience with Lambda, SQS, and S3.',
  },
  {
    id: 'skill-lambda',
    name: 'AWS Lambda',
    category: 'cloud',
    mastery: 64,
    targetMastery: 82,
    parentId: 'skill-aws',
    relatedConcepts: ['Cold starts', 'Concurrency', 'Triggers', 'Timeouts'],
    weakAreas: ['Provisioned concurrency', 'Cold-start mitigation'],
  },
  {
    id: 'skill-sqs',
    name: 'AWS SQS',
    category: 'cloud',
    mastery: 41,
    targetMastery: 80,
    parentId: 'skill-aws',
    relatedConcepts: ['Queues', 'Visibility timeout', 'Retries', 'DLQ', 'Idempotency'],
    weakAreas: ['Visibility timeout', 'Duplicate processing', 'Retry behavior'],
    resumeExcerpt: 'Used SQS in asynchronous pipeline processing 50M+ daily records.',
  },
  {
    id: 'skill-s3',
    name: 'AWS S3',
    category: 'cloud',
    mastery: 68,
    targetMastery: 80,
    parentId: 'skill-aws',
    relatedConcepts: ['Buckets', 'Objects', 'Presigned URLs', 'Lifecycle'],
    weakAreas: ['Lifecycle policies'],
  },
  {
    id: 'skill-docker',
    name: 'Docker',
    category: 'devops',
    mastery: 67,
    targetMastery: 78,
    parentId: null,
    relatedConcepts: ['Images', 'Layers', 'Compose', 'Build cache'],
    weakAreas: ['Multi-stage builds', 'Layer caching'],
    resumeExcerpt: 'Containerized services with Docker for local and CI.',
  },

  // Databases
  {
    id: 'skill-postgresql',
    name: 'PostgreSQL',
    category: 'database',
    mastery: 72,
    targetMastery: 85,
    parentId: null,
    relatedConcepts: ['Indexes', 'Query plans', 'ACID', 'MVCC'],
    weakAreas: ['Query plan analysis', 'Partial indexes'],
    resumeExcerpt: 'PostgreSQL as primary OLTP database.',
  },
  {
    id: 'skill-mongodb',
    name: 'MongoDB',
    category: 'database',
    mastery: 70,
    targetMastery: 78,
    parentId: null,
    relatedConcepts: ['Documents', 'Aggregation', 'Sharding', 'Indexes'],
    weakAreas: ['Aggregation pipeline'],
  },

  // System design (concept)
  {
    id: 'skill-system-design',
    name: 'System Design',
    category: 'concept',
    mastery: 42,
    targetMastery: 80,
    parentId: null,
    relatedConcepts: ['Scalability', 'CAP', 'Sharding', 'Caching', 'Load balancing'],
    weakAreas: ['Capacity estimation', 'Caching strategies', 'CAP trade-offs'],
  },

  // Tooling
  {
    id: 'skill-github-actions',
    name: 'GitHub Actions',
    category: 'tooling',
    mastery: 63,
    targetMastery: 75,
    parentId: null,
    relatedConcepts: ['Workflows', 'Runners', 'Caching', 'Secrets'],
    weakAreas: ['Reusable workflows'],
  },
  {
    id: 'skill-gemini',
    name: 'Gemini',
    category: 'ai',
    mastery: 58,
    targetMastery: 72,
    parentId: null,
    relatedConcepts: ['LLM', 'Prompting', 'Embeddings', 'Function calling'],
    weakAreas: ['Function calling', 'Context window management'],
    resumeExcerpt: 'Integrated Gemini for document extraction features.',
  },
];

export const seedProjects: Project[] = [
  {
    id: 'proj-drill',
    name: 'Drill',
    description:
      'A spaced-repetition practice platform with adaptive difficulty and analytics.',
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'React', 'Docker'],
    highlights: [
      'Reduced p95 API latency by 40% via query optimization and caching.',
      'Designed adaptive difficulty algorithm using item response theory.',
    ],
  },
  {
    id: 'proj-syllabixtract',
    name: 'SyllabiXtract',
    description:
      'A document intelligence service extracting structured data from syllabi using Gemini.',
    technologies: ['Python', 'Gemini', 'TypeScript', 'AWS Lambda', 'S3'],
    highlights: [
      'Processed 50M+ daily records through an asynchronous Lambda/SQS/S3 pipeline.',
      'Achieved 94% extraction accuracy with prompt tuning and validation.',
    ],
  },
  {
    id: 'proj-pipeline',
    name: 'Event Ingestion Pipeline',
    description:
      'High-throughput event ingestion with deduplication and dead-letter handling.',
    technologies: ['Java', 'AWS SQS', 'AWS Lambda', 'PostgreSQL'],
    highlights: [
      'Built idempotent consumers to handle duplicate SQS messages.',
      'Implemented DLQ-based retry with exponential backoff.',
    ],
  },
];

export const seedClaims: ResumeClaim[] = [
  {
    id: 'claim-1',
    text: 'Processed 50M+ daily records through an asynchronous AWS Lambda/SQS/S3 pipeline.',
    category: 'AWS / Distributed Systems',
    risk: 'high',
    status: 'developing',
    reason:
      'Large quantified claims tend to trigger interviewer follow-up questions about architecture, scaling, and failure modes.',
    resumeExcerpt:
      'Built an asynchronous AWS Lambda/SQS/S3 pipeline processing 50M+ daily records.',
    relatedSkillIds: ['skill-lambda', 'skill-sqs', 'skill-s3', 'skill-system-design'],
    potentialQuestions: [
      'Walk me through the architecture of this pipeline.',
      'How did you handle duplicate messages in SQS?',
      'What happens when a Lambda function fails mid-batch?',
      'How would you make the pipeline idempotent?',
      'How would you redesign this if traffic increased 10x?',
      'What was your throughput per Lambda invocation?',
    ],
  },
  {
    id: 'claim-2',
    text: 'Reduced query latency by 60% by optimizing PostgreSQL queries and indexes.',
    category: 'Databases / Performance',
    risk: 'high',
    status: 'needs-practice',
    reason:
      'Performance claims with specific numbers invite deep probing on measurement and methodology.',
    resumeExcerpt:
      'Reduced query latency by 60% by adding composite indexes and rewriting N+1 queries.',
    relatedSkillIds: ['skill-postgresql', 'skill-spring-jpa'],
    potentialQuestions: [
      'What was the original query and how slow was it?',
      'Which indexes did you add and why?',
      'How did you measure the improvement?',
      'What trade-offs did indexing introduce?',
      'Did you use EXPLAIN ANALYZE? What did it show?',
      'How did you avoid N+1 queries in JPA?',
    ],
  },
  {
    id: 'claim-3',
    text: 'Designed adaptive difficulty algorithm using item response theory.',
    category: 'Algorithms / Product',
    risk: 'medium',
    status: 'developing',
    reason:
      'Algorithm design claims test whether you can explain the model and justify design decisions.',
    resumeExcerpt:
      'Designed adaptive difficulty algorithm using item response theory in Drill.',
    relatedSkillIds: ['skill-java', 'skill-system-design'],
    potentialQuestions: [
      'What is item response theory in one sentence?',
      'How did you parameterize difficulty?',
      'How did you validate the algorithm?',
      'What were the edge cases?',
      'How did cold-start work for new items?',
    ],
  },
  {
    id: 'claim-4',
    text: 'Integrated Gemini for structured document extraction with 94% accuracy.',
    category: 'AI / LLM',
    risk: 'medium',
    status: 'mastered',
    reason:
      'LLM integration claims probe prompt engineering, evaluation, and failure handling.',
    resumeExcerpt:
      'Integrated Gemini for document extraction achieving 94% accuracy.',
    relatedSkillIds: ['skill-gemini', 'skill-python'],
    potentialQuestions: [
      'How did you define and measure accuracy?',
      'How did you handle hallucinated fields?',
      'What was your prompt validation strategy?',
      'How did you handle rate limits and cost?',
    ],
  },
  {
    id: 'claim-5',
    text: 'Built idempotent consumers to handle duplicate SQS messages.',
    category: 'Distributed Systems',
    risk: 'high',
    status: 'weak',
    reason:
      'Idempotency is a classic distributed systems interview topic — interviewers will dig into the mechanism.',
    resumeExcerpt:
      'Implemented idempotent consumers with deduplication keys and DLQ retry.',
    relatedSkillIds: ['skill-sqs', 'skill-system-design'],
    potentialQuestions: [
      'What does idempotency mean in this context?',
      'How did you generate deduplication keys?',
      'Where did you store the idempotency state?',
      'What happens if the dedup store is unavailable?',
      'How did you handle at-least-once delivery?',
    ],
  },
  {
    id: 'claim-6',
    text: 'Containerized services with Docker and CI/CD via GitHub Actions.',
    category: 'DevOps',
    risk: 'low',
    status: 'mastered',
    reason: 'Standard DevOps claims are lower risk but may prompt workflow questions.',
    resumeExcerpt: 'Containerized services with Docker; CI/CD via GitHub Actions.',
    relatedSkillIds: ['skill-docker', 'skill-github-actions'],
    potentialQuestions: [
      'Describe your CI/CD pipeline.',
      'How did you optimize Docker build times?',
      'How did you manage secrets in GitHub Actions?',
    ],
  },
];

export const seedQuestions: Question[] = [
  {
    id: 'q-1',
    prompt: 'What is AWS Lambda?',
    difficulty: 'beginner',
    category: 'definition',
    relatedSkillIds: ['skill-lambda'],
    suggestedPoints: [
      'Serverless compute service',
      'Event-driven execution',
      'Pay-per-invocation pricing',
      'Automatic scaling',
    ],
  },
  {
    id: 'q-2',
    prompt: 'Why would you use SQS between Lambda functions instead of direct invocation?',
    difficulty: 'intermediate',
    category: 'tradeoffs',
    relatedSkillIds: ['skill-sqs', 'skill-lambda'],
    suggestedPoints: [
      'Decouples producers from consumers',
      'Buffers bursts of traffic',
      'Enables retries and DLQ handling',
      'At-least-once delivery semantics',
    ],
  },
  {
    id: 'q-3',
    prompt: 'How would you make an SQS-based Lambda pipeline idempotent?',
    difficulty: 'advanced',
    category: 'system-design',
    relatedSkillIds: ['skill-sqs', 'skill-lambda', 'skill-system-design'],
    suggestedPoints: [
      'Deduplication keys from message body or attributes',
      'Idempotency store (DynamoDB) with conditional writes',
      'Handle at-least-once delivery',
      'TTL on idempotency records',
    ],
  },
  {
    id: 'q-4',
    prompt:
      'You mentioned processing 50M+ daily records. Walk me through the architecture.',
    difficulty: 'advanced',
    category: 'resume-defense',
    relatedClaimId: 'claim-1',
    relatedSkillIds: ['skill-lambda', 'skill-sqs', 'skill-s3', 'skill-system-design'],
    suggestedPoints: [
      'Ingestion into SQS',
      'Lambda consumers batching records',
      'S3 for raw + processed storage',
      'Monitoring and DLQ',
    ],
    followUpId: 'q-5',
  },
  {
    id: 'q-5',
    prompt: 'How did you handle duplicate messages in that pipeline?',
    difficulty: 'advanced',
    category: 'follow-up',
    relatedSkillIds: ['skill-sqs', 'skill-system-design'],
    suggestedPoints: [
      'Deduplication ID on send',
      'Idempotency table with conditional put',
      'Visibility timeout tuning',
      'DLQ for poison messages',
    ],
  },
  {
    id: 'q-6',
    prompt: 'How would you redesign the system if traffic increased 10x?',
    difficulty: 'expert',
    category: 'system-design',
    relatedSkillIds: ['skill-sqs', 'skill-lambda', 'skill-system-design'],
    suggestedPoints: [
      'Partition SQS or move to Kinesis',
      'Provisioned concurrency on Lambda',
      'Batch size tuning',
      'Backpressure and autoscaling',
    ],
  },
  {
    id: 'q-7',
    prompt:
      'You mentioned Spring Boot extensively. Explain dependency injection and why you used it.',
    difficulty: 'intermediate',
    category: 'resume-defense',
    relatedSkillIds: ['skill-spring-boot'],
    suggestedPoints: [
      'Inversion of control',
      'Loose coupling and testability',
      'Constructor vs field injection',
      'Spring container and beans',
    ],
  },
  {
    id: 'q-8',
    prompt: 'What is the purpose of an SQS visibility timeout?',
    difficulty: 'intermediate',
    category: 'definition',
    relatedSkillIds: ['skill-sqs'],
    suggestedPoints: [
      'Prevents concurrent processing of the same message',
      'Message becomes invisible after read',
      'Reappears if not deleted before timeout',
      'Tune based on processing time',
    ],
  },
  {
    id: 'q-9',
    prompt: 'Explain the happens-before relationship in Java concurrency.',
    difficulty: 'advanced',
    category: 'definition',
    relatedSkillIds: ['skill-concurrency'],
    suggestedPoints: [
      'Guarantees memory visibility between threads',
      'Established by synchronized, volatile, final fields',
      'Creates a partial ordering on actions',
    ],
  },
  {
    id: 'q-10',
    prompt:
      'You reduced query latency by 60%. What indexes did you add and how did you measure it?',
    difficulty: 'advanced',
    category: 'resume-defense',
    relatedClaimId: 'claim-2',
    relatedSkillIds: ['skill-postgresql', 'skill-spring-jpa'],
    suggestedPoints: [
      'EXPLAIN ANALYZE before and after',
      'Composite index on filter + sort columns',
      'N+1 elimination via JOIN FETCH',
      'Measured p95 and p99 latency',
    ],
  },
];

export const seedFlashcards: Flashcard[] = [
  {
    id: 'fc-1',
    skillId: 'skill-sqs',
    front: 'What is the purpose of an SQS visibility timeout?',
    back: 'It prevents another consumer from processing the same message while the current consumer is processing it. The message becomes invisible after being read and reappears if not deleted before the timeout expires.',
    deck: 'AWS SQS',
  },
  {
    id: 'fc-2',
    skillId: 'skill-sqs',
    front: 'What is a dead-letter queue (DLQ)?',
    back: 'A queue that receives messages after they fail to be processed successfully after a configured number of attempts. It isolates poison messages for inspection and reprocessing.',
    deck: 'AWS SQS',
  },
  {
    id: 'fc-3',
    skillId: 'skill-sqs',
    front: 'What does idempotency mean in the context of SQS consumers?',
    back: 'Processing the same message multiple times produces the same result as processing it once. Required because SQS provides at-least-once delivery.',
    deck: 'AWS SQS',
  },
  {
    id: 'fc-4',
    skillId: 'skill-sqs',
    front: 'What is the difference between FIFO and Standard SQS queues?',
    back: 'Standard offers high throughput, at-least-once delivery, and best-effort ordering. FIFO provides exactly-once processing and message ordering within a message group, at lower throughput.',
    deck: 'AWS SQS',
  },
  {
    id: 'fc-5',
    skillId: 'skill-concurrency',
    front: 'What does the volatile keyword guarantee in Java?',
    back: 'It guarantees visibility of updates to a variable across threads and establishes a happens-before relationship. It does not provide atomicity for compound actions.',
    deck: 'Java Concurrency',
  },
  {
    id: 'fc-6',
    skillId: 'skill-concurrency',
    front: 'What is a happens-before relationship?',
    back: 'A guarantee that memory writes by one action are visible to another action that has a happens-before relationship with it, establishing a partial ordering for visibility.',
    deck: 'Java Concurrency',
  },
  {
    id: 'fc-7',
    skillId: 'skill-spring-boot',
    front: 'What is dependency injection?',
    back: 'A pattern where an object receives its dependencies from an external container rather than creating them itself. It inverts control and improves testability and loose coupling.',
    deck: 'Spring Boot',
  },
  {
    id: 'fc-8',
    skillId: 'skill-spring-security',
    front: 'What is the Spring Security filter chain?',
    back: 'A chain of servlet filters that process security concerns such as authentication, authorization, CSRF, and session management before requests reach the controller.',
    deck: 'Spring Security',
  },
  {
    id: 'fc-9',
    skillId: 'skill-system-design',
    front: 'What is the CAP theorem?',
    back: 'A distributed system can provide at most two of: Consistency, Availability, and Partition tolerance. Since partitions are unavoidable, the practical choice is between CP and AP.',
    deck: 'System Design',
  },
  {
    id: 'fc-10',
    skillId: 'skill-system-design',
    front: 'What is a circuit breaker pattern?',
    back: 'A pattern that stops calling a failing downstream service after a threshold of failures, allowing it to recover. It trips open, then half-open to test recovery, then closes.',
    deck: 'System Design',
  },
  {
    id: 'fc-11',
    skillId: 'skill-postgresql',
    front: 'What is MVCC?',
    back: 'Multi-Version Concurrency Control. Each transaction sees a snapshot of data, allowing readers to not block writers and vice versa. PostgreSQL uses it to provide ACID guarantees.',
    deck: 'PostgreSQL',
  },
  {
    id: 'fc-12',
    skillId: 'skill-postgresql',
    front: 'What is an N+1 query problem?',
    back: 'When a list of entities is fetched with one query, then related entities are fetched one-by-one per row. Solved via JOIN FETCH, entity graphs, or batch fetching.',
    deck: 'PostgreSQL',
  },
];

export const seedResources: LearningResource[] = [
  {
    id: 'res-1',
    skillId: 'skill-sqs',
    title: 'Amazon SQS Developer Guide',
    source: 'AWS',
    type: 'documentation',
    difficulty: 'intermediate',
    duration: 'Self-paced',
    description:
      'Official AWS documentation covering queues, visibility timeout, retries, DLQs, and FIFO semantics.',
    url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html',
  },
  {
    id: 'res-2',
    skillId: 'skill-sqs',
    title: 'Understanding Amazon SQS',
    source: 'YouTube',
    type: 'video',
    difficulty: 'beginner',
    duration: '18 min',
    description: 'A visual walkthrough of SQS concepts, message flow, and common patterns.',
    url: 'https://www.youtube.com/results?search_query=amazon+sqs+explained',
  },
  {
    id: 'res-3',
    skillId: 'skill-sqs',
    title: 'Message Queues Explained',
    source: 'ByteByteGo',
    type: 'article',
    difficulty: 'beginner',
    duration: '8 min',
    description: 'A clear primer on queue semantics, delivery guarantees, and when to use them.',
    url: 'https://bytebytego.com',
  },
  {
    id: 'res-4',
    skillId: 'skill-sqs',
    title: 'Building Reliable Event-Driven Systems',
    source: 'AWS Architecture Blog',
    type: 'article',
    difficulty: 'advanced',
    duration: '22 min',
    description:
      'Patterns for idempotency, retry, and DLQ design in event-driven architectures.',
    url: 'https://aws.amazon.com/builders-library/',
  },
  {
    id: 'res-5',
    skillId: 'skill-system-design',
    title: 'System Design Primer',
    source: 'GitHub',
    type: 'tutorial',
    difficulty: 'intermediate',
    duration: 'Self-paced',
    description:
      'A large open-source repository of system design concepts, trade-offs, and interview questions.',
    url: 'https://github.com/donnemartin/system-design-primer',
  },
  {
    id: 'res-6',
    skillId: 'skill-concurrency',
    title: 'Java Concurrency in Practice',
    source: 'Addison-Wesley',
    type: 'book',
    difficulty: 'advanced',
    duration: '20+ hours',
    description:
      'The canonical reference for Java threading, memory model, and concurrent design.',
    url: 'https://jcip.net',
  },
  {
    id: 'res-7',
    skillId: 'skill-spring-security',
    title: 'Spring Security Reference',
    source: 'Spring',
    type: 'documentation',
    difficulty: 'intermediate',
    duration: 'Self-paced',
    description: 'Official reference covering filter chain, OAuth2, method security, and CSRF.',
    url: 'https://docs.spring.io/spring-security/reference/',
  },
  {
    id: 'res-8',
    skillId: 'skill-postgresql',
    title: 'Using EXPLAIN ANALYZE',
    source: 'PostgreSQL Docs',
    type: 'documentation',
    difficulty: 'intermediate',
    duration: '12 min',
    description: 'How to read query plans and identify bottlenecks in PostgreSQL.',
    url: 'https://www.postgresql.org/docs/current/sql-explain.html',
  },
];

export const seedLearningTopics: LearningTopic[] = [
  {
    id: 'topic-1',
    skillId: 'skill-sqs',
    priority: 1,
    currentMastery: 41,
    targetMastery: 80,
    estimatedTime: '2.5 hours',
    reason:
      'Your resume claims production experience with SQS, but your assessment indicates weak understanding of retry semantics and message delivery.',
  },
  {
    id: 'topic-2',
    skillId: 'skill-system-design',
    priority: 2,
    currentMastery: 42,
    targetMastery: 80,
    estimatedTime: '4 hours',
    reason:
      'System design is the weakest overall area and is heavily weighted in backend interviews.',
  },
  {
    id: 'topic-3',
    skillId: 'skill-concurrency',
    priority: 3,
    currentMastery: 52,
    targetMastery: 80,
    estimatedTime: '3 hours',
    reason:
      'You list Java as a core skill, but concurrency fundamentals — volatile, happens-before, executors — are underdeveloped.',
  },
  {
    id: 'topic-4',
    skillId: 'skill-spring-security',
    priority: 4,
    currentMastery: 57,
    targetMastery: 80,
    estimatedTime: '2 hours',
    reason:
      'Spring Security appears in your stack and is a common interview topic for backend roles.',
  },
];

export const seedProgress: ProgressSnapshot[] = [
  { date: 'Jul 7', readiness: 58, technical: 64, resumeDefense: 48, coding: 49, systemDesign: 30, communication: 68 },
  { date: 'Jul 14', readiness: 62, technical: 67, resumeDefense: 52, coding: 51, systemDesign: 33, communication: 70 },
  { date: 'Jul 21', readiness: 64, technical: 69, resumeDefense: 54, coding: 52, systemDesign: 35, communication: 71 },
  { date: 'Jul 28', readiness: 66, technical: 71, resumeDefense: 56, coding: 53, systemDesign: 37, communication: 73 },
  { date: 'Aug 4', readiness: 68, technical: 73, resumeDefense: 58, coding: 54, systemDesign: 39, communication: 74 },
  { date: 'Aug 11', readiness: 69, technical: 75, resumeDefense: 59, coding: 54, systemDesign: 40, communication: 75 },
  { date: 'Aug 18', readiness: 72, technical: 78, resumeDefense: 61, coding: 55, systemDesign: 42, communication: 76 },
];

export const seedStats: ProgressStats = {
  questionsAnswered: 184,
  flashcardsReviewed: 412,
  studyTimeMinutes: 960,
  claimsMastered: 18,
  mockInterviewsCompleted: 7,
  weakAreasImproved: 9,
};

export const seedEvaluation: AnswerEvaluation = {
  technicalAccuracy: 72,
  depth: 51,
  specificity: 44,
  communication: 81,
  didWell: [
    'Correctly described Lambda invocation and triggers',
    'Explained asynchronous processing and decoupling',
  ],
  missed: [
    'Idempotency and deduplication strategy',
    'Dead-letter queue handling',
    'Retry semantics and visibility timeout',
  ],
  followUpPrompt: 'How would you prevent duplicate processing in this pipeline?',
};

// Resume profile area breakdown
export const resumeProfile = [
  { label: 'Backend Engineering', value: 82 },
  { label: 'Frontend Engineering', value: 61 },
  { label: 'Cloud', value: 52 },
  { label: 'Databases', value: 72 },
  { label: 'AI', value: 63 },
];

export const readinessScore = 72;
export const claimsMasteredCount = 18;
export const claimsTotalCount = 27;
