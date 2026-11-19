/* ==========================================================================
   DATA — tout le contenu du portfolio (FR / EN), source unique de vérité.
   Modifier ce fichier suffit pour mettre à jour le site.
   ========================================================================== */
window.App = window.App || {};

App.profile = {
  name: "Mohamed Ziyad Benabdeljalil",
  short: "Ziyad Benabdeljalil",
  handle: "ziyad",
  email: "ziyadbenabdeljalil@gmail.com",
  phone: "+212 701 253 117",
  phoneRaw: "+212701253117",
  location: "Maroc · Mobilité internationale",
  cv: "assets/CV_Ziyad_Benabdeljalil.pdf",
  photo: "assets/photo.jpg",
  linkedin: "", // ← ajoute ton URL LinkedIn ici
  github: "https://github.com/SorenBe"
};

App.i18n = {
  fr: {
    "nav.about": "Profil",
    "nav.experience": "Expériences",
    "nav.skills": "Compétences",
    "nav.projects": "Projets",
    "nav.terminal": "Terminal",
    "nav.education": "Formation",
    "nav.contact": "Contact",
    "nav.palette": "Commandes",

    "boot.skip": "Appuyez sur une touche pour passer",

    "hero.status": "Disponible — CDI · CDD · Alternance",
    "hero.prefix": "Ingénieur d'État",
    "hero.roles": ["Informatique & Réseaux", "Cloud & DevOps", "Développement Full-Stack", "Infrastructure hyperconvergée", "IA & Data"],
    "hero.pitch": "Diplômé MIAGE de l'EMSI, je conçois des systèmes de bout en bout : du code applicatif jusqu'au cluster qui l'héberge — APIs, conteneurs, pipelines CI/CD, stockage distribué et réseau.",
    "hero.cta.projects": "Explorer mon travail",
    "hero.cta.cv": "Télécharger le CV",
    "hero.cta.terminal": "Ouvrir le terminal",
    "hero.scroll": "défiler",
    "hero.mobility": "Maroc & International · Présentiel / Hybride / Télétravail",

    "about.kicker": "01 — Profil",
    "about.title": "Du code jusqu'au rack.",
    "about.p1": "Ingénieur d'État en Informatique & Réseaux, j'ai construit mon parcours à la frontière entre le <strong>développement logiciel</strong>, l'<strong>architecture cloud/DevOps</strong> et l'<strong>infrastructure réseau</strong>.",
    "about.p2": "En trois expériences en entreprise — en France et au Maroc — j'ai livré une API REST sécurisée avec son frontend React et sa chaîne CI/CD, déployé un cluster hyperconvergé Proxmox VE + Ceph à haute disponibilité, puis conçu des solutions logicielles conteneurisées pour la logistique maritime chez CMA CGM.",
    "about.p3": "Ce qui me motive : comprendre un système dans son ensemble, le mesurer, puis le rendre plus fiable.",
    "about.stat.exp": "expériences en entreprise",
    "about.stat.years": "ans de formation ingénieur",
    "about.stat.projects": "projets académiques",
    "about.stat.langs": "langues parlées",
    "about.stat.tech": "technologies maîtrisées",

    "exp.kicker": "02 — Expériences",
    "exp.title": "Trois missions, trois couches de la stack.",
    "exp.sub": "Chaque mission est accompagnée d'un <em>lab interactif</em> qui simule le type de système sur lequel j'ai travaillé. Manipulez-le.",
    "exp.tab.missions": "Missions",
    "exp.tab.lab": "Lab interactif",
    "exp.tab.stack": "Stack",

    "lab.k8s.title": "Orchestrateur de conteneurs",
    "lab.k8s.hint": "Faites évoluer le nombre de réplicas, tuez un pod ou un nœud : l'ordonnanceur rétablit l'état désiré.",
    "lab.k8s.scaleUp": "+ réplica",
    "lab.k8s.scaleDown": "− réplica",
    "lab.k8s.kill": "Tuer un pod",
    "lab.k8s.drain": "Panne nœud",
    "lab.k8s.reset": "Réinitialiser",
    "lab.k8s.desired": "désirés",
    "lab.k8s.ready": "prêts",
    "lab.k8s.rps": "req/s",

    "lab.pve.title": "Cluster Proxmox VE + Ceph (HA)",
    "lab.pve.hint": "Cliquez sur un nœud pour simuler une panne matérielle. Observez la bascule HA des VMs et la reconstruction Ceph.",
    "lab.pve.bench": "Lancer fio",
    "lab.pve.iperf": "Lancer iperf3",
    "lab.pve.heal": "Réparer tout",
    "lab.pve.health": "Santé Ceph",
    "lab.pve.quorum": "Quorum",

    "lab.ci.title": "Pipeline CI/CD GitHub Actions",
    "lab.ci.hint": "Déclenchez un push. Activez « bug » pour injecter une régression et voir le pipeline la bloquer avant la prod.",
    "lab.ci.push": "git push",
    "lab.ci.bug": "Injecter un bug",
    "lab.ci.idle": "En attente d'un commit…",

    "skills.kicker": "03 — Compétences",
    "skills.title": "Une carte, pas une liste.",
    "skills.sub": "Graphe de force : chaque technologie est reliée aux missions et projets où je l'ai mise en œuvre. Glissez les nœuds, survolez pour révéler les liens.",
    "skills.all": "Tout",
    "skills.legend.skill": "Technologie",
    "skills.legend.work": "Mission / projet",
    "skills.usedIn": "Mise en œuvre dans",
    "skills.none": "Compétence issue de la formation et des certifications.",

    "proj.kicker": "04 — Projets",
    "proj.title": "Projets académiques.",
    "proj.sub": "Six projets menés pendant le cycle ingénieur, du système distribué à la vision par ordinateur.",
    "proj.all": "Tous",
    "proj.challenge": "Enjeu",
    "proj.approach": "Approche",
    "proj.stack": "Technologies",
    "proj.close": "Fermer",
    "proj.open": "Détails",

    "term.kicker": "05 — Terminal",
    "term.title": "Interrogez-moi en ligne de commande.",
    "term.sub": "Tapez <code>help</code> pour la liste des commandes. Tab pour l'auto-complétion, ↑/↓ pour l'historique.",

    "edu.kicker": "06 — Formation",
    "edu.title": "Formation & certifications.",
    "edu.certs": "Certifications",
    "edu.langs": "Langues",
    "edu.soft": "Savoir-être",
    "edu.interests": "Engagements & intérêts",

    "contact.kicker": "07 — Contact",
    "contact.title": "Construisons quelque chose de fiable.",
    "contact.sub": "Je recherche un poste en CDI, CDD ou alternance — au Maroc ou à l'international, en présentiel, hybride ou télétravail.",
    "contact.name": "Votre nom",
    "contact.company": "Entreprise",
    "contact.subject": "Objet",
    "contact.message": "Message",
    "contact.send": "Préparer l'e-mail",
    "contact.copy": "Copier l'adresse",
    "contact.copied": "Adresse copiée dans le presse-papiers",
    "contact.call": "Appeler",
    "contact.download": "CV (PDF)",
    "contact.opening": "Ouverture de votre client mail…",
    "contact.required": "Merci de remplir votre nom et votre message.",
    "contact.subjects": ["Opportunité CDI", "Opportunité CDD", "Alternance", "Mission / freelance", "Autre"],

    "footer.built": "Conçu et codé à la main — HTML, CSS & JavaScript natif, zéro framework.",
    "footer.latency": "latence",
    "footer.top": "Retour en haut",

    "palette.placeholder": "Tapez une commande ou une section…",
    "palette.empty": "Aucun résultat",
    "toast.theme.dark": "Thème sombre activé",
    "toast.theme.light": "Thème clair activé",
    "toast.lang": "Langue : Français",
    "toast.konami": "Mode NOC débloqué — trafic réseau ×5",
  },

  en: {
    "nav.about": "Profile",
    "nav.experience": "Experience",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.terminal": "Terminal",
    "nav.education": "Education",
    "nav.contact": "Contact",
    "nav.palette": "Commands",

    "boot.skip": "Press any key to skip",

    "hero.status": "Open to work — Permanent · Fixed-term · Work-study",
    "hero.prefix": "State-certified Engineer",
    "hero.roles": ["Computer Science & Networks", "Cloud & DevOps", "Full-Stack Development", "Hyperconverged Infrastructure", "AI & Data"],
    "hero.pitch": "MIAGE graduate from EMSI, I build systems end to end: from application code down to the cluster that runs it — APIs, containers, CI/CD pipelines, distributed storage and networking.",
    "hero.cta.projects": "Explore my work",
    "hero.cta.cv": "Download résumé",
    "hero.cta.terminal": "Open the terminal",
    "hero.scroll": "scroll",
    "hero.mobility": "Morocco & International · On-site / Hybrid / Remote",

    "about.kicker": "01 — Profile",
    "about.title": "From code to rack.",
    "about.p1": "As a state-certified engineer in Computer Science & Networks, I've built my path at the crossroads of <strong>software development</strong>, <strong>cloud/DevOps architecture</strong> and <strong>network infrastructure</strong>.",
    "about.p2": "Across three industry roles — in France and Morocco — I shipped a secured REST API with its React frontend and CI/CD chain, deployed a highly available Proxmox VE + Ceph hyperconverged cluster, then designed containerised software for maritime logistics at CMA CGM.",
    "about.p3": "What drives me: understanding a system as a whole, measuring it, then making it more reliable.",
    "about.stat.exp": "industry roles",
    "about.stat.years": "years of engineering school",
    "about.stat.projects": "academic projects",
    "about.stat.langs": "spoken languages",
    "about.stat.tech": "technologies",

    "exp.kicker": "02 — Experience",
    "exp.title": "Three roles, three layers of the stack.",
    "exp.sub": "Each role comes with an <em>interactive lab</em> simulating the kind of system I worked on. Play with it.",
    "exp.tab.missions": "Missions",
    "exp.tab.lab": "Interactive lab",
    "exp.tab.stack": "Stack",

    "lab.k8s.title": "Container orchestrator",
    "lab.k8s.hint": "Scale replicas, kill a pod or a node: the scheduler restores the desired state.",
    "lab.k8s.scaleUp": "+ replica",
    "lab.k8s.scaleDown": "− replica",
    "lab.k8s.kill": "Kill a pod",
    "lab.k8s.drain": "Node failure",
    "lab.k8s.reset": "Reset",
    "lab.k8s.desired": "desired",
    "lab.k8s.ready": "ready",
    "lab.k8s.rps": "req/s",

    "lab.pve.title": "Proxmox VE + Ceph cluster (HA)",
    "lab.pve.hint": "Click a node to simulate a hardware failure. Watch VMs fail over and Ceph rebuild.",
    "lab.pve.bench": "Run fio",
    "lab.pve.iperf": "Run iperf3",
    "lab.pve.heal": "Repair all",
    "lab.pve.health": "Ceph health",
    "lab.pve.quorum": "Quorum",

    "lab.ci.title": "GitHub Actions CI/CD pipeline",
    "lab.ci.hint": "Trigger a push. Toggle “bug” to inject a regression and watch the pipeline stop it before production.",
    "lab.ci.push": "git push",
    "lab.ci.bug": "Inject a bug",
    "lab.ci.idle": "Waiting for a commit…",

    "skills.kicker": "03 — Skills",
    "skills.title": "A map, not a list.",
    "skills.sub": "Force-directed graph: every technology is linked to the roles and projects where I used it. Drag nodes, hover to reveal links.",
    "skills.all": "All",
    "skills.legend.skill": "Technology",
    "skills.legend.work": "Role / project",
    "skills.usedIn": "Used in",
    "skills.none": "Skill from coursework and certifications.",

    "proj.kicker": "04 — Projects",
    "proj.title": "Academic projects.",
    "proj.sub": "Six projects built during engineering school, from distributed systems to computer vision.",
    "proj.all": "All",
    "proj.challenge": "Challenge",
    "proj.approach": "Approach",
    "proj.stack": "Technologies",
    "proj.close": "Close",
    "proj.open": "Details",

    "term.kicker": "05 — Terminal",
    "term.title": "Query me from the command line.",
    "term.sub": "Type <code>help</code> to list commands. Tab to autocomplete, ↑/↓ for history.",

    "edu.kicker": "06 — Education",
    "edu.title": "Education & certifications.",
    "edu.certs": "Certifications",
    "edu.langs": "Languages",
    "edu.soft": "Soft skills",
    "edu.interests": "Commitments & interests",

    "contact.kicker": "07 — Contact",
    "contact.title": "Let's build something reliable.",
    "contact.sub": "I'm looking for a permanent, fixed-term or work-study position — in Morocco or abroad, on-site, hybrid or remote.",
    "contact.name": "Your name",
    "contact.company": "Company",
    "contact.subject": "Subject",
    "contact.message": "Message",
    "contact.send": "Compose e-mail",
    "contact.copy": "Copy address",
    "contact.copied": "Address copied to clipboard",
    "contact.call": "Call",
    "contact.download": "Résumé (PDF)",
    "contact.opening": "Opening your mail client…",
    "contact.required": "Please fill in your name and message.",
    "contact.subjects": ["Permanent position", "Fixed-term position", "Work-study", "Contract / freelance", "Other"],

    "footer.built": "Designed and hand-coded — vanilla HTML, CSS & JavaScript, zero framework.",
    "footer.latency": "latency",
    "footer.top": "Back to top",

    "palette.placeholder": "Type a command or section…",
    "palette.empty": "No results",
    "toast.theme.dark": "Dark theme on",
    "toast.theme.light": "Light theme on",
    "toast.lang": "Language: English",
    "toast.konami": "NOC mode unlocked — network traffic ×5",
  }
};

/* ---------- Expériences ---------- */
App.experiences = [
  {
    id: "cmacgm",
    company: "CMA CGM",
    period: { fr: "Fév. – Juil. 2026", en: "Feb. – Jul. 2026" },
    place: { fr: "Maroc", en: "Morocco" },
    role: { fr: "Stage de Fin d'Études (PFE)", en: "Final-Year Engineering Internship" },
    domain: { fr: "Logistique & maritime", en: "Logistics & shipping" },
    lab: "k8s",
    missions: {
      fr: [
        "Conception et développement de solutions informatiques dédiées à la gestion logistique et maritime.",
        "Conteneurisation des services et intégration dans l'architecture système existante.",
        "Optimisation des bases de données et sécurisation des échanges de données."
      ],
      en: [
        "Designed and developed software solutions for logistics and maritime operations management.",
        "Containerised services and integrated them into the existing system architecture.",
        "Optimised databases and secured data exchanges."
      ]
    },
    stack: ["Docker", "Conteneurisation", "Bases de données", "Sécurité des échanges", "Architecture SI"]
  },
  {
    id: "emerge",
    company: "Emerge Invest",
    period: { fr: "Juil. – Août 2025", en: "Jul. – Aug. 2025" },
    place: { fr: "Casablanca", en: "Casablanca" },
    role: { fr: "Stage Ingénieur", en: "Engineering Internship" },
    domain: { fr: "Infrastructure & virtualisation", en: "Infrastructure & virtualisation" },
    lab: "pve",
    missions: {
      fr: [
        "Conception et déploiement d'une architecture hyperconvergée : cluster Proxmox VE + stockage distribué Ceph.",
        "Tests de performance et de haute disponibilité (bascule de VMs, perte de nœud).",
        "Supervision et métrologie via Grafana, benchmarks disque avec fio et réseau avec iperf3."
      ],
      en: [
        "Designed and deployed a hyperconverged architecture: Proxmox VE cluster + Ceph distributed storage.",
        "Ran performance and high-availability tests (VM failover, node loss).",
        "Monitoring with Grafana, disk benchmarks with fio and network benchmarks with iperf3."
      ]
    },
    stack: ["Proxmox VE", "Ceph", "Grafana", "fio", "iperf3", "Haute disponibilité"]
  },
  {
    id: "smb",
    company: "SMB-Industries",
    period: { fr: "Juil. – Août 2024", en: "Jul. – Aug. 2024" },
    place: { fr: "Montpellier, France", en: "Montpellier, France" },
    role: { fr: "Stage Développeur", en: "Developer Internship" },
    domain: { fr: "Développement full-stack", en: "Full-stack development" },
    lab: "ci",
    missions: {
      fr: [
        "Backend & API : développement d'une API REST sécurisée avec FastAPI et PostgreSQL.",
        "Frontend : conception d'une interface web dynamique en React.",
        "DevOps : pipelines CI/CD avec GitHub Actions et conteneurisation Docker."
      ],
      en: [
        "Backend & API: built a secured REST API with FastAPI and PostgreSQL.",
        "Frontend: designed a dynamic web interface in React.",
        "DevOps: CI/CD pipelines with GitHub Actions and Docker containerisation."
      ]
    },
    stack: ["FastAPI", "PostgreSQL", "React", "GitHub Actions", "Docker", "REST"]
  }
];

/* ---------- Compétences ---------- */
App.skillCategories = [
  { id: "lang",  fr: "Langages",        en: "Languages",        color: "#4da3ff" },
  { id: "back",  fr: "Backend",          en: "Backend",          color: "#8f7bff" },
  { id: "front", fr: "Frontend",         en: "Frontend",         color: "#ff7bd5" },
  { id: "ops",   fr: "DevOps & Cloud",   en: "DevOps & Cloud",   color: "#3ee8c5" },
  { id: "db",    fr: "Bases de données", en: "Databases",        color: "#ffb547" },
  { id: "net",   fr: "Réseaux & Sécurité", en: "Networks & Security", color: "#ff6b6b" },
  { id: "ai",    fr: "IA & Data",        en: "AI & Data",        color: "#b6f36b" },
  { id: "erp",   fr: "ERP / CRM",        en: "ERP / CRM",        color: "#5ad1ff" }
];

/* links = ids d'expériences / projets où la techno est utilisée (d'après le CV) */
App.skills = [
  { n: "Java",          c: "lang" },
  { n: "Python",        c: "lang", links: ["smb", "face", "agri", "nlp"] },
  { n: "C",             c: "lang" },
  { n: "Dart",          c: "lang" },
  { n: "JavaScript",    c: "lang", links: ["smb", "ecom"] },
  { n: "Spring Boot",   c: "back" },
  { n: "FastAPI",       c: "back", links: ["smb"] },
  { n: "Flask",         c: "back" },
  { n: "Django",        c: "back" },
  { n: "J2EE",          c: "back" },
  { n: "React",         c: "front", links: ["smb"] },
  { n: "React Native",  c: "front" },
  { n: "Tailwind CSS",  c: "front" },
  { n: "HTML5/CSS3",    c: "front", links: ["ecom"] },
  { n: "Docker",        c: "ops", links: ["smb", "cmacgm", "micro"] },
  { n: "Kubernetes",    c: "ops", links: ["micro"] },
  { n: "OpenShift",     c: "ops" },
  { n: "Proxmox VE",    c: "ops", links: ["emerge"] },
  { n: "Ceph",          c: "ops", links: ["emerge"] },
  { n: "CI/CD",         c: "ops", links: ["smb", "devsecops"] },
  { n: "Git",           c: "ops", links: ["smb", "devsecops"] },
  { n: "Grafana",       c: "ops", links: ["emerge"] },
  { n: "PostgreSQL",    c: "db", links: ["smb"] },
  { n: "MySQL",         c: "db" },
  { n: "MongoDB",       c: "db" },
  { n: "Oracle",        c: "db" },
  { n: "SQL Server",    c: "db" },
  { n: "TCP/IP",        c: "net", links: ["emerge"] },
  { n: "Wireshark",     c: "net" },
  { n: "Cisco Packet Tracer", c: "net" },
  { n: "SAST",          c: "net", links: ["devsecops"] },
  { n: "OWASP",         c: "net", links: ["devsecops", "smb"] },
  { n: "PyTorch",       c: "ai", links: ["face", "agri"] },
  { n: "Réseaux siamois", en: "Siamese networks", c: "ai", links: ["face"] },
  { n: "NLP",           c: "ai", links: ["nlp"] },
  { n: "Classification d'images", en: "Image classification", c: "ai", links: ["agri"] },
  { n: "Salesforce",    c: "erp" },
  { n: "LWC / Apex",    c: "erp" }
];

/* ---------- Projets ---------- */
App.projects = [
  {
    id: "micro", cat: "cloud", icon: "hub",
    title: { fr: "Architecture microservices", en: "Microservices architecture" },
    short: { fr: "Conception et déploiement d'une application distribuée.", en: "Design and deployment of a distributed application." },
    challenge: { fr: "Découper une application en services indépendants, déployables et scalables séparément, sans perdre la cohérence globale.", en: "Split an application into independent services that can be deployed and scaled separately without losing overall consistency." },
    approach: { fr: "Services faiblement couplés communiquant par API, conteneurisés, avec une passerelle d'entrée et une découverte de services ; déploiement orchestré.", en: "Loosely coupled services communicating over APIs, containerised, behind an API gateway with service discovery; orchestrated deployment." },
    tags: ["Microservices", "Docker", "Kubernetes", "API"]
  },
  {
    id: "devsecops", cat: "cloud", icon: "shield",
    title: { fr: "Chaîne DevSecOps", en: "DevSecOps pipeline" },
    short: { fr: "Intégration d'outils d'analyse de vulnérabilités dans la chaîne CI/CD.", en: "Vulnerability scanning integrated into the CI/CD chain." },
    challenge: { fr: "Détecter les failles le plus tôt possible, sans ralentir le cycle de livraison.", en: "Catch vulnerabilities as early as possible without slowing delivery." },
    approach: { fr: "Analyse statique (SAST) et contrôles alignés OWASP exécutés automatiquement à chaque commit, avec blocage du pipeline sur les failles critiques.", en: "Static analysis (SAST) and OWASP-aligned checks run automatically on every commit, failing the pipeline on critical findings." },
    tags: ["CI/CD", "SAST", "OWASP", "Git"]
  },
  {
    id: "face", cat: "ai", icon: "face",
    title: { fr: "Reconnaissance faciale", en: "Face recognition" },
    short: { fr: "Modèle à base de réseaux siamois.", en: "Siamese-network based model." },
    challenge: { fr: "Reconnaître une personne à partir de très peu d'exemples par identité (one-shot learning).", en: "Recognise a person from very few examples per identity (one-shot learning)." },
    approach: { fr: "Réseau siamois apprenant un espace d'embeddings où la distance mesure la similarité entre deux visages ; vérification par seuil.", en: "Siamese network learning an embedding space where distance measures similarity between two faces; threshold-based verification." },
    tags: ["PyTorch", "Réseaux siamois", "Computer Vision", "Python"]
  },
  {
    id: "agri", cat: "ai", icon: "leaf",
    title: { fr: "Classification d'images agricoles", en: "Agricultural image classification" },
    short: { fr: "Modèle de vision par ordinateur.", en: "Computer vision model." },
    challenge: { fr: "Classer automatiquement des images agricoles malgré la variabilité des conditions de prise de vue.", en: "Automatically classify agricultural images despite varying capture conditions." },
    approach: { fr: "Réseau de neurones convolutif, augmentation de données et évaluation par matrice de confusion.", en: "Convolutional neural network, data augmentation and confusion-matrix evaluation." },
    tags: ["PyTorch", "Classification d'images", "CNN", "Python"]
  },
  {
    id: "nlp", cat: "ai", icon: "chat",
    title: { fr: "Analyse de sentiments", en: "Sentiment analysis" },
    short: { fr: "Traitement automatique du langage (NLP).", en: "Natural language processing (NLP)." },
    challenge: { fr: "Déterminer automatiquement la polarité d'un texte libre.", en: "Automatically determine the polarity of free text." },
    approach: { fr: "Pipeline NLP : nettoyage, tokenisation, vectorisation puis modèle de classification.", en: "NLP pipeline: cleaning, tokenisation, vectorisation, then a classification model." },
    tags: ["NLP", "Python", "Machine Learning"]
  },
  {
    id: "ecom", cat: "web", icon: "cart",
    title: { fr: "Plateforme e-commerce", en: "E-commerce platform" },
    short: { fr: "Application web complète.", en: "Full web application." },
    challenge: { fr: "Livrer un parcours d'achat complet : catalogue, panier, commande et administration.", en: "Deliver a full shopping journey: catalogue, cart, checkout and administration." },
    approach: { fr: "Application web full-stack avec gestion des utilisateurs, du catalogue et des commandes.", en: "Full-stack web application handling users, catalogue and orders." },
    tags: ["Full-stack", "JavaScript", "HTML5/CSS3", "SQL"]
  }
];

App.projectCats = [
  { id: "cloud", fr: "Cloud & DevOps", en: "Cloud & DevOps" },
  { id: "ai",    fr: "IA & Data",      en: "AI & Data" },
  { id: "web",   fr: "Web",            en: "Web" }
];

/* ---------- Formation ---------- */
App.education = [
  {
    title: { fr: "Diplôme d'Ingénieur d'État — MIAGE", en: "State Engineering Degree — MIAGE" },
    school: "École Marocaine des Sciences de l'Ingénieur (EMSI)",
    period: "2021 – 2026", place: "Rabat",
    detail: { fr: "Méthodes Informatiques Appliquées à la Gestion des Entreprises — Informatique & Réseaux.", en: "Computer Methods Applied to Business Management — Computer Science & Networks." }
  },
  {
    title: { fr: "Baccalauréat Scientifique (Option Français)", en: "Scientific Baccalaureate (French option)" },
    school: "Lycée Paul Valéry",
    period: "2020", place: "Meknès",
    detail: { fr: "", en: "" }
  }
];

App.certs = [
  { group: { fr: "Cloud & DevOps", en: "Cloud & DevOps" }, items: ["Docker", "Kubernetes", "OpenShift"] },
  { group: { fr: "Développement & Data", en: "Development & Data" }, items: ["React Native — Meta", "SQL — University of Colorado", "Git & GitHub — Google"] },
  { group: { fr: "Intelligence artificielle", en: "Artificial intelligence" }, items: ["AI Foundations — IBM"] }
];

App.languages = [
  { n: { fr: "Français", en: "French" }, lvl: { fr: "Langue maternelle / courant", en: "Native / fluent" }, v: 100 },
  { n: { fr: "Arabe", en: "Arabic" }, lvl: { fr: "Courant", en: "Fluent" }, v: 90 },
  { n: { fr: "Anglais", en: "English" }, lvl: { fr: "Avancé", en: "Advanced" }, v: 80 }
];

App.softSkills = {
  fr: ["Capacité d'analyse et résolution de problèmes", "Travail en équipe & méthodologies agiles", "Rigueur, organisation et autonomie"],
  en: ["Analytical thinking and problem solving", "Teamwork & agile methodologies", "Rigour, organisation and autonomy"]
};

App.interests = {
  fr: [
    { t: "Bénévolat", d: "Aide humanitaire à la Croix-Rouge." },
    { t: "Jeux de rôle tactiques", d: "Planification et stratégie." },
    { t: "Veille technologique", d: "Cloud, infrastructure, IA." }
  ],
  en: [
    { t: "Volunteering", d: "Humanitarian aid with the Red Cross." },
    { t: "Tactical role-playing games", d: "Planning and strategy." },
    { t: "Tech watch", d: "Cloud, infrastructure, AI." }
  ]
};
