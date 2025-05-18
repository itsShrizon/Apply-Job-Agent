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
Polyfins Technology Inc.\\
525 Market Street, 15th Floor\\
San Francisco, CA 94105\\
United States
}

\opening{Dear Hiring Manager,}

I am writing to express my interest in the Senior Machine Learning Engineer position at Polyfins Technology Inc. As a passionate AI practitioner with extensive experience in fine-tuning large language models and building production-ready machine learning systems, I am excited about the opportunity to contribute to your innovative healthcare AI solutions.

My current role as a Machine Learning Engineer at Polyfins has allowed me to develop specialized expertise in RAG pipelines using LangChain and LangSmith, as well as optimizing LLMs with techniques like QLoRA. I have successfully implemented vision models achieving 84\% accuracy for acne grading and deployed scalable AI doctor chatbot solutions. These experiences align perfectly with your requirements for developing advanced natural language processing systems.

While at Polyfins, I designed and optimized complete machine learning pipelines from data preprocessing through model evaluation. I consistently documented insights to refine system accuracy and deployed robust APIs using FastAPI. In my parallel role as a Data Scientist, I've developed AI-based customer support systems using NLP and implemented vector search for semantic matching and rapid information retrieval.

I am particularly drawn to Polyfins' mission to transform healthcare through AI-enabled solutions. Your recent advances in medical diagnostic tools demonstrate a commitment to meaningful innovation that I strongly identify with. I believe my combination of technical skills and domain knowledge would allow me to make significant contributions to your team's continued success.

I welcome the opportunity to discuss how my background and skills would benefit your team. Thank you for considering my application, and I look forward to the possibility of working together.

\closing{Sincerely,}

\vspace{1.5cm}
\fromsig{
    \vspace{-1cm}
    Diganto Bhowmik
}

\fromaddress{
    \contactdetails{Email: digantobhowmik@gmail.com}{Phone: 01767145146}{Location: Mohammadpur, Dhaka, Bangladesh}
}

\end{letter}
\end{document}