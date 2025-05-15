\documentclass[11pt,a4paper,sans]{moderncv}
\moderncvstyle{classic}
\moderncvcolor{blue}
\usepackage[utf8]{inputenc}
\usepackage[scale=0.9]{geometry}
\microtypesetup{expansion=false}

\name{FirstName}{LastName}

\begin{document}
\makecvtitle
\vspace{-2em}

\texttt{Address Line 1}{City, Country}\\
\texttt{PhoneNumber}\\
\texttt{Email Address}
\vspace{2em}

\section{Executive Summary}
Short paragraph summarizing career objectives, specializations, or passions.

\section{Professional Experience}
\cventry{Start Date -- End Date}{Job Title}{Company Name}{City, Country}{}{
\begin{itemize}
    \item Key responsibility or achievement 1.
    \item Key responsibility or achievement 2.
\end{itemize}}

% Repeat for more jobs

\section{Education}
\cventry{Year -- Year}{Degree}{Institution Name}{City}{CGPA or Achievements}{}

% Repeat for more education entries

\section{Awards and Acknowledgements}
\begin{itemize}
    \item Award or recognition 1
    \item Award or recognition 2
\end{itemize}

\section{Skills}
\begin{itemize}
    \item Skill Category 1: Skill1, Skill2, Skill3
    \item Skill Category 2: SkillA, SkillB, SkillC
\end{itemize}

% Optional: Additional sections (Projects, Publications, Certifications, etc.)
\section{Projects}
\begin{itemize}
    \item Project Title 1
    \begin{itemize}
        \item Description of project, tools used, outcome.
    \end{itemize}
    \item Project Title 2
    \begin{itemize}
        \item Description of project, tools used, outcome.
    \end{itemize}
\end{itemize}

\section{Certifications}
\begin{itemize}
    \item Certification Name — Issuer (Year)
\end{itemize}

\end{document}