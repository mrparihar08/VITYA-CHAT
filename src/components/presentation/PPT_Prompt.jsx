export const PPT_CATEGORIES = [
  {
    "id": "all",
    "label": "✨ All Topics"
  },
  {
    "id": "tech",
    "label": "💻 AI & IT Technology"
  },
  {
    "id": "science",
    "label": "🔬 Science & Space"
  },
  {
    "id": "society",
    "label": "🏛️ History & Society"
  },
  {
    "id": "environment",
    "label": "🌿 Climate & Environment"
  },
  {
    "id": "business",
    "label": "💼 Business & Economy"
  },
  {
    "id": "education",
    "label": "🎓 Education & Learning"
  },
  {
    "id": "health",
    "label": "🏥 Health & Medicine"
  },
  {
    "id": "arts",
    "label": "🎨 Art, Music & Design"
  },
  {
    "id": "lifestyle",
    "label": "🧘 Wellness & Personal Growth"
  },
  {
    "id": "law",
    "label": "⚖️ Law & Governance"
  }
];

export const PPT_PROMPTS = [
  {
    "id": "ai_master",
    "category": "tech",
    "icon": "🤖",
    "title": "Artificial Intelligence (AI)",
    "desc": "Machine learning, deep learning, NLP, computer vision, Generative AI & ethics",
    "keywords": [
      "ai",
      "artificial intelligence",
      "agentic ai",
      "computer vision"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Artificial Intelligence (AI) covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, history, how AI works, major types of AI, machine learning and deep learning, natural language processing, computer vision, generative AI, real-world applications, advantages, limitations, ethical concerns, future scope, and career opportunities. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, practical examples, relevant diagrams, icons, and AI-related images on every slide, with a modern technology-themed design suitable for students and beginners.",
    "template": "dark",
    "slideCount": 10,
    "audience": "Students & Tech Enthusiasts"
  },
  {
    "id": "cybersecurity_master",
    "category": "tech",
    "icon": "🛡️",
    "title": "Cyber Security",
    "desc": "Malware, phishing, ransomware, encryption, zero-trust & prevention",
    "keywords": [
      "cyber security",
      "cybersecurity",
      "security",
      "threats",
      "malware",
      "phishing",
      "ransomware",
      "ethical hacking",
      "hacking"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Cyber Security covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, importance, common cyber threats, malware, phishing, ransomware, password security, encryption, authentication, network security, data privacy, ethical hacking, real-world cyber attacks, prevention methods, advantages, challenges, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, real-world examples, security diagrams, relevant icons, and cybersecurity-themed images on every slide, with a modern professional design suitable for students and beginners.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Students & IT Professionals"
  },
  {
    "id": "cloud_computing_master",
    "category": "tech",
    "icon": "☁️",
    "title": "Cloud Computing",
    "desc": "IaaS/PaaS/SaaS, AWS/Azure/GCP, storage, security & future scope",
    "keywords": [
      "cloud computing",
      "cloud",
      "iaas",
      "paas",
      "saas",
      "aws",
      "azure",
      "gcp",
      "virtualization"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Cloud Computing covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, how cloud computing works, characteristics, service models such as IaaS, PaaS and SaaS, deployment models, virtualization, cloud storage, major cloud platforms, real-world applications, benefits, limitations, security concerns, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, practical examples, cloud architecture diagrams, relevant icons, and high-quality cloud computing images on every slide, with a modern technology-themed design.",
    "template": "corporate",
    "slideCount": 8,
    "audience": "Students & Tech Beginners"
  },
  {
    "id": "machine_learning",
    "category": "tech",
    "icon": "⚙️",
    "title": "Machine Learning (ML)",
    "desc": "Supervised, unsupervised, reinforcement learning, algorithms & evaluation",
    "keywords": [
      "machine learning",
      "ml",
      "supervised learning",
      "unsupervised learning",
      "reinforcement learning",
      "algorithms"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Machine Learning (ML) covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, relationship with Artificial Intelligence, how machine learning works, types of machine learning such as supervised, unsupervised and reinforcement learning, data preprocessing, training and testing, important algorithms, model evaluation, real-world applications, advantages, limitations, challenges, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, practical examples, flowcharts, ML diagrams, charts, and relevant images on every slide.",
    "template": "dark",
    "slideCount": 10,
    "audience": "Students & Engineers"
  },
  {
    "id": "data_science_master",
    "category": "tech",
    "icon": "📊",
    "title": "Data Science",
    "desc": "Lifecycle, EDA, Python libraries (Pandas/NumPy/ML), applications & career",
    "keywords": [
      "data science",
      "data analytics",
      "eda",
      "pandas",
      "numpy",
      "statistics"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Data Science covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, importance, complete data science lifecycle, data collection, data cleaning and preprocessing, exploratory data analysis (EDA), data visualization, statistics, machine learning, deep learning, popular Python libraries such as NumPy, Pandas, Matplotlib, Seaborn and Scikit-learn, real-world applications, advantages, challenges, career opportunities, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, practical examples, relevant diagrams/charts, and a clear flow suitable for students and beginners. Keep the presentation modern, concise, informative, and easy to understand.",
    "template": "education",
    "slideCount": 10,
    "audience": "Students & Beginners"
  },
  {
    "id": "iot",
    "category": "tech",
    "icon": "🌐",
    "title": "Internet of Things (IoT)",
    "desc": "Sensors, smart homes, smart cities, protocols & security",
    "keywords": [
      "internet of things",
      "iot",
      "smart home",
      "sensors",
      "actuators",
      "embedded"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Internet of Things (IoT) covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, basic architecture, sensors and actuators, connectivity, IoT devices, cloud integration, communication protocols, how IoT works, smart home, smart city, healthcare, agriculture and industrial applications, advantages, challenges, security issues, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, real-world examples, architecture diagrams, device illustrations, and relevant IoT images on every slide.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Tech Students & IT Professionals"
  },
  {
    "id": "blockchain",
    "category": "tech",
    "icon": "🔗",
    "title": "Blockchain Technology",
    "desc": "Distributed ledger, smart contracts, consensus & crypto",
    "keywords": [
      "blockchain",
      "crypto",
      "cryptocurrency",
      "smart contracts",
      "distributed ledger",
      "bitcoin"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Blockchain Technology covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, history, basic structure, blocks and transactions, distributed ledger, hashing, consensus mechanisms, cryptocurrency, smart contracts, blockchain types, real-world applications, advantages, limitations, security, challenges, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, blockchain diagrams, transaction flowcharts, network illustrations, and relevant images on every slide.",
    "template": "finance",
    "slideCount": 9,
    "audience": "Tech & Financial Analysts"
  },
  {
    "id": "web_development",
    "category": "tech",
    "icon": "💻",
    "title": "Web Development",
    "desc": "Frontend, backend, HTML/CSS/JS, frameworks & web deployment",
    "keywords": [
      "web development",
      "web dev",
      "frontend",
      "backend",
      "html",
      "css",
      "javascript",
      "react"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Web Development covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, how websites work, frontend development, backend development, databases, HTML, CSS, JavaScript, popular frameworks, APIs, server-side programming, responsive design, web security, deployment, real-world applications, career opportunities, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, practical examples, website architecture diagrams, coding-related visuals, and relevant images on every slide.",
    "template": "startup",
    "slideCount": 10,
    "audience": "Students & Web Developers"
  },
  {
    "id": "dbms",
    "category": "tech",
    "icon": "🗄️",
    "title": "Database Management System (DBMS)",
    "desc": "SQL, Relational/NoSQL, normalization, ER diagrams & security",
    "keywords": [
      "database",
      "dbms",
      "sql",
      "nosql",
      "relational database",
      "er diagram",
      "normalization"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Database Management System (DBMS) covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, need for databases, database types, relational and non-relational databases, tables, records and fields, keys, SQL, normalization, relationships, transactions, database security, popular DBMS technologies, real-world applications, advantages, limitations, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, database diagrams, ER diagrams, SQL examples, and relevant images on every slide.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Computer Science Students"
  },
  {
    "id": "software_engineering",
    "category": "tech",
    "icon": "🛠️",
    "title": "Software Engineering",
    "desc": "SDLC, Agile vs Waterfall, testing, DevOps & project management",
    "keywords": [
      "software engineering",
      "sdlc",
      "agile",
      "waterfall",
      "software testing",
      "devops"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Software Engineering covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, importance, software development life cycle, requirement analysis, system design, development, testing, deployment, maintenance, Agile methodology, Waterfall model, DevOps, software testing, project management, quality assurance, real-world examples, challenges, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, SDLC flowcharts, methodology diagrams, development-related images, and practical examples on every slide.",
    "template": "corporate",
    "slideCount": 10,
    "audience": "Software Engineers & CS Students"
  },
  {
    "id": "computer_networks",
    "category": "tech",
    "icon": "📡",
    "title": "Computer Networks",
    "desc": "OSI model, TCP/IP, LAN/WAN, IP addressing & network security",
    "keywords": [
      "computer networks",
      "networking",
      "osi model",
      "tcp/ip",
      "lan",
      "wan",
      "router"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Computer Networks covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, importance, types of networks such as LAN, MAN and WAN, network topologies, networking devices, OSI model, TCP/IP model, IP addresses, routing, protocols, wireless networks, network security, real-world applications, advantages, challenges, and future technologies. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, network diagrams, topology illustrations, protocol flowcharts, and relevant images on every slide.",
    "template": "dark",
    "slideCount": 9,
    "audience": "IT Students & Network Engineers"
  },
  {
    "id": "generative_ai",
    "category": "tech",
    "icon": "✨",
    "title": "Generative AI",
    "desc": "LLMs, prompt engineering, text/image/video generation & ethics",
    "keywords": [
      "generative ai",
      "genai",
      "llm",
      "large language models",
      "chatgpt",
      "midjourney",
      "prompt engineering"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Generative Artificial Intelligence (Generative AI) covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, how it works, Large Language Models (LLMs), Generative AI models, text generation, image generation, audio and video generation, popular applications, prompt engineering, real-world use cases, advantages, limitations, ethical concerns, copyright and privacy issues, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, AI-generated visual concepts, diagrams, examples, and relevant images on every slide.",
    "template": "dark",
    "slideCount": 10,
    "audience": "Tech Enthusiasts & Creators"
  },
  {
    "id": "robotics",
    "category": "tech",
    "icon": "🤖",
    "title": "Robotics",
    "desc": "Sensors, actuators, humanoid & industrial robots, AI in robotics",
    "keywords": [
      "robotics",
      "robot",
      "humanoid",
      "automation",
      "sensors",
      "actuators"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Robotics covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, history, components of robots, sensors, actuators, controllers, types of robots, industrial robots, humanoid robots, autonomous robots, AI in robotics, applications in healthcare, manufacturing, agriculture and space exploration, advantages, limitations, challenges, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, robot diagrams, real-world examples, and relevant robotics images on every slide.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Engineering Students"
  },
  {
    "id": "ar_vr",
    "category": "tech",
    "icon": "🥽",
    "title": "Virtual Reality & Augmented Reality (VR/AR)",
    "desc": "VR headsets, AR applications, mixed reality & gaming/medical uses",
    "keywords": [
      "virtual reality",
      "augmented reality",
      "vr",
      "ar",
      "mixed reality",
      "metaverse"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Virtual Reality (VR) and Augmented Reality (AR) covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, their definitions, differences, how they work, hardware and software components, VR headsets, AR applications, mixed reality, applications in gaming, education, healthcare, engineering, tourism and entertainment, advantages, limitations, challenges, and future scope. Use immersive visuals, comparison diagrams, practical examples, and relevant VR/AR images on every slide.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Tech Students & Designers"
  },
  {
    "id": "devops",
    "category": "tech",
    "icon": "♾️",
    "title": "DevOps & CI/CD",
    "desc": "CI/CD pipelines, Docker, Kubernetes, automation & cloud",
    "keywords": [
      "devops",
      "ci/cd",
      "docker",
      "kubernetes",
      "automation",
      "jenkins"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on DevOps covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, importance, relationship between development and operations, DevOps lifecycle, Continuous Integration and Continuous Deployment (CI/CD), version control, automation, monitoring, containerization, Docker, Kubernetes, cloud integration, advantages, challenges, real-world applications, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, workflow diagrams, pipeline illustrations, and relevant DevOps images on every slide.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "DevOps Engineers & CS Students"
  },
  {
    "id": "big_data",
    "category": "tech",
    "icon": "📊",
    "title": "Big Data & Analytics",
    "desc": "5 Vs of Big Data, Hadoop, Spark, analytics & storage",
    "keywords": [
      "big data",
      "hadoop",
      "spark",
      "5 vs",
      "data analytics",
      "data warehouse"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Big Data covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, characteristics of Big Data, the 5 Vs, data sources, structured and unstructured data, data processing, Hadoop, Spark, data storage, analytics, real-world applications in business, healthcare, finance and social media, advantages, challenges, security concerns, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, architecture diagrams, charts, data visualizations, and relevant Big Data images on every slide.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Data Engineers & Analysts"
  },
  {
    "id": "mobile_dev",
    "category": "tech",
    "icon": "📱",
    "title": "Mobile Application Development",
    "desc": "Android, iOS, Flutter/React Native, UI/UX & app deployment",
    "keywords": [
      "mobile app",
      "android",
      "ios",
      "flutter",
      "react native",
      "app development"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Mobile Application Development covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, Android and iOS platforms, native and cross-platform development, UI/UX design, mobile programming languages, popular frameworks, APIs, databases, authentication, mobile security, app testing, deployment to app stores, real-world applications, challenges, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, app-development diagrams, smartphone visuals, interface examples, and relevant images on every slide.",
    "template": "startup",
    "slideCount": 9,
    "audience": "App Developers & Students"
  },
  {
    "id": "nlp",
    "category": "tech",
    "icon": "🗣️",
    "title": "Natural Language Processing (NLP)",
    "desc": "Tokenization, sentiment analysis, chatbots & LLM text processing",
    "keywords": [
      "natural language processing",
      "nlp",
      "tokenization",
      "sentiment analysis",
      "chatbots",
      "text processing"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Natural Language Processing (NLP) covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, relationship with Artificial Intelligence and Machine Learning, how NLP works, text preprocessing, tokenization, stemming, lemmatization, sentiment analysis, text classification, chatbots, speech recognition, machine translation, Large Language Models, real-world applications, challenges, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, NLP flowcharts, chatbot illustrations, examples, and relevant images on every slide.",
    "template": "dark",
    "slideCount": 9,
    "audience": "AI & Data Science Students"
  },
  {
    "id": "future_of_technology",
    "category": "tech",
    "icon": "🚀",
    "title": "Future of Technology",
    "desc": "AI, Quantum, Biotech, IoT, XR & societal transformations",
    "keywords": [
      "future of technology",
      "emerging technology",
      "biotech",
      "future tech",
      "automation"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on the Future of Technology covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, emerging technologies such as Artificial Intelligence, Robotics, Quantum Computing, Biotechnology, Internet of Things, Space Technology, Renewable Energy, Brain-Computer Interfaces and Extended Reality. Explain how these technologies may transform education, healthcare, transportation, business, communication and everyday life, along with their benefits, risks, ethical concerns, challenges, and possible future scenarios. Use futuristic visuals, diagrams, timelines, and relevant images on every slide.",
    "template": "dark",
    "slideCount": 10,
    "audience": "General & Tech Audience"
  },
  {
    "id": "electric_vehicles",
    "category": "tech",
    "icon": "⚡",
    "title": "Electric Vehicles (EVs)",
    "desc": "EV technology, lithium-ion batteries, charging infrastructure & adoption",
    "keywords": [
      "electric vehicles",
      "ev",
      "electric cars",
      "lithium battery",
      "charging station",
      "tesla"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Electric Vehicles (EVs) covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, what electric vehicles are, how they work, types of EVs, batteries, electric motors, charging infrastructure, EVs versus petrol and diesel vehicles, environmental impact, advantages and limitations, EV adoption in India, government initiatives, battery recycling, challenges, and the future of electric transportation. Use vehicle images, battery diagrams, comparison charts, charging-station visuals, and relevant images on every slide.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Auto & Tech Enthusiasts"
  },
  {
    "id": "future_transportation",
    "category": "tech",
    "icon": "🛩️",
    "title": "The Future of Human Transportation",
    "desc": "Hyperloop, flying taxis, autonomous cars, high-speed rail & space transit",
    "keywords": [
      "future transportation",
      "hyperloop",
      "flying taxis",
      "autonomous vehicles",
      "bullet train"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on The Future of Human Transportation covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, electric vehicles, autonomous cars, high-speed rail, hyperloop concepts, flying taxis, drones, smart public transport, sustainable aviation, space transportation, artificial intelligence in transportation, safety, infrastructure, environmental impact, challenges, and possible transportation systems of the future. Use futuristic vehicles, transport diagrams, city illustrations, comparison charts, and relevant images on every slide.",
    "template": "startup",
    "slideCount": 10,
    "audience": "Engineers & Transport Planners"
  },
  {
    "id": "space_exploration",
    "category": "science",
    "icon": "🚀",
    "title": "Space Exploration",
    "desc": "NASA/ISRO missions, rockets, Moon/Mars exploration & satellites",
    "keywords": [
      "space exploration",
      "space",
      "nasa",
      "isro",
      "rockets",
      "mars",
      "moon",
      "astronauts"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Space Exploration covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the history of space exploration, important space missions, rockets and spacecraft, satellites, astronauts, the Moon and Mars missions, space stations, contributions of major space agencies, benefits of space research, challenges faced in space exploration, recent developments, and the future of human exploration beyond Earth. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, space diagrams, mission timelines, astronomical visuals, and high-quality space images on every slide.",
    "template": "education",
    "slideCount": 10,
    "audience": "Science Students & Astronomy Enthusiasts"
  },
  {
    "id": "black_holes",
    "category": "science",
    "icon": "🕳️",
    "title": "Black Holes",
    "desc": "Event horizon, singularity, relativity & supermassive black holes",
    "keywords": [
      "black hole",
      "black holes",
      "singularity",
      "event horizon",
      "astrophysics",
      "einstein"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Black Holes covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, their definition, formation, types of black holes, gravity and event horizon, singularity, accretion disks, how black holes are detected, supermassive black holes, famous observations, relationship with Einstein's theory of relativity, mysteries surrounding black holes, and current scientific research. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, space illustrations, diagrams, and relevant astronomical images on every slide.",
    "template": "dark",
    "slideCount": 8,
    "audience": "Physics & Astronomy Students"
  },
  {
    "id": "quantum_physics",
    "category": "science",
    "icon": "⚛️",
    "title": "Quantum Computing",
    "desc": "Qubits, superposition, entanglement & quantum algorithms",
    "keywords": [
      "quantum",
      "quantum computing",
      "qubit",
      "superposition",
      "entanglement"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Quantum Computing covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, difference between classical and quantum computers, qubits, superposition, entanglement, quantum gates, quantum algorithms, quantum cryptography, applications, current challenges, advantages and limitations, major developments, and future scope. Explain complex concepts in simple language using diagrams, illustrations, examples, and relevant quantum computing images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Computer Science & Physics Students"
  },
  {
    "id": "human_brain",
    "category": "science",
    "icon": "🧠",
    "title": "Human Brain & Nervous System",
    "desc": "Neurons, memory, emotions, neurological health & brain-computer interfaces",
    "keywords": [
      "human brain",
      "brain",
      "neuroscience",
      "neurons",
      "nervous system",
      "memory"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on the Human Brain covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its structure, major parts, functions, neurons, nervous system, memory, learning, emotions, decision-making, brain-computer interaction, common neurological disorders, lifestyle factors affecting brain health, scientific discoveries, and future research. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, labeled diagrams, brain illustrations, and relevant scientific images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Biology & Medical Students"
  },
  {
    "id": "human_evolution",
    "category": "science",
    "icon": "🦴",
    "title": "Human Evolution",
    "desc": "Early hominids, Homo sapiens, tools, language & civilization",
    "keywords": [
      "human evolution",
      "evolution",
      "homo sapiens",
      "archaeology",
      "anthropology"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Human Evolution covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the concept of evolution, early human ancestors, major stages of human evolution, Australopithecus, Homo habilis, Homo erectus, Neanderthals and Homo sapiens, migration of early humans, development of tools and language, agriculture and civilization, archaeological evidence, and modern scientific understanding. Use timelines, evolutionary diagrams, maps, archaeological illustrations, and relevant images on every slide.",
    "template": "education",
    "slideCount": 8,
    "audience": "Students & Science Enthusiasts"
  },
  {
    "id": "isro_space_programme",
    "category": "science",
    "icon": "🛸",
    "title": "Indian Space Programme (ISRO)",
    "desc": "Chandrayaan, Mangalyaan, Gaganyaan, Aditya-L1 & ISRO achievements",
    "keywords": [
      "isro",
      "indian space programme",
      "chandrayaan",
      "mangalyaan",
      "gaganyaan",
      "satellites"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on the Indian Space Programme covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its history, establishment of ISRO, early satellite and launch vehicle programmes, major achievements, Chandrayaan missions, Mangalyaan, Aditya-L1, Gaganyaan, satellite technology, communication and navigation satellites, applications in agriculture and disaster management, India's international collaborations, challenges, and future space missions. Use mission timelines, spacecraft diagrams, rocket images, maps, and relevant space visuals on every slide.",
    "template": "education",
    "slideCount": 10,
    "audience": "Science Students & Citizens"
  },
  {
    "id": "psychology_human_behavior",
    "category": "science",
    "icon": "🧠",
    "title": "Psychology of Human Behavior",
    "desc": "Personality, motivation, emotions, cognitive biases & decision-making",
    "keywords": [
      "psychology",
      "human behavior",
      "personality",
      "cognitive bias",
      "emotions"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Psychology of Human Behavior covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, what psychology studies, factors influencing human behavior, personality, emotions, motivation, learning, memory, social behavior, decision-making, cognitive biases, nature versus nurture, behavioral experiments, everyday applications of psychology, and the importance of understanding human behavior. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, psychological diagrams, examples, illustrations, and relevant images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Psychology Students & Curious Minds"
  },
  {
    "id": "nuclear_energy",
    "category": "science",
    "icon": "⚛️",
    "title": "Nuclear Energy",
    "desc": "Fission, fusion, nuclear reactors, radiation safety & power generation",
    "keywords": [
      "nuclear energy",
      "nuclear power",
      "nuclear reactor",
      "fission",
      "fusion",
      "radiation"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Nuclear Energy covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, atomic energy, nuclear fission, nuclear fusion, how nuclear reactors work, major reactor components, nuclear power generation, peaceful applications of nuclear technology, nuclear medicine, agriculture and industry, advantages, radiation safety, radioactive waste, major challenges, nuclear energy in India, and future possibilities. Use scientifically accurate diagrams, reactor illustrations, energy comparisons, and relevant images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Physics & Energy Engineers"
  },
  {
    "id": "secrets_human_body",
    "category": "science",
    "icon": "🫀",
    "title": "Secrets of the Human Body",
    "desc": "Organs, immunity, sleep, healing mechanisms & anatomical discoveries",
    "keywords": [
      "human body",
      "anatomy",
      "immune system",
      "healing",
      "human organs",
      "biology"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Secrets of the Human Body covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the major organs, nervous system, immune system, human senses, heartbeat and blood circulation, digestion, hormones, sleep, memory, healing mechanisms, fascinating facts about the human body, and recent scientific discoveries. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, anatomical diagrams, scientific illustrations, interesting facts, and relevant images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Medical Students & Science Curious"
  },
  {
    "id": "time_travel",
    "category": "science",
    "icon": "⏳",
    "title": "Time Travel: Science or Fiction?",
    "desc": "Relativity, time dilation, wormholes, paradoxes & physics limits",
    "keywords": [
      "time travel",
      "time dilation",
      "wormhole",
      "einstein",
      "relativity",
      "grandfather paradox"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Time Travel: Science or Fiction? covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the concept of time, Einstein's theory of relativity, time dilation, space-time, wormholes, black holes, theoretical possibilities of traveling into the future or past, famous scientific theories, paradoxes such as the grandfather paradox, popular science-fiction examples, current scientific limitations, and whether time travel could ever become possible. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, scientific diagrams, timelines, and futuristic visuals on every slide.",
    "template": "dark",
    "slideCount": 8,
    "audience": "Physics Students & Sci-Fi Fans"
  },
  {
    "id": "life_beyond_earth",
    "category": "science",
    "icon": "👽",
    "title": "Life Beyond Earth",
    "desc": "Exoplanets, SETI, extremophiles, Mars missions & alien biosignatures",
    "keywords": [
      "life beyond earth",
      "extraterrestrial life",
      "aliens",
      "exoplanets",
      "seti",
      "drake equation"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Life Beyond Earth covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the conditions required for life, the search for extraterrestrial life, habitable zones, Mars, Europa, Enceladus, exoplanets, biosignatures, SETI, space missions searching for life, extremophiles on Earth, the Drake Equation, scientific evidence and unanswered questions, and the future search for extraterrestrial life. Use space photographs, planet comparisons, scientific diagrams, mission visuals, and relevant images on every slide.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Astronomy Enthusiasts & Students"
  },
  {
    "id": "volcanoes",
    "category": "science",
    "icon": "🌋",
    "title": "Volcanoes & Earth Science",
    "desc": "Magma, lava, tectonic plates, eruptions & volcanic forecasting",
    "keywords": [
      "volcano",
      "volcanoes",
      "lava",
      "magma",
      "tectonic plates",
      "geology"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Volcanoes covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, what volcanoes are, Earth's internal structure, how magma forms, types of volcanoes, volcanic eruptions, lava and ash, famous volcanoes, volcanic hazards, effects on humans and the environment, benefits of volcanic activity, prediction and monitoring techniques, disaster preparedness, and major volcanic events in history. Use cross-section diagrams, eruption photographs, maps, timelines, and relevant scientific images on every slide.",
    "template": "education",
    "slideCount": 8,
    "audience": "Geology Students & Earth Scientists"
  },
  {
    "id": "earthquakes",
    "category": "science",
    "icon": "🌩️",
    "title": "Earthquakes & Seismology",
    "desc": "Tectonic faults, seismic waves, Richter scale & earthquake-resistant design",
    "keywords": [
      "earthquake",
      "earthquakes",
      "seismology",
      "fault line",
      "richter scale",
      "tsunami"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Earthquakes covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the structure of Earth, tectonic plates, causes of earthquakes, faults and seismic waves, magnitude and intensity, earthquake measurement, major historical earthquakes, effects on buildings and communities, earthquake-resistant construction, early warning systems, disaster preparedness, and future challenges. Use tectonic maps, seismic diagrams, building illustrations, statistics, and relevant images on every slide.",
    "template": "education",
    "slideCount": 8,
    "audience": "Civil Engineers & Geologists"
  },
  {
    "id": "mystery_of_dreams",
    "category": "science",
    "icon": "🌙",
    "title": "The Mystery of Dreams",
    "desc": "REM sleep, lucid dreaming, memory consolidation & dream psychology",
    "keywords": [
      "dreams",
      "rem sleep",
      "lucid dreaming",
      "nightmares",
      "sleep psychology"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on The Mystery of Dreams covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, what dreams are, stages of sleep, REM sleep, why humans dream, major scientific theories, memory and dreams, lucid dreaming, nightmares, recurring dreams, the relationship between dreams and emotions, famous experiments, what science can and cannot explain about dreams, and current research. Use sleep-cycle diagrams, brain illustrations, dream-related visuals, scientific findings, and relevant images on every slide.",
    "template": "dark",
    "slideCount": 8,
    "audience": "Curious Learners & Psychology Students"
  },
  {
    "id": "why_do_we_age",
    "category": "science",
    "icon": "⏳",
    "title": "Why Do Humans Age?",
    "desc": "Telomeres, DNA repair, oxidative stress & anti-aging research",
    "keywords": [
      "aging",
      "longevity",
      "telomeres",
      "anti aging",
      "dna repair",
      "biological clock"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Why Humans Age covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the biological process of aging, cells and DNA, telomeres, oxidative stress, genetics, cellular repair, changes in muscles and organs, theories of aging, lifestyle factors, healthy aging, modern anti-aging research, biotechnology, ethical questions, and the future of longevity research. Use simple scientific explanations, biological diagrams, timelines, microscopic illustrations, and relevant images on every slide.",
    "template": "education",
    "slideCount": 8,
    "audience": "Medical & Biology Students"
  },
  {
    "id": "science_of_happiness",
    "category": "science",
    "icon": "😊",
    "title": "The Science of Happiness",
    "desc": "Serotonin, positive psychology, brain chemistry & well-being habits",
    "keywords": [
      "science of happiness",
      "happiness",
      "dopamine",
      "serotonin",
      "positive psychology",
      "wellbeing"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on The Science of Happiness covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the meaning of happiness, brain chemistry, dopamine and serotonin, emotions, psychology of well-being, relationships, habits, sleep, exercise, social connections, effects of money and success, positive psychology, scientific studies on happiness, common misconceptions, and practical factors associated with a healthy and fulfilling life. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, brain diagrams, research-based charts, illustrations, and relevant images on every slide.",
    "template": "minimal",
    "slideCount": 8,
    "audience": "Wellness & Psychology Audience"
  },
  {
    "id": "why_do_we_need_sleep",
    "category": "science",
    "icon": "😴",
    "title": "The Science of Sleep",
    "desc": "Sleep cycles, memory consolidation, hormones & sleep deprivation effects",
    "keywords": [
      "sleep science",
      "why sleep",
      "sleep cycle",
      "rem sleep",
      "insomnia",
      "brain repair"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on The Science of Sleep covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, why humans sleep, sleep cycles, REM and non-REM sleep, the role of the brain, memory consolidation, hormones, dreams, effects of sleep deprivation, sleep disorders, factors affecting sleep quality, importance of healthy sleep, scientific research, and future developments in sleep science. Use sleep-cycle diagrams, brain illustrations, charts, scientific facts, and relevant images on every slide.",
    "template": "education",
    "slideCount": 8,
    "audience": "Health & Science Students"
  },
  {
    "id": "human_survival_extreme",
    "category": "science",
    "icon": "🧗",
    "title": "Human Survival in Extreme Environments",
    "desc": "Deserts, polar zones, mountains & space survival physiology",
    "keywords": [
      "human survival",
      "extreme environments",
      "polar survival",
      "mountaineering",
      "space survival"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Human Survival in Extreme Environments covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, survival in deserts, polar regions, high mountains, deep oceans and space, how the human body responds to extreme temperature and pressure, survival technologies, protective equipment, food and water challenges, famous expeditions, scientific research, emergency preparedness, and the limits of human survival. Use maps, human-body diagrams, expedition photographs, survival equipment visuals, and relevant images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Explorers & Biology Students"
  },
  {
    "id": "power_of_human_mind",
    "category": "science",
    "icon": "🌌",
    "title": "The Power of the Human Mind",
    "desc": "Neuroplasticity, concentration, subconscious, creativity & cognitive potential",
    "keywords": [
      "human mind",
      "neuroplasticity",
      "subconscious mind",
      "creativity",
      "cognitive power"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on The Power of the Human Mind covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, perception, memory, learning, imagination, creativity, emotions, decision-making, problem-solving, concentration, subconscious processes, cognitive biases, neuroplasticity, extraordinary abilities of the brain, factors that influence thinking, and current neuroscience research. Use brain illustrations, psychological experiments, diagrams, examples, and relevant scientific images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Psychology & Mind Enthusiasts"
  },
  {
    "id": "why_do_humans_laugh",
    "category": "science",
    "icon": "😂",
    "title": "Why Do Humans Laugh?",
    "desc": "Psychology of humor, contagious laughter, stress reduction & brain mechanisms",
    "keywords": [
      "why we laugh",
      "laughter",
      "humor psychology",
      "gelotology",
      "stress relief"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Why Humans Laugh covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the science and psychology of laughter, how the brain produces laughter, different theories of humor, emotional and social functions of laughter, contagious laughter, laughter and stress, laughter in different cultures, the role of laughter in relationships, scientific research, unusual facts, and what laughter reveals about human behavior. Use brain diagrams, psychological illustrations, interesting examples, research findings, and relevant images on every slide.",
    "template": "education",
    "slideCount": 8,
    "audience": "Psychology Students & Curious Minds"
  },
  {
    "id": "science_of_fear",
    "category": "science",
    "icon": "😱",
    "title": "The Science of Fear",
    "desc": "Amygdala, fight-or-flight response, phobias & danger detection",
    "keywords": [
      "science of fear",
      "fear",
      "amygdala",
      "fight or flight",
      "phobias",
      "anxiety"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on The Science of Fear covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, what fear is, how the brain detects danger, the amygdala, fight-or-flight response, hormones involved in fear, different types of fear, learned and instinctive fears, phobias, fear and decision-making, fear in animals, benefits of fear for survival, managing fear, and current scientific research. Use brain diagrams, physiological illustrations, examples, charts, and relevant images on every slide.",
    "template": "education",
    "slideCount": 8,
    "audience": "Biology & Psychology Students"
  },
  {
    "id": "secrets_of_universe",
    "category": "science",
    "icon": "🌌",
    "title": "Secrets of the Universe",
    "desc": "Big Bang, dark matter, dark energy, cosmic expansion & antimatter",
    "keywords": [
      "secrets of universe",
      "big bang",
      "dark matter",
      "dark energy",
      "cosmology",
      "galaxies"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Secrets of the Universe covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the origin of the universe, Big Bang theory, galaxies, stars, planets, dark matter, dark energy, black holes, cosmic expansion, antimatter, gravitational waves, the possibility of extraterrestrial life, major discoveries, unanswered questions, and the future of astronomy. Use stunning astronomical visuals, scientific diagrams, timelines, space photographs, and relevant images on every slide.",
    "template": "dark",
    "slideCount": 10,
    "audience": "Physics & Astronomy Enthusiasts"
  },
  {
    "id": "mysteries_human_senses",
    "category": "science",
    "icon": "👁️",
    "title": "Mysteries of the Human Senses",
    "desc": "Vision, hearing, smell, taste, touch, optical illusions & sensory perception",
    "keywords": [
      "human senses",
      "optical illusions",
      "sensory perception",
      "vision",
      "hearing",
      "smell"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Mysteries of the Human Senses covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, vision, hearing, smell, taste, touch, how sensory organs work, how the brain interprets sensory information, optical illusions, sensory adaptation, unusual human sensory abilities, differences between humans and animals, sensory disorders, scientific discoveries, and future research. Use anatomical diagrams, optical illusions, brain illustrations, experiments, and relevant images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Biology Students & Science Enthusiasts"
  },
  {
    "id": "indian_freedom_movement",
    "category": "society",
    "icon": "🕊️",
    "title": "Indian Freedom Movement",
    "desc": "Non-Cooperation, Quit India, freedom fighters & 1947 independence",
    "keywords": [
      "indian freedom movement",
      "freedom fighters",
      "gandhi",
      "independence",
      "history of india"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on the Indian Freedom Movement covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the background of British rule, major events, important movements, prominent freedom fighters, the Non-Cooperation Movement, Civil Disobedience Movement, Quit India Movement, revolutionary activities, role of women, contribution of different regions and communities, independence in 1947, major challenges, and its historical significance. Use a clear timeline, historical photographs, maps, portraits, and relevant images on every slide.",
    "template": "education",
    "slideCount": 10,
    "audience": "History Students & General Audience"
  },
  {
    "id": "indian_constitution",
    "category": "society",
    "icon": "📜",
    "title": "Constitution of India",
    "desc": "Preamble, Fundamental Rights, Parliament & federal structure",
    "keywords": [
      "constitution of india",
      "indian constitution",
      "preamble",
      "fundamental rights",
      "dr ambedkar",
      "polity"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on the Constitution of India covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its historical background, Constituent Assembly, making of the Constitution, Preamble, Fundamental Rights, Fundamental Duties, Directive Principles, Union and State governments, Parliament, judiciary, federal structure, constitutional amendments, importance of the Constitution, and its role in Indian democracy. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, constitutional diagrams, timelines, and relevant historical images on every slide.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Polity Students & Citizens"
  },
  {
    "id": "indian_defence_system",
    "category": "society",
    "icon": "⚔️",
    "title": "Indian Defence System",
    "desc": "Army, Navy, Air Force, military technology & modern warfare",
    "keywords": [
      "indian defence",
      "indian army",
      "navy",
      "air force",
      "defence system",
      "drdo"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on the Indian Defence System covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the Indian Army, Navy and Air Force, their roles and responsibilities, defence organization, modern military technology, border security, disaster relief operations, defence research, major achievements, training and discipline, cybersecurity and modern warfare, challenges, and future modernization. Use informative diagrams, maps, equipment images, and relevant defence visuals on every slide.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Defence Aspirants & Students"
  },
  {
    "id": "indian_culture",
    "category": "society",
    "icon": "🛕",
    "title": "Indian Culture & Heritage",
    "desc": "Diversity, languages, monuments, classical art, music & UNESCO sites",
    "keywords": [
      "indian culture",
      "heritage",
      "monuments",
      "unesco",
      "indian art",
      "traditions"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Indian Culture and Heritage covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, India's cultural diversity, languages, religions, traditions, festivals, classical dances, music, art, architecture, food, traditional clothing, historical monuments, UNESCO heritage sites, regional cultures, cultural preservation, and the importance of Indian heritage in the modern world. Use maps, historical photographs, cultural illustrations, monuments, traditional art, and relevant images on every slide.",
    "template": "education",
    "slideCount": 10,
    "audience": "Students & Tourists"
  },
  {
    "id": "indian_agriculture",
    "category": "society",
    "icon": "🌾",
    "title": "Agriculture in India",
    "desc": "Crops, Green Revolution, modern agri-tech, organic farming & food security",
    "keywords": [
      "agriculture",
      "farming",
      "indian agriculture",
      "green revolution",
      "crops",
      "farmers"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Agriculture in India covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the importance of agriculture, major crops, agricultural regions, farming methods, irrigation, monsoon dependency, Green Revolution, modern agricultural technology, organic farming, agricultural markets, challenges faced by farmers, climate change impacts, government initiatives, food security, and the future of Indian agriculture. Use maps, crop images, charts, farming photographs, and informative diagrams on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Students & Agri-Specialists"
  },
  {
    "id": "disaster_management",
    "category": "society",
    "icon": "🚨",
    "title": "Disaster Management",
    "desc": "Natural & man-made disasters, emergency preparedness, NDMA & rescue",
    "keywords": [
      "disaster management",
      "earthquake",
      "flood",
      "cyclone",
      "emergency preparedness"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Disaster Management covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the meaning and types of disasters, natural and man-made disasters, earthquakes, floods, cyclones, landslides, fires and industrial accidents, disaster preparedness, risk assessment, emergency response, rescue operations, rehabilitation, role of government and communities, early warning systems, technology in disaster management, and disaster prevention strategies. Use maps, disaster diagrams, emergency-response flowcharts, and relevant images on every slide.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Students & Safety Officers"
  },
  {
    "id": "indian_festivals",
    "category": "society",
    "icon": "🪔",
    "title": "Indian Festivals",
    "desc": "Diwali, Holi, Eid, Christmas, Onam, cultural traditions & economic impact",
    "keywords": [
      "indian festivals",
      "diwali",
      "holi",
      "eid",
      "christmas",
      "durga puja",
      "traditions"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Indian Festivals covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the diversity of festivals across India, their historical and cultural significance, major festivals such as Diwali, Holi, Eid, Christmas, Pongal, Onam, Baisakhi, Ganesh Chaturthi and Durga Puja, regional traditions, food, music, clothing, social importance, economic impact, environmental concerns, and changing festival traditions in modern India. Use authentic cultural photographs, maps, festival illustrations, and relevant images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Cultural Enthusiasts & Students"
  },
  {
    "id": "ancient_indian_science",
    "category": "society",
    "icon": "🏛️",
    "title": "Ancient Indian Science & Technology",
    "desc": "Mathematics, astronomy, Ayurveda, metallurgy & ancient scholars",
    "keywords": [
      "ancient indian science",
      "ayurveda",
      "aryabhata",
      "sushruta",
      "ancient mathematics",
      "metallurgy"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Ancient Indian Science and Technology covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, mathematics, astronomy, medicine, metallurgy, architecture, water management, agriculture, ancient universities, important scholars, major scientific contributions, archaeological evidence, and the influence of ancient Indian knowledge on later scientific development. Clearly distinguish historically established evidence from traditional claims, and use timelines, manuscripts, monuments, scientific diagrams, and relevant historical images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "History & Science Students"
  },
  {
    "id": "human_rights",
    "category": "society",
    "icon": "⚖️",
    "title": "Human Rights",
    "desc": "Universal Declaration, fundamental freedoms, equality & legal protections",
    "keywords": [
      "human rights",
      "udhr",
      "equality",
      "civil rights",
      "freedom",
      "human rights commission"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Human Rights covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the meaning and importance of human rights, fundamental principles, Universal Declaration of Human Rights, civil and political rights, social and economic rights, children's rights, women's rights, freedom and equality, constitutional protections in India, responsibilities of citizens, major challenges, and the role of national and international institutions. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, historical timelines, infographics, symbols, and relevant images on every slide.",
    "template": "corporate",
    "slideCount": 8,
    "audience": "Law Students & Citizens"
  },
  {
    "id": "psychology_social_media",
    "category": "society",
    "icon": "📲",
    "title": "Psychology of Social Media",
    "desc": "Dopamine loops, FOMO, echo chambers & healthy digital habits",
    "keywords": [
      "psychology of social media",
      "social media",
      "dopamine",
      "fomo",
      "screen addiction",
      "digital wellness"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on The Psychology of Social Media covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, why people use social media, dopamine and reward systems, likes and notifications, attention and algorithms, social comparison, FOMO, online identity, influencer culture, echo chambers, misinformation, benefits and risks, effects on relationships and productivity, and strategies for healthy digital habits. Use simple psychological concepts, diagrams, examples, charts, and relevant images on every slide.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Youth, Parents & Educators"
  },
  {
    "id": "food_human_civilization",
    "category": "society",
    "icon": "🍲",
    "title": "Food & Human Civilization",
    "desc": "Spice trade, agricultural evolution, industrial food & culinary culture",
    "keywords": [
      "food history",
      "food civilization",
      "spice trade",
      "agriculture evolution",
      "gastronomy"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Food and Human Civilization covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the origins of cooking, hunter-gatherer diets, development of agriculture, domestication of plants and animals, spices and ancient trade routes, food and culture, evolution of cooking technologies, industrial food production, fast food, nutrition, food security, sustainability, and how food has influenced the development of human societies. Use historical illustrations, maps, food photographs, timelines, and relevant images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "History & Culinary Students"
  },
  {
    "id": "future_human_civilization",
    "category": "society",
    "icon": "🏙️",
    "title": "Future of Human Civilization",
    "desc": "Urbanization, AI, climate resilience, space colonization & human longevity",
    "keywords": [
      "future of human civilization",
      "future cities",
      "longevity",
      "humanity future",
      "future society"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on The Future of Human Civilization covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, population growth, urbanization, artificial intelligence, automation, climate change, renewable energy, biotechnology, space exploration, future cities, changing jobs and education, human longevity, global challenges, ethical questions, possible future scenarios, and the technologies and decisions that may shape humanity's future. Use futuristic city visuals, timelines, infographics, scientific illustrations, and relevant images on every slide.",
    "template": "dark",
    "slideCount": 10,
    "audience": "Futurists & Thinkers"
  },
  {
    "id": "ancient_civilizations",
    "category": "society",
    "icon": "🏛️",
    "title": "Ancient Civilizations",
    "desc": "Mesopotamia, Egypt, Indus Valley, China, Greece & Rome",
    "keywords": [
      "ancient civilizations",
      "indus valley",
      "mesopotamia",
      "egypt",
      "greece",
      "rome",
      "archaeology"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Ancient Civilizations covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the origins of early civilizations, Mesopotamia, Ancient Egypt, Indus Valley Civilization, Ancient China, Greece and Rome, their cities, writing systems, architecture, science, technology, trade, social structures, cultural achievements, decline and transformation, archaeological discoveries, and their influence on modern civilization. Use historical maps, timelines, archaeological photographs, monuments, artifacts, and relevant images on every slide.",
    "template": "education",
    "slideCount": 10,
    "audience": "History Students"
  },
  {
    "id": "great_inventions",
    "category": "society",
    "icon": "💡",
    "title": "Great Inventions That Changed the World",
    "desc": "Wheel, printing press, steam engine, electricity, internet & medical breakthroughs",
    "keywords": [
      "great inventions",
      "inventions",
      "wheel",
      "printing press",
      "internet history",
      "electricity"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Great Inventions That Changed the World covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the wheel, printing press, compass, steam engine, electricity, telephone, automobile, airplane, radio, television, computer, internet, modern medical inventions, and other transformative technologies. Explain how each invention changed human life, communication, transportation, industry and society. Use historical timelines, inventor portraits, invention photographs, diagrams, and relevant images on every slide.",
    "template": "education",
    "slideCount": 10,
    "audience": "History & Tech Students"
  },
  {
    "id": "human_migration",
    "category": "society",
    "icon": "🗺️",
    "title": "Human Migration",
    "desc": "Prehistoric human expansion out of Africa, climate/war migration & modern trends",
    "keywords": [
      "human migration",
      "migration out of africa",
      "refugees",
      "diaspora",
      "demographics"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Human Migration covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, why humans migrate, prehistoric human migration out of Africa, major migration routes, migration caused by climate, war, economy and natural disasters, historical migrations, cultural exchange, effects on societies, migration in the modern world, challenges faced by migrants, and future migration trends. Use world maps, migration-route diagrams, historical timelines, statistics, and relevant images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Geography & History Students"
  },
  {
    "id": "lost_cities",
    "category": "society",
    "icon": "🏛️",
    "title": "Lost Cities of the World",
    "desc": "Mohenjo-daro, Pompeii, Machu Picchu, Petra, Atlantis & archaeological excavations",
    "keywords": [
      "lost cities",
      "pompeii",
      "machu picchu",
      "petra",
      "mohenjo daro",
      "archaeology"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Lost Cities of the World covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the concept of lost cities, ancient civilizations, Mohenjo-daro, Pompeii, Machu Picchu, Petra, Angkor, ancient Egyptian cities, possible causes of abandonment, archaeological discoveries, modern excavation techniques, mysteries surrounding lost cities, and what these discoveries teach us about ancient civilizations. Use archaeological photographs, maps, reconstructions, timelines, artifacts, and relevant images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Archaeology & History Fans"
  },
  {
    "id": "psychology_first_impressions",
    "category": "society",
    "icon": "🤝",
    "title": "The Psychology of First Impressions",
    "desc": "Body language, facial expressions, halo effect & unconscious bias",
    "keywords": [
      "first impressions",
      "body language",
      "psychology",
      "social perception",
      "halo effect"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on The Psychology of First Impressions covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, how people form first impressions, facial expressions, body language, voice, clothing, appearance, confidence, unconscious judgments, confirmation bias, stereotypes, social perception, first impressions in interviews and relationships, whether first impressions can change, scientific experiments, and practical insights. Use psychological diagrams, examples, illustrations, research findings, and relevant images on every slide.",
    "template": "corporate",
    "slideCount": 8,
    "audience": "Students, Job Seekers & Professionals"
  },
  {
    "id": "story_of_human_language",
    "category": "society",
    "icon": "🗣️",
    "title": "The Story of Human Language",
    "desc": "Linguistics, language families, writing scripts & endangered dialects",
    "keywords": [
      "human language",
      "linguistics",
      "etymology",
      "writing systems",
      "dialects"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on The Story of Human Language covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the origin and evolution of language, early communication, development of speech, writing systems, major language families, how languages change, endangered languages, multilingualism, language and culture, sign languages, modern communication, and possible future changes in human language. Use world language maps, historical scripts, timelines, communication illustrations, and relevant images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Linguistics & History Students"
  },
  {
    "id": "climate_change",
    "category": "environment",
    "icon": "🌍",
    "title": "Climate Change & Global Warming",
    "desc": "Greenhouse effect, rising sea levels, mitigation & renewable solutions",
    "keywords": [
      "climate change",
      "global warming",
      "greenhouse effect",
      "environment",
      "glaciers"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Climate Change covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, causes, greenhouse gases, global warming, effects on weather and ecosystems, melting glaciers, rising sea levels, impact on agriculture and human health, climate change in India, renewable energy, mitigation and adaptation strategies, government initiatives, challenges, and future solutions. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, climate charts, maps, diagrams, real-world examples, and relevant environmental images on every slide.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Students & Environmentalists"
  },
  {
    "id": "renewable_energy",
    "category": "environment",
    "icon": "🌿",
    "title": "Renewable Energy & Sustainability",
    "desc": "Solar, wind, battery storage & corporate ESG initiatives",
    "keywords": [
      "renewable energy",
      "sustainability",
      "solar",
      "wind",
      "esg",
      "environment"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Renewable Energy covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, importance, solar energy, wind energy, hydropower, biomass energy, geothermal energy, advantages and disadvantages of each source, applications, energy storage, renewable energy in India, environmental benefits, challenges, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, comparison charts, energy diagrams, real-world examples, and relevant images on every slide.",
    "template": "minimal",
    "slideCount": 8,
    "audience": "Sustainability Committee & Students"
  },
  {
    "id": "water_conservation",
    "category": "environment",
    "icon": "💧",
    "title": "Water Conservation",
    "desc": "Rainwater harvesting, groundwater, watershed management & sustainability",
    "keywords": [
      "water conservation",
      "rainwater harvesting",
      "groundwater",
      "water scarcity",
      "environment"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Water Conservation covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the importance of water, sources of freshwater, water scarcity, groundwater depletion, causes of water wastage, rainwater harvesting, watershed management, efficient irrigation, water recycling, conservation methods at home and in agriculture, India's water challenges, successful conservation examples, and future solutions. Use water-cycle diagrams, maps, statistics, before-and-after visuals, and relevant environmental images on every slide.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Students & Environmentalists"
  },
  {
    "id": "ocean_marine_life",
    "category": "environment",
    "icon": "🌊",
    "title": "Oceans & Marine Life",
    "desc": "Coral reefs, marine biodiversity, ocean zones, plastic pollution & conservation",
    "keywords": [
      "ocean",
      "marine life",
      "coral reefs",
      "sea animals",
      "ocean pollution",
      "marine biology"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Oceans and Marine Life covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the importance of oceans, ocean zones, marine ecosystems, coral reefs, marine biodiversity, fascinating sea animals, food chains, ocean currents, pollution, plastic waste, overfishing, climate change, conservation efforts, protected marine areas, and the future of ocean exploration. Use underwater photographs, ecosystem diagrams, maps, charts, and relevant marine-life images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Biology Students & Ocean Lovers"
  },
  {
    "id": "indian_monsoon",
    "category": "environment",
    "icon": "🌧️",
    "title": "Indian Monsoon",
    "desc": "Southwest/Northeast monsoon, rainfall distribution, El Niño & agriculture",
    "keywords": [
      "indian monsoon",
      "monsoon",
      "rainfall",
      "el nino",
      "climate of india",
      "weather"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on the Indian Monsoon covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, what monsoons are, factors controlling the Indian monsoon, southwest and northeast monsoons, onset and withdrawal, monsoon winds, rainfall distribution, role of the Himalayas and Indian Ocean, impact on agriculture and economy, floods and droughts, El Niño and La Niña, climate change, forecasting, and the importance of monsoon rainfall for India. Use maps, weather diagrams, rainfall charts, satellite imagery, and relevant images on every slide.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Geography Students & Farmers"
  },
  {
    "id": "wildlife_conservation",
    "category": "environment",
    "icon": "🐅",
    "title": "Wildlife Conservation",
    "desc": "Project Tiger, national parks, endangered species & poaching defense",
    "keywords": [
      "wildlife conservation",
      "national parks",
      "endangered species",
      "project tiger",
      "biodiversity"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Wildlife Conservation covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, biodiversity, importance of wildlife, endangered species, habitat destruction, poaching, human-wildlife conflict, national parks, wildlife sanctuaries, tiger and elephant conservation, conservation organizations, community participation, laws and protected areas, successful conservation examples, major challenges, and future strategies. Use wildlife photographs, habitat maps, population charts, conservation diagrams, and relevant images on every slide.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Wildlife Lovers & Environmentalists"
  },
  {
    "id": "indian_ocean",
    "category": "environment",
    "icon": "🌊",
    "title": "Indian Ocean",
    "desc": "Trade routes, maritime security, ocean currents & strategic importance",
    "keywords": [
      "indian ocean",
      "maritime security",
      "trade routes",
      "coastal ecosystems",
      "oceanography"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on the Indian Ocean covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its geography, major seas and islands, ocean currents, climate, marine biodiversity, important ports and trade routes, fisheries, natural resources, strategic importance, coastal communities, maritime security, pollution, climate change, and India's role in the Indian Ocean region. Use maps, satellite images, ocean diagrams, maritime photographs, and relevant visuals on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Geography & Defense Analysts"
  },
  {
    "id": "deep_ocean",
    "category": "environment",
    "icon": "🐙",
    "title": "The Deep Ocean",
    "desc": "Bioluminescence, abyssal zones, hydrothermal vents & deep-sea life",
    "keywords": [
      "deep ocean",
      "abyssal zone",
      "bioluminescence",
      "mariana trench",
      "deep sea"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on The Deep Ocean covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, ocean zones, extreme pressure and darkness, temperature, unusual marine organisms, bioluminescence, deep-sea ecosystems, hydrothermal vents, underwater exploration technology, unexplored regions, scientific discoveries, natural resources, environmental threats, and the future of deep-sea exploration. Use underwater photographs, ocean-depth diagrams, maps, exploration technology visuals, and relevant images on every slide.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Oceanographers & Science Students"
  },
  {
    "id": "future_of_food",
    "category": "environment",
    "icon": "🌱",
    "title": "The Future of Food",
    "desc": "Vertical farming, lab-grown meat, plant proteins & food security",
    "keywords": [
      "future of food",
      "lab grown meat",
      "vertical farming",
      "food security",
      "hydroponics"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on The Future of Food covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, population growth and food demand, sustainable agriculture, vertical farming, hydroponics, lab-grown meat, plant-based foods, alternative proteins, genetically modified crops, food technology, AI and robotics in agriculture, food waste reduction, climate change, food security, ethical concerns, and possible future food systems. Use futuristic food visuals, farm diagrams, comparison charts, technology illustrations, and relevant images on every slide.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Agri-Tech & Food Scientists"
  },
  {
    "id": "startup_pitch",
    "category": "business",
    "icon": "🚀",
    "title": "Startup Investor Pitch Deck",
    "desc": "Problem, solution, market size, business model & traction",
    "keywords": [
      "startup",
      "pitch",
      "investor",
      "pitch deck",
      "business plan",
      "venture capital"
    ],
    "prompt": "Create a compelling 10-slide investor pitch deck covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, market problem, innovative product solution, target market TAM/SAM, monetization business model, competitive advantage, financial projections, and funding ask.",
    "template": "startup",
    "slideCount": 10,
    "audience": "Venture Capitalists & Angel Investors"
  },
  {
    "id": "qbr_report",
    "category": "business",
    "icon": "📈",
    "title": "Quarterly Business Review (QBR)",
    "desc": "Revenue growth, team achievements, KPIs & strategic goals",
    "keywords": [
      "qbr",
      "quarterly business review",
      "business review",
      "kpi",
      "quarterly"
    ],
    "prompt": "Create an 8-slide executive presentation for Quarterly Business Review summarizing Q3 revenue targets, operational metrics, top wins, key lessons learned, and strategic goals for next quarter. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 8,
    "audience": "Board of Directors & Executives"
  },
  {
    "id": "digital_marketing",
    "category": "business",
    "icon": "🎯",
    "title": "Digital Marketing Strategy",
    "desc": "Omnichannel growth, AI content, acquisition funnels & ROAS",
    "keywords": [
      "digital marketing",
      "marketing",
      "seo",
      "growth marketing",
      "social media"
    ],
    "prompt": "Create an 8-slide digital marketing strategy presentation covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, omnichannel acquisition, AI-generated content workflows, customer funnel optimization, paid search/social strategy, and ROAS metrics.",
    "template": "startup",
    "slideCount": 8,
    "audience": "Marketing & Growth Team"
  },
  {
    "id": "fintech_banking",
    "category": "business",
    "icon": "💳",
    "title": "Fintech & Open Banking",
    "desc": "Embedded finance, AI fraud prevention & digital payments",
    "keywords": [
      "fintech",
      "banking",
      "finance",
      "open banking",
      "payments",
      "digital banking"
    ],
    "prompt": "Create a 9-slide presentation on fintech innovations, open banking APIs, AI fraud detection systems, embedded finance, and mobile payment revolution. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "finance",
    "slideCount": 9,
    "audience": "Financial Analysts & Fintech Partners"
  },
  {
    "id": "digital_economy",
    "category": "business",
    "icon": "💳",
    "title": "Digital Economy",
    "desc": "E-commerce, UPI, digital banking, gig economy & cybersecurity",
    "keywords": [
      "digital economy",
      "upi",
      "e-commerce",
      "digital payments",
      "fintech",
      "online banking"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on the Digital Economy covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its definition, evolution, digital payments, e-commerce, online banking, digital businesses, gig economy, role of technology, opportunities for entrepreneurs, impact on traditional businesses, cybersecurity and privacy concerns, digital inclusion, India's digital economy, challenges, and future scope. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, statistics, charts, infographics, and relevant images on every slide.",
    "template": "finance",
    "slideCount": 9,
    "audience": "Business Students & Entrepreneurs"
  },
  {
    "id": "indian_tourism",
    "category": "business",
    "icon": "🏞️",
    "title": "Indian Tourism",
    "desc": "Heritage sites, wildlife, eco-tourism, medical tourism & economic impact",
    "keywords": [
      "indian tourism",
      "tourism in india",
      "incredible india",
      "travel",
      "world heritage"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Indian Tourism covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, India's geographical and cultural diversity, historical tourism, religious tourism, wildlife tourism, adventure tourism, medical tourism, eco-tourism, famous destinations, UNESCO World Heritage Sites, economic importance of tourism, employment generation, challenges, responsible tourism, and future opportunities. Use maps, destination photographs, monuments, landscapes, and relevant tourism images on every slide.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Tourism Students & Travelers"
  },
  {
    "id": "indian_economy",
    "category": "business",
    "icon": "📈",
    "title": "Indian Economy",
    "desc": "GDP, sectors, banking, digital payments, startups & global standing",
    "keywords": [
      "indian economy",
      "gdp",
      "economic reforms",
      "rbi",
      "inflation",
      "taxation"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on the Indian Economy covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its basic structure, agriculture, industry and services sectors, GDP, employment, inflation, taxation, banking, digital payments, startups, exports and imports, infrastructure, economic reforms, India's position in the global economy, major challenges, and future growth opportunities. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, economic charts, graphs, statistics, and relevant images on every slide.",
    "template": "finance",
    "slideCount": 10,
    "audience": "Economics Students & Analysts"
  },
  {
    "id": "indian_railways",
    "category": "business",
    "icon": "🚂",
    "title": "Indian Railways",
    "desc": "Vande Bharat, routes, electrification, safety technology & future projects",
    "keywords": [
      "indian railways",
      "vande bharat",
      "trains",
      "railway network",
      "locomotives",
      "irctc"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Indian Railways covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, its history, development, railway zones, important railway routes, locomotives, railway stations, high-speed and semi-high-speed trains, electrification, railway bridges and tunnels, economic importance, employment, safety systems, technological modernization, environmental initiatives, challenges, and future projects. Use railway maps, train photographs, infrastructure diagrams, statistics, and relevant images on every slide.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Transport & Engineering Students"
  },
  {
    "id": "how_money_works",
    "category": "business",
    "icon": "💵",
    "title": "How Money Works",
    "desc": "Currency history, central banks, interest rates, inflation & monetary policy",
    "keywords": [
      "how money works",
      "money",
      "inflation",
      "banking",
      "central bank",
      "currency",
      "personal finance"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on How Money Works covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the meaning and history of money, barter systems, coins and paper currency, banks, central banks, interest rates, inflation, loans, credit, digital payments, monetary policy, how money moves through an economy, personal finance basics, economic challenges, and the future of money. Use simple examples, flowcharts, economic diagrams, charts, and relevant financial images on every slide.",
    "template": "finance",
    "slideCount": 9,
    "audience": "Finance & Economics Beginners"
  },
  {
    "id": "future_of_education",
    "category": "education",
    "icon": "🎓",
    "title": "Future of Education",
    "desc": "AI in education, digital classrooms, VR learning & skill-based training",
    "keywords": [
      "future of education",
      "online learning",
      "edtech",
      "ai in education",
      "smart classroom"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on the Future of Education covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, traditional versus modern education, online learning, digital classrooms, artificial intelligence in education, personalized learning, virtual and augmented reality, smart classrooms, skill-based education, lifelong learning, changing teacher and student roles, opportunities and challenges, digital divide, and possible future education models. Use futuristic classroom visuals, diagrams, technology illustrations, and relevant images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Teachers, Students & Educators"
  },
  {
    "id": "stem_education",
    "category": "education",
    "icon": "🧪",
    "title": "STEM & STEAM Education",
    "desc": "Science, Technology, Engineering, Arts & Math integration in modern learning",
    "keywords": [
      "stem",
      "steam",
      "science education",
      "coding for kids",
      "pedagogy",
      "curriculum"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on STEM & STEAM Education covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the transition from STEM to STEAM, importance of experiential learning, interdisciplinary projects, critical thinking, coding and robotics in schools, integrating arts with science, real-world problem solving, career pathways, challenges in implementation, and future trends in modern education. Use clear executive explanations, structured architecture diagrams, comparison matrices, performance charts, educational infographics, project flowcharts, and relevant classroom visuals on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Teachers, Students & Policy Makers"
  },
  {
    "id": "effective_study_techniques",
    "category": "education",
    "icon": "📚",
    "title": "Effective Study & Learning Techniques",
    "desc": "Active recall, Pomodoro technique, spaced repetition & cognitive retention",
    "keywords": [
      "study techniques",
      "active recall",
      "pomodoro",
      "spaced repetition",
      "mind mapping",
      "exam preparation"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Effective Study & Learning Techniques covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the science of learning, memory retention, active recall vs passive reading, spaced repetition algorithms, the Pomodoro technique, mind mapping, Feynman technique, exam preparation strategies, overcoming procrastination, study-life balance, and digital study tools. Use clear diagrams, study habit flowcharts, comparison charts, and student-focused illustrations on every slide.",
    "template": "minimal",
    "slideCount": 8,
    "audience": "Students & Academic Counselors"
  },
  {
    "id": "e_learning_revolution",
    "category": "education",
    "icon": "💻",
    "title": "E-Learning & EdTech Revolution",
    "desc": "Online courses, LMS platforms, gamification & micro-credentials",
    "keywords": [
      "e-learning",
      "edtech",
      "lms",
      "online courses",
      "moocs",
      "gamification",
      "remote learning"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on E-Learning and EdTech covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the rise of online platforms, Learning Management Systems (LMS), MOOCs, gamified learning, micro-credentials, personalized learning paths, blended learning models, role of AI in EdTech, accessibility, advantages and challenges, and the future of digital degrees. Use platform architecture diagrams, learning flowcharts, infographics, and relevant EdTech images on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Educators, Students & EdTech Entrepreneurs"
  },
  {
    "id": "financial_literacy_students",
    "category": "education",
    "icon": "💰",
    "title": "Financial Literacy for Students",
    "desc": "Budgeting, saving, student debt, compounding interest & basic investing",
    "keywords": [
      "financial literacy",
      "student budgeting",
      "saving money",
      "investing basics",
      "compounding interest",
      "debt management"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Financial Literacy for Students covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, money management basics, budgeting techniques (50/30/20 rule), saving habits, power of compound interest, understanding credit scores and student loans, basic investment options, fraud prevention, digital banking safety, and building long-term financial independence. Use simple financial charts, budgeting flowcharts, real-world examples, and clear visuals on every slide.",
    "template": "finance",
    "slideCount": 9,
    "audience": "High School & University Students"
  },
  {
    "id": "supply_chain_management",
    "category": "business",
    "icon": "🚚",
    "title": "Supply Chain & Logistics Management",
    "desc": "Procurement, inventory optimization, warehousing & cold chain technology",
    "keywords": [
      "supply chain",
      "logistics",
      "procurement",
      "inventory management",
      "cold chain",
      "freight"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Supply Chain and Logistics Management covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, supply chain fundamentals, procurement, inventory management, warehousing, transport systems, cold chain logistics, supply chain visibility, risk management, IoT and AI in logistics, sustainability in supply chains, and future trends. Use supply chain flowcharts, logistics diagrams, key performance metrics, and industry images on every slide.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Supply Chain Managers & Business Students"
  },
  {
    "id": "e_commerce_d2c",
    "category": "business",
    "icon": "🛒",
    "title": "E-Commerce & D2C Business Models",
    "desc": "Online storefronts, direct-to-consumer strategy, checkout conversion & logistics",
    "keywords": [
      "e-commerce",
      "d2c",
      "shopify",
      "online retail",
      "conversion rate",
      "customer acquisition"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on E-Commerce and D2C Business Models covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, market growth, D2C vs marketplace models, store creation, payment gateways, checkout optimization, omnichannel marketing, customer retention, logistics & fulfillment, data analytics, and future e-commerce trends. Use conversion funnel diagrams, business model comparison charts, and modern retail visuals on every slide.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Entrepreneurs & E-Commerce Professionals"
  },
  {
    "id": "modern_leadership",
    "category": "business",
    "icon": "👔",
    "title": "Modern Leadership & People Management",
    "desc": "Emotional intelligence, team building, hybrid management & corporate culture",
    "keywords": [
      "leadership",
      "management",
      "emotional intelligence",
      "team building",
      "corporate culture",
      "conflict resolution"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Modern Leadership and People Management covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, core leadership styles, emotional intelligence (EQ), effective communication, managing remote/hybrid teams, delegation, conflict resolution, building inclusive team culture, employee motivation, and continuous mentorship. Use leadership frameworks, management matrix diagrams, team illustrations, and business infographics on every slide.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Managers, Team Leads & HR Executives"
  },
  {
    "id": "corporate_esg",
    "category": "business",
    "icon": "🍃",
    "title": "Corporate ESG & Sustainability",
    "desc": "Environmental, Social, Governance metrics & sustainable business practices",
    "keywords": [
      "esg",
      "corporate sustainability",
      "governance",
      "carbon footprint",
      "green business",
      "csr"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Corporate ESG & Sustainability covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Environmental, Social, and Governance pillars, carbon neutrality goals, sustainable reporting frameworks, ethical supply chains, social impact, corporate governance, ESG investing trends, regulatory compliance, and business benefits of sustainability. Use ESG framework diagrams, reporting matrices, green business illustrations, and corporate charts on every slide.",
    "template": "minimal",
    "slideCount": 8,
    "audience": "Corporate Executives & ESG Officers"
  },
  {
    "id": "green_architecture",
    "category": "environment",
    "icon": "🏙️",
    "title": "Green Buildings & Sustainable Architecture",
    "desc": "LEED certification, passive design, eco-materials & net-zero buildings",
    "keywords": [
      "green buildings",
      "sustainable architecture",
      "leed",
      "net zero",
      "passive solar",
      "eco friendly construction"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Green Buildings and Sustainable Architecture covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, principles of eco-friendly building design, energy efficiency, passive solar techniques, renewable energy integration, sustainable building materials, water recycling systems, LEED certification, smart building automation, indoor air quality, net-zero energy structures, and case studies of famous sustainable buildings. Use architectural diagrams, energy flowcharts, material comparisons, and high-quality structural images on every slide.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Architects, Civil Engineers & Urban Planners"
  },
  {
    "id": "circular_economy",
    "category": "environment",
    "icon": "♻️",
    "title": "Circular Economy & Zero Waste",
    "desc": "Waste elimination, product lifecycle extension & sustainable design",
    "keywords": [
      "circular economy",
      "zero waste",
      "recycling",
      "upcycling",
      "extended producer responsibility",
      "waste management"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Circular Economy and Zero Waste covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, linear vs circular economic models, design for longevity, recycling and upcycling, industrial symbiosis, e-waste management, single-use plastic reduction, business models driving zero-waste, policy interventions, community engagement, and environmental impact. Use circular flow diagrams, waste hierarchy charts, product lifecycle illustrations, and environmental infographics on every slide.",
    "template": "minimal",
    "slideCount": 8,
    "audience": "Sustainability Specialists & Policy Makers"
  },
  {
    "id": "air_pollution_aqi",
    "category": "environment",
    "icon": "🌫️",
    "title": "Air Pollution & AQI Management",
    "desc": "PM2.5, smog formation, clean air tech, health impacts & policy",
    "keywords": [
      "air pollution",
      "aqi",
      "air quality index",
      "pm2.5",
      "smog",
      "air purifiers",
      "environmental health"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Air Pollution and Air Quality Management covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, sources of air pollution, particulate matter (PM2.5 & PM10), smog formation, Air Quality Index (AQI) ratings, respiratory health impacts, industrial emissions control, urban greening, clean air technologies, electric mobility solutions, and government action plans. Use AQI chart visuals, health impact diagrams, pollution source maps, and environmental charts on every slide.",
    "template": "education",
    "slideCount": 8,
    "audience": "Environmental Researchers & Public Health Workers"
  },
  {
    "id": "ui_ux_design",
    "category": "tech",
    "icon": "🎨",
    "title": "UI/UX Design Principles",
    "desc": "User research, wireframing, prototyping, usability & design systems",
    "keywords": [
      "ui ux",
      "user interface",
      "user experience",
      "wireframing",
      "figma",
      "design system",
      "usability"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on UI/UX Design Principles covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, user-centered design, research methodologies, user personas, information architecture, wireframing and prototyping tools (Figma/Adobe XD), visual hierarchy, accessibility (WCAG), usability testing, design systems, micro-interactions, and emerging UX trends in AI and spatial computing. Use UI mockup illustrations, design process flowcharts, interactive wireframe diagrams, and visual examples on every slide.",
    "template": "startup",
    "slideCount": 10,
    "audience": "UI/UX Designers & Product Managers"
  },
  {
    "id": "cyber_forensics",
    "category": "tech",
    "icon": "🔍",
    "title": "Digital Forensics & Incident Response",
    "desc": "Data recovery, evidence preservation, threat hunting & malware analysis",
    "keywords": [
      "cyber forensics",
      "digital forensics",
      "incident response",
      "evidence collection",
      "malware analysis",
      "threat hunting"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Digital Forensics and Incident Response covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, investigation lifecycles, evidence gathering, disk and memory forensics, network forensic analysis, malware reverse engineering, chain of custody, legal compliance, threat hunting methodologies, incident containment, and case studies. Use forensic process flowcharts, evidence handling diagrams, technical security metrics, and investigative visuals on every slide.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Cybersecurity Specialists & Security Analysts"
  },
  {
    "id": "genetics_crispr",
    "category": "science",
    "icon": "🧬",
    "title": "Genetics & CRISPR Gene Editing",
    "desc": "DNA structure, genome sequencing, CRISPR-Cas9, gene therapy & ethics",
    "keywords": [
      "crispr",
      "genetics",
      "gene editing",
      "dna",
      "genome sequencing",
      "biotechnology",
      "gene therapy"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Genetics & CRISPR Gene Editing covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, DNA fundamentals, human genome project, mechanism of CRISPR-Cas9, targeted gene modification, bio-medical applications, disease treatment, agricultural bio-engineering, bio-ethical controversies, safety regulation, and the future of genetic medicine. Use double-helix diagrams, molecular flowcharts, gene editing illustrations, and bio-tech visuals on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Biology & Biotech Students"
  },
  {
    "id": "philosophy_ethics",
    "category": "society",
    "icon": "📜",
    "title": "Introduction to Philosophy & Ethics",
    "desc": "Moral philosophy, logic, stoicism, utilitarianism & critical thinking",
    "keywords": [
      "philosophy",
      "ethics",
      "stoicism",
      "utilitarianism",
      "logic",
      "moral philosophy",
      "critical thinking"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Introduction to Philosophy & Ethics covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the main branches of philosophy (metaphysics, epistemology, ethics, logic), ancient and modern thinkers (Socrates, Aristotle, Kant, Mill), ethical frameworks (deontology, utilitarianism, virtue ethics), thought experiments (Trolley Problem), practical ethics in technology and society, and developing critical thinking skills. Use philosophical timelines, decision tree diagrams, quote callouts, and classical illustrations on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Philosophy Students & General Audience"
  },
  {
    "id": "cyber_hygiene",
    "category": "tech",
    "icon": "🔒",
    "title": "Personal Cyber Hygiene & Online Security",
    "desc": "Password management, 2FA, phishing awareness & privacy protection",
    "keywords": [
      "cyber hygiene",
      "password manager",
      "2fa",
      "two factor authentication",
      "phishing",
      "privacy",
      "online safety"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Personal Cyber Hygiene & Online Security covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, password security, two-factor authentication (2FA), recognizing phishing attacks, secure Wi-Fi usage, social media privacy settings, malware defense, data backup strategies, and practical tips for staying safe online. Use clear security infographics, threat flowcharts, checklist visuals, and privacy illustrations on every slide.",
    "template": "dark",
    "slideCount": 8,
    "audience": "General Public, Students & Employees"
  },
  {
    "id": "open_source_dev",
    "category": "tech",
    "icon": "🐧",
    "title": "Open Source Software & Community",
    "desc": "Git, GitHub, open source licenses, Linux & contributing to OSS",
    "keywords": [
      "open source",
      "github",
      "git",
      "linux",
      "oss",
      "open source licensing",
      "community"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Open Source Software & Community covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the history of open source, difference between open source and proprietary software, Linux ecosystem, Git and GitHub workflow, open-source licenses (MIT, GPL, Apache), how to contribute to open-source projects, and business models around open source. Use version control diagrams, community flowcharts, and software developer illustrations on every slide.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Developers, Students & Tech Enthusiasts"
  },
  {
    "id": "game_development",
    "category": "tech",
    "icon": "🎮",
    "title": "Game Development & Engine Architecture",
    "desc": "Unity, Unreal Engine, game physics, loop architecture & 3D graphics",
    "keywords": [
      "game development",
      "game dev",
      "unity",
      "unreal engine",
      "game design",
      "3d graphics",
      "game physics"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Game Development & Engine Architecture covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the game development pipeline, game loops, game engines (Unity, Unreal Engine), 2D vs 3D graphics, physics engines, AI in games, sound design, game monetization models, and career paths in the gaming industry. Use game pipeline diagrams, engine architecture charts, asset flow visuals, and gaming graphics on every slide.",
    "template": "dark",
    "slideCount": 10,
    "audience": "Aspiring Game Developers & Tech Students"
  },
  {
    "id": "quantum_cryptography",
    "category": "tech",
    "icon": "🔐",
    "title": "Quantum Cryptography & Post-Quantum Security",
    "desc": "Quantum Key Distribution (QKD), Shor's algorithm & post-quantum encryption",
    "keywords": [
      "quantum cryptography",
      "qkd",
      "quantum key distribution",
      "post quantum",
      "shors algorithm",
      "encryption"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Quantum Cryptography & Post-Quantum Security covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, traditional encryption limitations, quantum threats to RSA/ECC, Shor's algorithm, Quantum Key Distribution (QKD), Heisenberg uncertainty principle in security, lattice-based cryptography, post-quantum standardization, and future secure communications. Use quantum physics diagrams, encryption flowcharts, security comparison matrices, and futuristic visuals on every slide.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Cybersecurity Experts & Quantum Researchers"
  },
  {
    "id": "renewable_energy_physics",
    "category": "science",
    "icon": "☀️",
    "title": "Physics of Renewable Energy",
    "desc": "Photovoltaics, wind turbine aerodynamics, solar thermal & energy conversion",
    "keywords": [
      "physics of renewable energy",
      "photovoltaic effect",
      "solar power physics",
      "wind aerodynamics",
      "thermodynamics"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on the Physics of Renewable Energy covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, energy conversion principles, photovoltaic effect in solar cells, wind turbine aerodynamics (Betz limit), hydroelectric power physics, geothermal thermodynamics, energy storage physics (batteries, pumped hydro), efficiency limits, and future breakthroughs in energy physics. Use energy conversion flowcharts, physics formulas/diagrams, solar cell cross-sections, and technical visuals on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Physics & Engineering Students"
  },
  {
    "id": "astrobiology_exoplanets",
    "category": "science",
    "icon": "🪐",
    "title": "Astrobiology & Exoplanet Exploration",
    "desc": "Habitable zones, James Webb telescope discoveries, extremophiles & biosignatures",
    "keywords": [
      "astrobiology",
      "exoplanets",
      "james webb",
      "goldilocks zone",
      "biosignatures",
      "extraterrestrial life"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Astrobiology & Exoplanet Exploration covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, what astrobiology is, habitable Goldilocks zones, exoplanet detection methods (transit method, radial velocity), James Webb Space Telescope discoveries, extremophiles on Earth, atmospheric biosignatures, and potential ocean worlds like Europa and Enceladus. Use planetary orbit diagrams, telescope visuals, light spectrum charts, and space illustrations on every slide.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Astronomy Students & Science Enthusiasts"
  },
  {
    "id": "neuroplasticity_brain",
    "category": "science",
    "icon": "🧠",
    "title": "Neuroplasticity & Brain Adaptation",
    "desc": "Synaptic pruning, neurogenesis, habit formation & brain injury recovery",
    "keywords": [
      "neuroplasticity",
      "brain adaptation",
      "synaptic plasticity",
      "neurogenesis",
      "habit formation",
      "brain recovery"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Neuroplasticity & Brain Adaptation covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, structural vs functional neuroplasticity, synaptic pruning, neurogenesis, how learning rewires the brain, habit formation loops, stroke rehabilitation, mindfulness impact on brain structure, and cognitive enhancement. Use neuron network diagrams, brain mapping visuals, habit loop flowcharts, and neuroscience illustrations on every slide.",
    "template": "education",
    "slideCount": 8,
    "audience": "Medical Students, Psychologists & Learners"
  },
  {
    "id": "industrial_revolutions",
    "category": "society",
    "icon": "🏭",
    "title": "The Four Industrial Revolutions",
    "desc": "From steam power & electricity to computing & Industry 4.0 automation",
    "keywords": [
      "industrial revolution",
      "industry 4.0",
      "steam engine",
      "mass production",
      "automation",
      "cyber physical systems"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on The Four Industrial Revolutions covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the First (steam power & mechanization), Second (electricity & mass production), Third (computing & internet automation), and Fourth Industrial Revolution (Industry 4.0: AI, IoT, robotics, 3D printing). Compare social, economic, and technological impacts across eras and discuss Industry 5.0 concepts. Use historical timelines, comparative charts, factory illustrations, and technological evolution diagrams on every slide.",
    "template": "corporate",
    "slideCount": 10,
    "audience": "History, Business & Engineering Students"
  },
  {
    "id": "media_literacy_fake_news",
    "category": "society",
    "icon": "📰",
    "title": "Media Literacy & Fighting Misinformation",
    "desc": "Fact-checking, deepfakes, echo chambers, algorithmic bias & critical news consumption",
    "keywords": [
      "media literacy",
      "misinformation",
      "fake news",
      "deepfakes",
      "fact checking",
      "echo chambers",
      "bias"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Media Literacy & Fighting Misinformation covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, types of misinformation and disinformation, deepfakes and AI synthetic media, echo chambers and filter bubbles, cognitive biases in news consumption, verification and fact-checking techniques, source evaluation, and building a healthy news diet. Use media analysis flowcharts, fact-checking checklists, network echo chamber diagrams, and real-world examples on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Students, Educators & Journalists"
  },
  {
    "id": "great_archaeological_discoveries",
    "category": "society",
    "icon": "🏺",
    "title": "Greatest Archaeological Discoveries",
    "desc": "Rosetta Stone, Terracotta Army, King Tut's Tomb, Dead Sea Scrolls & Pompeii",
    "keywords": [
      "archaeology",
      "archaeological discoveries",
      "rosetta stone",
      "terracotta army",
      "king tut",
      "pompeii",
      "ancient artifacts"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on the Greatest Archaeological Discoveries covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the Rosetta Stone, Tutankhamun's Tomb, Terracotta Army, Dead Sea Scrolls, Pompeii excavations, Machu Picchu, and modern LIDAR technology in jungle excavations. Highlight how each discovery unlocked secrets of ancient human history. Use discovery timelines, excavation maps, artifact photographs, and historical illustrations on every slide.",
    "template": "education",
    "slideCount": 10,
    "audience": "History & Archaeology Enthusiasts"
  },
  {
    "id": "biodiversity_extinction",
    "category": "environment",
    "icon": "🐾",
    "title": "Biodiversity Loss & Extinction Crisis",
    "desc": "Sixth mass extinction, habitat fragmentation, endangered species & rewilding",
    "keywords": [
      "biodiversity loss",
      "extinction",
      "mass extinction",
      "endangered species",
      "habitat loss",
      "rewilding"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Biodiversity Loss & Extinction Crisis covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, ecosystem services, drivers of biodiversity loss (habitat destruction, climate change, pollution, invasive species), the Sixth Mass Extinction, IUCN Red List categories, key indicator species, rewilding initiatives, biodiversity corridors, and international conservation frameworks. Use biodiversity maps, species extinction charts, ecosystem food webs, and wildlife visuals on every slide.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Environmentalists & Biology Students"
  },
  {
    "id": "ocean_plastic_pollution",
    "category": "environment",
    "icon": "🐢",
    "title": "Ocean Plastic Pollution & Clean-Up Tech",
    "desc": "Microplastics, Great Pacific Garbage Patch, ocean clean-up technology & plastic bans",
    "keywords": [
      "ocean plastic",
      "microplastics",
      "garbage patch",
      "plastic pollution",
      "ocean clean up",
      "single use plastic"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Ocean Plastic Pollution & Clean-Up Tech covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, sources of ocean plastic, microplastics and nanoplastics, the Great Pacific Garbage Patch, impact on marine life and human food chains, innovative ocean clean-up technologies (barrier systems, river interceptors), circular plastic alternatives, and global plastic treaties. Use ocean pollution maps, plastic lifecycle flowcharts, cleanup technology diagrams, and environmental infographics on every slide.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Environmental Advocates & Marine Researchers"
  },
  {
    "id": "product_management_strategy",
    "category": "business",
    "icon": "📦",
    "title": "Product Management & Product Strategy",
    "desc": "Product roadmaps, MVP definition, user stories, OKRs & product lifecycle",
    "keywords": [
      "product management",
      "product strategy",
      "mvp",
      "product roadmap",
      "okrs",
      "agile product",
      "user stories"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Product Management & Product Strategy covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, product discovery, defining Minimum Viable Products (MVPs), creating product roadmaps, writing effective user stories, OKRs and product metrics (CAC, LTV, Churn), Agile product delivery, prioritization frameworks (RICE, Kano model), and product-led growth. Use product roadmap diagrams, prioritization matrices, lifecycle charts, and business flowcharts on every slide.",
    "template": "startup",
    "slideCount": 10,
    "audience": "Product Managers, Founders & Tech Teams"
  },
  {
    "id": "gig_economy_freelancing",
    "category": "business",
    "icon": "💻",
    "title": "The Gig Economy & Freelance Revolution",
    "desc": "Freelance platforms, independent contracting, digital nomads & gig worker rights",
    "keywords": [
      "gig economy",
      "freelancing",
      "digital nomad",
      "remote work",
      "independent contractor",
      "platform work"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on The Gig Economy & Freelance Revolution covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the growth of platform-based work, digital nomadism, benefits and flexibility for workers, challenges (lack of benefits, income instability), platform business models, legal classifications of gig workers, building a successful freelance career, and the future of work. Use market growth charts, worker demographic visuals, platform comparison matrices, and remote work illustrations on every slide.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Freelancers, Gig Workers & Business Students"
  },
  {
    "id": "franchise_business_model",
    "category": "business",
    "icon": "🏢",
    "title": "Franchising & Business Expansion",
    "desc": "Franchise agreements, royalties, brand replication & operational scaling",
    "keywords": [
      "franchise",
      "franchising",
      "business expansion",
      "franchise agreement",
      "royalties",
      "brand scaling"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Franchising & Business Expansion covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, what franchising is, franchisor vs franchisee roles, franchise fee structures and royalties, evaluating franchise opportunities, brand standardization and operational manuals, legal requirements, famous franchise case studies (McDonald's, Subway), and scaling a business through franchising. Use franchise model flowcharts, royalty structure diagrams, expansion maps, and business visuals on every slide.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Entrepreneurs, Investors & Business Students"
  },
  {
    "id": "early_childhood_education",
    "category": "education",
    "icon": "🧸",
    "title": "Early Childhood & Play-Based Learning",
    "desc": "Montessori, Reggio Emilia, cognitive development & early literacy",
    "keywords": [
      "early childhood education",
      "montessori",
      "play based learning",
      "reggio emilia",
      "child development",
      "kindergarten"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Early Childhood & Play-Based Learning covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, brain development in early years (0-6), benefits of play-based learning, Montessori and Reggio Emilia philosophies, motor skills development, early literacy and numeracy, social-emotional learning, role of parents and educators, and designing engaging learning environments. Use developmental milestone charts, learning activity illustrations, classroom design diagrams, and child education visuals on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Early Childhood Educators, Parents & Teachers"
  },
  {
    "id": "critical_thinking_pedagogy",
    "category": "education",
    "icon": "💡",
    "title": "Teaching Critical Thinking & Problem Solving",
    "desc": "Socratic method, inquiry-based learning, analytical reasoning & debate",
    "keywords": [
      "critical thinking",
      "problem solving",
      "socratic method",
      "inquiry based learning",
      "blooms taxonomy",
      "analytical thinking"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Teaching Critical Thinking & Problem Solving covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Bloom's Taxonomy, the Socratic questioning method, inquiry-based learning frameworks, analyzing arguments and logical fallacies, problem-solving methodologies (design thinking in education), classroom debate techniques, and assessing critical thinking skills. Use Bloom's taxonomy pyramid diagrams, questioning flowcharts, problem-solving matrix visuals, and educational infographics on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Educators, Curriculum Designers & Students"
  },
  {
    "id": "cardiovascular_health",
    "category": "health",
    "icon": "🫀",
    "title": "Cardiovascular Health & Heart Disease",
    "desc": "Heart anatomy, blood pressure, cholesterol, heart attack prevention & cardiac care",
    "keywords": [
      "cardiovascular health",
      "heart disease",
      "blood pressure",
      "cholesterol",
      "cardiology",
      "heart attack"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Cardiovascular Health covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, heart anatomy, blood circulation, common diseases (hypertension, CAD, heart attack), risk factors, cholesterol management, lifestyle habits for a healthy heart, diagnostic tests, and modern cardiac treatments. Include medical diagrams, health flowcharts, and clear visuals on every slide.",
    "template": "education",
    "slideCount": 9,
    "audience": "Medical Students, Nurses & General Public"
  },
  {
    "id": "diabetes_management",
    "category": "health",
    "icon": "🩸",
    "title": "Understanding & Managing Diabetes",
    "desc": "Type 1 vs Type 2 diabetes, insulin, blood sugar monitoring, diet & complications",
    "keywords": [
      "diabetes",
      "type 1 diabetes",
      "type 2 diabetes",
      "insulin",
      "blood sugar",
      "glucose"
    ],
    "prompt": "Create a detailed presentation on Diabetes Management explaining Type 1 and Type 2 diabetes, insulin resistance, symptoms, glucose monitoring, dietary management, exercise, long-term health risks, and prevention strategies. Include flowcharts of glucose regulation and healthy lifestyle guidelines. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Diabetic Patients, Health Educators & Students"
  },
  {
    "id": "mental_health_awareness",
    "category": "health",
    "icon": "🧠",
    "title": "Mental Health Awareness & Therapy",
    "desc": "Anxiety, depression, therapy approaches, stigma reduction & self-care",
    "keywords": [
      "mental health",
      "anxiety",
      "depression",
      "therapy",
      "psychiatry",
      "mindfulness",
      "stigma"
    ],
    "prompt": "Create an empathetic and informative presentation on Mental Health Awareness covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, common conditions like anxiety and depression, recognizing warning signs, psychological therapy modalities (CBT, DBT), breaking societal stigmas, self-care routines, and seeking professional help. Use warm, reassuring visuals and crisis resources.",
    "template": "minimal",
    "slideCount": 10,
    "audience": "Students, Corporate Employees & Community Groups"
  },
  {
    "id": "nutrition_healthy_eating",
    "category": "health",
    "icon": "🥗",
    "title": "Human Nutrition & Balanced Diet",
    "desc": "Macronutrients, micronutrients, gut health, vitamins & dietary guidelines",
    "keywords": [
      "nutrition",
      "balanced diet",
      "macronutrients",
      "vitamins",
      "gut health",
      "caloric balance"
    ],
    "prompt": "Create an executive-level, professional, and visually engaging presentation on Human Nutrition covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, carbohydrates, proteins, fats, essential vitamins and minerals, gut microbiome health, reading food labels, debunking diet myths, and building a balanced meal plate. Include nutrition pyramids, food source infographics, and meal planning charts.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Nutritionists, Fitness Enthusiasts & Students"
  },
  {
    "id": "immunology_vaccines",
    "category": "health",
    "icon": "💉",
    "title": "Immunology & Vaccine Science",
    "desc": "Innate & adaptive immunity, antibodies, mRNA vaccines & herd immunity",
    "keywords": [
      "immunology",
      "vaccines",
      "immune system",
      "antibodies",
      "mrna vaccine",
      "pathogens"
    ],
    "prompt": "Create an educational presentation on Immunology & Vaccine Science covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, innate vs adaptive immunity, T-cells and B-cells, antibody production, historical impact of vaccines, modern vaccine technologies (mRNA, viral vector), herd immunity, and addressing vaccine hesitancy. Use biological diagrams and medical illustrations.",
    "template": "education",
    "slideCount": 10,
    "audience": "Biology Students, Healthcare Workers & Public"
  },
  {
    "id": "cancer_biology_therapies",
    "category": "health",
    "icon": "🔬",
    "title": "Cancer Biology & Modern Treatments",
    "desc": "Oncology, tumor development, chemotherapy, immunotherapy & early detection",
    "keywords": [
      "cancer biology",
      "oncology",
      "chemotherapy",
      "immunotherapy",
      "car-t cell",
      "early detection"
    ],
    "prompt": "Create an informative presentation on Cancer Biology covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, cellular mutations, tumor progression, benign vs malignant tumors, cancer risk factors, screening & early detection, traditional treatments (surgery, chemo, radiation), and cutting-edge immunotherapies (CAR-T, targeted therapy). Use cellular diagrams and medical charts.",
    "template": "dark",
    "slideCount": 10,
    "audience": "Medical & Biotech Students, Researchers"
  },
  {
    "id": "sleep_medicine",
    "category": "health",
    "icon": "🛌",
    "title": "Sleep Medicine & Sleep Hygiene",
    "desc": "Insomnia, sleep apnea, circadian rhythm, REM cycles & sleep disorder therapies",
    "keywords": [
      "sleep medicine",
      "insomnia",
      "sleep apnea",
      "circadian rhythm",
      "rem sleep",
      "melatonin"
    ],
    "prompt": "Create a presentation on Sleep Medicine explaining sleep physiology, circadian rhythm regulation, sleep stages, common disorders (insomnia, CPAP for sleep apnea), cognitive behavioral therapy for insomnia (CBT-I), and actionable sleep hygiene practices. Include sleep stage graphs and circadian biological clock visuals. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 8,
    "audience": "Health Professionals & General Audience"
  },
  {
    "id": "pharmacology_drug_discovery",
    "category": "health",
    "icon": "💊",
    "title": "Pharmacology & Drug Discovery",
    "desc": "Drug targets, clinical trials, FDA approval process, pharmacokinetics & safety",
    "keywords": [
      "pharmacology",
      "drug discovery",
      "clinical trials",
      "fda approval",
      "pharmacokinetics",
      "pharmaceuticals"
    ],
    "prompt": "Create a comprehensive presentation on Pharmacology & Drug Discovery detailing target identification, drug synthesis, preclinical testing, Phase I-IV clinical trials, regulatory approval, pharmacokinetics (ADME), and drug safety monitoring. Use drug development pipelines and clinical trial milestone diagrams. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Pharmacy Students & Biotech Professionals"
  },
  {
    "id": "telemedicine_digital_health",
    "category": "health",
    "icon": "📱",
    "title": "Telemedicine & Digital Health Tech",
    "desc": "Remote care, wearable health sensors, AI diagnostics, EHR & digital health regulation",
    "keywords": [
      "telemedicine",
      "digital health",
      "wearable sensors",
      "ai diagnostics",
      "electronic health records",
      "ehealth"
    ],
    "prompt": "Create a presentation on Telemedicine & Digital Health covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, virtual consultations, IoT medical wearables (smartwatches, continuous glucose monitors), AI-assisted diagnostic tools, Electronic Health Records (EHR), patient privacy (HIPAA), and future trends in remote patient care. Include telehealth workflow charts and digital health ecosystem diagrams.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Healthcare Administrators, Tech Founders & Doctors"
  },
  {
    "id": "public_health_epidemiology",
    "category": "health",
    "icon": "🌐",
    "title": "Public Health & Epidemiology",
    "desc": "Disease tracking, R0 transmission rate, outbreak response & WHO health policies",
    "keywords": [
      "public health",
      "epidemiology",
      "r0 rate",
      "outbreak management",
      "who",
      "pandemic preparedness"
    ],
    "prompt": "Create a presentation on Public Health & Epidemiology covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, principles of disease surveillance, basic reproduction number (R0), outbreak investigation steps, contact tracing, social determinants of health, global health organizations (WHO, CDC), and pandemic preparedness strategies. Use epidemic curves and disease transmission maps.",
    "template": "education",
    "slideCount": 9,
    "audience": "Public Health Officers, Policy Makers & Students"
  },
  {
    "id": "pediatric_health",
    "category": "health",
    "icon": "👶",
    "title": "Pediatric Health & Child Development",
    "desc": "Infant nutrition, developmental milestones, child immunization & pediatric care",
    "keywords": [
      "pediatrics",
      "child health",
      "infant nutrition",
      "developmental milestones",
      "vaccination",
      "childhood diseases"
    ],
    "prompt": "Create a presentation on Pediatric Health covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, physical and cognitive growth milestones, infant nutrition and breastfeeding, childhood immunization schedules, common pediatric illnesses, safety & injury prevention, and promoting mental well-being in children. Include growth charts and milestone timelines.",
    "template": "education",
    "slideCount": 9,
    "audience": "Parents, Pediatric Nurses & Childcare Workers"
  },
  {
    "id": "geriatric_care_aging",
    "category": "health",
    "icon": "👵",
    "title": "Geriatric Medicine & Healthy Aging",
    "desc": "Alzheimer's, osteoporosis, elder care, fall prevention & quality of life",
    "keywords": [
      "geriatrics",
      "aging",
      "alzheimers",
      "dementia",
      "osteoporosis",
      "elder care",
      "longevity"
    ],
    "prompt": "Create a presentation on Geriatric Medicine discussing age-related health changes, neurodegenerative conditions (Alzheimer's, Parkinson's), bone health and fall prevention, polypharmacy management, palliative care, and strategies for promoting independence and quality of life in senior citizens. Use care management flowcharts. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Geriatric Caregivers, Doctors & Families"
  },
  {
    "id": "dentistry_oral_health",
    "category": "health",
    "icon": "🦷",
    "title": "Dentistry & Oral Health Care",
    "desc": "Tooth anatomy, cavities, gum disease, orthodontics & oral hygiene",
    "keywords": [
      "dentistry",
      "oral health",
      "cavities",
      "periodontitis",
      "orthodontics",
      "dental hygiene"
    ],
    "prompt": "Create an educational presentation on Dentistry & Oral Health covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, tooth anatomy, plaque formation and cavities, periodontal (gum) disease, cosmetic and restorative dentistry, orthodontics, oral cancer screening, and preventative hygiene habits. Include dental anatomical diagrams and hygiene step-by-step visuals.",
    "template": "education",
    "slideCount": 8,
    "audience": "Dental Students, Hygienists & Patients"
  },
  {
    "id": "first_aid_emergency_care",
    "category": "health",
    "icon": "🚑",
    "title": "First Aid & Emergency Response",
    "desc": "CPR, Heimlich maneuver, wound management, fracture immobilization & triage",
    "keywords": [
      "first aid",
      "cpr",
      "emergency care",
      "heimlich",
      "triage",
      "bleeding control",
      "aed"
    ],
    "prompt": "Create an action-oriented presentation on First Aid & Emergency Response covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, primary assessment (DRABC), performing CPR and using an AED, Heimlich maneuver for choking, severe bleeding control, burn care, fracture stabilization, and snakebite first aid. Include step-by-step emergency action diagrams and safety icons.",
    "template": "corporate",
    "slideCount": 10,
    "audience": "First Responders, School Teachers & Office Safety Officers"
  },
  {
    "id": "sports_medicine_rehab",
    "category": "health",
    "icon": "🏃",
    "title": "Sports Medicine & Physical Rehabilitation",
    "desc": "Athletic injuries, ACL tears, physical therapy, biomechanics & recovery protocols",
    "keywords": [
      "sports medicine",
      "physical therapy",
      "acl tear",
      "rehabilitation",
      "biomechanics",
      "athletic recovery"
    ],
    "prompt": "Create a presentation on Sports Medicine & Physical Rehabilitation covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, common sports injuries (sprains, ACL tears, concussions), biomechanics of athletic movement, injury prevention strategies, physical therapy modalities, RICE protocol, and return-to-sport evaluation. Include joint movement diagrams and rehabilitation exercise flowcharts.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Physiotherapists, Coaches & Athletes"
  },
  {
    "id": "dermatology_skin_care",
    "category": "health",
    "icon": "✨",
    "title": "Dermatology & Skin Health",
    "desc": "Skin layers, acne, eczema, melanoma, sun protection & dermatological procedures",
    "keywords": [
      "dermatology",
      "skin care",
      "acne",
      "melanoma",
      "sunscreen",
      "eczema",
      "dermatologist"
    ],
    "prompt": "Create a presentation on Dermatology & Skin Health explaining skin anatomy, common skin conditions (acne, eczema, psoriasis), UV radiation damage and skin cancer prevention (ABCDE criteria for melanoma), skincare active ingredients (retinoids, vitamin C, SPF), and cosmetic dermatology treatments. Include skin layer diagrams and protection guides. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Dermatology Students, Estheticians & Patients"
  },
  {
    "id": "genomic_medicine",
    "category": "health",
    "icon": "🧬",
    "title": "Genomic Medicine & Personalized Healthcare",
    "desc": "DNA sequencing, pharmacogenomics, gene therapy & hereditary risk testing",
    "keywords": [
      "genomic medicine",
      "personalized health",
      "pharmacogenomics",
      "dna sequencing",
      "genetic testing"
    ],
    "prompt": "Create a presentation on Genomic Medicine & Personalized Healthcare covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, high-throughput DNA sequencing, identifying genetic disease risks, pharmacogenomics (tailoring drugs to genetic profiles), gene therapy successes, direct-to-consumer genetic testing, and ethical considerations. Include DNA sequencing flowcharts and precision medicine comparison charts.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Genetic Counselors, Researchers & Biotech Executives"
  },
  {
    "id": "eye_care_optometry",
    "category": "health",
    "icon": "👁️",
    "title": "Ophthalmology & Vision Care",
    "desc": "Eye anatomy, myopia, cataracts, glaucoma, LASIK & screen eye strain",
    "keywords": [
      "ophthalmology",
      "eye care",
      "myopia",
      "cataracts",
      "glaucoma",
      "lasik",
      "digital eye strain"
    ],
    "prompt": "Create a presentation on Ophthalmology & Vision Care covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, eye anatomy, refractive errors (myopia, hyperopia, astigmatism), age-related eye conditions (cataracts, macular degeneration, glaucoma), corrective surgeries (LASIK), and preventing digital eye strain (20-20-20 rule). Include optical diagrams and vision testing visual aids.",
    "template": "education",
    "slideCount": 8,
    "audience": "Optometry Students, Eye Care Patients & Office Workers"
  },
  {
    "id": "women_health_wellness",
    "category": "health",
    "icon": "🌸",
    "title": "Women's Health & Wellness",
    "desc": "Reproductive health, PCOS, maternal health, menopause & preventative screenings",
    "keywords": [
      "womens health",
      "pcos",
      "maternal health",
      "menopause",
      "mammography",
      "reproductive wellness"
    ],
    "prompt": "Create a supportive and informative presentation on Women's Health covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, hormonal health, menstrual cycle phases, Polycystic Ovary Syndrome (PCOS), maternal care and prenatal nutrition, menopause management, and preventative screenings (Pap smear, mammograms). Include health cycle diagrams and wellness roadmaps.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Women's Health Advocates, Doctors & General Public"
  },
  {
    "id": "men_health_wellness",
    "category": "health",
    "icon": "🏋️",
    "title": "Men's Health & Preventative Care",
    "desc": "Prostate health, testosterone levels, cardiovascular risk, mental health & fitness",
    "keywords": [
      "mens health",
      "prostate health",
      "testosterone",
      "cardiovascular risk",
      "mens mental health"
    ],
    "prompt": "Create a practical presentation on Men's Health covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, key risk factors, prostate health and PSA screening, maintaining healthy testosterone levels, heart disease prevention, overcoming barriers to mental health support, and age-appropriate physical fitness routines. Use structured health charts and risk assessment guides.",
    "template": "corporate",
    "slideCount": 8,
    "audience": "Men's Health Groups, Physicians & General Public"
  },
  {
    "id": "environmental_health_toxins",
    "category": "health",
    "icon": "☣️",
    "title": "Environmental Health & Toxicology",
    "desc": "Heavy metals, endocrine disruptors, water contaminants & occupational health",
    "keywords": [
      "environmental health",
      "toxicology",
      "heavy metals",
      "endocrine disruptors",
      "lead poisoning",
      "occupational safety"
    ],
    "prompt": "Create a presentation on Environmental Health & Toxicology covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, exposure pathways for environmental toxins, heavy metal toxicity (lead, mercury), endocrine disruptors in plastics, industrial worker hazards, indoor air pollutants, and regulatory standards for safe air and drinking water. Use toxicology exposure diagrams and safety standards tables.",
    "template": "education",
    "slideCount": 9,
    "audience": "Environmental Health Officers & Safety Inspectors"
  },
  {
    "id": "gastroenterology_gut_health",
    "category": "health",
    "icon": "🫐",
    "title": "Gastroenterology & Digestive Health",
    "desc": "Digestive system anatomy, IBS, acid reflux, gut microbiome & fiber benefits",
    "keywords": [
      "gastroenterology",
      "gut health",
      "ibs",
      "acid reflux",
      "gerd",
      "gut microbiome",
      "digestive system"
    ],
    "prompt": "Create a presentation on Gastroenterology & Digestive Health covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the digestive tract anatomy, gut microbiome functions, common disorders (GERD, IBS, Inflammatory Bowel Disease), dietary fiber and probiotics, liver health, and endoscopy diagnostic procedures. Include digestive system diagrams and gut health guidelines.",
    "template": "education",
    "slideCount": 9,
    "audience": "Gastroenterology Students, Dietitians & Patients"
  },
  {
    "id": "holistic_integrative_medicine",
    "category": "health",
    "icon": "🧘‍♀️",
    "title": "Integrative & Holistic Medicine",
    "desc": "Combining conventional & complementary therapies, acupuncture, Ayurveda & evidence",
    "keywords": [
      "integrative medicine",
      "holistic health",
      "ayurveda",
      "acupuncture",
      "naturopathy",
      "mind body medicine"
    ],
    "prompt": "Create a presentation on Integrative & Holistic Medicine covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the philosophy of treating the whole person (mind, body, spirit), combining evidence-based complementary therapies (acupuncture, yoga, herbal medicine) with conventional medical treatments, managing chronic pain, and evaluating scientific evidence for alternative remedies.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Healthcare Providers & Holistic Health Practitioners"
  },
  {
    "id": "medical_ethics_bioethics",
    "category": "health",
    "icon": "⚖️",
    "title": "Medical Ethics & Bioethics",
    "desc": "Autonomy, beneficence, informed consent, organ donation & end-of-life care",
    "keywords": [
      "medical ethics",
      "bioethics",
      "informed consent",
      "autonomy",
      "organ donation",
      "euthanasia",
      "patient rights"
    ],
    "prompt": "Create a thoughtful presentation on Medical Ethics & Bioethics covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the 4 core principles (autonomy, beneficence, non-maleficence, justice), obtaining informed consent, confidentiality, ethical dilemmas in organ allocation, genetic editing ethics, and end-of-life decision-making. Include ethical case study analysis flowcharts.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Medical Students, Ethics Committees & Healthcare Workers"
  },
  {
    "id": "addiction_recovery",
    "category": "health",
    "icon": "🌱",
    "title": "Addiction Science & Recovery Pathways",
    "desc": "Neurobiology of addiction, substance dependence, behavioral addiction & rehab",
    "keywords": [
      "addiction science",
      "substance abuse",
      "dopamine pathway",
      "rehabilitation",
      "recovery",
      "behavioral addiction"
    ],
    "prompt": "Create a compassionate presentation on Addiction Science & Recovery covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the neurobiology of reward pathways (dopamine hijacking), chemical dependence vs behavioral addictions, stages of change model, evidence-based treatments (MAT, behavioral therapy), harm reduction strategies, and supporting long-term recovery. Use neuro-pathway diagrams and recovery timeline models.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Counselors, Social Workers & Community Advocates"
  },
  {
    "id": "history_of_western_art",
    "category": "arts",
    "icon": "🎨",
    "title": "History of Western Art Movements",
    "desc": "Renaissance, Impressionism, Cubism, Surrealism & Pop Art evolution",
    "keywords": [
      "western art",
      "art history",
      "renaissance",
      "impressionism",
      "cubism",
      "surrealism",
      "pop art"
    ],
    "prompt": "Create a visually rich presentation on Western Art History covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, major periods from Classical Antiquity, Renaissance masters (Leonardo, Michelangelo), Impressionism (Monet), Cubism (Picasso), Surrealism (Dalí), to Pop Art (Warhol). Include iconic masterpiece artwork high-res visuals and style comparison timelines.",
    "template": "education",
    "slideCount": 10,
    "audience": "Art History Students & Gallery Enthusiasts"
  },
  {
    "id": "graphic_design_fundamentals",
    "category": "arts",
    "icon": "📐",
    "title": "Graphic Design Fundamentals",
    "desc": "Typography, color theory, grid systems, composition & brand identity",
    "keywords": [
      "graphic design",
      "typography",
      "color theory",
      "grid system",
      "branding",
      "layout design"
    ],
    "prompt": "Create an essential presentation on Graphic Design Fundamentals explaining color theory (RGB vs CMYK, color harmony), typography anatomy, layout balance and grid systems, contrast, alignment, whitespace, and building visual hierarchy in digital and print media. Include side-by-side design examples and grid layout mockups. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Beginner Graphic Designers, Marketers & Creators"
  },
  {
    "id": "music_theory_basics",
    "category": "arts",
    "icon": "🎵",
    "title": "Music Theory Basics & Harmony",
    "desc": "Scales, chords, rhythm, time signatures, musical notation & chord progressions",
    "keywords": [
      "music theory",
      "chords",
      "scales",
      "sheet music",
      "rhythm",
      "harmony",
      "chord progression"
    ],
    "prompt": "Create an accessible presentation on Music Theory Basics covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, staff notation, major and minor scales, interval structures, building triads and 7th chords, circle of fifths, rhythm & time signatures, and common pop/classical chord progressions. Include piano keyboard diagrams and musical staff notations.",
    "template": "education",
    "slideCount": 9,
    "audience": "Music Students, Songwriters & Instrumentalists"
  },
  {
    "id": "cinematography_film_making",
    "category": "arts",
    "icon": "🎬",
    "title": "Cinematography & Film Directing",
    "desc": "Camera angles, lighting setups, shot composition, color grading & storytelling",
    "keywords": [
      "cinematography",
      "filmmaking",
      "camera angles",
      "lighting setup",
      "color grading",
      "director"
    ],
    "prompt": "Create a cinematic presentation on Cinematography & Directing covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, camera shot types (wide, medium, close-up), rule of thirds and framing, 3-point lighting setups, camera movement techniques (tracking, pan, tilt), color grading moods, and visual storytelling principles. Include film frame examples and lighting diagrams.",
    "template": "dark",
    "slideCount": 10,
    "audience": "Film Students, Videographers & Content Creators"
  },
  {
    "id": "architectural_styles_history",
    "category": "arts",
    "icon": "🏛️",
    "title": "Architectural Styles Through History",
    "desc": "Gothic, Baroque, Neoclassical, Modernism, Brutalism & Contemporary design",
    "keywords": [
      "architecture",
      "architectural history",
      "gothic",
      "baroque",
      "modernism",
      "brutalism",
      "building design"
    ],
    "prompt": "Create a visual presentation on Architectural History spanning Gothic cathedrals, Renaissance domes, Baroque ornamentation, Neoclassical columns, Bauhaus modernism, mid-century modern, Brutalism, and parametric contemporary architecture. Include photos of famous landmarks and architectural structural diagrams. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 10,
    "audience": "Architecture Students & Urban Historians"
  },
  {
    "id": "photography_mastery",
    "category": "arts",
    "icon": "📷",
    "title": "Photography Exposure & Composition",
    "desc": "Aperture, shutter speed, ISO, depth of field, portrait lighting & framing",
    "keywords": [
      "photography",
      "exposure triangle",
      "aperture",
      "shutter speed",
      "iso",
      "portrait photography",
      "composition"
    ],
    "prompt": "Create a stunning presentation on Photography Mastery explaining the Exposure Triangle (Aperture, Shutter Speed, ISO), controlling depth of field, motion blur vs freezing action, lens selection, natural vs studio lighting, and compositional rules (leading lines, golden ratio). Include sample photographic exposure comparison grids. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Photographers & Visual Artists"
  },
  {
    "id": "fashion_design_history",
    "category": "arts",
    "icon": "👗",
    "title": "Fashion Design & Haute Couture",
    "desc": "Fashion eras, textile science, garment construction, runway shows & sustainability",
    "keywords": [
      "fashion design",
      "haute couture",
      "textiles",
      "runway",
      "fashion history",
      "sustainable fashion"
    ],
    "prompt": "Create a stylish presentation on Fashion Design covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, historical fashion eras (20s flapper, 50s Dior New Look, 90s minimalism), textile types and garment construction, moodboard creation, haute couture vs ready-to-wear, sustainable fashion ethics, and famous fashion houses. Include fashion sketch illustrations and textile charts.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Fashion Students, Designers & Stylists"
  },
  {
    "id": "3d_animation_cgi",
    "category": "arts",
    "icon": "👾",
    "title": "3D Animation & CGI Pipeline",
    "desc": "Modeling, rigging, keyframing, texturing, rendering & VFX production",
    "keywords": [
      "3d animation",
      "cgi",
      "blender",
      "maya",
      "rigging",
      "rendering",
      "vfx"
    ],
    "prompt": "Create a technical art presentation on 3D Animation & CGI production detailing polygonal modeling, UV unwrapping, texturing & shading, character rigging, 12 principles of animation, lighting, rendering engines (Cycles, Arnold), and VFX compositing. Include wireframe 3D model visuals and pipeline flowcharts. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "dark",
    "slideCount": 10,
    "audience": "3D Animators, VFX Artists & Game Artists"
  },
  {
    "id": "sculpture_3d_art",
    "category": "arts",
    "icon": "🗿",
    "title": "Sculpture & 3D Fine Art Formats",
    "desc": "Classical marble carving, bronze casting, installation art & digital 3D sculpting",
    "keywords": [
      "sculpture",
      "fine art",
      "bronze casting",
      "marble carving",
      "installation art",
      "digital sculpting"
    ],
    "prompt": "Create an artistic presentation on Sculpture & 3D Fine Art covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, traditional subtractive carving (marble), additive modeling (clay, wax), lost-wax bronze casting process, modern kinetic and installation art, and digital 3D sculpting (ZBrush). Include photos of famous historical and contemporary sculptures.",
    "template": "education",
    "slideCount": 9,
    "audience": "Art Students & Museum Visitors"
  },
  {
    "id": "theater_acting_stagecraft",
    "category": "arts",
    "icon": "🎭",
    "title": "Theater Production & Stagecraft",
    "desc": "Acting methods (Stanislavski), set design, stage lighting, acoustics & playwriting",
    "keywords": [
      "theater",
      "acting",
      "stagecraft",
      "stanislavski",
      "playwriting",
      "set design",
      "stage lighting"
    ],
    "prompt": "Create a theatrical presentation on Theater Production covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, acting techniques (Method acting, Meisner technique), stage layouts (proscenium, thrust, arena), set design engineering, theatrical lighting design, costume design, sound engineering, and directing classic plays. Include stage floorplan diagrams and set design sketches.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Drama Students, Theater Directors & Actors"
  },
  {
    "id": "classical_music_composers",
    "category": "arts",
    "icon": "🎻",
    "title": "Classical Music Eras & Great Composers",
    "desc": "Baroque, Classical, Romantic, Modernist eras, Bach, Mozart, Beethoven & Chopin",
    "keywords": [
      "classical music",
      "bach",
      "mozart",
      "beethoven",
      "symphony",
      "concerto",
      "baroque music"
    ],
    "prompt": "Create an inspiring presentation on Classical Music Eras profiling the Baroque era (Bach, Vivaldi), Classical era (Mozart, Haydn), Romantic era (Beethoven, Chopin, Tchaikovsky), and 20th Century Modernism (Stravinsky). Explain orchestral instruments, symphonic structure, and musical evolution. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Musicology Students & Classical Music Lovers"
  },
  {
    "id": "digital_art_illustration",
    "category": "arts",
    "icon": "✍️",
    "title": "Digital Art & Concept Illustration",
    "desc": "Graphics tablets, brushes, color blending, environment design & character art",
    "keywords": [
      "digital art",
      "concept art",
      "illustration",
      "photoshop art",
      "procreate",
      "character design"
    ],
    "prompt": "Create a visual presentation on Digital Art & Concept Illustration covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, software tools (Photoshop, Procreate), setting up drawing tablets, brush customization, color theory application, light and value rendering, concept art pipelines for movies/games, and selling digital art online. Include step-by-step painting process breakdowns.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Digital Illustrators & Concept Artists"
  },
  {
    "id": "indian_classical_dance",
    "category": "arts",
    "icon": "💃",
    "title": "Indian Classical Dance Forms",
    "desc": "Bharatanatyam, Kathak, Odissi, Kathakali, Mudras, Abhinaya & cultural heritage",
    "keywords": [
      "indian classical dance",
      "bharatanatyam",
      "kathak",
      "odissi",
      "mudras",
      "kathakali",
      "nATYA SHASTRA"
    ],
    "prompt": "Create a culturally rich presentation on Indian Classical Dance Forms covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Natya Shastra foundations, 8 recognized classical dances (Bharatanatyam, Kathak, Odissi, Kathakali, Kuchipudi, Manipuri, Mohiniyattam, Sattriya), hand mudras, facial expressions (Abhinaya), costumes, and musical accompaniment. Include costume photos and mudra diagrams.",
    "template": "education",
    "slideCount": 10,
    "audience": "Dance Students, Cultural Scholars & Enthusiasts"
  },
  {
    "id": "calligraphy_typography",
    "category": "arts",
    "icon": "✒️",
    "title": "Calligraphy & The Art of Lettering",
    "desc": "Western, Arabic, Chinese calligraphy, brush lettering, nibs & typographic design",
    "keywords": [
      "calligraphy",
      "lettering",
      "typography",
      "arabic calligraphy",
      "brush lettering",
      "hand lettering"
    ],
    "prompt": "Create an elegant presentation on Calligraphy & Hand Lettering covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, historical scripts (Uncial, Copperplate, Gothic), Islamic Arabic calligraphy traditions, Asian ink calligraphy, modern brush pen lettering, nib types & inks, and converting hand lettering into digital vector fonts. Include stroke-order guides and script specimens.",
    "template": "minimal",
    "slideCount": 8,
    "audience": "Calligraphers, Designers & Hobbyists"
  },
  {
    "id": "interior_design_principles",
    "category": "arts",
    "icon": "🛋️",
    "title": "Interior Design & Space Planning",
    "desc": "Color palettes, ergonomics, lighting layers, furniture layout & design styles",
    "keywords": [
      "interior design",
      "space planning",
      "furniture layout",
      "lighting design",
      "home decor",
      "ergonomics"
    ],
    "prompt": "Create a stylish presentation on Interior Design & Space Planning explaining design styles (Minimalist, Industrial, Scandinavian, Bohemian), space planning ergonomics, 3 lighting layers (ambient, task, accent), material selection, color psychology in living spaces, and 3D floorplan rendering tools. Include moodboard layouts and floorplan diagrams. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Interior Designers, Homeowners & Architects"
  },
  {
    "id": "pottery_ceramic_art",
    "category": "arts",
    "icon": "🏺",
    "title": "Pottery & Ceramic Artistry",
    "desc": "Wheel throwing, hand-building, glazing techniques, kilns & ceramic history",
    "keywords": [
      "pottery",
      "ceramic art",
      "wheel throwing",
      "glazing",
      "kiln firing",
      "clay sculpture"
    ],
    "prompt": "Create a craft-centered presentation on Pottery & Ceramic Artistry covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, clay bodies (earthenware, stoneware, porcelain), hand-building techniques (pinch, coil, slab), pottery wheel throwing process, ceramic glazing chemistry, firing stages (bisque and glaze firings in kilns), and famous pottery cultures. Include process photo series.",
    "template": "education",
    "slideCount": 8,
    "audience": "Potters, Crafters & Fine Art Students"
  },
  {
    "id": "contemporary_art_movements",
    "category": "arts",
    "icon": "🖼️",
    "title": "Contemporary & Avant-Garde Art",
    "desc": "Conceptual art, street art, performance art, NFT digital art & museum curation",
    "keywords": [
      "contemporary art",
      "street art",
      "conceptual art",
      "banksy",
      "nft art",
      "art curation"
    ],
    "prompt": "Create a provocative presentation on Contemporary & Avant-Garde Art detailing post-1970s movements, Conceptual Art (Duchamp's legacy), Street Art & Graffiti (Banksy, Basquiat), Performance & Video Art, NFT crypto art, and how modern galleries curate controversial artworks. Include controversial artwork case studies. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Art Critics, Gallery Curators & Collectors"
  },
  {
    "id": "sound_design_audio_engineering",
    "category": "arts",
    "icon": "🎛️",
    "title": "Sound Design & Audio Engineering",
    "desc": "DAWs, mixing, mastering, Foley sound effects, synthesizers & acoustics",
    "keywords": [
      "sound design",
      "audio engineering",
      "mixing",
      "mastering",
      "foley",
      "synthesizer",
      "daw"
    ],
    "prompt": "Create a technical presentation on Sound Design & Audio Engineering covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Digital Audio Workstations (Pro Tools, Ableton), acoustic treatment, microphone polar patterns, Foley sound effect creation for movies, subtractive/FM synthesis, mixing EQ/compression, and final mastering. Include audio signal chain flowcharts.",
    "template": "dark",
    "slideCount": 10,
    "audience": "Audio Engineers, Producers & Sound Designers"
  },
  {
    "id": "folk_art_traditions",
    "category": "arts",
    "icon": "🪵",
    "title": "Global Folk Art & Indigenous Craft",
    "desc": "Warli art, Madhubani, Mexican alebrijes, African masks & cultural preservation",
    "keywords": [
      "folk art",
      "indigenous art",
      "madhubani",
      "warli art",
      "handicrafts",
      "cultural preservation"
    ],
    "prompt": "Create a colorful presentation on Global Folk Art & Indigenous Crafts showcasing Madhubani and Warli painting from India, Mexican Alebrijes and Papel Picado, African tribal wood masks, Japanese Kintsugi, Indigenous Australian dot painting, and preserving traditional craftsmanship against industrialization. Include traditional art motifs. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Cultural Heritage Researchers & Art Enthusiasts"
  },
  {
    "id": "jazz_music_history",
    "category": "arts",
    "icon": "🎷",
    "title": "Jazz Music Evolution & Improv",
    "desc": "New Orleans roots, Swing era, Bebop, Cool Jazz, Fusion & legendary musicians",
    "keywords": [
      "jazz music",
      "bebop",
      "swing music",
      "miles davis",
      "improvisation",
      "louis armstrong"
    ],
    "prompt": "Create a soulful presentation on Jazz Music Evolution tracing origins in African-American blues and ragtime in New Orleans, Swing big bands (Duke Ellington), Bebop revolution (Charlie Parker, Dizzy Gillespie), Cool Jazz (Miles Davis), Fusion, and the art of musical improvisation. Include jazz timeline visuals and legendary artist profiles. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Jazz Musicians, Music Students & Historians"
  },
  {
    "id": "industrial_product_design",
    "category": "arts",
    "icon": "⌚",
    "title": "Industrial & Product Design",
    "desc": "Form follows function, Dieter Rams design rules, prototyping & manufacturing",
    "keywords": [
      "industrial design",
      "product design",
      "dieter rams",
      "prototyping",
      "cad",
      "design thinking"
    ],
    "prompt": "Create a clean presentation on Industrial & Product Design covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Dieter Rams' 10 Principles of Good Design, user-centric product research, sketching and CAD modeling (SolidWorks, Fusion 360), rapid 3D print prototyping, injection molding manufacturing, and sustainable product design. Include product teardown and prototype photos.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Industrial Designers & Hardware Engineers"
  },
  {
    "id": "comic_manga_creation",
    "category": "arts",
    "icon": "🎨",
    "title": "Comic & Manga Storytelling",
    "desc": "Panel layout, lettering, storytelling pacing, character design & inking",
    "keywords": [
      "manga",
      "comics",
      "comic book art",
      "panel layout",
      "character design",
      "storyboarding"
    ],
    "prompt": "Create an action-packed presentation on Comic & Manga Storytelling explaining comic scriptwriting, character turnarounds, panel layout and gutters (closure effect), camera pacing, screentones and inking, speech balloon lettering, and publishing indie webcomics vs traditional Manga. Include page layout breakdown diagrams. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Comic Artists, Mangaka & Illustrators"
  },
  {
    "id": "origami_paper_craft",
    "category": "arts",
    "icon": "📄",
    "title": "Origami & Mathematical Paper Folding",
    "desc": "Traditional Japanese origami, tessellations, engineering applications & crease patterns",
    "keywords": [
      "origami",
      "paper folding",
      "crease pattern",
      "tessellation",
      "origami engineering"
    ],
    "prompt": "Create a fascinating presentation on Origami & Paper Folding covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Akira Yoshizawa's notation system, modular origami, tessellations, mathematical geometry behind paper folding, and modern engineering applications of origami (space solar panels, medical stents, deployable structures). Include crease pattern diagrams and origami step guides.",
    "template": "education",
    "slideCount": 8,
    "audience": "Mathematicians, Engineers & Origami Enthusiasts"
  },
  {
    "id": "screenwriting_narrative",
    "category": "arts",
    "icon": "✍️",
    "title": "Screenwriting & Narrative Structure",
    "desc": "Three-act structure, Hero's Journey, character arcs, scene writing & dialogue",
    "keywords": [
      "screenwriting",
      "scriptwriting",
      "three act structure",
      "heros journey",
      "dialogue",
      "character arc"
    ],
    "prompt": "Create a narrative-focused presentation on Screenwriting explaining the Three-Act Structure, Joseph Campbell's Hero's Journey, creating compelling character arcs, writing authentic dialogue, scene beats & pacing, formatting industry-standard scripts (Final Draft), and pitching screenplays. Include story arc diagrams and script page examples. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Screenwriters, Authors & Directors"
  },
  {
    "id": "user_interface_animation",
    "category": "arts",
    "icon": "✨",
    "title": "UI Motion Design & Micro-Interactions",
    "desc": "Easing curves, UI transitions, Lottie animations, feedback cues & delight",
    "keywords": [
      "motion design",
      "ui animation",
      "micro interactions",
      "easing",
      "lottie",
      "after effects"
    ],
    "prompt": "Create a dynamic presentation on UI Motion Design covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, functional vs decorative animation, easing curves (cubic-bezier), micro-interactions (button feedback, loading spinners), Lottie file exports, spatial interface motion, and performance guidelines for mobile/web interfaces. Include animated UI transition breakdowns.",
    "template": "startup",
    "slideCount": 9,
    "audience": "UI/UX Designers & Motion Graphics Artists"
  },
  {
    "id": "mindfulness_meditation",
    "category": "lifestyle",
    "icon": "🧘‍♂️",
    "title": "Mindfulness & Daily Meditation",
    "desc": "Vipassana, breathwork, stress reduction, neurobiology of meditation & habits",
    "keywords": [
      "mindfulness",
      "meditation",
      "breathwork",
      "stress relief",
      "vipassana",
      "mental clarity"
    ],
    "prompt": "Create a peaceful presentation on Mindfulness & Meditation explaining the science of stress reduction (lowering cortisol), breathwork techniques (Box breathing, 4-7-8), Mindfulness-Based Stress Reduction (MBSR), Vipassana body scan, overcoming brain chatter, and establishing a sustainable daily meditation habit. Include practice steps. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Wellness Seekers, Corporate Employees & Individuals"
  },
  {
    "id": "time_management_productivity",
    "category": "lifestyle",
    "icon": "⏱️",
    "title": "Time Management & Productivity Systems",
    "desc": "Eisenhower matrix, Time blocking, Getting Things Done (GTD) & focus hacks",
    "keywords": [
      "time management",
      "productivity",
      "eisenhower matrix",
      "time blocking",
      "gtd",
      "pomodoro"
    ],
    "prompt": "Create an empowering presentation on Time Management Systems detailing the Eisenhower Urgent/Important Matrix, David Allen's Getting Things Done (GTD) framework, Time Blocking on calendars, eliminating distraction, managing energy over time, and tools like Notion and Todoist. Include system framework diagrams. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Professionals, Students & Entrepreneurs"
  },
  {
    "id": "stoic_philosophy_living",
    "category": "lifestyle",
    "icon": "🏛️",
    "title": "Stoicism for Modern Living",
    "desc": "Dichotomy of control, Marcus Aurelius, emotional resilience & journal practices",
    "keywords": [
      "stoicism",
      "marcus aurelius",
      "seneca",
      "epictetus",
      "resilience",
      "dichotomy of control"
    ],
    "prompt": "Create a practical presentation on Stoicism for Modern Life exploring core teachings of Marcus Aurelius, Seneca, and Epictetus. Explain the Dichotomy of Control, Amor Fati, Memento Mori, managing anger and anxiety, daily journaling practices, and building unshakeable mental resilience in challenging times. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Seekers of Mental Resilience & General Public"
  },
  {
    "id": "strength_training_fitness",
    "category": "lifestyle",
    "icon": "🏋️‍♂️",
    "title": "Strength Training & Muscle Hypertrophy",
    "desc": "Progressive overload, compound movements, muscle recovery & protein synthesis",
    "keywords": [
      "strength training",
      "fitness",
      "muscle building",
      "hypertrophy",
      "progressive overload",
      "bodybuilding"
    ],
    "prompt": "Create a science-based presentation on Strength Training & Hypertrophy explaining progressive overload mechanisms, compound vs isolation lifts (squat, bench, deadlift), mechanical tension and muscle damage, protein synthesis timing, workout splits (Push/Pull/Legs), and avoiding overtraining. Include muscle group charts. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Gym-goers, Personal Trainers & Fitness Enthusiasts"
  },
  {
    "id": "habit_building_atomic",
    "category": "lifestyle",
    "icon": "⚡",
    "title": "Science of Habit Building & Change",
    "desc": "Habit loop (Cue-Craving-Response-Reward), identity habits & breaking bad habits",
    "keywords": [
      "habits",
      "atomic habits",
      "habit loop",
      "behavior change",
      "self discipline",
      "routine"
    ],
    "prompt": "Create a transformational presentation on the Science of Habit Building explaining Charles Duhigg and James Clear frameworks: Cue, Craving, Response, Reward. Cover identity-based habits, 2-minute rule, habit stacking, environment design, friction reduction, and breaking destructive addiction loops. Include habit tracking templates. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Individuals Seeking Personal Growth & Coaches"
  },
  {
    "id": "public_speaking_oratory",
    "category": "lifestyle",
    "icon": "🎤",
    "title": "Public Speaking & Oratory Mastery",
    "desc": "Vocal modulation, stage presence, overcoming glossophobia, speech structure & body language",
    "keywords": [
      "public speaking",
      "oratory",
      "speech writing",
      "stage fear",
      "body language",
      "toastmasters"
    ],
    "prompt": "Create a high-impact presentation on Public Speaking Mastery covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, overcoming stage fear (glossophobia), structuring a speech with hook and call-to-action, vocal pitch and pacing modulation, non-verbal body language, handling Q&A sessions, and storytelling techniques used by TED speakers. Include speech outline blueprints.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Professionals, Students & Public Speakers"
  },
  {
    "id": "financial_independence_fire",
    "category": "lifestyle",
    "icon": "🔥",
    "title": "Financial Independence, Retire Early (FIRE)",
    "desc": "Savings rate, 4% withdrawal rule, index funds, frugal living & passive income",
    "keywords": [
      "fire movement",
      "financial independence",
      "retire early",
      "4 percent rule",
      "index funds",
      "passive income"
    ],
    "prompt": "Create a strategic presentation on the FIRE (Financial Independence, Retire Early) movement explaining LeanFIRE vs FatFIRE, calculating your FIRE number, achieving 50%+ savings rates, investing in broad low-cost index funds, 4% safe withdrawal rule, and creating multiple passive income streams. Include compound interest growth charts. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "finance",
    "slideCount": 9,
    "audience": "Young Professionals & Financial Planners"
  },
  {
    "id": "minimalism_decluttering",
    "category": "lifestyle",
    "icon": "🧹",
    "title": "Minimalism & Intentional Living",
    "desc": "KonMari method, digital minimalism, capsule wardrobe & financial freedom",
    "keywords": [
      "minimalism",
      "konmari",
      "decluttering",
      "digital minimalism",
      "intentional living",
      "essentialism"
    ],
    "prompt": "Create a serene presentation on Minimalism & Intentional Living covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, physical decluttering (Marie Kondo method), digital decluttering (inbox zero, phone boundaries), capsule wardrobes, essentialism in commitments, reducing consumerism, and reclaiming time and focus for what truly matters.",
    "template": "minimal",
    "slideCount": 8,
    "audience": "Overwhelmed Professionals & General Audience"
  },
  {
    "id": "yoga_pranayama_practice",
    "category": "lifestyle",
    "icon": "🧘‍♀️",
    "title": "Yoga Philosophy & Asana Practice",
    "desc": "Eight limbs of yoga, Patanjali sutras, Asanas, Pranayama & flexibility",
    "keywords": [
      "yoga",
      "asanas",
      "pranayama",
      "eight limbs of yoga",
      "patanjali",
      "flexibility",
      "wellness"
    ],
    "prompt": "Create a holistic presentation on Yoga Philosophy & Practice detailing Patanjali's 8 Limbs of Yoga (Yama, Niyama, Asana, Pranayama, etc.), physical benefits of core poses, breath control (Pranayama), chakra alignment, safety and alignment principles, and integrating yoga into a daily routine. Include pose illustrations. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Yoga Practitioners, Teachers & Wellness Enthusiasts"
  },
  {
    "id": "emotional_intelligence_eq",
    "category": "lifestyle",
    "icon": "❤️",
    "title": "Emotional Intelligence (EQ) in Life",
    "desc": "Self-awareness, empathy, emotional regulation, social skills & relationship health",
    "keywords": [
      "emotional intelligence",
      "eq",
      "empathy",
      "self awareness",
      "emotional regulation",
      "relationships"
    ],
    "prompt": "Create a deep presentation on Emotional Intelligence (EQ) covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Daniel Goleman's 5 components: Self-Awareness, Self-Regulation, Internal Motivation, Empathy, and Social Skills. Explain recognizing emotional triggers, active listening, managing conflicts compassionately, and elevating EQ over IQ in life success. Include EQ self-assessment visual framework.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Leaders, Couples, Students & Individuals"
  },
  {
    "id": "fasting_autophagy_health",
    "category": "lifestyle",
    "icon": "⏳",
    "title": "Intermittent Fasting & Autophagy",
    "desc": "16/8 fasting, cellular cleanup (autophagy), insulin sensitivity & longevity",
    "keywords": [
      "intermittent fasting",
      "autophagy",
      "16 8 fasting",
      "ketosis",
      "longevity",
      "cellular repair"
    ],
    "prompt": "Create a science-backed presentation on Intermittent Fasting & Autophagy detailing popular protocols (16/8, 5:2, OMAD), Nobel Prize-winning cellular autophagy mechanisms, improving insulin sensitivity, fat loss vs muscle retention, who should avoid fasting, and how to break fasts safely. Include fasting timeline stages. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 8,
    "audience": "Health Seekers, Dieters & Biohackers"
  },
  {
    "id": "biohacking_longevity_hacks",
    "category": "lifestyle",
    "icon": "🧬",
    "title": "Biohacking & Science of Longevity",
    "desc": "Cold exposure, red light therapy, NMN, HRV tracking & optimizing healthspan",
    "keywords": [
      "biohacking",
      "longevity",
      "healthspan",
      "cold plunge",
      "red light therapy",
      "hrv",
      "nmn"
    ],
    "prompt": "Create an innovative presentation on Biohacking & Longevity optimizing healthspan over lifespan. Cover cold water immersion (Wim Hof), saunas, Heart Rate Variability (HRV) tracking, NMN/NAD+ supplements, blue-light blocking, red light therapy, and data-driven biohacking experiments. Include healthspan vs lifespan comparison charts. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Biohackers, Tech Executives & Health Enthusiasts"
  },
  {
    "id": "journaling_mental_clarity",
    "category": "lifestyle",
    "icon": "📓",
    "title": "Journaling Methods for Mental Clarity",
    "desc": "Bullet Journal (BuJo), Morning Pages, gratitude logs & cognitive brain dumps",
    "keywords": [
      "journaling",
      "bullet journal",
      "bujo",
      "morning pages",
      "gratitude journal",
      "mental clarity"
    ],
    "prompt": "Create a reflective presentation on Journaling Methods covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Julia Cameron's Morning Pages, Ryder Carroll's Bullet Journal (BuJo) system, Gratitude Journaling, Stoic evening reviews, and Brain Dumping for anxiety relief. Include page layout templates and habit tracker designs.",
    "template": "minimal",
    "slideCount": 8,
    "audience": "Writers, Creatives & Stressed Individuals"
  },
  {
    "id": "work_life_balance_burnout",
    "category": "lifestyle",
    "icon": "⚖️",
    "title": "Overcoming Burnout & Work-Life Balance",
    "desc": "Signs of burnout, setting boundaries, detachment, digital detox & recharge",
    "keywords": [
      "burnout",
      "work life balance",
      "stress management",
      "digital detox",
      "boundaries",
      "mental exhaustion"
    ],
    "prompt": "Create a vital presentation on Overcoming Burnout explaining World Health Organization criteria for occupational burnout, identifying physical/emotional exhaustion signs, establishing firm work-home boundaries, saying 'no' gracefully, taking true digital detoxes, and rebuilding personal vitality. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Corporate Workers, Executives & Freelancers"
  },
  {
    "id": "running_marathon_training",
    "category": "lifestyle",
    "icon": "🏃‍♂️",
    "title": "Running & Marathon Preparation",
    "desc": "Gait analysis, Zone 2 training, marathon nutrition, shoe selection & recovery",
    "keywords": [
      "running",
      "marathon training",
      "zone 2 running",
      "long distance",
      "running shoes",
      "endurance"
    ],
    "prompt": "Create an athletic presentation on Running & Marathon Training covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, proper foot strike biomechanics, Zone 2 low-heart-rate endurance building, 16-week marathon training plans, fueling with carbs/electrolytes on long runs, choosing running shoes, and preventing shin splints/runner's knee. Include weekly mileage ramp-up charts.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Runners, Triathletes & Fitness Coaches"
  },
  {
    "id": "gardening_home_farming",
    "category": "lifestyle",
    "icon": "🪴",
    "title": "Home Gardening & Urban Agriculture",
    "desc": "Soil health, composting, balcony gardening, vegetable growing & pest control",
    "keywords": [
      "gardening",
      "urban farming",
      "composting",
      "balcony garden",
      "organic vegetables",
      "soil health"
    ],
    "prompt": "Create a green presentation on Home Gardening & Urban Agriculture covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, soil composition & organic composting, seed germination, growing vegetables in small spaces/balconies, natural pest deterrents, rainwater harvesting for plants, and mental health benefits of gardening. Include plant care calendars.",
    "template": "minimal",
    "slideCount": 8,
    "audience": "Homeowners, Urbanites & Eco-Lovers"
  },
  {
    "id": "diy_home_improvement",
    "category": "lifestyle",
    "icon": "🔨",
    "title": "DIY Home Improvement & Tool Safety",
    "desc": "Power tools, drywall repair, painting techniques, basic plumbing & safety gear",
    "keywords": [
      "diy home improvement",
      "power tools",
      "painting tips",
      "drywall repair",
      "plumbing basics",
      "home maintenance"
    ],
    "prompt": "Create a practical presentation on DIY Home Improvement covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, essential hand & power tools every homeowner needs, safety gear (eye/ear protection), drywall patching, interior painting techniques (cutting in, rolling), fixing simple plumbing leaks, and budgeting DIY projects. Include step-by-step repair guides.",
    "template": "corporate",
    "slideCount": 8,
    "audience": "Homeowners, Handymen & DIY Enthusiasts"
  },
  {
    "id": "pet_care_dog_training",
    "category": "lifestyle",
    "icon": "🐕",
    "title": "Pet Care & Positive Dog Training",
    "desc": "Canine behavior, positive reinforcement, pet nutrition, grooming & vet care",
    "keywords": [
      "pet care",
      "dog training",
      "positive reinforcement",
      "canine behavior",
      "pet nutrition",
      "vet checkup"
    ],
    "prompt": "Create a heartwarming presentation on Pet Care & Dog Training covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, positive reinforcement techniques (clicker training), understanding canine body language, optimal pet nutrition, routine vet preventative care, socialization, and addressing separation anxiety. Include behavior chart visual aids.",
    "template": "minimal",
    "slideCount": 8,
    "audience": "Pet Owners, Dog Trainers & Animal Shelter Volunteers"
  },
  {
    "id": "sustainable_travel_ecotourism",
    "category": "lifestyle",
    "icon": "🎒",
    "title": "Sustainable Travel & Ecotourism",
    "desc": "Packing light, leave no trace, supporting local economies & low-carbon transit",
    "keywords": [
      "sustainable travel",
      "ecotourism",
      "leave no trace",
      "packing light",
      "responsible travel"
    ],
    "prompt": "Create an inspiring presentation on Sustainable Travel & Ecotourism covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, carbon footprint reduction (train over flight), Leave No Trace principles in nature, choosing eco-certified lodgings, supporting indigenous local businesses, ethical wildlife interactions, and ultra-light travel packing strategies. Include eco-travel checklists.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Backpackers, Travelers & Eco-Tourists"
  },
  {
    "id": "negotiation_persuasion_life",
    "category": "lifestyle",
    "icon": "🤝",
    "title": "Art of Negotiation & Persuasion",
    "desc": "Chris Voss tactics, mirroring, labeling, batna & win-win agreements",
    "keywords": [
      "negotiation",
      "persuasion",
      "chris voss",
      "never split the difference",
      "batna",
      "communication"
    ],
    "prompt": "Create a compelling presentation on the Art of Negotiation & Persuasion exploring FBI negotiator Chris Voss techniques: Tactical Empathy, Mirroring, Labeling, Calibrated Questions, and identifying BATNA (Best Alternative to a Negotiated Agreement). Apply principles to salary raises, purchasing, and interpersonal disputes. Include dialogue scripts. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Salespeople, Job Seekers & Professionals"
  },
  {
    "id": "baking_pastry_arts",
    "category": "lifestyle",
    "icon": "🍞",
    "title": "Sourdough & Culinary Baking Science",
    "desc": "Fermentation, gluten development, hydration percentages & oven spring",
    "keywords": [
      "baking science",
      "sourdough",
      "bread making",
      "fermentation",
      "gluten",
      "baking"
    ],
    "prompt": "Create a mouth-watering presentation on Sourdough & Culinary Baking Science covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, wild yeast starter cultivation, baker's math & hydration percentages, autolyse and gluten development, bulk fermentation stages, scoring techniques, and achieving optimal oven spring. Include baking process timelines.",
    "template": "education",
    "slideCount": 9,
    "audience": "Bakers, Culinary Students & Home Chefs"
  },
  {
    "id": "speed_reading_memory_hacks",
    "category": "lifestyle",
    "icon": "📖",
    "title": "Speed Reading & Supercharging Memory",
    "desc": "Subvocalization elimination, Memory Palace (Loci), chunking & recall speed",
    "keywords": [
      "speed reading",
      "memory hacks",
      "memory palace",
      "subvocalization",
      "mnemonics",
      "accelerated learning"
    ],
    "prompt": "Create an intellectual presentation on Speed Reading & Memory Hacks covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, eliminating subvocalization, using visual pacers, chunking text, constructing a Memory Palace (Method of Loci), Peg systems, and mnemonic devices for rapid learning and retention. Include memory exercise examples.",
    "template": "education",
    "slideCount": 8,
    "audience": "Students, Researchers & Lifelong Learners"
  },
  {
    "id": "personal_style_wardrobe",
    "category": "lifestyle",
    "icon": "👔",
    "title": "Personal Style & Capsule Wardrobe",
    "desc": "Color seasonal analysis, body proportion dressing, essential staples & clothing care",
    "keywords": [
      "personal style",
      "capsule wardrobe",
      "fashion staples",
      "dressing well",
      "color analysis"
    ],
    "prompt": "Create a chic presentation on Personal Style & Capsule Wardrobe detailing seasonal color analysis, understanding body proportions, building a 30-piece versatile capsule wardrobe for work and leisure, garment care and tailoring, and dressing with confidence without fast fashion waste. Include wardrobe matrix graphics. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "minimal",
    "slideCount": 8,
    "audience": "Style-conscious Individuals & Fashion Beginners"
  },
  {
    "id": "coffee_brewing_barista",
    "category": "lifestyle",
    "icon": "☕",
    "title": "Coffee Science & Barista Crafts",
    "desc": "Espresso extraction, grind size, pour-over methods, bean origins & latte art",
    "keywords": [
      "coffee science",
      "espresso",
      "barista",
      "pour over",
      "coffee beans",
      "latte art"
    ],
    "prompt": "Create an aromatic presentation on Coffee Science & Barista Crafts covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Arabica vs Robusta bean origins, roasting profiles, extraction variables (grind size, water temp, pressure), mastering Pour-Over (V60, Chemex) and Espresso, steaming micro-foam for latte art, and specialty coffee tasting notes. Include extraction chart visuals.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Coffee Enthusiasts, Baristas & Cafe Owners"
  },
  {
    "id": "parenting_positive_discipline",
    "category": "lifestyle",
    "icon": "👨‍👩‍👧",
    "title": "Positive Parenting & Child Connection",
    "desc": "Emotion coaching, setting calm boundaries, reducing tantrums & parent resilience",
    "keywords": [
      "parenting",
      "positive discipline",
      "child psychology",
      "tantrums",
      "parent child bond",
      "family"
    ],
    "prompt": "Create a compassionate presentation on Positive Parenting covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, emotion coaching over punishment, setting firm respectful boundaries, navigating toddler tantrums and teenage independence, active empathetic listening, encouraging autonomy, and maintaining parent self-care. Include parent-child communication scripts.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Parents, Caregivers & Family Counselors"
  },
  {
    "id": "constitutional_law_rights",
    "category": "law",
    "icon": "📜",
    "title": "Constitutional Law & Civil Liberties",
    "desc": "Separation of powers, free speech, due process, judicial review & landmark cases",
    "keywords": [
      "constitutional law",
      "civil liberties",
      "free speech",
      "due process",
      "judicial review",
      "supreme court"
    ],
    "prompt": "Create an authoritative presentation on Constitutional Law & Civil Liberties covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, separation of powers, judicial review, freedom of speech and press, equal protection clause, due process of law, fundamental privacy rights, and landmark Supreme Court decisions shaping society. Include legal framework hierarchy diagrams.",
    "template": "corporate",
    "slideCount": 10,
    "audience": "Law Students, Attorneys & Civics Educators"
  },
  {
    "id": "intellectual_property_ip",
    "category": "law",
    "icon": "💡",
    "title": "Intellectual Property (IP) Protection",
    "desc": "Patents, trademarks, copyrights, trade secrets & IP litigation",
    "keywords": [
      "intellectual property",
      "ip law",
      "patents",
      "trademarks",
      "copyright",
      "trade secrets",
      "licensing"
    ],
    "prompt": "Create a comprehensive presentation on Intellectual Property (IP) Law explaining the 4 main IP pillars: Patents (utility vs design), Trademarks (brand protection), Copyrights (artistic creations), and Trade Secrets. Cover IP registration, licensing agreements, fair use doctrine, and international IP enforcement (WIPO). Include IP comparison tables. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Entrepreneurs, Inventors, Artists & Business Owners"
  },
  {
    "id": "cyber_law_data_privacy",
    "category": "law",
    "icon": "🛡️",
    "title": "Cyber Law, GDPR & Data Privacy",
    "desc": "GDPR, CCPA, cybercrime legislation, data breach liability & digital rights",
    "keywords": [
      "cyber law",
      "gdpr",
      "data privacy",
      "ccpa",
      "data breach",
      "cybercrime law",
      "privacy regulation"
    ],
    "prompt": "Create a crucial presentation on Cyber Law & Data Privacy Regulations covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, General Data Protection Regulation (GDPR), CCPA, India's DPDP Act, data subject rights (right to be forgotten), corporate data breach notification requirements, cloud compliance, and legal penalties for non-compliance. Include compliance readiness flowcharts.",
    "template": "corporate",
    "slideCount": 10,
    "audience": "Legal Counsel, CTOs, Compliance Officers & Students"
  },
  {
    "id": "criminal_law_procedure",
    "category": "law",
    "icon": "⚖️",
    "title": "Criminal Law & Judicial Procedure",
    "desc": "Elements of crime (Mens Rea & Actus Reus), trial process, bail & sentencing",
    "keywords": [
      "criminal law",
      "criminal procedure",
      "mens rea",
      "actus reus",
      "bail",
      "trial",
      "prosecution"
    ],
    "prompt": "Create an informative presentation on Criminal Law & Judicial Procedure detailing elements of crime (Actus Reus and Mens Rea), police investigation & arrest procedures, rights of accused persons, bail hearings, plea bargaining, trial proceedings, burden of proof (beyond reasonable doubt), and sentencing guidelines. Include criminal trial flowcharts. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 10,
    "audience": "Law Students, Paralegals & Law Enforcement Aspirants"
  },
  {
    "id": "corporate_law_governance",
    "category": "law",
    "icon": "🏢",
    "title": "Corporate Law & Mergers & Acquisitions",
    "desc": "Company formation, shareholder rights, board duties, M&A due diligence & compliance",
    "keywords": [
      "corporate law",
      "mergers and acquisitions",
      "m&a",
      "board of directors",
      "shareholder rights",
      "compliance"
    ],
    "prompt": "Create a business legal presentation on Corporate Law & Mergers & Acquisitions covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, corporate entity structures (LLC, Inc, Pvt Ltd), fiduciary duties of directors (care and loyalty), shareholder agreements, M&A deal structures, due diligence checklists, antitrust approvals, and corporate restructuring. Include M&A process timelines.",
    "template": "corporate",
    "slideCount": 10,
    "audience": "Corporate Lawyers, Business Executives & Investment Bankers"
  },
  {
    "id": "international_law_treaties",
    "category": "law",
    "icon": "🌐",
    "title": "Public International Law & Global Treaties",
    "desc": "United Nations, International Court of Justice, sovereignty, Geneva convention & treaties",
    "keywords": [
      "international law",
      "united nations",
      "icj",
      "geneva convention",
      "treaties",
      "diplomatic immunity"
    ],
    "prompt": "Create an insightful presentation on Public International Law covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, sources of international law (treaties, customary law), United Nations charter, International Court of Justice (ICJ), diplomatic immunity, laws of armed conflict (Geneva Conventions), state sovereignty, and enforcing international sanctions. Include UN organ organizational charts.",
    "template": "education",
    "slideCount": 10,
    "audience": "International Relations & Law Students, Diplomats"
  },
  {
    "id": "environmental_law_policy",
    "category": "law",
    "icon": "🌿",
    "title": "Environmental Law & Climate Policy",
    "desc": "Paris Agreement, National Green Tribunal, EIA, carbon credits & environmental compliance",
    "keywords": [
      "environmental law",
      "paris agreement",
      "climate policy",
      "eia",
      "carbon credits",
      "green litigation"
    ],
    "prompt": "Create an impactful presentation on Environmental Law & Climate Policy covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, global accords (Paris Agreement, Kyoto Protocol), Environmental Impact Assessment (EIA) mandates, pollution control legislation, public trust doctrine, carbon trading mechanisms, National Green Tribunal (NGT) rulings, and climate litigation against corporations.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Environmental Lawyers, Policy Analysts & Activists"
  },
  {
    "id": "labor_employment_law",
    "category": "law",
    "icon": "👷‍♂️",
    "title": "Labor & Employment Law",
    "desc": "Workplace contracts, wrongful termination, wage laws, harassment protection & unions",
    "keywords": [
      "employment law",
      "labor law",
      "wrongful termination",
      "minimum wage",
      "posh act",
      "unions"
    ],
    "prompt": "Create a vital legal presentation on Labor & Employment Law covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, employee vs independent contractor classification, employment contracts, minimum wage & overtime rules, workplace harassment protection (POSH), wrongful termination standards, severance agreements, and collective bargaining/union rights. Include workplace policy compliance checklists.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "HR Managers, Labor Lawyers & Employees"
  },
  {
    "id": "contract_law_drafting",
    "category": "law",
    "icon": "📝",
    "title": "Contract Law & Agreement Drafting",
    "desc": "Offer, acceptance, consideration, breach of contract, indemnity & dispute clauses",
    "keywords": [
      "contract law",
      "contract drafting",
      "offer and acceptance",
      "consideration",
      "breach of contract",
      "indemnity"
    ],
    "prompt": "Create a practical legal presentation on Contract Law & Agreement Drafting detailing essential elements of a valid contract (Offer, Acceptance, Consideration, Capacity), key clauses (Indemnity, Limitation of Liability, Termination, Force Majeure, Governing Law), common drafting mistakes, and remedies for breach of contract. Include contract clause breakdowns. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Lawyers, Business Managers & Contract Specialists"
  },
  {
    "id": "human_rights_law",
    "category": "law",
    "icon": "🕊️",
    "title": "International Human Rights Law",
    "desc": "UDHR, ICCPR, refugee rights, genocide convention & human rights courts",
    "keywords": [
      "human rights law",
      "udhr",
      "refugee rights",
      "iccpr",
      "human rights court",
      "amnesty"
    ],
    "prompt": "Create an inspiring presentation on International Human Rights Law examining Universal Declaration of Human Rights (UDHR), International Covenant on Civil and Political Rights (ICCPR), European Court of Human Rights, refugee protection protocols, conventions against torture and genocide, and human rights advocacy NGO work. Include human rights framework visual maps. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Human Rights Advocates, NGO Workers & Students"
  },
  {
    "id": "family_marriage_law",
    "category": "law",
    "icon": "👨‍👩‍👧‍👦",
    "title": "Family Law, Marriage & Custody",
    "desc": "Divorce proceedings, child custody, alimony, adoption law & prenuptial agreements",
    "keywords": [
      "family law",
      "divorce",
      "child custody",
      "alimony",
      "adoption law",
      "prenup"
    ],
    "prompt": "Create an empathetic legal presentation on Family Law covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, marriage registration, ground for divorce, legal standards for child custody (best interests of the child), spousal maintenance & alimony calculations, adoption legal processes, protection against domestic violence, and prenuptial agreements. Include custody arrangement flowcharts.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Family Law Attorneys, Mediators & Clients"
  },
  {
    "id": "property_real_estate_law",
    "category": "law",
    "icon": "🏠",
    "title": "Property & Real Estate Law",
    "desc": "Title deeds, mortgages, zoning regulations, tenant rights & property disputes",
    "keywords": [
      "real estate law",
      "property law",
      "title deed",
      "zoning",
      "tenant rights",
      "mortgage law",
      "rera"
    ],
    "prompt": "Create a property presentation on Real Estate Law & Property Rights covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, land title verification, deeds and conveyancing, landlord-tenant rights and eviction laws, zoning codes, mortgage foreclosures, property boundary disputes, and real estate regulatory frameworks (RERA). Include real estate transaction flowcharts.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Real Estate Agents, Property Buyers & Attorneys"
  },
  {
    "id": "taxation_law_policy",
    "category": "law",
    "icon": "💸",
    "title": "Taxation Law & Corporate Tax Strategy",
    "desc": "Direct vs indirect tax, GST, income tax, international tax havens & audit defense",
    "keywords": [
      "tax law",
      "income tax",
      "gst",
      "corporate tax",
      "tax audit",
      "tax havens"
    ],
    "prompt": "Create a structured presentation on Taxation Law covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, principles of taxation (equity, certainty), Income Tax structure, Goods and Services Tax (GST/VAT), corporate tax deductions, transfer pricing, tax avoidance vs tax evasion, international tax treaties (OECD BEPS), and tax audit defense. Include tax flow diagrams.",
    "template": "finance",
    "slideCount": 10,
    "audience": "Tax Attorneys, Chartered Accountants & CFOs"
  },
  {
    "id": "maritime_admiralty_law",
    "category": "law",
    "icon": "⚓",
    "title": "Maritime & Admiralty Law",
    "desc": "Law of the sea (UNCLOS), shipping contracts, salvage rights & piracy laws",
    "keywords": [
      "maritime law",
      "admiralty law",
      "unclos",
      "law of the sea",
      "shipping law",
      "maritime piracy"
    ],
    "prompt": "Create an intriguing presentation on Maritime & Admiralty Law covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, UN Convention on the Law of the Sea (UNCLOS), territorial waters vs Exclusive Economic Zones (EEZ), charterparties and bills of lading, marine insurance, vessel salvage rights, collisions at sea, and anti-piracy maritime enforcement. Include ocean boundary map diagrams.",
    "template": "education",
    "slideCount": 9,
    "audience": "Maritime Lawyers, Shipping Executives & Naval Officers"
  },
  {
    "id": "media_entertainment_law",
    "category": "law",
    "icon": "🎬",
    "title": "Media, Entertainment & Defamation Law",
    "desc": "Defamation (libel/slander), censorship, talent contracts, fair use & privacy torts",
    "keywords": [
      "media law",
      "entertainment law",
      "defamation",
      "libel",
      "censorship",
      "talent contract",
      "fair use"
    ],
    "prompt": "Create an engaging presentation on Media & Entertainment Law covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, defamation (libel vs slander), right of publicity, music synchronization licensing, talent contract negotiations, film distribution agreements, censorship standards, and fair use defense for news/satire. Include media contract lifecycle charts.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Media Executives, Journalists, Creators & Entertainment Lawyers"
  },
  {
    "id": "ai_ethics_law",
    "category": "law",
    "icon": "🤖",
    "title": "Artificial Intelligence Regulation & Law",
    "desc": "EU AI Act, AI copyright liability, algorithmic bias law & autonomous vehicle liability",
    "keywords": [
      "ai law",
      "eu ai act",
      "ai regulation",
      "ai copyright",
      "algorithmic bias",
      "autonomous liability"
    ],
    "prompt": "Create a cutting-edge presentation on AI Regulation & Legal Frameworks detailing the EU AI Act risk categories, copyright ownership of AI-generated content, liability for autonomous systems (self-driving car accidents, medical AI errors), deepfake legislation, and preventing algorithmic discrimination. Include AI legal risk matrices. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "dark",
    "slideCount": 10,
    "audience": "Tech Lawyers, AI Developers, Policy Makers & Ethicists"
  },
  {
    "id": "arbitration_adr_resolution",
    "category": "law",
    "icon": "🤝",
    "title": "Alternative Dispute Resolution (ADR) & Arbitration",
    "desc": "Arbitration clauses, mediation techniques, conciliation & enforcing arbitral awards",
    "keywords": [
      "adr",
      "arbitration",
      "mediation",
      "dispute resolution",
      "arbitral award",
      "conciliation"
    ],
    "prompt": "Create an efficient legal presentation on Alternative Dispute Resolution (ADR) detailing arbitration vs litigation, drafting effective arbitration clauses, the mediation process, role of neutral mediators, enforcing international arbitral awards under New York Convention, and reducing court backlog. Include ADR process comparison flowcharts. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Corporate Counsel, Arbitrators, Mediators & Litigators"
  },
  {
    "id": "healthcare_medical_malpractice_law",
    "category": "law",
    "icon": "🏥",
    "title": "Healthcare Law & Medical Malpractice",
    "desc": "Standard of care, medical negligence, hospital liability, patient rights & consent",
    "keywords": [
      "medical malpractice",
      "healthcare law",
      "medical negligence",
      "standard of care",
      "patient consent"
    ],
    "prompt": "Create a critical legal presentation on Healthcare Law & Medical Malpractice covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, proving medical negligence (duty, breach, causation, damages), standard of care benchmarks, hospital vicarious liability, informed consent legal requirements, medical record privacy, and defensive medicine practices. Include negligence evaluation flowcharts.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Medical Defense Attorneys, Hospital Administrators & Doctors"
  },
  {
    "id": "banking_financial_regulation_law",
    "category": "law",
    "icon": "🏦",
    "title": "Banking & Financial Services Regulation",
    "desc": "Central bank oversight, Anti-Money Laundering (AML/KYC), Basel III & SEC compliance",
    "keywords": [
      "banking law",
      "financial regulation",
      "aml",
      "kyc",
      "sec compliance",
      "basel iii",
      "anti money laundering"
    ],
    "prompt": "Create a high-level legal presentation on Banking & Financial Services Regulation covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, central banking oversight, Anti-Money Laundering (AML) & Know Your Customer (KYC) requirements, SEC securities regulations, Basel III capital adequacy accords, insider trading prosecution, and regulating fintech/crypto platforms. Include compliance framework diagrams.",
    "template": "finance",
    "slideCount": 10,
    "audience": "Banking Compliance Officers, Financial Lawyers & Regulators"
  },
  {
    "id": "space_law_outer_space_treaty",
    "category": "law",
    "icon": "🚀",
    "title": "Space Law & Outer Space Governance",
    "desc": "Outer Space Treaty of 1967, space debris liability, asteroid mining & Artemis Accords",
    "keywords": [
      "space law",
      "outer space treaty",
      "space debris",
      "asteroid mining",
      "artemis accords",
      "space governance"
    ],
    "prompt": "Create a visionary legal presentation on Space Law & Outer Space Governance covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Outer Space Treaty 1967 fundamentals (non-militarization, common heritage of mankind), liability for satellite collisions and space debris, legal status of commercial asteroid mining, space tourism regulation, and the Artemis Accords. Include orbital space jurisdiction maps.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Space Lawyers, Aerospace Executives & Policy Researchers"
  },
  {
    "id": "consumer_protection_law",
    "category": "law",
    "icon": "🛍️",
    "title": "Consumer Protection & Fair Trade Laws",
    "desc": "Defective products, false advertising, consumer courts, warranties & e-commerce rights",
    "keywords": [
      "consumer protection",
      "consumer rights",
      "false advertising",
      "product liability",
      "consumer court"
    ],
    "prompt": "Create an empowering legal presentation on Consumer Protection Laws covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, consumer rights against defective goods and deficient services, false advertising and deceptive trade practices, product liability standards, e-commerce return & refund rights, and filing claims in Consumer Disputes Redressal Commissions. Include consumer complaint step-by-step guides.",
    "template": "corporate",
    "slideCount": 8,
    "audience": "Consumers, Consumer Rights Activists & Legal Clinics"
  },
  {
    "id": "immigration_citizenship_law",
    "category": "law",
    "icon": "🛂",
    "title": "Immigration & Citizenship Law",
    "desc": "Visas, green cards, asylum, deportation defense, naturalization & border policy",
    "keywords": [
      "immigration law",
      "citizenship",
      "asylum",
      "visas",
      "green card",
      "naturalization",
      "deportation"
    ],
    "prompt": "Create a global legal presentation on Immigration & Citizenship Law covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, work visas and permanent residency pathways, asylum and refugee law criteria, deportation defense and due process rights, naturalization requirements, dual citizenship rules, and border security policy impacts. Include visa application lifecycle charts.",
    "template": "education",
    "slideCount": 9,
    "audience": "Immigration Lawyers, Applicants & NGO Workers"
  },
  {
    "id": "election_voting_law",
    "category": "law",
    "icon": "🗳️",
    "title": "Election Law & Democratic Governance",
    "desc": "Voting rights, campaign finance, redistricting (gerrymandering) & election security",
    "keywords": [
      "election law",
      "voting rights",
      "campaign finance",
      "gerrymandering",
      "electoral commission",
      "democracy"
    ],
    "prompt": "Create a vital legal presentation on Election Law & Democratic Integrity covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, voting rights legislation, campaign finance rules (PACs and disclosure), redistricting standards and gerrymandering court challenges, election administration security, resolving contested election results, and the role of independent Electoral Commissions. Include election process flowcharts.",
    "template": "education",
    "slideCount": 9,
    "audience": "Political Scientists, Election Observers, Lawyers & Citizens"
  },
  {
    "id": "cybersecurity_breach_litigation",
    "category": "law",
    "icon": "🔐",
    "title": "Data Breach Litigation & Corporate Risk",
    "desc": "Class-action lawsuits, ransomware negotiation legality, cyber insurance & director liability",
    "keywords": [
      "data breach litigation",
      "cyber insurance",
      "ransomware law",
      "class action",
      "corporate risk"
    ],
    "prompt": "Create an urgent legal presentation on Data Breach Litigation & Corporate Risk covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, shareholder class-action lawsuits after data leaks, legalities of paying ransomware ransoms, cyber insurance policy claim disputes, board of director liability for poor security, and post-breach forensic disclosure duties. Include risk mitigation checklists.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Chief Risk Officers, Corporate Lawyers & CISOs"
  },
  {
    "id": "animal_rights_welfare_law",
    "category": "law",
    "icon": "🐾",
    "title": "Animal Rights & Welfare Legislation",
    "desc": "Cruelty prevention, animal personhood debate, wildlife protection & lab testing laws",
    "keywords": [
      "animal rights law",
      "animal welfare",
      "cruelty to animals",
      "wildlife protection act",
      "animal personhood"
    ],
    "prompt": "Create a compassionate legal presentation on Animal Rights & Welfare Legislation covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, anti-cruelty laws, the legal status of animals (property vs non-human persons), regulating lab testing and factory farming, endangered species legal protections, and landmark habeas corpus petitions for captive primates/elephants. Include animal law timeline visuals.",
    "template": "minimal",
    "slideCount": 8,
    "audience": "Animal Advocates, Environmental Lawyers & Veterinary Students"
  },
  {
    "id": "devsecops_cloud_security",
    "category": "tech",
    "icon": "🛡️",
    "title": "DevSecOps & Cloud Security Integration",
    "desc": "Shift-left security, SAST/DAST, container scanning & IAM policies",
    "keywords": [
      "devsecops",
      "cloud security",
      "sast",
      "dast",
      "iam",
      "container security",
      "vulnerability management"
    ],
    "prompt": "Create a technical presentation on DevSecOps & Cloud Security Integration detailing the shift-left security movement, integrating SAST and DAST in CI/CD pipelines, container vulnerability scanning (Trivy), IAM least-privilege principles, and cloud compliance monitoring. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "dark",
    "slideCount": 9,
    "audience": "DevOps Engineers, CISOs & Cloud Architects"
  },
  {
    "id": "microservices_api_architecture",
    "category": "tech",
    "icon": "🧩",
    "title": "Microservices Architecture & API Gateways",
    "desc": "Monolith vs microservices, REST/GraphQL/gRPC, service mesh & circuit breakers",
    "keywords": [
      "microservices",
      "api gateway",
      "graphql",
      "grpc",
      "service mesh",
      "istio",
      "event driven"
    ],
    "prompt": "Create a software architecture presentation on Microservices & API Gateways comparing monolithic vs microservices patterns, API design (REST vs GraphQL vs gRPC), service mesh (Istio), event-driven architecture (Kafka), and resilience patterns (circuit breakers, rate limiting). Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "dark",
    "slideCount": 10,
    "audience": "Software Architects & Backend Engineers"
  },
  {
    "id": "quantum_hardware_qubits",
    "category": "tech",
    "icon": "⚛️",
    "title": "Quantum Computing Hardware Architectures",
    "desc": "Superconducting qubits, trapped ions, cryogenics & quantum error correction",
    "keywords": [
      "quantum hardware",
      "superconducting qubits",
      "trapped ion",
      "cryogenics",
      "quantum error correction"
    ],
    "prompt": "Create an advanced tech presentation on Quantum Hardware Architectures comparing superconducting qubits (IBM/Google), trapped ion systems, topological qubits, dilution refrigerators, quantum noise, and surface code error correction algorithms. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Quantum Engineers & Physics Researchers"
  },
  {
    "id": "web3_decentralized_web",
    "category": "tech",
    "icon": "🌐",
    "title": "Web3 & Decentralized Web Infrastructure",
    "desc": "IPFS, dApps, DAO governance, smart contract audits & zero-knowledge proofs",
    "keywords": [
      "web3",
      "ipfs",
      "dapps",
      "dao",
      "zero knowledge proofs",
      "solidity",
      "decentralized"
    ],
    "prompt": "Create a forward-looking tech presentation on Web3 & Decentralized Web covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, InterPlanetary File System (IPFS), building decentralized applications (dApps), Decentralized Autonomous Organizations (DAOs), smart contract security audits, and Zero-Knowledge Proofs (ZK-Rollups).",
    "template": "startup",
    "slideCount": 9,
    "audience": "Web3 Developers, Crypto Enthusiasts & Founders"
  },
  {
    "id": "embedded_systems_rtos",
    "category": "tech",
    "icon": "📟",
    "title": "Embedded Systems & Real-Time OS (RTOS)",
    "desc": "Microcontrollers, FreeRTOS, GPIO, interrupts, firmware & ARM architecture",
    "keywords": [
      "embedded systems",
      "rtos",
      "freertos",
      "microcontroller",
      "stm32",
      "arm cortex",
      "firmware"
    ],
    "prompt": "Create an engineering presentation on Embedded Systems & Real-Time Operating Systems (RTOS) covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, microcontroller architectures (ARM Cortex-M), memory constraints, task scheduling in FreeRTOS, interrupt handling, GPIO/SPI/I2C protocols, and writing safe firmware for IoT.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Embedded Systems Engineers & Hardware Developers"
  },
  {
    "id": "augmented_reality_mobile",
    "category": "tech",
    "icon": "👓",
    "title": "Mobile Augmented Reality (ARKit & ARCore)",
    "desc": "Spatial tracking, plane detection, 3D anchor positioning & AR UX",
    "keywords": [
      "augmented reality",
      "arkit",
      "arcore",
      "spatial computing",
      "plane detection",
      "ar ux"
    ],
    "prompt": "Create an immersive tech presentation on Mobile Augmented Reality (ARKit & ARCore) explaining VIO spatial tracking, surface plane detection, anchoring 3D objects in physical space, occlusion, lighting estimation, and AR user interface design guidelines. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Mobile AR Developers & UX Designers"
  },
  {
    "id": "linux_system_administration",
    "category": "tech",
    "icon": "🐧",
    "title": "Linux System Administration & Shell Scripting",
    "desc": "Kernel, Bash scripting, systemd, permissions, networking & cron jobs",
    "keywords": [
      "linux sysadmin",
      "bash scripting",
      "systemd",
      "linux permissions",
      "cron",
      "shell script"
    ],
    "prompt": "Create a hands-on IT presentation on Linux System Administration & Bash Scripting covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Linux directory structure (FHS), file permissions (chmod/chown), process management, systemd services, automated cron jobs, log analysis, and writing robust Bash scripts.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "System Administrators, Linux Users & IT Support"
  },
  {
    "id": "natural_user_interfaces_hci",
    "category": "tech",
    "icon": "🤏",
    "title": "Human-Computer Interaction (HCI) & Gesture Interfaces",
    "desc": "Voice UI, haptics, eye tracking, brain-computer interfaces (BCI) & accessibility",
    "keywords": [
      "hci",
      "human computer interaction",
      "voice ui",
      "haptics",
      "eye tracking",
      "brain computer interface",
      "bci"
    ],
    "prompt": "Create a futuristic presentation on Human-Computer Interaction (HCI) exploring the evolution from CLI/GUI to Natural User Interfaces (NUI), voice user interfaces (VUI), eye-tracking, advanced haptic feedback, accessibility standards, and non-invasive Brain-Computer Interfaces (BCI). Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "HCI Researchers, Product Designers & Engineers"
  },
  {
    "id": "vector_databases_rag",
    "category": "tech",
    "icon": "⚡",
    "title": "Vector Databases & Retrieval-Augmented Generation (RAG)",
    "desc": "Embeddings, Pinecone/Chroma, semantic search, RAG pipelines & LLM context",
    "keywords": [
      "vector database",
      "rag",
      "retrieval augmented generation",
      "embeddings",
      "pinecone",
      "chromadb",
      "semantic search"
    ],
    "prompt": "Create an cutting-edge AI presentation on Vector Databases & Retrieval-Augmented Generation (RAG) explaining vector embeddings, cosine similarity, HNSW indexing, vector DBs (Pinecone, Chroma, Qdrant), building end-to-end RAG pipelines for LLMs, and chunking strategies. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "dark",
    "slideCount": 10,
    "audience": "AI Engineers, Data Scientists & Software Developers"
  },
  {
    "id": "autonomous_driving_tech",
    "category": "tech",
    "icon": "🚗",
    "title": "Autonomous Driving & Sensor Fusion",
    "desc": "LiDAR, RADAR, computer vision perception, SLAM navigation & safety levels 1-5",
    "keywords": [
      "autonomous driving",
      "lidar",
      "radar",
      "sensor fusion",
      "slam",
      "self driving cars",
      "tesla autopolit"
    ],
    "prompt": "Create a technical presentation on Autonomous Vehicles & Sensor Fusion explaining SAE Levels 1-5, LiDAR vs camera-only perception, RADAR sensor fusion, SLAM mapping, path planning algorithms, deep neural networks for object detection, and safety fail-safes. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "dark",
    "slideCount": 10,
    "audience": "Automotive Engineers, Robotics Researchers & Tech Enthusiasts"
  },
  {
    "id": "database_sharding_scaling",
    "category": "tech",
    "icon": "🗄️",
    "title": "Database Scaling, Sharding & Replication",
    "desc": "Read replicas, horizontal sharding, CAP theorem, ACID vs BASE & distributed DBs",
    "keywords": [
      "database scaling",
      "sharding",
      "replication",
      "cap theorem",
      "acid",
      "distributed database",
      "cockroachdb"
    ],
    "prompt": "Create a high-performance database presentation on Scaling & Sharding covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, vertical vs horizontal scaling, primary-replica replication, database sharding strategies (hash vs range), CAP Theorem trade-offs, ACID transactions vs BASE consistency, and distributed SQL (CockroachDB).",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Database Administrators & Systems Engineers"
  },
  {
    "id": "computer_graphics_raytracing",
    "category": "tech",
    "icon": "🎨",
    "title": "Computer Graphics & Real-Time Ray Tracing",
    "desc": "Rasterization, shaders, BVH trees, path tracing & GPU pipeline",
    "keywords": [
      "computer graphics",
      "ray tracing",
      "shaders",
      "rasterization",
      "path tracing",
      "gpu pipeline",
      "directx"
    ],
    "prompt": "Create a visual computing presentation on Computer Graphics & Real-Time Ray Tracing covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the graphics pipeline (vertex/fragment shaders), rasterization limits, bounding volume hierarchies (BVH), ray-triangle intersection, path tracing photorealism, and hardware-accelerated RT cores.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Graphics Programmers & Game Engine Developers"
  },
  {
    "id": "synthetic_data_ai_training",
    "category": "tech",
    "icon": "🤖",
    "title": "Synthetic Data Generation for AI",
    "desc": "GANs, diffusion models, simulation environments & privacy-preserving data",
    "keywords": [
      "synthetic data",
      "gans",
      "diffusion models",
      "privacy preserving",
      "ai training",
      "data augmentation"
    ],
    "prompt": "Create an AI methodology presentation on Synthetic Data Generation detailing generating photorealistic or structured data using GANs, diffusion models, and physics simulators (NVIDIA Omniverse), bypassing data privacy laws, mitigating class imbalance, and training robust AI models. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Machine Learning Engineers & Data Privacy Officers"
  },
  {
    "id": "site_reliability_engineering_sre",
    "category": "tech",
    "icon": "🚨",
    "title": "Site Reliability Engineering (SRE) & Observability",
    "desc": "SLOs/SLAs, error budgets, Prometheus, Distributed tracing & incident post-mortems",
    "keywords": [
      "sre",
      "site reliability engineering",
      "slo",
      "sla",
      "error budget",
      "observability",
      "prometheus"
    ],
    "prompt": "Create an operational IT presentation on Site Reliability Engineering (SRE) & Observability covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Service Level Objectives (SLOs) and SLAs, managing error budgets, the 3 pillars of observability (Metrics, Logs, Traces), Prometheus/Grafana monitoring, blameless post-mortems, and on-call rotation management.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "SREs, System Administrators & Engineering Leads"
  },
  {
    "id": "compilers_programming_language_design",
    "category": "tech",
    "icon": "⚙️",
    "title": "Compiler Design & Programming Language Architecture",
    "desc": "Lexing, parsing (AST), intermediate representation (LLVM), code generation & optimization",
    "keywords": [
      "compiler design",
      "programming language",
      "ast",
      "llvm",
      "lexer",
      "parser",
      "type system"
    ],
    "prompt": "Create a computer science presentation on Compiler Design explaining lexical analysis, parsing and Abstract Syntax Trees (AST), type checking, intermediate representations (LLVM IR), optimization passes, target machine code generation, and garbage collection mechanisms. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "dark",
    "slideCount": 10,
    "audience": "Computer Science Students & Language Creators"
  },
  {
    "id": "wearable_technology_iot",
    "category": "tech",
    "icon": "⌚",
    "title": "Wearable Technology & Health Sensors",
    "desc": "PPG heart sensors, accelerometers, battery optimization, BLE & health analytics",
    "keywords": [
      "wearable tech",
      "health sensors",
      "ppg sensor",
      "ble",
      "bluetooth low energy",
      "smartwatch tech"
    ],
    "prompt": "Create a hardware tech presentation on Wearable Technology & Health Sensors covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, photoplethysmography (PPG) pulse sensors, 9-axis IMU accelerometers, Bluetooth Low Energy (BLE) protocol, ultra-low power microcontroller states, biometric algorithms, and FDA medical device approval considerations.",
    "template": "startup",
    "slideCount": 8,
    "audience": "Hardware Product Managers & Biomedical Engineers"
  },
  {
    "id": "robot_operating_system_ros",
    "category": "tech",
    "icon": "🤖",
    "title": "Robot Operating System (ROS 2) & Kinematics",
    "desc": "ROS nodes, topics, services, URDF models, Gazebo simulation & forward/inverse kinematics",
    "keywords": [
      "ros 2",
      "robot operating system",
      "kinematics",
      "gazebo simulation",
      "urdf",
      "robotics software"
    ],
    "prompt": "Create a robotics software presentation on Robot Operating System (ROS 2) covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, pub/sub node architecture, ROS services and actions, URDF robot modeling, Gazebo simulation testing, forward and inverse kinematics calculations, and obstacle avoidance navigation stacks.",
    "template": "dark",
    "slideCount": 10,
    "audience": "Robotics Engineers & Mechatronics Students"
  },
  {
    "id": "satellite_internet_constellations",
    "category": "tech",
    "icon": "🛰️",
    "title": "Satellite Internet & LEO Constellations",
    "desc": "Starlink, Kuiper, Low Earth Orbit physics, phased array antennas & global latency",
    "keywords": [
      "satellite internet",
      "starlink",
      "leo constellation",
      "phased array",
      "space internet",
      "low earth orbit"
    ],
    "prompt": "Create a space communications presentation on Satellite Internet & LEO Constellations detailing Low Earth Orbit mechanics vs Geostationary orbits, phased array beamforming antennas, inter-satellite laser links, orbital decay, frequency allocation, and bridging the global digital divide. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "dark",
    "slideCount": 9,
    "audience": "Telecom Engineers, Space Enthusiasts & IT Analysts"
  },
  {
    "id": "speech_recognition_voice_ai",
    "category": "tech",
    "icon": "🎙️",
    "title": "Voice AI & Automatic Speech Recognition (ASR)",
    "desc": "Acoustic modeling, Mel-spectrograms, Whisper AI, text-to-speech (TTS) & latency",
    "keywords": [
      "speech recognition",
      "voice ai",
      "asr",
      "tts",
      "text to speech",
      "whisper ai",
      "audio ai"
    ],
    "prompt": "Create an audio AI presentation on Automatic Speech Recognition (ASR) & Voice AI covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, converting audio waveforms to Mel-spectrograms, transformer-based speech models (OpenAI Whisper), neural Text-to-Speech (TTS) synthesis, noise suppression, and real-time voice latency optimization.",
    "template": "dark",
    "slideCount": 9,
    "audience": "AI Researchers & Voice Application Developers"
  },
  {
    "id": "zero_trust_architecture",
    "category": "tech",
    "icon": "🔒",
    "title": "Zero Trust Architecture & Network Security",
    "desc": "Never trust always verify, micro-segmentation, identity-aware proxies & SDP",
    "keywords": [
      "zero trust",
      "network security",
      "microsegmentation",
      "identity aware proxy",
      "software defined perimeter"
    ],
    "prompt": "Create an enterprise security presentation on Zero Trust Architecture explaining the core principle 'Never Trust, Always Verify', identity and device posture verification, network micro-segmentation, Software-Defined Perimeter (SDP), and replacing legacy VPNs with Zero Trust Network Access (ZTNA). Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Network Security Engineers & Enterprise IT Directors"
  },
  {
    "id": "gravitational_waves_ligo",
    "category": "science",
    "icon": "🌌",
    "title": "Gravitational Waves & LIGO Astronomy",
    "desc": "Spacetime ripples, laser interferometry, neutron star collisions & gravitational astronomy",
    "keywords": [
      "gravitational waves",
      "ligo",
      "laser interferometry",
      "neutron stars",
      "einstein relativity",
      "black hole collision"
    ],
    "prompt": "Create an astrophysics presentation on Gravitational Waves & LIGO detailing Einstein's 1916 prediction, laser interferometer detection mechanisms measuring sub-atomic distances, observing black hole and neutron star collisions, and the new era of multi-messenger astronomy. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Physics Students & Astronomy Enthusiasts"
  },
  {
    "id": "synthetic_biology_bioengineering",
    "category": "science",
    "icon": "🧪",
    "title": "Synthetic Biology & Genetic Bio-Factories",
    "desc": "DNA synthesis, metabolic engineering, bio-fuels, lab-grown materials & bio-foundries",
    "keywords": [
      "synthetic biology",
      "bioengineering",
      "metabolic engineering",
      "dna synthesis",
      "biofuels",
      "biofoundry"
    ],
    "prompt": "Create a biotechnology presentation on Synthetic Biology covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, designing artificial genetic circuits, metabolic engineering of yeast/bacteria to produce pharmaceuticals and biofuels, bio-materials (spider silk, lab-grown leather), and ethical oversight of synthetic organisms.",
    "template": "education",
    "slideCount": 10,
    "audience": "Biotech Researchers, Geneticists & Students"
  },
  {
    "id": "plate_tectonics_geology",
    "category": "science",
    "icon": "🌍",
    "title": "Plate Tectonics & Earth's Geological Evolution",
    "desc": "Pangaea, subduction zones, continental drift, mantle convection & mountain formation",
    "keywords": [
      "plate tectonics",
      "geology",
      "pangaea",
      "subduction zone",
      "continental drift",
      "mantle convection"
    ],
    "prompt": "Create a geology presentation on Plate Tectonics exploring Wegener's continental drift hypothesis, mantle convection currents, convergent/divergent/transform plate boundaries, mountain formation (Himalayas), ocean trenches, and supercontinent cycles over Earth's 4.5 billion year history. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Geology Students & Earth Science Enthusiasts"
  },
  {
    "id": "particle_physics_cern",
    "category": "science",
    "icon": "⚛️",
    "title": "Particle Physics & Large Hadron Collider (CERN)",
    "desc": "Standard Model, Higgs Boson, quarks, leptons, particle accelerators & antimatter",
    "keywords": [
      "particle physics",
      "cern",
      "large hadron collider",
      "higgs boson",
      "quarks",
      "standard model"
    ],
    "prompt": "Create a high-energy physics presentation on Particle Physics & CERN explaining the Standard Model of elementary particles (quarks, leptons, gauge bosons), the 27km Large Hadron Collider ring, detecting the Higgs Boson particle, and searching for dark matter and supersymmetry. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 10,
    "audience": "Physics Majors & Science Enthusiasts"
  },
  {
    "id": "stem_cell_research_medicine",
    "category": "science",
    "icon": "🧫",
    "title": "Stem Cell Biology & Regenerative Medicine",
    "desc": "Embryonic vs iPSCs, organoid development, tissue engineering & ethical guidelines",
    "keywords": [
      "stem cells",
      "ipsc",
      "induced pluripotent",
      "regenerative medicine",
      "tissue engineering",
      "organoids"
    ],
    "prompt": "Create a medical science presentation on Stem Cell Biology exploring embryonic vs Induced Pluripotent Stem Cells (iPSCs), Yamanaka factors, tissue engineering for organ replacement, growing 3D brain/kidney organoids for drug testing, and bioethical regulatory frameworks. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Biomedical Students, Doctors & Researchers"
  },
  {
    "id": "superconductivity_materials",
    "category": "science",
    "icon": "⚡",
    "title": "Superconductivity & Quantum Materials",
    "desc": "Zero electrical resistance, Meissner effect, Maglev trains, Cooper pairs & room-temp superconductors",
    "keywords": [
      "superconductivity",
      "meissner effect",
      "maglev",
      "cooper pairs",
      "quantum materials",
      "zero resistance"
    ],
    "prompt": "Create a materials science presentation on Superconductivity detailing zero electrical resistance below critical temperature, the Meissner effect (magnetic levitation), BCS theory and Cooper pairs, High-Temperature Superconductors (HTS), Maglev train tech, and the quest for room-temperature ambient pressure superconductors. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Materials Scientists, Physicists & Engineers"
  },
  {
    "id": "ocean_acidification_marine_chem",
    "category": "science",
    "icon": "🧪",
    "title": "Ocean Acidification & Marine Chemistry",
    "desc": "CO2 absorption, carbonic acid, coral bleaching, shellfish calcification & ocean pH",
    "keywords": [
      "ocean acidification",
      "marine chemistry",
      "carbonic acid",
      "coral bleaching",
      "ocean ph",
      "shellfish"
    ],
    "prompt": "Create an environmental chemistry presentation on Ocean Acidification explaining how oceans absorb 30% of human CO2 emissions, chemical formation of carbonic acid, declining ocean pH levels, destruction of calcium carbonate shells in plankton/corals, and cascading marine ecosystem collapses. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 8,
    "audience": "Marine Chemists, Environmental Science Students"
  },
  {
    "id": "solar_flares_space_weather",
    "category": "science",
    "icon": "☀️",
    "title": "Solar Flares & Space Weather Forecasting",
    "desc": "Coronal Mass Ejections (CMEs), solar wind, magnetosphere, Auroras & power grid risks",
    "keywords": [
      "solar flares",
      "space weather",
      "coronal mass ejection",
      "solar wind",
      "aurora borealis",
      "geomagnetic storm"
    ],
    "prompt": "Create a space science presentation on Solar Flares & Space Weather covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, the Sun's 11-year magnetic cycle, Coronal Mass Ejections (CMEs), Earth's magnetosphere shield, Aurora Borealis physics, and risks of severe geomagnetic storms to GPS satellites, astronaut safety, and terrestrial power grids.",
    "template": "education",
    "slideCount": 9,
    "audience": "Space Physicists, Satellite Operators & Science Students"
  },
  {
    "id": "epigenetics_gene_expression",
    "category": "science",
    "icon": "🧬",
    "title": "Epigenetics & Gene Expression Control",
    "desc": "DNA methylation, histone modification, environmental impact on genes & transgenerational inheritance",
    "keywords": [
      "epigenetics",
      "dna methylation",
      "histone modification",
      "gene expression",
      "transgenerational genetics"
    ],
    "prompt": "Create a molecular biology presentation on Epigenetics exploring how environmental factors (diet, stress, toxins) turn genes on/off without altering the underlying DNA sequence. Explain DNA methylation, histone modification, microRNAs, and evidence for transgenerational epigenetic inheritance. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Genetics Students, Biologists & Researchers"
  },
  {
    "id": "photosynthesis_biochemistry",
    "category": "science",
    "icon": "🍃",
    "title": "Biochemistry of Photosynthesis & Plant Energy",
    "desc": "Light reactions, Calvin cycle, Chlorophyll absorption, Rubisco enzyme & artificial photosynthesis",
    "keywords": [
      "photosynthesis",
      "calvin cycle",
      "chlorophyll",
      "rubisco",
      "plant biochemistry",
      "artificial photosynthesis"
    ],
    "prompt": "Create a biochemistry presentation on Photosynthesis detailing Light-Dependent Reactions in thylakoids, Photosystems I & II, ATP synthesis, the Light-Independent Calvin Cycle, Rubisco efficiency challenges, C3 vs C4 vs CAM plant adaptations, and bio-engineering artificial photosynthesis for clean hydrogen generation. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Biochemistry Majors, Botanists & Researchers"
  },
  {
    "id": "thermodynamics_laws_entropy",
    "category": "science",
    "icon": "🔥",
    "title": "Laws of Thermodynamics & Entropy",
    "desc": "Zeroth to 3rd Laws, heat engines, Carnot cycle, Maxwell's Demon & arrow of time",
    "keywords": [
      "thermodynamics",
      "entropy",
      "carnot cycle",
      "laws of thermodynamics",
      "heat engine",
      "arrow of time"
    ],
    "prompt": "Create a fundamental physics presentation on the Laws of Thermodynamics covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Energy Conservation (1st Law), Entropy and spontaneous processes (2nd Law), Absolute Zero (3rd Law), Thermal Equilibrium (Zeroth Law), Carnot engine efficiency limits, and physical implications for the fate of the universe.",
    "template": "education",
    "slideCount": 9,
    "audience": "Physics & Mechanical Engineering Students"
  },
  {
    "id": "dinosaur_paleontology_extinction",
    "category": "science",
    "icon": "🦖",
    "title": "Paleontology & Dinosaur Extinction Event",
    "desc": "Fossilization process, Mesozoic era, Chicxulub asteroid impact & bird evolution",
    "keywords": [
      "paleontology",
      "dinosaurs",
      "chicxulub asteroid",
      "fossils",
      "mesozoic era",
      "dinosaur extinction"
    ],
    "prompt": "Create an exciting earth science presentation on Paleontology & Dinosaurs covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, fossilization mechanisms, Mesozoic eras (Triassic, Jurassic, Cretaceous), major dinosaur clades, the 66-million-year-old Chicxulub asteroid impact event, iridium layer evidence, and how theropod dinosaurs evolved into modern birds.",
    "template": "education",
    "slideCount": 9,
    "audience": "Paleontology Enthusiasts, Geology Students & Public"
  },
  {
    "id": "crispr_cas9_biochemistry",
    "category": "science",
    "icon": "✂️",
    "title": "Biochemical Mechanisms of CRISPR-Cas9",
    "desc": "Guide RNA (sgRNA), PAM sequences, double-strand breaks & NHEJ/HDR repair",
    "keywords": [
      "crispr biochemistry",
      "cas9 enzyme",
      "guide rna",
      "pam sequence",
      "nhej",
      "hdr repair"
    ],
    "prompt": "Create a deep-dive biochemistry presentation on CRISPR-Cas9 detailing bacterial adaptive immune origins, single guide RNA (sgRNA) design, Protospacer Adjacent Motif (PAM) recognition, Cas9 endonuclease double-strand DNA cleavage, and cellular repair pathways (NHEJ vs HDR). Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Molecular Biologists, Biochemists & Researchers"
  },
  {
    "id": "fluid_dynamics_aerodynamics",
    "category": "science",
    "icon": "🌪️",
    "title": "Fluid Dynamics & Aerodynamics Principles",
    "desc": "Navier-Stokes equations, Bernoulli's principle, turbulence, boundary layers & lift",
    "keywords": [
      "fluid dynamics",
      "aerodynamics",
      "navier stokes",
      "bernoulli principle",
      "turbulence",
      "boundary layer"
    ],
    "prompt": "Create a physics & engineering presentation on Fluid Dynamics & Aerodynamics covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, laminar vs turbulent flow, Bernoulli's principle, airfoil lift generation, boundary layer separation, drag coefficient reduction, and the unsolved million-dollar Navier-Stokes existence and smoothness problem.",
    "template": "education",
    "slideCount": 10,
    "audience": "Aerospace Engineers, Physicists & Applied Mathematicians"
  },
  {
    "id": "microbiome_gut_brain_axis",
    "category": "science",
    "icon": "🦠",
    "title": "The Gut-Brain Axis & Microbiome Science",
    "desc": "Vagus nerve signaling, short-chain fatty acids, serotonin production & mental health",
    "keywords": [
      "gut brain axis",
      "microbiome",
      "vagus nerve",
      "serotonin",
      "gut flora",
      "microbiota"
    ],
    "prompt": "Create a neuroscience presentation on The Gut-Brain Axis exploring how trillions of gut bacteria communicate with the central nervous system via the vagus nerve, produce 90% of the body's serotonin, synthesize short-chain fatty acids (butyrate), and influence mood, anxiety, and neuro-inflammation. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Neuroscientists, Microbiologists, Doctors & Students"
  },
  {
    "id": "dark_energy_cosmic_expansion",
    "category": "science",
    "icon": "🌌",
    "title": "Dark Energy & Accelerating Cosmic Expansion",
    "desc": "Type Ia supernovae evidence, cosmological constant, Hubble tension & Big Rip fate",
    "keywords": [
      "dark energy",
      "cosmic expansion",
      "hubble constant",
      "type ia supernovae",
      "cosmological constant"
    ],
    "prompt": "Create a cosmology presentation on Dark Energy & Cosmic Expansion detailing the 1998 Nobel Prize discovery of accelerating expansion using Type Ia Supernovae, Einstein's Cosmological Constant (Lambda), measuring the Hubble Constant tension, and future cosmic end scenarios (Big Freeze vs Big Rip). Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Astrophysicists & Cosmology Enthusiasts"
  },
  {
    "id": "quantum_entanglement_spooky",
    "category": "science",
    "icon": "🔮",
    "title": "Quantum Entanglement & Bell's Theorem",
    "desc": "EPR paradox, non-locality, Bell test experiments & Nobel Prize 2022 physics",
    "keywords": [
      "quantum entanglement",
      "bells theorem",
      "epr paradox",
      "non locality",
      "quantum physics",
      "nobel prize 2022"
    ],
    "prompt": "Create a quantum mechanics presentation on Quantum Entanglement & Bell's Theorem examining Einstein's 'spooky action at a distance', John Bell's mathematical inequality testing local realism, Aspect/Clauser/Zeilinger Nobel-winning experiments, and applications in quantum teleportation. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Quantum Physicists, Philosophers of Science & Students"
  },
  {
    "id": "atmospheric_science_meteorology",
    "category": "science",
    "icon": "🌤️",
    "title": "Atmospheric Science & Weather Forecasting",
    "desc": "Coriolis effect, pressure systems, jet streams, Doppler radar & numerical weather prediction",
    "keywords": [
      "meteorology",
      "atmospheric science",
      "coriolis effect",
      "jet stream",
      "doppler radar",
      "weather forecasting"
    ],
    "prompt": "Create a meteorology presentation on Atmospheric Science explaining global atmospheric circulation cells (Hadley, Ferrel, Polar), Coriolis deflection, jet stream dynamics, high/low pressure systems, Doppler weather radar principles, and supercomputer numerical weather prediction models. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Meteorology Students, Climate Scientists & General Audience"
  },
  {
    "id": "nuclear_fusion_iter_tokamak",
    "category": "science",
    "icon": "⚛️",
    "title": "Nuclear Fusion & Tokamak Energy",
    "desc": "Deuterium-tritium fusion, magnetic confinement, ITER reactor, NIF laser ignition & clean power",
    "keywords": [
      "nuclear fusion",
      "tokamak",
      "iter",
      "magnetic confinement",
      "deuterium tritium",
      "clean energy"
    ],
    "prompt": "Create an energy science presentation on Nuclear Fusion & Tokamak Technology explaining recreating solar core temperatures (150M°C), magnetic confinement in Tokamaks (ITER project), inertial confinement laser fusion (Lawrence Livermore NIF breakthrough), net energy gain (Q > 1), and clean limitless zero-carbon power. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 10,
    "audience": "Nuclear Engineers, Energy Researchers & Physicists"
  },
  {
    "id": "extremophiles_extreme_biology",
    "category": "science",
    "icon": "🌋",
    "title": "Extremophiles & Life in Extreme Conditions",
    "desc": "Thermophiles, halophiles, tardigrades, radiation resistance (Taq polymerase) & alien life models",
    "keywords": [
      "extremophiles",
      "tardigrades",
      "thermophiles",
      "halophiles",
      "taq polymerase",
      "extreme biology"
    ],
    "prompt": "Create a biological science presentation on Extremophiles covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, organisms surviving in extreme heat (hydrothermal vents), extreme cold (Antarctica), high salinity, and intense radiation (Deinococcus radiodurans), famous tardigrade resilience, industrial applications of Taq polymerase, and implications for life on Mars.",
    "template": "education",
    "slideCount": 9,
    "audience": "Microbiologists, Astrobiologists & Biology Students"
  },
  {
    "id": "cold_war_geopolitics",
    "category": "society",
    "icon": "🗺️",
    "title": "The Cold War & Global Geopolitics (1947–1991)",
    "desc": "US vs USSR, nuclear deterrence, Cuban Missile Crisis, space race & fall of Berlin Wall",
    "keywords": [
      "cold war",
      "geopolitics",
      "cuban missile crisis",
      "berlin wall",
      "nuclear deterrence",
      "space race",
      "ussr"
    ],
    "prompt": "Create a geopolitical history presentation on The Cold War detailing ideological conflict between US Capitalism and USSR Communism, NATO vs Warsaw Pact, Mutually Assured Destruction (MAD), Cuban Missile Crisis, proxy wars (Korea, Vietnam), Space Race, and the collapse of the Soviet Union. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 10,
    "audience": "History & Political Science Students"
  },
  {
    "id": "silk_road_trade_routes",
    "category": "society",
    "icon": "🐫",
    "title": "The Ancient Silk Road & Global Trade",
    "desc": "Eurasian trade network, Marco Polo, cultural exchange, silk/spices & spread of ideas",
    "keywords": [
      "silk road",
      "trade routes",
      "marco polo",
      "eurasia trade",
      "cultural exchange",
      "ancient history"
    ],
    "prompt": "Create a rich historical presentation on The Ancient Silk Road examining overland and maritime trade networks connecting China, Central Asia, India, Persia, and the Mediterranean. Cover commodities traded (silk, spices, porcelain), cultural and religious exchanges (Buddhism, Islam), disease spread (Black Death), and its legacy. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "World History & Economics Students"
  },
  {
    "id": "french_revolution_enlightenment",
    "category": "society",
    "icon": "🗼",
    "title": "The French Revolution & Age of Enlightenment",
    "desc": "Bastille storming, Reign of Terror, Voltaire/Rousseau ideals & rise of Napoleon",
    "keywords": [
      "french revolution",
      "enlightenment",
      "bastille",
      "robespierre",
      "napoleon",
      "liberty equality fraternity"
    ],
    "prompt": "Create a historical analysis presentation on The French Revolution & Enlightenment exploring philosophies of Voltaire, Rousseau, and Montesquieu, financial collapse of the monarchy, Storming of the Bastille, Declaration of the Rights of Man, Reign of Terror under Robespierre, and Napoleon Bonaparte's rise. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 10,
    "audience": "European History Students & Scholars"
  },
  {
    "id": "roman_empire_rise_fall",
    "category": "society",
    "icon": "🏛️",
    "title": "Rise & Fall of the Roman Empire",
    "desc": "Roman Republic, Pax Romana, Julius Caesar, military legions & causes of collapse",
    "keywords": [
      "roman empire",
      "julius caesar",
      "pax romana",
      "colosseum",
      "roman republic",
      "fall of rome"
    ],
    "prompt": "Create a classic history presentation on The Roman Empire covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Republic government structure, Julius Caesar's assassination, Augustus and the Pax Romana, Roman engineering (aqueducts, roads, Colosseum), military organization, conversion to Christianity, and internal/external causes of the Western Empire's fall.",
    "template": "education",
    "slideCount": 10,
    "audience": "Ancient History Students & Classics Enthusiasts"
  },
  {
    "id": "renaissance_florence_art_science",
    "category": "society",
    "icon": "🖼️",
    "title": "The Renaissance: Rebirth of Art & Science",
    "desc": "Medici family patronage, humanism, Leonardo da Vinci, Gutenberg press & scientific rebirth",
    "keywords": [
      "renaissance",
      "florence",
      "da vinci",
      "gutenberg press",
      "humanism",
      "medici"
    ],
    "prompt": "Create a cultural history presentation on The Renaissance in 14th-17th Century Europe examining Florence as the birthplace, Medici financial patronage, Humanist philosophy shifting away from medieval scholasticism, technological disruption of Gutenberg's printing press, and polymath achievements of Da Vinci and Galileo. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Art & Cultural History Students"
  },
  {
    "id": "american_civil_rights_movement",
    "category": "society",
    "icon": "✊",
    "title": "The Civil Rights Movement in America",
    "desc": "MLK Jr, Rosa Parks, 1964 Civil Rights Act, non-violent protest & racial equality",
    "keywords": [
      "civil rights movement",
      "martin luther king",
      "rosa parks",
      "civil rights act",
      "racial equality",
      "non violent protest"
    ],
    "prompt": "Create an inspiring social history presentation on The American Civil Rights Movement covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Jim Crow segregation laws, Rosa Parks & Montgomery Bus Boycott, Martin Luther King Jr's non-violent philosophy, March on Washington, 1964 Civil Rights Act & 1965 Voting Rights Act, and ongoing civil rights advocacy.",
    "template": "education",
    "slideCount": 10,
    "audience": "Sociology, History & Civics Students"
  },
  {
    "id": "industrial_revolution_social_impact",
    "category": "society",
    "icon": "🏭",
    "title": "Social Impact of the Industrial Revolution",
    "desc": "Urbanization, labor movement, child labor, rise of middle class & living conditions",
    "keywords": [
      "industrial revolution impact",
      "urbanization",
      "labor movement",
      "child labor",
      "working class",
      "factory system"
    ],
    "prompt": "Create a social history presentation on the Consequences of the Industrial Revolution exploring rapid urbanization, grim factory working conditions, child labor exploitation, emergence of labor unions and strikes, rise of the industrial middle class, public health crises, and social reform movements. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "History & Sociology Students"
  },
  {
    "id": "space_race_history",
    "category": "society",
    "icon": "🚀",
    "title": "The Space Race: Sputnik to Apollo 11",
    "desc": "Sputnik 1, Yuri Gagarin, NASA Apollo program, Moon landing & Cold War space diplomacy",
    "keywords": [
      "space race",
      "sputnik",
      "yuri gagarin",
      "apollo 11",
      "moon landing",
      "neil armstrong",
      "nasa"
    ],
    "prompt": "Create an exciting historical presentation on The Space Race detailing Soviet early victories (Sputnik 1 in 1957, Yuri Gagarin in 1961), Kennedy's moon challenge, NASA Gemini and Apollo engineering feats, the July 1969 Apollo 11 moon landing, and transitioning into Apollo-Soyuz cooperative space diplomacy. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 10,
    "audience": "Space History Enthusiasts & Students"
  },
  {
    "id": "feudal_japan_samurai_history",
    "category": "society",
    "icon": "⚔️",
    "title": "Feudal Japan, Bushido & The Samurai",
    "desc": "Shogunate system, Bushido code, Tokugawa peace era & Meiji Restoration",
    "keywords": [
      "samurai",
      "feudal japan",
      "bushido",
      "shogun",
      "tokugawa",
      "meiji restoration",
      "japanese history"
    ],
    "prompt": "Create a cultural history presentation on Feudal Japan & The Samurai detailing the Kamakura to Tokugawa Shogunates, the social class hierarchy (Samurai, Farmers, Artisans, Merchants), Bushido code of honor, katans and armor, castle architecture, and the rapid modernizing Meiji Restoration of 1868. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Japanese History & Culture Enthusiasts"
  },
  {
    "id": "globalization_cultural_exchange",
    "category": "society",
    "icon": "🌐",
    "title": "Globalization & Cultural Homogenization",
    "desc": "Global trade networks, cultural exchange vs Americanization, digital diaspora & local identity",
    "keywords": [
      "globalization",
      "cultural exchange",
      "americanization",
      "global culture",
      "diaspora",
      "local identity"
    ],
    "prompt": "Create a sociological presentation on Globalization & Cultural Impact examining international economic integration, global media distribution, cultural homogenization vs hyper-localization, spread of languages and cuisine, digital diasporas, and preserving local indigenous identity in a hyper-connected world. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Sociology & International Relations Students"
  },
  {
    "id": "women_suffrage_movement",
    "category": "society",
    "icon": "🗳️",
    "title": "Women's Suffrage Movement & Global Voting Rights",
    "desc": "Seneca Falls, Suffragettes, 19th Amendment, international voting rights history",
    "keywords": [
      "womens suffrage",
      "suffragettes",
      "19th amendment",
      "voting rights",
      "seneca falls",
      "feminism history"
    ],
    "prompt": "Create an inspiring presentation on Women's Suffrage History examining early conventions (Seneca Falls 1848), militant British Suffragette tactics, passing of the 19th Amendment in the US (1920), global timelines of women's voting rights (New Zealand first in 1893), and key feminist pioneers. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "History & Gender Studies Students"
  },
  {
    "id": "mayan_aztec_inca_civilizations",
    "category": "society",
    "icon": "🗿",
    "title": "Mesoamerican Civilizations: Maya, Aztec & Inca",
    "desc": "Pyramids, astronomy, agricultural terrace engineering, writing systems & Spanish conquest",
    "keywords": [
      "maya",
      "aztec",
      "inca",
      "mesoamerica",
      "machu picchu",
      "tenochtitlan",
      "pyramids"
    ],
    "prompt": "Create a historical presentation on Mesoamerican Civilizations comparing Maya mathematical and astronomical mastery, Aztec empire power and capital city Tenochtitlan, Inca Andean road and terrace engineering at Machu Picchu, writing systems, complex religions, and the devastating Spanish conquistador contact. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 10,
    "audience": "Archaeology & World History Students"
  },
  {
    "id": "age_of_discovery_exploration",
    "category": "society",
    "icon": "⛵",
    "title": "The Age of Discovery & Global Exploration",
    "desc": "Columbus, Magellan circumnavigation, nautical navigation tech & Columbian exchange",
    "keywords": [
      "age of discovery",
      "columbus",
      "magellan",
      "columbian exchange",
      "maritime exploration",
      "astrolabe"
    ],
    "prompt": "Create a historical presentation on The Age of Discovery detailing 15th-17th century European maritime expansion (Vasco da Gama, Columbus, Magellan), navigational innovations (astrolabe, caravel ship), maps, the Columbian Exchange of crops/diseases, and colonial empire establishment. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "History Students & Maritime Historians"
  },
  {
    "id": "history_of_money_banking",
    "category": "society",
    "icon": "🪙",
    "title": "History of Money: From Barter to Bitcoin",
    "desc": "Lydian coins, Song Dynasty paper money, Medici banking, fiat currency & crypto",
    "keywords": [
      "history of money",
      "barter",
      "gold standard",
      "fiat currency",
      "medici banking",
      "bitcoin history"
    ],
    "prompt": "Create an economic history presentation on The Evolution of Money tracing primitive barter systems, commodity money (shells, salt), first minted Lydian gold coins, Song Dynasty invention of paper banknote currency, Renaissance Italian Medici central banking, US gold standard abandonment, and digital cryptocurrency. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "finance",
    "slideCount": 10,
    "audience": "Economics & History Students"
  },
  {
    "id": "great_depression_new_deal",
    "category": "society",
    "icon": "📉",
    "title": "The Great Depression & FDR's New Deal",
    "desc": "1929 stock market crash, Dust Bowl, unemployment, Keynesian economics & New Deal programs",
    "keywords": [
      "great depression",
      "1929 crash",
      "new deal",
      "fdr",
      "keynesian economics",
      "dust bowl"
    ],
    "prompt": "Create a socio-economic history presentation on The Great Depression analyzing the 1929 Wall Street stock crash, bank panics, Dust Bowl agricultural disaster, mass unemployment, Keynesian economic interventions, and Franklin D. Roosevelt's landmark New Deal social safety net programs. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Economics & US History Students"
  },
  {
    "id": "history_of_medicine_healing",
    "category": "society",
    "icon": "🩺",
    "title": "History of Medicine: From Trepanning to Antibiotics",
    "desc": "Hippocrates, germ theory (Pasteur), penicillin discovery (Fleming) & surgical anesthesia",
    "keywords": [
      "history of medicine",
      "germ theory",
      "pasteur",
      "penicillin",
      "fleming",
      "anesthesia",
      "hippocrates"
    ],
    "prompt": "Create a medical history presentation detailing ancient healing practices (trepanning, humoral theory), Hippocratic Oath, Renaissance anatomical discoveries (Vesalius), Joseph Lister's antiseptics, Louis Pasteur's Germ Theory of Disease, William Morton's ether anesthesia, and Alexander Fleming's penicillin miracle. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 10,
    "audience": "Medical History Students & Healthcare Professionals"
  },
  {
    "id": "un_peacekeeping_humanitarian",
    "category": "society",
    "icon": "🇺🇳",
    "title": "United Nations Peacekeeping & Global Humanitarian Missions",
    "desc": "Blue Helmets, conflict de-escalation, refugee aid (UNHCR) & peacekeeping challenges",
    "keywords": [
      "un peacekeeping",
      "united nations",
      "blue helmets",
      "unhcr",
      "humanitarian aid",
      "conflict resolution"
    ],
    "prompt": "Create a political science presentation on United Nations Peacekeeping examining the deployment of UN Blue Helmets, principles of consent/impartiality/non-use of force, UNHCR refugee camp management, disaster relief operations, famous success stories, and structural geopolitical limitations. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "International Relations & Political Science Students"
  },
  {
    "id": "press_freedom_journalism_history",
    "category": "society",
    "icon": "📰",
    "title": "History of Press Freedom & Investigative Journalism",
    "desc": "4th Estate, Watergate scandal, Pentagon Papers, investigative reporting & press protection",
    "keywords": [
      "press freedom",
      "journalism history",
      "watergate",
      "investigative journalism",
      "pentagon papers",
      "fourth estate"
    ],
    "prompt": "Create a journalism history presentation on Press Freedom & Investigative Reporting explaining the concepts of the Fourth Estate, constitutional protections, landmark investigative exposures (Watergate scandal, Pentagon Papers, Panama Papers), whistleblowing, and defending journalists in authoritarian regimes. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Journalism Students, Reporters & Advocates"
  },
  {
    "id": "history_of_education_schools",
    "category": "society",
    "icon": "🏫",
    "title": "History of Education & School Systems",
    "desc": "Gurukul system, Prussian school model, university origins (Bologna/Nalanda) & modern reform",
    "keywords": [
      "history of education",
      "prussian model",
      "gurukul",
      "ancient universities",
      "nalanda",
      "school history"
    ],
    "prompt": "Create an educational history presentation detailing ancient learning academies (Plato's Academy, Nalanda, Taxila), medieval European university origins (Bologna, Oxford), the 19th-century Industrial Prussian school model of age-grading and standardized testing, and progressive modern educational reforms. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Educators, Pedagogy Students & Historians"
  },
  {
    "id": "architecture_urban_planning_history",
    "category": "society",
    "icon": "🏙️",
    "title": "History of Urban Planning & City Design",
    "desc": "Indus Valley grid cities, Haussmann's Paris renovation, Garden City movement & smart cities",
    "keywords": [
      "urban planning history",
      "haussmann paris",
      "city design",
      "grid system",
      "garden city",
      "smart city design"
    ],
    "prompt": "Create an urban history presentation on The Evolution of Urban Planning exploring ancient grid layouts (Mohenjo-daro, Roman camps), Baron Haussmann's 19th-century overhaul of Paris, Ebenezer Howard's Garden City concept, automobile-centric suburban sprawl, and modern sustainable Smart City designs. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 10,
    "audience": "Urban Planners, Architects & Historians"
  },
  {
    "id": "venture_capital_due_diligence",
    "category": "business",
    "icon": "💰",
    "title": "Venture Capital Due Diligence & Term Sheets",
    "desc": "Valuation cap, liquidation preference, cap table management & VC investment memo",
    "keywords": [
      "venture capital",
      "due diligence",
      "term sheet",
      "liquidation preference",
      "cap table",
      "valuation"
    ],
    "prompt": "Create a finance presentation on Venture Capital Due Diligence detailing evaluating startup pitch decks, technology audits, legal and financial due diligence, understanding Term Sheet mechanics (pre-money vs post-money valuation, anti-dilution, liquidation preferences), and managing cap tables. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "finance",
    "slideCount": 10,
    "audience": "Startup Founders, VC Associates & Angel Investors"
  },
  {
    "id": "brand_strategy_positioning",
    "category": "business",
    "icon": "🏷️",
    "title": "Brand Strategy, Architecture & Equity",
    "desc": "Brand positioning matrix, archetype alignment, brand equity models & voice guidelines",
    "keywords": [
      "brand strategy",
      "brand positioning",
      "brand equity",
      "brand architecture",
      "branding",
      "marketing strategy"
    ],
    "prompt": "Create a marketing presentation on Brand Strategy & Positioning covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, defining brand vision and purpose, constructing a brand positioning statement matrix, choosing brand archetypes, building brand architecture (monolithic vs house of brands), and measuring Keller's Brand Equity model.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Brand Managers, Marketing Directors & Agency Executives"
  },
  {
    "id": "growth_hacking_funnels",
    "category": "business",
    "icon": "🚀",
    "title": "Growth Hacking & AARRR Funnel Architecture",
    "desc": "Acquisition, Activation, Retention, Referral, Revenue & viral coefficient loops",
    "keywords": [
      "growth hacking",
      "aarrr funnel",
      "pirate metrics",
      "retention",
      "viral coefficient",
      "growth marketing"
    ],
    "prompt": "Create a modern growth marketing presentation on Growth Hacking & the AARRR Pirate Metrics Funnel covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, optimizing Acquisition channels, frictionless Activation onboarding, boosting Retention rates, building Referral viral loops (K-factor > 1), and maximizing Lifetime Revenue.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Growth Marketers, Startup Founders & Product Leads"
  },
  {
    "id": "b2b_sales_pipeline_management",
    "category": "business",
    "icon": "💼",
    "title": "B2B Enterprise Sales Pipeline & SPIN Selling",
    "desc": "Lead qualification (BANT), SPIN selling methodology, CRM funnels & closing enterprise deals",
    "keywords": [
      "b2b sales",
      "spin selling",
      "sales pipeline",
      "bant",
      "enterprise sales",
      "crm",
      "sales funnel"
    ],
    "prompt": "Create a B2B sales strategy presentation covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, Enterprise Sales Pipeline Management, BANT lead qualification (Budget, Authority, Need, Timeline), Neil Rackham's SPIN Selling method (Situation, Problem, Implication, Need-payoff), overcoming objections, and CRM pipeline forecasting.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "B2B Sales Reps, Account Executives & Sales Directors"
  },
  {
    "id": "mergers_acquisitions_integration",
    "category": "business",
    "icon": "🤝",
    "title": "M&A Post-Merger Integration (PMI)",
    "desc": "Synergy realization, cultural alignment, IT system migration & retention strategy",
    "keywords": [
      "post merger integration",
      "m&a integration",
      "synergy realization",
      "corporate restructuring",
      "pmi"
    ],
    "prompt": "Create a corporate strategy presentation on Post-Merger Integration (PMI) covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, executing Day 1 integration, capturing cost and revenue synergies, aligning corporate cultures, migrating legacy IT infrastructure, and retaining key talent during corporate restructuring.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "M&A Executives, Strategy Consultants & Corporate Leaders"
  },
  {
    "id": "risk_management_enterprise",
    "category": "business",
    "icon": "🛡️",
    "title": "Enterprise Risk Management (ERM)",
    "desc": "Risk identification matrix, COSO framework, risk appetite & mitigation strategies",
    "keywords": [
      "enterprise risk management",
      "erm",
      "coso framework",
      "risk matrix",
      "risk mitigation",
      "compliance"
    ],
    "prompt": "Create an executive presentation on Enterprise Risk Management (ERM) using the COSO ERM framework. Cover identifying operational, financial, strategic, and reputational risks, building heat map risk matrices, establishing corporate risk appetite, and executing risk mitigation vs transfer (insurance). Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Chief Risk Officers, Board Members & Internal Auditors"
  },
  {
    "id": "value_proposition_design",
    "category": "business",
    "icon": "🎯",
    "title": "Value Proposition Canvas & Fit",
    "desc": "Customer gains/pains, pain relievers, gain creators & product-market fit verification",
    "keywords": [
      "value proposition",
      "customer pain points",
      "product market fit",
      "value proposition canvas",
      "alex osterwalder"
    ],
    "prompt": "Create a business design presentation on Value Proposition Canvas (Osterwalder model) exploring mapping customer jobs, pains, and desired gains against product features, pain relievers, and gain creators to achieve verifiable Product-Market Fit. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "startup",
    "slideCount": 8,
    "audience": "Entrepreneurs, Product Managers & Innovation Leads"
  },
  {
    "id": "customer_success_retention",
    "category": "business",
    "icon": "🎧",
    "title": "Customer Success & Churn Reduction",
    "desc": "NPS score, customer health score, onboarding flows, net revenue retention (NRR) & expansion",
    "keywords": [
      "customer success",
      "churn reduction",
      "nps",
      "nrr",
      "customer health score",
      "retention"
    ],
    "prompt": "Create a SaaS business presentation on Customer Success & Churn Reduction detailing proactive onboarding workflows, building Customer Health Scores, tracking Net Promoter Score (NPS), driving upsells and expansion revenue, and increasing Net Revenue Retention (NRR). Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Customer Success Managers, SaaS Founders & Account Managers"
  },
  {
    "id": "franchise_expansion_strategy",
    "category": "business",
    "icon": "🏬",
    "title": "Franchise System Expansion Strategy",
    "desc": "Unit economics, master franchise agreements, operational manuals & franchisee training",
    "keywords": [
      "franchise expansion",
      "unit economics",
      "master franchise",
      "franchisee training",
      "brand scaling"
    ],
    "prompt": "Create a retail business presentation on Franchise System Expansion Strategy detailing establishing profitable unit economics, drafting comprehensive Master Franchise Agreements, writing standard Operating Manuals, setting up franchisee training academies, and quality control auditing. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Franchisors, Retail Directors & Business Growth Consultants"
  },
  {
    "id": "behavioral_economics_nudge",
    "category": "business",
    "icon": "🧠",
    "title": "Behavioral Economics & Nudge Strategy",
    "desc": "Loss aversion, choice architecture, anchoring, default bias & consumer behavior",
    "keywords": [
      "behavioral economics",
      "nudge theory",
      "choice architecture",
      "loss aversion",
      "anchoring",
      "kahneman"
    ],
    "prompt": "Create a captivating business psychology presentation on Behavioral Economics exploring Daniel Kahneman & Richard Thaler concepts: Prospect Theory, Loss Aversion, Anchoring Effect, Choice Architecture, Default Bias, and designing subtle 'Nudges' that ethically drive consumer decisions. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Marketers, UX Designers, Product Managers & Economists"
  },
  {
    "id": "corporate_turnaround_restructuring",
    "category": "business",
    "icon": "🔄",
    "title": "Corporate Turnaround Strategy & Crisis Management",
    "desc": "Distressed asset evaluation, cash burn containment, operational restructuring & debt workouts",
    "keywords": [
      "corporate turnaround",
      "crisis management",
      "restructuring",
      "distressed assets",
      "debt workout",
      "cash burn"
    ],
    "prompt": "Create a high-stakes business presentation on Corporate Turnaround Strategy detailing diagnosing distressed companies, immediate 90-day cash burn containment, debt restructuring with creditors, shedding non-core assets, operational rightsizing, and restoring investor confidence. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Turnaround Consultants, CFOs & Restructuring Specialists"
  },
  {
    "id": "real_estate_investment_analysis",
    "category": "business",
    "icon": "🏗️",
    "title": "Real Estate Investment Analysis & Financial Modeling",
    "desc": "Cap rate, Net Operating Income (NOI), cash-on-cash return, REITs & commercial valuation",
    "keywords": [
      "real estate investment",
      "cap rate",
      "noi",
      "reit",
      "real estate modeling",
      "commercial real estate"
    ],
    "prompt": "Create a real estate finance presentation on Real Estate Investment Analysis detailing calculating Net Operating Income (NOI), Capitalization Rates (Cap Rates), Cash-on-Cash Return, Internal Rate of Return (IRR), evaluating commercial vs residential property, and Real Estate Investment Trusts (REITs). Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "finance",
    "slideCount": 10,
    "audience": "Real Estate Investors, Analysts & Developers"
  },
  {
    "id": "cross_border_trade_tariffs",
    "category": "business",
    "icon": "🛳️",
    "title": "Cross-Border Trade & Export-Import Business",
    "desc": "Incoterms 2020, customs clearance, letters of credit, trade tariffs & foreign exchange risk",
    "keywords": [
      "export import",
      "incoterms",
      "letter of credit",
      "trade tariffs",
      "customs clearance",
      "forex risk"
    ],
    "prompt": "Create an international business presentation on Cross-Border Trade detailing Incoterms 2020 (FOB, CIF, DDP), international payment methods (Letters of Credit), customs documentation & compliance, navigating import tariffs, and managing foreign exchange rate risk. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Export-Import Managers, International Trade Consultants"
  },
  {
    "id": "pricing_strategy_monetization",
    "category": "business",
    "icon": "🏷️",
    "title": "Pricing Strategy & Monetization Models",
    "desc": "Value-based pricing, freemium, tiered SaaS pricing, dynamic pricing & price elasticity",
    "keywords": [
      "pricing strategy",
      "monetization",
      "value based pricing",
      "freemium",
      "saas pricing",
      "price elasticity"
    ],
    "prompt": "Create a revenue strategy presentation on Pricing Strategy & Monetization Models exploring Cost-Plus vs Competitor vs Value-Based pricing, designing tiered SaaS packages, Freemium conversion loops, Dynamic surge pricing algorithms, and calculating Price Elasticity of Demand. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "startup",
    "slideCount": 9,
    "audience": "Product Managers, Monetization Leads & Business Executives"
  },
  {
    "id": "nonprofit_fundraising_grant_writing",
    "category": "business",
    "icon": "🤝",
    "title": "Nonprofit Fundraising & Grant Writing",
    "desc": "Donor cultivation, grant proposal structure, impact metrics & major gift strategies",
    "keywords": [
      "nonprofit fundraising",
      "grant writing",
      "donor cultivation",
      "impact metrics",
      "major gifts",
      "ngo management"
    ],
    "prompt": "Create an impactful NGO management presentation on Nonprofit Fundraising & Grant Writing covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, building a donor pyramid, writing persuasive grant proposals (problem statement, methodology, budget), communicating social impact metrics, and cultivating major individual donors.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Nonprofit Directors, NGO Founders & Fundraisers"
  },
  {
    "id": "differentiated_instruction_classroom",
    "category": "education",
    "icon": "🎨",
    "title": "Differentiated Instruction in Diverse Classrooms",
    "desc": "Adapting content, process & product, learning styles, UDL framework & neurodiversity",
    "keywords": [
      "differentiated instruction",
      "udl",
      "universal design for learning",
      "neurodiversity",
      "pedagogy"
    ],
    "prompt": "Create a teacher professional development presentation on Differentiated Instruction detailing adapting content, process, and product based on student readiness and interest, implementing Universal Design for Learning (UDL) frameworks, and supporting neurodiverse learners. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "K-12 Teachers, School Administrators & Pedagogy Students"
  },
  {
    "id": "formative_vs_summative_assessment",
    "category": "education",
    "icon": "📝",
    "title": "Educational Assessment & Rubric Design",
    "desc": "Formative vs summative evaluation, authentic assessment, rubric design & feedback loops",
    "keywords": [
      "assessment",
      "rubric design",
      "formative assessment",
      "summative assessment",
      "feedback",
      "grading"
    ],
    "prompt": "Create an educational assessment presentation comparing Formative (learning checks, exit tickets) vs Summative (final exams) evaluations, designing objective analytic rubrics, authentic performance task assessment, and giving constructive actionable feedback to students. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Educators, Curriculum Specialists & Academic Directors"
  },
  {
    "id": "gamified_learning_mechanics",
    "category": "education",
    "icon": "🎮",
    "title": "Gamified Learning & Educational Game Design",
    "desc": "Points, badges, leaderboards (PBL), quest-based learning & intrinsic motivation",
    "keywords": [
      "gamified learning",
      "gamification",
      "educational games",
      "pbl",
      "quest based learning",
      "motivation"
    ],
    "prompt": "Create an innovative EdTech presentation on Gamified Learning exploring integrating game mechanics into curricula: Points/Badges/Leaderboards (PBL), quest-based learning paths, instant feedback loops, narrative storytelling in lessons, and balancing intrinsic vs extrinsic motivation. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "EdTech Designers, Teachers & Instructional Designers"
  },
  {
    "id": "blended_flipped_classroom",
    "category": "education",
    "icon": "🔄",
    "title": "The Flipped Classroom & Blended Learning Models",
    "desc": "Pre-recorded lectures, active in-class application, station rotation & self-pacing",
    "keywords": [
      "flipped classroom",
      "blended learning",
      "active learning",
      "station rotation",
      "hybrid education"
    ],
    "prompt": "Create a modern teaching presentation on The Flipped Classroom & Blended Learning Models detailing moving lecture content to homework videos, utilizing in-class time for collaborative active problem-solving, station rotation models, and facilitating self-paced student learning. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "High School & College Instructors, EdTech Specialists"
  },
  {
    "id": "social_emotional_learning_sel",
    "category": "education",
    "icon": "🧠",
    "title": "Social-Emotional Learning (SEL) Frameworks",
    "desc": "CASEL 5 competencies, self-awareness, social awareness, relationship skills & resilience",
    "keywords": [
      "sel",
      "social emotional learning",
      "casel",
      "emotional literacy",
      "classroom management"
    ],
    "prompt": "Create a holistic education presentation on Social-Emotional Learning (SEL) exploring CASEL's 5 core competencies: Self-Awareness, Self-Management, Social Awareness, Relationship Skills, and Responsible Decision-Making. Include SEL integration into daily school routines. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "School Counselors, Teachers & Parents"
  },
  {
    "id": "project_based_learning_pbl",
    "category": "education",
    "icon": "🛠️",
    "title": "Project-Based Learning (PBL) Execution",
    "desc": "Driving questions, sustained inquiry, public product presentation & real-world impact",
    "keywords": [
      "pbl",
      "project based learning",
      "driving question",
      "inquiry based",
      "hands on learning"
    ],
    "prompt": "Create a progressive education presentation on Project-Based Learning (PBL) detailing crafting open-ended Driving Questions, guiding sustained student inquiry, integrating multi-subject standards, facilitating student reflection, and culminating in authentic public presentations. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "K-12 Educators, School Reformers & Curriculum Leads"
  },
  {
    "id": "classroom_management_strategies",
    "category": "education",
    "icon": "🍎",
    "title": "Effective Classroom Management & Culture",
    "desc": "Proactive routines, positive behavior interventions (PBIS), conflict de-escalation & environment",
    "keywords": [
      "classroom management",
      "pbis",
      "positive behavior",
      "de escalation",
      "classroom culture"
    ],
    "prompt": "Create a practical teaching presentation on Classroom Management & Positive Culture covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, establishing clear routines on Day 1, implementing Positive Behavioral Interventions and Supports (PBIS), non-verbal redirection cues, conflict de-escalation, and fostering a safe learning environment.",
    "template": "education",
    "slideCount": 9,
    "audience": "New Teachers, Student Teachers & Mentors"
  },
  {
    "id": "adult_learning_andragogy",
    "category": "education",
    "icon": "💼",
    "title": "Adult Learning Theory (Andragogy) & Corporate Training",
    "desc": "Knowles' 6 principles of adult learning, self-directed learning & professional workshops",
    "keywords": [
      "andragogy",
      "adult learning",
      "malcolm knowles",
      "corporate training",
      "instructional design"
    ],
    "prompt": "Create a professional development presentation on Adult Learning Theory (Andragogy) detailing Malcolm Knowles' 6 principles: need to know, self-concept, prior experience, readiness, orientation to learning, and intrinsic motivation. Apply to designing effective corporate training workshops. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 9,
    "audience": "Corporate Trainers, HR L&D Managers & Instructional Designers"
  },
  {
    "id": "instructional_design_addie_model",
    "category": "education",
    "icon": "📐",
    "title": "Instructional Design & The ADDIE Model",
    "desc": "Analysis, Design, Development, Implementation, Evaluation & SAM agile model",
    "keywords": [
      "instructional design",
      "addie model",
      "sam model",
      "learning objectives",
      "curriculum design"
    ],
    "prompt": "Create an instructional design presentation on the ADDIE Framework detailing conducting Needs Analysis, designing learning objectives (Mager's model), developing course materials, implementing training, and evaluating via Kirkpatrick's 4 levels of evaluation. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "corporate",
    "slideCount": 10,
    "audience": "Instructional Designers, Curriculum Developers & L&D Teams"
  },
  {
    "id": "inclusive_education_special_needs",
    "category": "education",
    "icon": "🤝",
    "title": "Inclusive Education & IEP Management",
    "desc": "Individualized Education Programs (IEP), accommodations vs modifications, assistive tech",
    "keywords": [
      "inclusive education",
      "iep",
      "special education",
      "assistive technology",
      "accommodations"
    ],
    "prompt": "Create a special education presentation on Inclusive Education & IEP Management covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, writing measurable Individualized Education Program (IEP) goals, differentiating accommodations vs modifications, implementing assistive technology tools, and co-teaching models.",
    "template": "education",
    "slideCount": 9,
    "audience": "Special Education Teachers, Mainstream Teachers & Parents"
  },
  {
    "id": "media_literacy_digital_citizenship",
    "category": "education",
    "icon": "💻",
    "title": "Digital Citizenship & Online Safety for Students",
    "desc": "Digital footprint, cyberbullying prevention, copyright, online privacy & screen time",
    "keywords": [
      "digital citizenship",
      "cyberbullying",
      "digital footprint",
      "online safety",
      "screen time"
    ],
    "prompt": "Create a student-centered presentation on Digital Citizenship covering an explicit 'Introduction & Executive Context' section, 'Presentation Overview & Agenda' section, maintaining a clean digital footprint, cyberbullying prevention and reporting, respecting digital copyright, protecting personal data online, and managing healthy screen time balances.",
    "template": "education",
    "slideCount": 8,
    "audience": "Middle & High School Students, Educators & Parents"
  },
  {
    "id": "montessori_education_methodology",
    "category": "education",
    "icon": "🧩",
    "title": "Montessori Education Philosophy & Materials",
    "desc": "Prepared environment, self-directed activity, specialized tactile materials & multi-age groups",
    "keywords": [
      "montessori",
      "maria montessori",
      "prepared environment",
      "tactile learning",
      "child centered"
    ],
    "prompt": "Create a foundational pedagogy presentation on Montessori Education exploring Maria Montessori's philosophy: the Prepared Environment, self-directed activity, hands-on tactile learning materials (sensorial, practical life, math beads), multi-age classrooms, and freedom within limits. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Montessori Teachers, Parents & Education Researchers"
  },
  {
    "id": "peer_tutoring_collaborative_learning",
    "category": "education",
    "icon": "👥",
    "title": "Peer Tutoring & Collaborative Learning Dynamics",
    "desc": "Jigsaw method, Think-Pair-Share, reciprocal teaching & group accountability",
    "keywords": [
      "collaborative learning",
      "peer tutoring",
      "jigsaw method",
      "think pair share",
      "group work"
    ],
    "prompt": "Create an active learning presentation on Collaborative Learning & Peer Tutoring detailing structuring high-functioning student groups, implementing the Jigsaw classroom method, Think-Pair-Share protocols, reciprocal teaching roles, and establishing individual vs group accountability. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 8,
    "audience": "K-12 Teachers & College Professors"
  },
  {
    "id": "ai_in_education_cheating_ethics",
    "category": "education",
    "icon": "🤖",
    "title": "AI in Education: Ethics, Plagiarism & Assessment",
    "desc": "ChatGPT in homework, AI detectors, AI-assisted teaching & evolving assessment methods",
    "keywords": [
      "ai in education",
      "chatgpt teaching",
      "academic integrity",
      "ai plagiarism",
      "future of grading"
    ],
    "prompt": "Create a timely academic presentation on AI in Education exploring ChatGPT's impact on homework, evaluating AI detector limitations, re-thinking traditional essay assignments towards oral exams and in-class writing, teaching ethical AI use to students, and leveraging AI for personalized tutoring. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 10,
    "audience": "Educators, University Deans & Policy Makers"
  },
  {
    "id": "outdoor_nature_based_education",
    "category": "education",
    "icon": "🌲",
    "title": "Forest Schools & Nature-Based Learning",
    "desc": "Outdoor play, risk assessment in nature, environmental stewardship & experiential learning",
    "keywords": [
      "forest school",
      "nature based education",
      "outdoor learning",
      "experiential learning",
      "environmental stewardship"
    ],
    "prompt": "Create a refreshing pedagogy presentation on Forest Schools & Nature-Based Education exploring outdoor immersive learning, calculated risk management (climbing, tools), fostering environmental stewardship, sensory stimulation in nature, and physical/mental health benefits of outdoor classrooms. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Outdoor Educators, Forest School Leaders & Parents"
  },
  {
    "id": "carbon_capture_sequestration_tech",
    "category": "environment",
    "icon": "🏭",
    "title": "Carbon Capture & Geological Sequestration",
    "desc": "Direct Air Capture (DAC), point-source capture, basalt mineralization & carbon economy",
    "keywords": [
      "carbon capture",
      "direct air capture",
      "dac",
      "carbon sequestration",
      "mineralization",
      "net zero"
    ],
    "prompt": "Create an environmental engineering presentation on Carbon Capture & Storage (CCS) detailing Direct Air Capture (DAC) technology, chemical solvents, underground geological mineralization (Climeworks in Iceland), point-source industrial capture, and economic viability of carbon removal. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Environmental Engineers, Climate Tech Investors & Policy Makers"
  },
  {
    "id": "microplastics_ecosystem_impact",
    "category": "environment",
    "icon": "🔍",
    "title": "Microplastics in Soil, Oceans & Human Tissues",
    "desc": "Primary vs secondary microplastics, bioaccumulation, trophic transfer & filtration tech",
    "keywords": [
      "microplastics",
      "nanoplastics",
      "bioaccumulation",
      "plastic pollution",
      "trophic transfer"
    ],
    "prompt": "Create a scientific environmental presentation on Microplastics detailing primary (beads) vs secondary (breakdown) microplastics, transport through soil and freshwater to oceans, bioaccumulation in fish, discovery in human blood and placenta, and innovative membrane filtration technology. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Environmental Scientists, Toxicologists & Public"
  },
  {
    "id": "permafrost_thaw_feedback_loops",
    "category": "environment",
    "icon": "🧊",
    "title": "Arctic Permafrost Thaw & Methane Feedback Loops",
    "desc": "Thermokarst lakes, ancient organic matter, methane clathrates & runaway warming",
    "keywords": [
      "permafrost thaw",
      "methane feedback",
      "arctic warming",
      "thermokarst",
      "climate tipping points"
    ],
    "prompt": "Create a climate science presentation on Arctic Permafrost Thaw exploring thermokarst lake formation, microbial decomposition of ancient frozen organic matter releasing methane and CO2, ocean floor methane clathrate risks, and self-reinforcing global warming feedback loops. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Climate Scientists, Geologists & Environmentalists"
  },
  {
    "id": "smart_grid_energy_storage",
    "category": "environment",
    "icon": "⚡",
    "title": "Smart Grids & Grid-Scale Battery Storage",
    "desc": "Intermittent renewables, Lithium-iron-phosphate (LFP), flow batteries, virtual power plants & grid stability",
    "keywords": [
      "smart grid",
      "battery storage",
      "lfp battery",
      "flow battery",
      "virtual power plant",
      "grid stability"
    ],
    "prompt": "Create a clean energy infrastructure presentation on Smart Grids & Energy Storage addressing renewable intermittency, grid-scale battery storage chemistries (LFP, Redox Flow, Sodium-ion), Virtual Power Plants (VPPs), smart meters, and demand-response load balancing. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Energy Engineers, Utility Executives & Clean Tech Founders"
  },
  {
    "id": "deforestation_amazon_rainforest",
    "category": "environment",
    "icon": "🌳",
    "title": "Amazon Deforestation & Global Climate Regulation",
    "desc": "Rainforest carbon sink, cattle ranching, tipping point to savanna & indigenous protection",
    "keywords": [
      "amazon deforestation",
      "rainforest",
      "carbon sink",
      "savannization",
      "indigenous lands",
      "biodiversity"
    ],
    "prompt": "Create a crucial conservation presentation on Amazon Deforestation detailing the rainforest's role as the Earth's lungs and water pump, drivers of destruction (cattle ranching, soy, logging), the 20-25% deforestation tipping point to savanna conversion, and indigenous territory guardianship. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Conservationists, Geographers & General Audience"
  },
  {
    "id": "sustainable_agriculture_permiculture",
    "category": "environment",
    "icon": "🌾",
    "title": "Regenerative Agriculture & Permaculture",
    "desc": "No-till farming, cover crops, soil microbiome, rotational grazing & carbon farming",
    "keywords": [
      "regenerative agriculture",
      "permaculture",
      "no till farming",
      "cover crops",
      "soil health",
      "carbon farming"
    ],
    "prompt": "Create an eco-farming presentation on Regenerative Agriculture & Permaculture contrasting industrial chemical agriculture with regenerative soil practices: no-till farming, cover cropping, holistic rotational livestock grazing, restoring soil microbiomes, and pulling carbon into topsoil. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Farmers, Agronomists & Environmental Advocates"
  },
  {
    "id": "urban_heat_island_effect",
    "category": "environment",
    "icon": "🏙️",
    "title": "Urban Heat Island Effect & Climate Adaptation",
    "desc": "Asphalt heat absorption, green roofs, urban canopy cover, cool pavements & climate resilient cities",
    "keywords": [
      "urban heat island",
      "green roofs",
      "urban canopy",
      "cool pavement",
      "urban climate adaptation"
    ],
    "prompt": "Create an urban climate presentation on Urban Heat Island (UHI) Effect explaining why concrete/asphalt cities are 5-10°C hotter than rural surroundings, satellite thermal mapping, health impacts on vulnerable populations, and mitigation: green roofs, tree canopy expansion, and reflective cool pavements. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "minimal",
    "slideCount": 8,
    "audience": "Urban Planners, Landscape Architects & Environmental Health Officials"
  },
  {
    "id": "desalination_water_scarcity",
    "category": "environment",
    "icon": "💧",
    "title": "Desalination Technology & Global Water Scarcity",
    "desc": "Reverse osmosis (RO), brine disposal impact, solar desalination & freshwater crisis",
    "keywords": [
      "desalination",
      "reverse osmosis",
      "water scarcity",
      "brine environmental impact",
      "freshwater"
    ],
    "prompt": "Create a water engineering presentation on Desalination & Water Scarcity exploring global freshwater depletion, Reverse Osmosis (RO) membrane technology, energy intensity, environmental risks of hypersaline brine discharge into oceans, and next-gen solar-powered desalination innovations. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "education",
    "slideCount": 9,
    "audience": "Water Engineers, Environmental Policy Makers & Students"
  },
  {
    "id": "rewilding_ecosystem_restoration",
    "category": "environment",
    "icon": "🐺",
    "title": "Rewilding & Apex Predator Reintroduction",
    "desc": "Yellowstone wolves trophic cascade, beaver wetland creation & ecosystem restoration",
    "keywords": [
      "rewilding",
      "trophic cascade",
      "yellowstone wolves",
      "ecosystem restoration",
      "apex predators"
    ],
    "prompt": "Create a thrilling ecology presentation on Rewilding & Apex Predator Reintroduction examining the famous Yellowstone National Park wolf reintroduction causing a beneficial trophic cascade altering river flows, beaver engineering of wetland ecosystems, and restoring self-sustaining wild nature. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Ecologists, Wildlife Enthusiasts & Conservationists"
  },
  {
    "id": "fast_fashion_textile_waste",
    "category": "environment",
    "icon": "👕",
    "title": "Fast Fashion & Textile Waste Crisis",
    "desc": "Microfiber pollution, water consumption, Atacama desert clothing dumps & circular textiles",
    "keywords": [
      "fast fashion",
      "textile waste",
      "microfiber pollution",
      "sustainable fashion",
      "clothing recycling"
    ],
    "prompt": "Create an eye-opening environmental presentation on Fast Fashion & Textile Waste detailing 100 billion annual garment production, toxic synthetic dye runoff, massive water usage for cotton, clothing dumps in Chile's Atacama desert, micro-plastic shedding in washing, and circular closed-loop textile recycling solutions. Include an explicit 'Introduction & Executive Context' slide and 'Presentation Overview & Agenda' slide with structured section headings.",
    "template": "minimal",
    "slideCount": 9,
    "audience": "Consumers, Fashion Students & Environmental Activists"
  }
];

/**
 * Searches PPT_PROMPTS for a prompt matching the input topic name or keyword.
 */
export function getPromptByTopic(topicInput) {
  const clean = (topicInput || "").trim().toLowerCase();
  if (!clean) return null;

  // 1. Exact Title or ID match
  for (const item of PPT_PROMPTS) {
    const titleClean = item.title.toLowerCase();
    if (titleClean === clean || item.id.toLowerCase() === clean) {
      return item;
    }
  }

  // 2. Exact keyword match (kw === clean)
  for (const item of PPT_PROMPTS) {
    if (item.keywords && item.keywords.some((kw) => kw.toLowerCase() === clean)) {
      return item;
    }
  }

  // 3. Substring in Title match
  for (const item of PPT_PROMPTS) {
    if (item.title.toLowerCase().includes(clean) || clean.includes(item.title.toLowerCase())) {
      return item;
    }
  }

  // 4. Keyword substring match
  for (const item of PPT_PROMPTS) {
    if (item.keywords && item.keywords.some((kw) => clean.includes(kw.toLowerCase()) || kw.toLowerCase().includes(clean))) {
      return item;
    }
  }

  return null;
}
