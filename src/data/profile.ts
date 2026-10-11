// Site-wide personal details. Source: Nathanael's CV ("Software Developer").
// The phone number is deliberately left out of the site.

export const profile = {
  name: 'Nathanael Cammay',
  title: 'Software Developer',
  pitch: 'I build and maintain enterprise insurance systems with C#/.NET, SQL Server and JavaScript.',
  location: 'Johannesburg, South Africa',
  email: 'nathanaelcammay@gmail.com',
  github: 'https://github.com/NathanaelCammay',
  linkedin: 'https://www.linkedin.com/in/nathanaelcammay/',
};

// Phone-free copy of the CV in public/. The download links only appear if the file exists.
export const cvFileName = 'Nathanael-Cammay-CV.pdf';

// From the CV's skills section; shown as a single line in About rather than rated or charted.
export const toolkit = [
  'C#',
  '.NET',
  'ASP.NET MVC',
  'Entity Framework',
  'SQL Server',
  'REST APIs',
  'JavaScript',
  'React',
  'Azure DevOps',
];

export interface Role {
  period: string;
  title: string;
  company: string;
  summary: string;
  tech: string[];
}

export const experience: Role[] = [
  {
    period: '2022 — Present',
    title: 'Software Developer',
    company: 'Hollard Insurance',
    summary:
      'Progressed from graduate to developer on Purple Heron, Hollard’s claims platform. I build business-critical functionality across C#/.NET, SQL Server and JavaScript, design database changes and performance optimisations, and develop the adaptors and integrations that keep data flowing between internal and external systems. I also resolve production incidents and take part in technical design, estimation and code reviews within a SAFe Agile team. Outside delivery, I helped run IT knowledge-sharing sessions and a department-wide Promptathon, where I was part of the winning team.',
    tech: ['C#', '.NET', 'SQL Server', 'JavaScript', 'Knockout.js', 'jQuery', 'Azure DevOps'],
  },
  {
    period: '2021 — 2022',
    title: 'Software Development Trainee',
    company: 'Mindworx Consulting and Academy',
    summary:
      'Completed an NQF5 Systems Development Higher Certificate covering C#, SQL, Java, VB.NET and web development. Built a software application and a website as part of a development team, presenting progress to stakeholders weekly, and completed an Azure DevOps bootcamp.',
    tech: ['C#', 'SQL', 'Java', 'VB.NET', 'Azure DevOps'],
  },
];

export const education = [
  { period: '2022', title: 'NQF5 Systems Development Higher Certificate', place: 'Mindworx Academy' },
  { period: '2017 — 2019', title: 'BCom Information Management', place: 'Damelin College' },
  { period: '2022', title: 'Microsoft Certified: Azure Fundamentals', place: 'Microsoft' },
  { period: '2022 — 2023', title: 'Certified SAFe Practitioner', place: 'Scaled Agile' },
];
