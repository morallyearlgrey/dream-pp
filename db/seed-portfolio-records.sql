WITH project_seed(
  match_name,
  name,
  from_date,
  to_date,
  summary,
  what_i_did,
  photos,
  main_video,
  project_link,
  tools_used
) AS (
  VALUES
    (
      'Rock Paper AI Sensors',
      'Rock Paper AI Sensors',
      DATE '2024-10-01',
      DATE '2024-10-01',
      $summary$Rock Paper AI Sensors is an AI-powered game built for UCF STEM Day 2024. Using OpenCV, it detects the player's hand gesture, generates a computer response, determines the winner, and turns a familiar game into an interactive introduction to computer vision.$summary$,
      $work$Developed the Tkinter gameplay interface and integrated the computer-vision backend into the frontend. Set up the live camera feed, connected detected gestures to the game logic, and implemented a scoring system that displays each round's result.$work$,
      '[]'::jsonb,
      'rps.mov',
      NULL,
      '["Python", "OpenCV", "Tkinter"]'::jsonb
    ),
    (
      'A.N.R / Agentic Nuclear Reactor',
      'A.N.R / Agentic Nuclear Reactor',
      DATE '2026-03-01',
      DATE '2026-03-01',
      $summary$Agentic Nuclear Reactor won 1st Overall and the Google Cloud prize at HackUSF 2026, placing first among 80+ teams. The project uses a Google ADK and Gemini agent pipeline to regulate a reactor's electrostatic fields while deterministic Python overrides keep every control decision within safe operating limits.$summary$,
      $work$Implemented a 15-rule Gemini decision tree with Python safety overrides and meta-agent tuning of operating limits. Built the analysis agent that detects beam instability using EWMA, coefficient of variation, integral error, and rate of change. Integrated Python serial control with an Arduino driving an MCP4728 DAC, and streamed real-time telemetry over WebSockets through FastAPI.$work$,
      '["anr.png"]'::jsonb,
      'anrvideo.mov',
      NULL,
      '["Python", "Gemini", "Google ADK", "FastAPI", "WebSocket", "Arduino"]'::jsonb
    ),
    (
      'SignHero',
      'SignHero',
      DATE '2026-01-01',
      DATE '2026-01-01',
      $summary$SignHero won 2nd Place Overall and Best Game Design at SwampHacks 2026 among 110+ teams. It is an ASL rhythm game that uses machine-learning sign recognition and timed gameplay to turn fingerspelling practice into an accessible, competitive experience.$summary$,
      $work$Built type-safe tRPC, Prisma, and MongoDB services for player creation, validation, and results across 50+ players. Created a mistake tracker with React hooks, Tailwind, and WebSockets that surfaced missed signs across 150+ rounds. Implemented tRPC routes and webhooks for beatmap creation, then built the song carousel in React and Tailwind.$work$,
      '["signhero.png"]'::jsonb,
      'signherovideo.mov',
      NULL,
      '["React", "TypeScript", "Tailwind", "WebSocket", "tRPC", "Prisma", "MongoDB"]'::jsonb
    ),
    (
      'Tariffix',
      'Tariffix',
      DATE '2025-04-01',
      DATE '2025-04-01',
      $summary$Tariffix won MLH Best Use of MongoDB at Bitcamp 2025. The browser extension and API scan HTS codes and show consumers how tariffs may affect product prices, combining tariff data with Gemini-powered analysis in an accessible interface.$summary$,
      $work$Deployed a tariff-rate API on MongoDB and developed REST endpoints with Express and Mongoose for efficient, scalable retrieval. Built the React and Tailwind CSS frontend to visualize JSON results, used Cheerio in the tariff-data workflow, and integrated the Gemini API for product analysis. Packaged the experience for the web and as a Vite-powered browser extension.$work$,
      '["tariffix.png"]'::jsonb,
      'tariffix.mov',
      NULL,
      '["MongoDB", "Cheerio", "Gemini", "React", "Tailwind CSS", "Next.js", "Express.js", "Mongoose", "Vite"]'::jsonb
    ),
    (
      'kmodo',
      'kmodo',
      DATE '2025-04-01',
      DATE '2025-04-01',
      $summary$kmodo won 1st Place at Project Launch 2025. The platform enables organizers to run hackathons, participants to discover and apply to events, companies to connect with attendees, and users to find the resources they need throughout an event.$summary$,
      $work$Led frontend development in React and Tailwind CSS for three key pages: Landing, Events, and Resources. Built three reusable components covering the navbar, footer, and sponsor dashboard. Implemented tag-based and keyword event search with Drizzle ORM and tRPC queries against PostgreSQL, and supported deployment through Coolify.$work$,
      '["kmodo.png"]'::jsonb,
      'kmodo.MOV',
      NULL,
      '["React", "Tailwind CSS", "PostgreSQL", "Drizzle", "tRPC", "Coolify"]'::jsonb
    ),
    (
      'KnightPool',
      'KnightPool',
      DATE '2025-01-01',
      DATE '2025-03-01',
      $summary$KnightPool is a ridesharing platform that matches students and coworkers around overlapping schedules, routes, and locations. I worked on schedule upload, Gemini parsing, authentication, and MongoDB/Mongoose backend routes for ride requests, users, and rides.$summary$,
      $work$Built the schedule upload flow for importing availability from screenshots. Integrated Gemini analysis to parse schedule images into usable app data. Implemented authentication flows with NextAuth. Developed backend routing and MongoDB/Mongoose models for users, rides, and ride requests. Helped build dashboard flows for drivers, requests, offers, and schedule-based matching.$work$,
      '["knightpool.png"]'::jsonb,
      'knightpoolvideo.mov',
      NULL,
      '["Next.js", "NextAuth", "Gemini", "MongoDB", "Mongoose"]'::jsonb
    ),
    (
      'Multi-Cycle RV32I Microprocessor',
      'Pipelined RV32I Microprocessor',
      DATE '2026-01-01',
      DATE '2026-04-01',
      $summary$This Verilog and C++ implementation of a pipelined RV32I processor finished in the top 10% for cycle count. The project combines data forwarding, an N-way write-back cache, prefetching, and a custom assembler to improve execution performance while preserving instruction-level correctness.$summary$,
      $work$Built the processor pipeline with EX-to-EX, MEM-to-EX, and MEM-to-MEM forwarding. Implemented an N-way write-back cache with LRU and PLRU replacement, dirty bits, write allocation, and prefetching. Developed a C++ assembler supporting RV32I instruction formats, symbol resolution, immediate values, and hex and binary output.$work$,
      '["processor.png"]'::jsonb,
      'ieeevideo.mov',
      NULL,
      '["Verilog", "C++", "RISC-V", "Assembly"]'::jsonb
    )
),
updated_projects AS (
  UPDATE projects
  SET
    name = project_seed.name,
    from_date = project_seed.from_date,
    to_date = project_seed.to_date,
    summary = project_seed.summary,
    what_i_did = project_seed.what_i_did,
    photos = project_seed.photos,
    main_video = project_seed.main_video,
    project_link = COALESCE(project_seed.project_link, projects.project_link),
    tools_used = project_seed.tools_used,
    updated_at = now()
  FROM project_seed
  WHERE lower(projects.name) = lower(project_seed.match_name)
    OR lower(projects.name) = lower(project_seed.name)
  RETURNING projects.id
)
INSERT INTO projects (
  name,
  from_date,
  to_date,
  summary,
  what_i_did,
  photos,
  main_video,
  project_link,
  tools_used
)
SELECT
  project_seed.name,
  project_seed.from_date,
  project_seed.to_date,
  project_seed.summary,
  project_seed.what_i_did,
  project_seed.photos,
  project_seed.main_video,
  project_seed.project_link,
  project_seed.tools_used
FROM project_seed
WHERE NOT EXISTS (
  SELECT 1
  FROM projects
  WHERE lower(projects.name) = lower(project_seed.match_name)
    OR lower(projects.name) = lower(project_seed.name)
);

WITH experience_seed(
  match_position_name,
  match_from_date,
  company_name,
  position_name,
  from_date,
  to_date,
  summary,
  responsibilities,
  photos,
  main_video
) AS (
  VALUES
    (
      'Embedded Software Intern',
      DATE '2026-05-01',
      'NVIDIA',
      'Software Engineer Intern',
      DATE '2026-05-01',
      DATE '2026-08-01',
      $summary$At NVIDIA, I built agentic AI and CI automation for MISRA/CERT-C remediation across embedded software. The tooling generated fixes and deviations, surfaced regressions directly in GitLab merge requests, and reduced static-analysis findings by 89%.$summary$,
      '["Built an agentic AI Python pipeline that developed MISRA/CERT violation fixes and wrote deviations across 70+ files.", "Built a Jenkins pipeline that flagged MISRA/CERT violations, posted suggestions on GitLab merge requests, and blocked 50+ regressions.", "Fixed 600 violations and authored 900 deviations, cutting MISRA/CERT-C findings from 1,800 to 200, an 89% drop.", "Built a Python Coverity scanner that applied profile and ruleset configurations and produced HTML/CSS reports."]'::jsonb,
      '["hero.jpeg"]'::jsonb,
      'nvidiaexpvideo.mov'
    ),
    (
      'Software Engineer Intern',
      DATE '2025-06-01',
      'BNY Mellon',
      'Software Engineer Intern',
      DATE '2026-01-01',
      DATE '2026-04-01',
      $summary$At BNY, I built multi-agent observability and machine-learning systems across AppDynamics, Grafana, and Prometheus. The work resolved 500+ injection attacks and automated 70% of fault-diagnosis paths by combining anomaly detection with fault classification.$summary$,
      '["Built a 4-agent observability pipeline for AppDynamics, Grafana, and Prometheus that resolved 500+ injection attacks.", "Trained an Isolation Forest model on 4,000+ points across 8 features and 300+ trees to flag latency and Docker faults.", "Built Random Forest and XGBoost models that classified 6 fault causes with 85% accuracy and automated 70% of diagnosis paths."]'::jsonb,
      '["builder.png"]'::jsonb,
      'bnyvideo.mov'
    ),
    (
      'Systems Software Intern',
      DATE '2024-05-01',
      'NVIDIA',
      'Software Engineer Intern',
      DATE '2025-05-01',
      DATE '2025-08-01',
      $summary$At NVIDIA, I expanded validation for a RISC-V operating system and shipped production fixes for low-level inter-process communication and thread-local storage behavior. My test work raised line coverage from 77.7% to 97.1%.$summary$,
      '["Wrote 10,000+ C microkernel tests across 230 RISC-V OS functions, raising line coverage from 77.7% to 97.1%.", "Shipped 4 production features addressing 8 critical inter-process communication and thread-local storage bugs."]'::jsonb,
      '["hero.jpeg"]'::jsonb,
      'nvidiaexpvideo.mov'
    ),
    (
      'Software Engineer',
      DATE '2024-01-01',
      'IEEE @ UCF',
      'Software Engineer',
      DATE '2024-08-01',
      DATE '2026-04-01',
      $summary$At IEEE @ UCF, I led a 25-developer team across four products while building the organization's full-stack platform. I introduced delivery workflows and shipped frontend, database, authentication, and backend systems serving members, events, and projects.$summary$,
      '["Led a 25-developer team across 4 products, boosting output by 600% through DevOps, GitHub workflows, and ticketing.", "Developed 6 React/Tailwind pages and 35 frontend components, then deployed the full-stack website on Vercel.", "Deployed a PostgreSQL/Drizzle ORM database and built Discord OAuth authentication for 100+ users.", "Built 39 tRPC endpoints across 7 routers, supporting CRUD for 100+ users, 200+ events, and 6 projects."]'::jsonb,
      '["ieee.jpeg", "knighthacks.jpeg"]'::jsonb,
      'ieeeexpvideo.MOV'
    )
),
updated_experiences AS (
  UPDATE experiences
  SET
    position_name = experience_seed.position_name,
    from_date = experience_seed.from_date,
    to_date = experience_seed.to_date,
    summary = experience_seed.summary,
    responsibilities = experience_seed.responsibilities,
    photos = experience_seed.photos,
    main_video = experience_seed.main_video,
    updated_at = now()
  FROM experience_seed
  WHERE lower(experiences.company_name) = lower(experience_seed.company_name)
    AND (
      (
        lower(experiences.position_name) = lower(experience_seed.match_position_name)
        AND experiences.from_date = experience_seed.match_from_date
      )
      OR (
        lower(experiences.position_name) = lower(experience_seed.position_name)
        AND experiences.from_date = experience_seed.from_date
      )
    )
  RETURNING experiences.id
)
INSERT INTO experiences (
  company_name,
  position_name,
  from_date,
  to_date,
  summary,
  responsibilities,
  photos,
  main_video
)
SELECT
  experience_seed.company_name,
  experience_seed.position_name,
  experience_seed.from_date,
  experience_seed.to_date,
  experience_seed.summary,
  experience_seed.responsibilities,
  experience_seed.photos,
  experience_seed.main_video
FROM experience_seed
WHERE NOT EXISTS (
  SELECT 1
  FROM experiences
  WHERE lower(experiences.company_name) = lower(experience_seed.company_name)
    AND (
      (
        lower(experiences.position_name) = lower(experience_seed.match_position_name)
        AND experiences.from_date = experience_seed.match_from_date
      )
      OR (
        lower(experiences.position_name) = lower(experience_seed.position_name)
        AND experiences.from_date = experience_seed.from_date
      )
    )
);
