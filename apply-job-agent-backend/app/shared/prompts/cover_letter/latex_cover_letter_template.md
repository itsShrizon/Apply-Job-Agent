\documentclass[11pt,a4paper]{letter}
\usepackage[utf8]{inputenc}
\usepackage[scale=0.9]{geometry}
\usepackage{helvet}
\usepackage{xcolor}
\usepackage{hyperref}
\usepackage{fontawesome}

% Define colors
\definecolor{mainblue}{RGB}{0,102,204}

% Set main font to Helvetica
\renewcommand{\familydefault}{\sfdefault}

% Custom header and footer
\usepackage{fancyhdr}
\pagestyle{fancy}
\fancyhf{}
\renewcommand{\headrulewidth}{0pt}

% Address and contact formatting
\newcommand{\contactdetails}[3]{
    {\large #1}\\ 
    {\normalsize #2}\\
    {\normalsize #3}
}

\begin{document}

\begin{letter}{%
Company Name\\
Company Address Line 1\\
City, State ZIP\\
Country
}

\opening{Dear Hiring Manager,}

% First paragraph - Introduction
[Introduction paragraph: Briefly introduce yourself, mention the position you're applying for, and where you found it. Include a statement about why you're interested in this role and the company.]

% Second paragraph - Your value proposition
[Value proposition paragraph: Highlight 2-3 key qualifications that make you an ideal candidate. Connect your experience directly to the job requirements.]

% Third paragraph - Specific examples
[Specific examples paragraph: Provide concrete examples of your achievements that demonstrate the skills mentioned in the previous paragraph. Use metrics when possible.]

% Fourth paragraph - Company knowledge
[Company knowledge paragraph: Show that you've researched the company by mentioning something specific about their products, culture, recent news, or challenges they're facing and how you can help.]

% Fifth paragraph - Call to action
[Closing paragraph: Express enthusiasm for the opportunity to interview, mention any availability constraints, and thank them for considering your application.]

\closing{Sincerely,}

\vspace{1.5cm}
\fromsig{
    \vspace{-1cm}
    FirstName LastName
}

\fromaddress{
    \contactdetails{Email: email@example.com}{Phone: (123) 456-7890}{LinkedIn: linkedin.com/in/yourprofile}
}

\end{letter}
\end{document}