/* ==========================================================================
   DATA — tout le contenu du portfolio (FR / EN), source unique de vérité.
   Aligné sur le CV (cv_base, novembre 2026). Modifier ce fichier suffit
   pour mettre à jour le site.
   ========================================================================== */
window.App = window.App || {};

App.profile = {
  name: "Mohamed Ziyad Benabdeljalil",
  short: "Ziyad Benabdeljalil",
  handle: "ziyad",
  email: "ziyadbenabdeljalil@gmail.com",
  phone: "+212 7 01 25 31 17",
  phoneRaw: "+212701253117",
  cv: "assets/CV_Ziyad_Benabdeljalil.pdf",
  photo: "assets/photo.jpg",
  linkedin: "https://www.linkedin.com/in/mohamed-ziyad-benabdeljalil",
  linkedinLabel: "mohamed-ziyad-benabdeljalil",
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

    "hero.status": "Recherche : CDI · CDD · Alternance",
    "hero.prefix": "Ingénieur d'État",
    "hero.roles": ["Informatique & Réseaux", "Infrastructure réseau multi-sites", "Virtualisation & Cloud", "Développement Full-Stack", "Data & IA"],
    "hero.pitch": "Ingénieur d'État diplômé de l'EMSI (filière MIAGE, 2026), à l'aise entre la technique et les besoins métier : réseau et stockage multi-sites, virtualisation hyperconvergée, développement web.",
    "hero.cta.projects": "Explorer mon travail",
    "hero.cta.cv": "Voir le CV",
    "hero.cta.terminal": "Ouvrir le terminal",
    "hero.scroll": "défiler",
    "hero.mobility": "France, Maroc ou télétravail",

    "about.kicker": "Profil",
    "about.title": "Du besoin métier à l'infrastructure.",
    "about.p1": "Ingénieur d'État en informatique et réseaux (EMSI, filière MIAGE, 2026), je suis à l'aise entre <strong>la technique</strong> et <strong>les besoins métier</strong>.",
    "about.p2": "Trois stages — infrastructure multi-sites chez CMA CGM, virtualisation hyperconvergée chez Emerge Invest, développement web en France chez SMB-Industries — m'ont appris à analyser un besoin, à le traduire en solution concrète et à la documenter clairement.",
    "about.p3": "Je recherche un CDI, un CDD ou une alternance, en France, au Maroc ou en télétravail.",
    "about.stat.exp": "stages en entreprise",
    "about.stat.years": "ans de cycle ingénieur",
    "about.stat.projects": "projets académiques",
    "about.stat.certs": "certifications Coursera",
    "about.stat.tech": "compétences techniques",

    "exp.kicker": "Expériences",
    "exp.title": "Trois stages, trois couches de l'infrastructure.",
    "exp.sub": "Chaque stage est accompagné d'un <em>lab interactif</em> : une simulation illustrative du type de système concerné (noms et valeurs fictifs). Manipulez-le.",
    "exp.tab.missions": "Missions",
    "exp.tab.lab": "Lab interactif",
    "exp.tab.stack": "Outils",

    "lab.net.title": "Réseau & stockage multi-sites",
    "lab.net.hint": "Simulation illustrative. Cliquez sur le lien WAN d'un site pour le couper, testez la connectivité, lancez une réplication NAS ou générez la documentation.",
    "lab.net.ping": "Tester la connectivité",
    "lab.net.sync": "Réplication NAS",
    "lab.net.vlan": "Vue VLAN",
    "lab.net.doc": "Générer la doc",
    "lab.net.online": "sites en ligne",
    "lab.net.latency": "latence moy.",
    "lab.net.hq": "Siège",
    "lab.net.branch": "Site régional",
    "lab.net.wan": "WAN",

    "lab.pve.title": "Cluster Proxmox VE + Ceph (HA)",
    "lab.pve.hint": "Simulation illustrative. Migrez les VMs de l'ancien serveur vers le cluster, puis cliquez sur un nœud pour simuler une panne : la haute disponibilité redémarre ses VMs ailleurs.",
    "lab.pve.migrate": "Migrer une VM",
    "lab.pve.heal": "Réparer tout",
    "lab.pve.health": "Santé Ceph",
    "lab.pve.quorum": "Quorum",
    "lab.pve.legacy": "Ancien serveur",

    "lab.ci.title": "Pipeline CI/CD",
    "lab.ci.hint": "Simulation illustrative. Déclenchez un push. Activez « bug » pour injecter une régression et voir le pipeline la bloquer avant la mise en production.",
    "lab.ci.push": "git push",
    "lab.ci.bug": "Injecter un bug",
    "lab.ci.idle": "En attente d'un commit…",

    "skills.kicker": "Compétences",
    "skills.title": "Une carte, pas une liste.",
    "skills.sub": "Graphe de force : chaque compétence est reliée aux stages et projets où je l'ai mise en œuvre. Glissez les nœuds, survolez pour révéler les liens.",
    "skills.all": "Tout",
    "skills.legend.skill": "Compétence",
    "skills.legend.work": "Stage / projet",
    "skills.usedIn": "Mise en œuvre dans",
    "skills.none": "Compétence issue de la formation et des certifications.",

    "proj.kicker": "Projets",
    "proj.title": "Projets académiques.",
    "proj.sub": "Six projets menés pendant le cycle ingénieur, de l'architecture distribuée à l'intelligence artificielle.",
    "proj.all": "Tous",
    "proj.challenge": "Enjeu",
    "proj.approach": "Approche",
    "proj.stack": "Technologies",
    "proj.close": "Fermer",
    "proj.open": "Détails",

    "term.kicker": "Terminal",
    "term.title": "Interrogez-moi en ligne de commande.",
    "term.sub": "Tapez <code>help</code> pour la liste des commandes. Tab pour l'auto-complétion, ↑/↓ pour l'historique.",

    "edu.kicker": "Formation",
    "edu.title": "Formation & certifications.",
    "edu.certs": "Certifications (Coursera)",
    "edu.langs": "Langues",
    "edu.soft": "Savoir-être",
    "edu.interests": "Centres d'intérêt",
    "edu.also": "Également",

    "contact.kicker": "Contact",
    "contact.title": "Construisons quelque chose de fiable.",
    "contact.sub": "Je recherche un CDI, un CDD ou une alternance — en France, au Maroc ou en télétravail.",
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
    "contact.subjects": ["Opportunité CDI", "Opportunité CDD", "Alternance", "Autre"],

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

    "hero.status": "Looking for: permanent · fixed-term · work-study",
    "hero.prefix": "State-certified Engineer",
    "hero.roles": ["Computer Science & Networks", "Multi-site network infrastructure", "Virtualisation & Cloud", "Full-Stack Development", "Data & AI"],
    "hero.pitch": "State-certified engineer from EMSI (MIAGE track, 2026), comfortable between technology and business needs: multi-site networking and storage, hyperconverged virtualisation, web development.",
    "hero.cta.projects": "Explore my work",
    "hero.cta.cv": "View résumé",
    "hero.cta.terminal": "Open the terminal",
    "hero.scroll": "scroll",
    "hero.mobility": "France, Morocco or remote",

    "about.kicker": "Profile",
    "about.title": "From business need to infrastructure.",
    "about.p1": "State-certified engineer in computer science and networks (EMSI, MIAGE track, 2026), I'm comfortable between <strong>technology</strong> and <strong>business needs</strong>.",
    "about.p2": "Three internships — multi-site infrastructure at CMA CGM, hyperconverged virtualisation at Emerge Invest, web development in France at SMB-Industries — taught me to analyse a need, turn it into a concrete solution and document it clearly.",
    "about.p3": "I'm looking for a permanent, fixed-term or work-study position, in France, Morocco or remote.",
    "about.stat.exp": "internships",
    "about.stat.years": "years of engineering school",
    "about.stat.projects": "academic projects",
    "about.stat.certs": "Coursera certificates",
    "about.stat.tech": "technical skills",

    "exp.kicker": "Experience",
    "exp.title": "Three internships, three layers of infrastructure.",
    "exp.sub": "Each internship comes with an <em>interactive lab</em>: an illustrative simulation of the kind of system involved (names and values are fictional). Play with it.",
    "exp.tab.missions": "Missions",
    "exp.tab.lab": "Interactive lab",
    "exp.tab.stack": "Tools",

    "lab.net.title": "Multi-site network & storage",
    "lab.net.hint": "Illustrative simulation. Click a site's WAN link to cut it, test connectivity, run a NAS replication or generate the documentation.",
    "lab.net.ping": "Test connectivity",
    "lab.net.sync": "NAS replication",
    "lab.net.vlan": "VLAN view",
    "lab.net.doc": "Generate docs",
    "lab.net.online": "sites online",
    "lab.net.latency": "avg latency",
    "lab.net.hq": "Head office",
    "lab.net.branch": "Regional site",
    "lab.net.wan": "WAN",

    "lab.pve.title": "Proxmox VE + Ceph cluster (HA)",
    "lab.pve.hint": "Illustrative simulation. Migrate VMs from the old server to the cluster, then click a node to simulate a failure: high availability restarts its VMs elsewhere.",
    "lab.pve.migrate": "Migrate a VM",
    "lab.pve.heal": "Repair all",
    "lab.pve.health": "Ceph health",
    "lab.pve.quorum": "Quorum",
    "lab.pve.legacy": "Old server",

    "lab.ci.title": "CI/CD pipeline",
    "lab.ci.hint": "Illustrative simulation. Trigger a push. Toggle “bug” to inject a regression and watch the pipeline stop it before production.",
    "lab.ci.push": "git push",
    "lab.ci.bug": "Inject a bug",
    "lab.ci.idle": "Waiting for a commit…",

    "skills.kicker": "Skills",
    "skills.title": "A map, not a list.",
    "skills.sub": "Force-directed graph: every skill is linked to the internships and projects where I used it. Drag nodes, hover to reveal links.",
    "skills.all": "All",
    "skills.legend.skill": "Skill",
    "skills.legend.work": "Internship / project",
    "skills.usedIn": "Used in",
    "skills.none": "Skill from coursework and certifications.",

    "proj.kicker": "Projects",
    "proj.title": "Academic projects.",
    "proj.sub": "Six projects built during engineering school, from distributed architecture to artificial intelligence.",
    "proj.all": "All",
    "proj.challenge": "Challenge",
    "proj.approach": "Approach",
    "proj.stack": "Technologies",
    "proj.close": "Close",
    "proj.open": "Details",

    "term.kicker": "Terminal",
    "term.title": "Query me from the command line.",
    "term.sub": "Type <code>help</code> to list commands. Tab to autocomplete, ↑/↓ for history.",

    "edu.kicker": "Education",
    "edu.title": "Education & certifications.",
    "edu.certs": "Certifications (Coursera)",
    "edu.langs": "Languages",
    "edu.soft": "Soft skills",
    "edu.interests": "Interests",
    "edu.also": "Also",

    "contact.kicker": "Contact",
    "contact.title": "Let's build something reliable.",
    "contact.sub": "I'm looking for a permanent, fixed-term or work-study position — in France, Morocco or remote.",
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
    "contact.subjects": ["Permanent position", "Fixed-term position", "Work-study", "Other"],

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

/* ---------- Expériences (texte repris du CV) ---------- */
App.experiences = [
  {
    id: "cmacgm",
    company: "CMA CGM Maroc",
    period: { fr: "févr. – août 2026", en: "Feb. – Aug. 2026" },
    place: { fr: "Casablanca", en: "Casablanca" },
    role: { fr: "Stage de fin d'études", en: "Final-year internship" },
    domain: { fr: "Infrastructure réseau & stockage", en: "Network & storage infrastructure" },
    lab: "net",
    missions: {
      fr: [
        "Modernisation de l'infrastructure réseau et stockage de trois sites (Casablanca, Tanger, Agadir).",
        "Équipements Cisco, Meraki, Dell et Synology ; schémas avant/après et documentation technique."
      ],
      en: [
        "Modernised the network and storage infrastructure of three sites (Casablanca, Tangier, Agadir).",
        "Cisco, Meraki, Dell and Synology equipment; before/after diagrams and technical documentation."
      ]
    },
    stack: ["Cisco", "Meraki", "Dell", "Synology", "Documentation technique"]
  },
  {
    id: "emerge",
    company: "Emerge Invest",
    period: { fr: "juil. – août 2025", en: "Jul. – Aug. 2025" },
    place: { fr: "Casablanca", en: "Casablanca" },
    role: { fr: "Stagiaire infrastructure & virtualisation", en: "Infrastructure & virtualisation intern" },
    domain: { fr: "Virtualisation hyperconvergée", en: "Hyperconverged virtualisation" },
    lab: "pve",
    missions: {
      fr: [
        "Conception de l'architecture d'un cluster hyperconvergé Proxmox VE + Ceph.",
        "Mise en place de la haute disponibilité et migration des machines virtuelles vers le cluster."
      ],
      en: [
        "Designed the architecture of a hyperconverged Proxmox VE + Ceph cluster.",
        "Set up high availability and migrated the virtual machines to the cluster."
      ]
    },
    stack: ["Proxmox VE", "Ceph", "Haute disponibilité", "Migration de VMs"]
  },
  {
    id: "smb",
    company: "SMB-Industries",
    period: { fr: "juil. – août 2024", en: "Jul. – Aug. 2024" },
    place: { fr: "Montpellier, France", en: "Montpellier, France" },
    role: { fr: "Stagiaire développeur full-stack", en: "Full-stack developer intern" },
    domain: { fr: "Développement web", en: "Web development" },
    lab: "ci",
    missions: {
      fr: [
        "Développement d'un logiciel de prise de rendez-vous : API FastAPI, interface React.",
        "Conteneurisation Docker et pipeline CI/CD ; suivi de projet et des échéances."
      ],
      en: [
        "Built an appointment-booking application: FastAPI API, React interface.",
        "Docker containerisation and CI/CD pipeline; project and deadline follow-up."
      ]
    },
    stack: ["FastAPI", "React", "Docker", "CI/CD", "Gestion de projet"]
  }
];

/* ---------- Compétences (catégories et éléments du CV) ---------- */
App.skillCategories = [
  { id: "net",  fr: "Réseaux & systèmes",     en: "Networks & systems",       color: "#ff6b6b" },
  { id: "virt", fr: "Virtualisation & cloud", en: "Virtualisation & cloud",   color: "#3ee8c5" },
  { id: "dev",  fr: "Développement",          en: "Development",              color: "#4da3ff" },
  { id: "tool", fr: "Outils & méthodes",      en: "Tools & methods",          color: "#ffb547" },
  { id: "ai",   fr: "Data & IA",              en: "Data & AI",                color: "#b6f36b" }
];

/* links = ids de stages / projets où la compétence apparaît dans le CV */
App.skills = [
  { n: "Cisco",            c: "net", links: ["cmacgm"] },
  { n: "Meraki",           c: "net", links: ["cmacgm"] },
  { n: "VLAN",             c: "net" },
  { n: "Wireshark",        c: "net" },
  { n: "Packet Tracer",    c: "net" },
  { n: "Linux/Unix",       c: "net" },
  { n: "Proxmox VE",       c: "virt", links: ["emerge"] },
  { n: "Ceph",             c: "virt", links: ["emerge"] },
  { n: "Docker",           c: "virt", links: ["smb", "micro"] },
  { n: "Kubernetes",       c: "virt", links: ["micro"] },
  { n: "OpenShift",        c: "virt" },
  { n: "Azure",            c: "virt" },
  { n: "Python",           c: "dev", links: ["smb", "face", "agri", "nlp"] },
  { n: "Java",             c: "dev", links: ["micro"] },
  { n: "Spring Boot",      c: "dev", links: ["micro"] },
  { n: "FastAPI",          c: "dev", links: ["smb"] },
  { n: "React",            c: "dev", links: ["smb"] },
  { n: "SQL/PostgreSQL",   c: "dev" },
  { n: "Git/GitHub",       c: "tool" },
  { n: "CI/CD",            c: "tool", links: ["smb", "devsecops"] },
  { n: "Salesforce",       c: "tool" },
  { n: "Documentation technique", en: "Technical documentation", c: "tool", links: ["cmacgm"] },
  { n: "Gestion de projet", en: "Project management", c: "tool", links: ["smb"] },
  { n: "PyTorch",          c: "ai", links: ["face", "agri"] },
  { n: "NLP",              c: "ai", links: ["nlp"] },
  { n: "Vision par ordinateur", en: "Computer vision", c: "ai", links: ["face", "agri"] }
];

/* ---------- Projets (CV : projets académiques) ---------- */
App.projects = [
  {
    id: "micro", cat: "cloud", icon: "hub",
    title: { fr: "Architecture microservices", en: "Microservices architecture" },
    short: { fr: "Application distribuée en microservices — Spring Boot, Docker, Kubernetes.", en: "Distributed microservices application — Spring Boot, Docker, Kubernetes." },
    challenge: { fr: "Découper une application en services indépendants, déployables et scalables séparément.", en: "Split an application into independent services that can be deployed and scaled separately." },
    approach: { fr: "Services Spring Boot communiquant par API, conteneurisés avec Docker et déployés sur Kubernetes.", en: "Spring Boot services communicating over APIs, containerised with Docker and deployed on Kubernetes." },
    tags: ["Spring Boot", "Docker", "Kubernetes"]
  },
  {
    id: "devsecops", cat: "cloud", icon: "shield",
    title: { fr: "DevSecOps", en: "DevSecOps" },
    short: { fr: "Analyse automatisée des vulnérabilités dans une chaîne CI/CD.", en: "Automated vulnerability analysis in a CI/CD chain." },
    challenge: { fr: "Détecter les vulnérabilités le plus tôt possible, sans ralentir les livraisons.", en: "Catch vulnerabilities as early as possible without slowing delivery." },
    approach: { fr: "Analyse des vulnérabilités exécutée automatiquement à chaque modification, intégrée aux étapes de la chaîne CI/CD.", en: "Vulnerability analysis run automatically on every change, built into the CI/CD stages." },
    tags: ["CI/CD", "Sécurité", "Automatisation"]
  },
  {
    id: "face", cat: "ai", icon: "face",
    title: { fr: "Reconnaissance faciale", en: "Face recognition" },
    short: { fr: "Modèle à base de réseaux siamois.", en: "Siamese-network based model." },
    challenge: { fr: "Reconnaître une personne à partir de très peu d'exemples par identité.", en: "Recognise a person from very few examples per identity." },
    approach: { fr: "Réseau siamois qui compare deux visages en mesurant la distance entre leurs représentations.", en: "Siamese network that compares two faces by measuring the distance between their representations." },
    tags: ["PyTorch", "Réseaux siamois", "Vision par ordinateur"]
  },
  {
    id: "agri", cat: "ai", icon: "leaf",
    title: { fr: "Classification d'images agricoles", en: "Agricultural image classification" },
    short: { fr: "Modèle de vision par ordinateur.", en: "Computer vision model." },
    challenge: { fr: "Classer automatiquement des images agricoles.", en: "Automatically classify agricultural images." },
    approach: { fr: "Modèle de vision par ordinateur entraîné pour attribuer une catégorie à chaque image.", en: "Computer vision model trained to assign a category to each image." },
    tags: ["PyTorch", "Vision par ordinateur"]
  },
  {
    id: "nlp", cat: "ai", icon: "chat",
    title: { fr: "Analyse de sentiments", en: "Sentiment analysis" },
    short: { fr: "Traitement automatique du langage (NLP).", en: "Natural language processing (NLP)." },
    challenge: { fr: "Déterminer automatiquement la polarité d'un texte.", en: "Automatically determine the polarity of a text." },
    approach: { fr: "Chaîne NLP : préparation du texte, représentation, puis modèle de classification.", en: "NLP pipeline: text preparation, representation, then a classification model." },
    tags: ["NLP", "Python"]
  },
  {
    id: "ecom", cat: "web", icon: "cart",
    title: { fr: "Plateforme e-commerce", en: "E-commerce platform" },
    short: { fr: "Application web complète.", en: "Full web application." },
    challenge: { fr: "Livrer un parcours d'achat complet, du catalogue à la commande.", en: "Deliver a full shopping journey, from catalogue to order." },
    approach: { fr: "Application web complète : catalogue, panier, commande et administration.", en: "Full web application: catalogue, cart, checkout and administration." },
    tags: ["Application web", "Full-stack"]
  }
];

App.projectCats = [
  { id: "cloud", fr: "Cloud & DevOps", en: "Cloud & DevOps" },
  { id: "ai",    fr: "IA",             en: "AI" },
  { id: "web",   fr: "Web",            en: "Web" }
];

/* ---------- Formation ---------- */
App.education = [
  {
    title: { fr: "Diplôme d'ingénieur d'État — Informatique et Réseaux (MIAGE)", en: "State Engineering Degree — Computer Science & Networks (MIAGE)" },
    school: "EMSI — École Marocaine des Sciences de l'Ingénieur",
    period: "2021 – 2026", place: "Rabat",
    detail: { fr: "", en: "" }
  },
  {
    title: { fr: "Baccalauréat français — option scientifique", en: "French Baccalaureate — science track" },
    school: "Lycée Paul Valéry",
    period: "2021", place: "Meknès",
    detail: { fr: "", en: "" }
  }
];

/* Certifications Coursera, dans l'ordre du CV */
App.certs = [
  { t: "Containers : Docker, Kubernetes & OpenShift", by: "IBM", y: "2025" },
  { t: "Virtual Networks in Azure", by: "Whizlabs", y: "2025" },
  { t: "Introduction to Git and GitHub", by: "Google", y: "2025" },
  { t: "The Unix Workbench", by: "Johns Hopkins University", y: "2024" },
  { t: { fr: "Java & programmation orientée objet", en: "Java & object-oriented programming" }, by: "University of Pennsylvania", y: "2024" },
  { t: { fr: "Programmation orientée objet en C++", en: "Object-oriented programming in C++" }, by: "EPFL", y: "2024" },
  { t: "Programming for Everybody (Python)", by: "University of Michigan", y: "2024" },
  { t: "The Structured Query Language (SQL)", by: "University of Colorado Boulder", y: "2023" },
  { t: "React Basics · React Native", by: "Meta", y: "2024 – 2025" },
  { t: { fr: "Développement web HTML5, CSS3, JavaScript", en: "Web development HTML5, CSS3, JavaScript" }, by: "University of Michigan & Johns Hopkins", y: "2023 – 2024" },
  { t: "The Arduino Platform and C Programming", by: "UC Irvine", y: "2023" }
];
App.certsAlso = "Impact Measurement for the SDGs (Duke), Villes africaines et développement durable (EPFL), La recherche documentaire (École Polytechnique)";

App.languages = [
  { n: { fr: "Français", en: "French" }, lvl: { fr: "Courant", en: "Fluent" }, v: 95 },
  { n: { fr: "Anglais", en: "English" }, lvl: { fr: "Professionnel", en: "Professional" }, v: 75 },
  { n: { fr: "Arabe", en: "Arabic" }, lvl: { fr: "Courant", en: "Fluent" }, v: 95 }
];

App.softSkills = {
  source: { fr: "Honoris Online Academy — 6 parcours, 46 h (2025)", en: "Honoris Online Academy — 6 tracks, 46 h (2025)" },
  fr: ["Communiquer avec impact", "Collaboration en équipe", "Efficacité au quotidien", "Marketing digital", "Entrepreneuriat & Run your Business"],
  en: ["Communicating with impact", "Team collaboration", "Everyday effectiveness", "Digital marketing", "Entrepreneurship & Run your Business"]
};

App.interests = {
  fr: [
    { t: "Lecture", d: "Ouvrages techniques, philosophie, science-fiction." },
    { t: "Jeux de rôle", d: "Conception d'univers, planification, travail collaboratif." }
  ],
  en: [
    { t: "Reading", d: "Technical books, philosophy, science fiction." },
    { t: "Role-playing games", d: "World-building, planning, collaborative work." }
  ]
};
