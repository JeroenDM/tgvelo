library(markdown)

markdownToHTML("general_info.md", "general_info.html", fragment.only = T)
markdownToHTML("performance_useability.md", "performance_useability.html", fragment.only = T)
markdownToHTML("performance_safety.md", "performance_safety.html", fragment.only = T)

markdownToHTML("performance_energy.md", "performance_energy.html", fragment.only = T)
