WITH skill_seed(name, category, photo) AS (
  VALUES
    ('Python', 'languages', '01-languages-python.png'),
    ('TypeScript', 'languages', '02-languages-typescript.png'),
    ('JavaScript', 'languages', '03-languages-javascript.png'),
    ('Java', 'languages', '04-languages-java.png'),
    ('C', 'languages', '05-languages-c.png'),
    ('C++', 'languages', '06-languages-cplusplus.png'),
    ('C#', 'languages', '07-languages-csharp.png'),
    ('SQL', 'languages', '08-languages-sql.png'),
    ('Verilog', 'languages', '09-languages-verilog.png'),
    ('RISC-V Assembly', 'languages', '10-languages-risc-v-assembly.png'),
    ('MIPS Assembly', 'languages', '11-languages-mips-assembly.png'),
    ('Kotlin', 'languages', '12-languages-kotlin.png'),
    ('React', 'frameworks', '13-frameworks-react.png'),
    ('FastAPI', 'frameworks', '14-frameworks-fastapi.png'),
    ('Spring Boot', 'frameworks', '15-frameworks-spring-boot.png'),
    ('Next.js', 'frameworks', '16-frameworks-next-js.png'),
    ('Node.js', 'frameworks', '17-frameworks-node-js.png'),
    ('Express.js', 'frameworks', '18-frameworks-express-js.png'),
    ('Tailwind', 'frameworks', '19-frameworks-tailwind.png'),
    ('tRPC', 'frameworks', '20-frameworks-trpc.png'),
    ('Google ADK', 'frameworks', '21-frameworks-google-adk.png'),
    ('WebSocket', 'frameworks', '22-frameworks-websocket.png'),
    ('Vue', 'frameworks', '23-frameworks-vue.png'),
    ('scikit-learn', 'libraries', '24-libraries-scikit-learn.png'),
    ('NumPy', 'libraries', '25-libraries-numpy.png'),
    ('Pandas', 'libraries', '26-libraries-pandas.png'),
    ('PyTorch', 'libraries', '27-libraries-pytorch.png'),
    ('OpenCV', 'libraries', '28-libraries-opencv.png'),
    ('Selenium', 'libraries', '29-libraries-selenium.png'),
    ('Playwright', 'libraries', '30-libraries-playwright.png'),
    ('Drizzle', 'libraries', '31-libraries-drizzle.png'),
    ('Prisma', 'libraries', '32-libraries-prisma.png'),
    ('Mongoose', 'libraries', '33-libraries-mongoose.png'),
    ('Matplotlib', 'libraries', '34-libraries-matplotlib.png'),
    ('XGBoost', 'libraries', '35-libraries-xgboost.png'),
    ('Puppeteer', 'libraries', '36-libraries-puppeteer.png'),
    ('NextAuth', 'libraries', '37-libraries-nextauth.png'),
    ('pyserial', 'libraries', '38-libraries-pyserial.png'),
    ('MongoDB', 'tools', '39-tools-mongodb.png'),
    ('PostgreSQL', 'tools', '40-tools-postgresql.png'),
    ('SQLite', 'tools', '41-tools-sqlite.png'),
    ('Neon', 'tools', '42-tools-neon.png'),
    ('Git', 'tools', '43-tools-git.png'),
    ('Visual Studio Code', 'tools', '44-tools-visual-studio-code.png'),
    ('Perforce', 'tools', '45-tools-perforce.png'),
    ('Docker', 'tools', '46-tools-docker.png'),
    ('Xcode', 'tools', '47-tools-xcode.png'),
    ('Android Studio', 'tools', '48-tools-android-studio.png'),
    ('Vercel', 'tools', '49-tools-vercel.png'),
    ('Figma', 'tools', '50-tools-figma.png'),
    ('Jira', 'tools', '51-tools-jira.png'),
    ('Unity', 'tools', '52-tools-unity.png'),
    ('Jupyter Notebook', 'tools', '53-tools-jupyter-notebook.png'),
    ('Grafana', 'tools', '54-tools-grafana.png'),
    ('Prometheus', 'tools', '55-tools-prometheus.png'),
    ('Arduino', 'tools', '56-tools-arduino.png'),
    ('Raspberry Pi', 'tools', '57-tools-raspberry-pi.png'),
    ('Godot', 'tools', '58-tools-godot.png'),
    ('AppDynamics', 'tools', '59-tools-appdynamics.png'),
    ('Jenkins', 'tools', '60-tools-jenkins.png'),
    ('Supabase', 'tools', '61-tools-supabase.png')
),
deleted_old_seed_rows AS (
  DELETE FROM skills
  WHERE name = 'Assembly (RISC-V, MIPS)'
    AND category = 'languages'
  RETURNING id
),
updated AS (
  UPDATE skills
  SET photo = skill_seed.photo
  FROM skill_seed
  WHERE lower(skills.name) = lower(skill_seed.name)
    AND skills.category = skill_seed.category::skill_category
  RETURNING skills.id
)
INSERT INTO skills (name, category, photo)
SELECT skill_seed.name, skill_seed.category::skill_category, skill_seed.photo
FROM skill_seed
WHERE NOT EXISTS (
  SELECT 1
  FROM skills
  WHERE lower(skills.name) = lower(skill_seed.name)
    AND skills.category = skill_seed.category::skill_category
);
