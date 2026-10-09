// Site-wide personal details. Source: Nathanael's CV ("Software Developer").
// The phone number is deliberately left out of the site.

export const profile = {
  name: 'Nathanael Cammay',
  title: 'Software Developer',
  location: 'Johannesburg, South Africa',
  email: 'nathanaelcammay@gmail.com',
  github: 'https://github.com/NathanaelCammay',
  linkedin: 'https://www.linkedin.com/in/nathanaelcammay/',
};

// Drop a phone-free copy of the CV into public/ under this name and the About page links to it.
export const cvFileName = 'Nathanael-Cammay-CV.pdf';

export interface Role {
  title: string;
  company: string;
  period: string;
  points: string[];
}

export const experience: Role[] = [
  {
    title: 'Software Developer',
    company: 'Hollard Insurance',
    period: 'May 2022 – Present',
    points: [
      'Progressed from Graduate Software Developer to Developer on the Purple Heron claims platform.',
      'Build and maintain business-critical functionality in C#, .NET, SQL Server and JavaScript (Knockout.js, jQuery, AJAX).',
      'Design database changes: stored procedures, scripts, data fixes and performance optimisations.',
      'Develop adaptor solutions and integrations that keep data flowing reliably between internal and external platforms.',
      'Investigate and resolve production incidents and defects, and take part in technical design, estimation and code reviews.',
      'Use Azure DevOps for source control, work tracking, CI/CD and deployments, within a SAFe Agile team.',
      'Also on the NEXUS team: organised IT knowledge-sharing sessions and a department-wide Promptathon, and was part of the winning team.',
    ],
  },
  {
    title: 'Software Development Trainee',
    company: 'Mindworx Consulting and Academy',
    period: 'Mar 2021 – Feb 2022',
    points: [
      'Completed an NQF5 Systems Development Higher Certificate covering C#, SQL, Java, VB.NET, web development and project management.',
      'Built two projects in a development team, a software application and a website, presenting progress to stakeholders weekly.',
      'Completed an Azure DevOps bootcamp.',
    ],
  },
];

export const education = [
  { qualification: 'BCom Information Management', institution: 'Damelin College', period: '2017 – 2019' },
  { qualification: 'NQF5 Systems Development Higher Certificate', institution: 'Mindworx Academy', period: '2022' },
];

export const certifications = [
  { name: 'Microsoft Certified: Azure Fundamentals', period: '2022' },
  { name: 'Certified SAFe Practitioner', period: '2022 – 2023' },
];

export const skills = [
  'C#',
  '.NET',
  'ASP.NET MVC',
  'Entity Framework',
  'SQL Server',
  'REST APIs',
  'JavaScript',
  'React',
  'Knockout.js',
  'jQuery',
  'Azure DevOps',
  'CI/CD',
];
