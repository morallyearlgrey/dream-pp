WITH project_seed(
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
      DATE '2025-02-01',
      DATE '2025-02-01',
      $summary$Rock Paper AI Sensors is an OpenCV-powered rock-paper-scissors game where the camera detects the player's hand gesture and compares it against a CPU's randomly selected move. The project combines real-time computer vision with a Tkinter interface so players can see the camera feed, submit gestures, and get round-by-round results instantly.$summary$,
      $work$Set up the live camera feed using OpenCV for real-time hand detection. Integrated the computer vision backend with the Tkinter frontend. Built the Tkinter interface for gameplay, round results, and score display. Connected detected hand gestures to rock-paper-scissors game logic. Implemented CPU move generation using randomized rock, paper, or scissors choices. Helped create a playable end-to-end experience for UCF STEM Day.$work$,
      '[]'::jsonb,
      'rps.mov',
      NULL,
      '["Python", "OpenCV", "Tkinter"]'::jsonb
    ),
    (
      'A.N.R / Agentic Nuclear Reactor',
      DATE '2026-03-01',
      DATE '2026-07-01',
      $summary$A.N.R is a hardware-software system that uses a four-agent AI pipeline to monitor and steer a 3kV electron beam inside a vacuum chamber. I helped connect Gemini, Google ADK, FastAPI, WebSockets, and Arduino control logic into a real-time loop with strict hardware safety boundaries.$summary$,
      $work$Built a four-agent control pipeline for analysis, decision-making, action safety, and meta-learning. Implemented signal analysis using EWMA, coefficient of variation, integral error, and ROC-style stability checks. Developed the Python serial bridge and Arduino firmware for DAC-driven electrode voltage control. Added hard safety clamps, max-delta limits, and fail-safe behavior before any hardware adjustment. Helped ship the real-time dashboard for telemetry, electrode state, and agent decision logs.$work$,
      '["anr.png"]'::jsonb,
      'anrvideo.mov',
      NULL,
      '["Python", "Gemini", "Google ADK", "FastAPI", "WebSocket", "Arduino"]'::jsonb
    ),
    (
      'SignHero',
      DATE '2025-09-01',
      DATE '2025-11-01',
      $summary$SignHero is a webcam-powered ASL rhythm game that turns fingerspelling practice into Guitar Hero-style gameplay. I focused on full-stack gameplay infrastructure, syncing real-time sign predictions with timed scoring, player data, and leaderboards.$summary$,
      $work$Built player management with tRPC, Prisma, and MongoDB for creation, errors, results, and persistence. Wrote React hooks to validate WebSocket sign predictions against timed scoring windows. Built mistake detection, progress tracking, combo logic, and game-state feedback. Created song-to-beatmap flows that turned music into time-validated ASL sequences. Worked on leaderboard infrastructure supporting 100+ entries across multiple game modes.$work$,
      '["signhero.png"]'::jsonb,
      'signherovideo.mov',
      NULL,
      '["React", "Next.js", "tRPC", "Prisma", "MongoDB", "WebSocket"]'::jsonb
    ),
    (
      'Tariffix',
      DATE '2025-04-01',
      DATE '2025-04-01',
      $summary$Tariffix is a Chrome extension and website that explains how tariffs may affect prices on everyday products. It combines HTS lookup, scraped tariff data, MongoDB, and Gemini-backed product analysis to make import costs easier for consumers to understand.$summary$,
      $work$Built MongoDB-backed tariff-rate API routes with Express and Mongoose. Helped create the HTS lookup and tariff-estimation flow for consumer-facing price insights. Developed React/Tailwind UI for tariff education, product analysis, and JSON result visualization. Integrated Gemini analysis for product metadata such as category and country of origin. Helped package the project as both a web app and Vite-powered Chrome extension.$work$,
      '["tariffix.png"]'::jsonb,
      'tariffix.mov',
      NULL,
      '["React", "Tailwind", "Express.js", "Mongoose", "MongoDB", "Gemini", "Vite"]'::jsonb
    ),
    (
      'kmodo',
      DATE '2025-09-01',
      DATE '2025-11-01',
      $summary$kmodo is a full-stack hackathon platform for discovering events, managing signups, supporting sponsors, and connecting hackers with resources. I led frontend pieces and search/data flows across a T3-style stack with React, Tailwind, tRPC, Drizzle, and PostgreSQL.$summary$,
      $work$Led frontend development for the landing, events, and resources pages. Built reusable UI pieces including navigation, footer, and sponsor dashboard components. Implemented tag-based and keyword event search with Drizzle, tRPC, and PostgreSQL. Contributed to multi-role workflows for hackers, organizers, and sponsors. Supported deployment and infrastructure work across Coolify, PostgreSQL, and the app stack.$work$,
      '["kmodo.png"]'::jsonb,
      'kmodo.MOV',
      NULL,
      '["React", "Tailwind", "tRPC", "Drizzle", "PostgreSQL", "Next.js", "Coolify"]'::jsonb
    ),
    (
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
      DATE '2024-08-01',
      DATE '2024-12-01',
      $summary$This project is a Verilog and C++ implementation of a multi-cycle RV32I processor with forwarding, cache behavior, and an assembler for hardware validation. I focused on performance, correctness, and clean hardware structure across the processor pipeline and supporting tooling.$summary$,
      $work$Implemented EX-to-EX, MEM-to-EX, and MEM-to-MEM forwarding logic in Verilog. Built LRU/PLRU cache replacement with dirty-bit write-back, write-allocate, and next-line prefetching. Implemented core processor modules including register file, memory, immediate generation, and muxes. Created a C++ assembler with instruction encoding, symbol tables, immediate parsing, and hex/binary output. Finished in the top 10% for fastest cycle count.$work$,
      '["processor.png"]'::jsonb,
      'ieeevideo.mov',
      NULL,
      '["Verilog", "C++", "RISC-V", "Assembly"]'::jsonb
    )
),
updated_projects AS (
  UPDATE projects
  SET
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
  WHERE lower(projects.name) = lower(project_seed.name)
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
  WHERE lower(projects.name) = lower(project_seed.name)
);

WITH experience_seed(
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
      'NVIDIA',
      'Software Intern',
      DATE '2026-05-01',
      DATE '2026-08-01',
      $summary$I worked on static-analysis automation and CI quality, connecting GitLab webhooks with Jenkins and Coverity to detect regressions, keep fixes moving through the pipeline, and make weekly results easier for engineers to review.$summary$,
      '["Built a GitLab webhook integration that triggered Jenkins Coverity checks and notified engineers about violation regressions.", "Fixed automated Jenkins pipeline failures across MISRA/CERT-C analysis for 70+ files.", "Fixed 600 violations and authored 900 deviations, cutting MISRA/CERT-C findings from 1,800 to 200, an 89% drop.", "Published weekly Jenkins reports with HTML/CSS summaries of Coverity regressions, fixes, and deviations."]'::jsonb,
      '["hero.jpeg"]'::jsonb,
      'nvidiaexpvideo.mov'
    ),
    (
      'BNY Mellon',
      'Software Engineer Intern',
      DATE '2025-06-01',
      DATE '2025-08-01',
      $summary$I built observability and anomaly-detection tooling across AppDynamics, Grafana, Prometheus, and incident data. The work combined multi-agent automation, machine learning, and Gemini-backed fallbacks to detect attacks, classify faults, and shorten debugging paths.$summary$,
      '["Built a 4-agent observability pipeline that resolved 500+ injection attacks.", "Trained an Isolation Forest model on 4,000+ points across 8 features and 300+ trees.", "Built Random Forest and XGBoost classifiers for 6 fault causes with 85% accuracy.", "Automated roughly 70% of fault-diagnosis paths.", "Integrated Gemini fallback reasoning with incident and anomaly context from PostgreSQL."]'::jsonb,
      '["builder.png"]'::jsonb,
      'bnyvideo.mov'
    ),
    (
      'NVIDIA',
      'Systems Software Intern',
      DATE '2024-05-01',
      DATE '2024-08-01',
      $summary$I worked on production systems software for NVIDIA's RISC-V OS and microkernel test infrastructure. The internship focused on expanding validation coverage and shipping fixes for IPC and thread-local storage behavior.$summary$,
      '["Wrote 10,000+ C microkernel tests across 230 RISC-V OS functions.", "Raised line coverage from 77.7% to 97.1%.", "Shipped 4 production features addressing 8 critical IPC and TLS bugs.", "Strengthened validation for low-level OS behavior across communication and concurrency paths."]'::jsonb,
      '["hero.jpeg"]'::jsonb,
      'nvidiaexpvideo.mov'
    ),
    (
      'IEEE @ UCF',
      'Software Engineer',
      DATE '2024-01-01',
      DATE '2026-05-01',
      $summary$I built and led software engineering for IEEE @ UCF's member-facing web products. The role grew from hands-on full-stack development into organizing a 25-developer team and improving the group's delivery process.$summary$,
      '["Led a 25-developer team across 4 products, increasing output by 600% through DevOps, GitHub workflows, and ticketing.", "Developed 6 React/Tailwind pages and 35 reusable frontend components.", "Deployed the full-stack website on Vercel.", "Built a PostgreSQL/Drizzle data layer and Discord OAuth authentication for 100+ users.", "Implemented 39 tRPC endpoints across 7 routers for users, events, and projects."]'::jsonb,
      '["ieee.jpeg", "knighthacks.jpeg"]'::jsonb,
      'ieeeexpvideo.MOV'
    )
),
updated_experiences AS (
  UPDATE experiences
  SET
    from_date = experience_seed.from_date,
    to_date = experience_seed.to_date,
    summary = experience_seed.summary,
    responsibilities = experience_seed.responsibilities,
    photos = experience_seed.photos,
    main_video = experience_seed.main_video,
    updated_at = now()
  FROM experience_seed
  WHERE lower(experiences.company_name) = lower(experience_seed.company_name)
    AND lower(experiences.position_name) = lower(experience_seed.position_name)
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
    AND lower(experiences.position_name) = lower(experience_seed.position_name)
);
