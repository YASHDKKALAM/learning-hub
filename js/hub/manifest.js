/**
 * Learning Hub manifest — add new tracks here (JavaScript, Python, etc.)
 */
export const hubManifest = {
  title: "Developer Learning Hub",
  tagline: "One place for interview prep & practice",
  defaultTrack: "sql",
  tracks: [
    {
      id: "sql",
      title: "SQL & Databases",
      icon: "🗄️",
      accent: "#238636",
      status: "active",
      description: "DBMS, SQL guide, practice lab",
      modules: [
        { id: "dbms", label: "DBMS Interview", short: "Theory" },
        { id: "learn", label: "SQL Learn", short: "Guide" },
        { id: "practice", label: "Practice Lab", short: "31 exercises" },
      ],
      builder: "sql",
    },
    {
      id: "testing",
      title: "QA & Testing",
      icon: "🧪",
      accent: "#1f6feb",
      status: "active",
      description: "QA, API, Selenium, Playwright, CI/CD",
      builder: "testing",
    },
    {
      id: "fastapi",
      title: "FastAPI",
      icon: "🚀",
      accent: "#2457d6",
      status: "active",
      description: "Python REST APIs — guide, examples, interview Q&A",
      builder: "fastapi",
    },
    {
      id: "javascript",
      title: "JavaScript",
      icon: "⚡",
      accent: "#d29922",
      status: "planned",
      description: "Add content/javascript/ + js/data/javascript-*.js",
      modules: [],
    },
    {
      id: "python",
      title: "Python",
      icon: "🐍",
      accent: "#388bfd",
      status: "planned",
      description: "Add content/python/ + js/data/python-*.js",
      modules: [],
    },
  ],
};