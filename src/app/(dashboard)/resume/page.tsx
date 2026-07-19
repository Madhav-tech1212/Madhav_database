"use client";

import { Download, Mail, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function ResumePage() {
  const handlePrint = () => window.print();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold flex items-center gap-2"
          >
            <Download size={15}/>Download PDF
          </button>
        </div>
      </div>

      <div className="bg-card text-foreground border border-border rounded-xl p-10 print:bg-white print:text-black">

        <div className="border-b border-border pb-6 flex justify-between flex-wrap gap-6">
          <div>
            <h1 className="text-4xl font-bold">Madhav Karthick I</h1>
            <p className="text-cyan-600 dark:text-cyan-400 mt-2 font-medium">
              Data Analyst • Business Intelligence • SQL Developer
            </p>
          </div>

          <div className="text-sm space-y-2 text-muted-foreground dark:text-slate-300">
            <div className="flex gap-2 items-center"><Mail size={14}/> madhavkarthickk.1212@gmail.com</div>
            <div className="flex gap-2 items-center"><MapPin size={14}/>  India</div>
            <div className="flex gap-2 items-center"><FaGithub size={14}/> github.com/Madhav-tech1212</div>
            <div className="flex gap-2 items-center"><FaLinkedin size={14}/> linkedin.com/in/madhavkarthickki</div>
          </div>
        </div>

        <section className="mt-8">
          <h3 className="font-bold uppercase text-cyan-600 dark:text-cyan-400 mb-2">Executive Summary</h3>
          <p className="text-sm leading-7 text-muted-foreground dark:text-slate-300">
            Data Analyst focused on transforming business data into actionable insights using SQL,
            Python, Power BI and BigQuery. Background in Full Stack Development with experience
            building business applications, automation workflows and modern dashboards. Currently
            developing end-to-end analytics projects covering data cleaning, KPI reporting,
            visualization and business intelligence for real-world use cases.
          </p>
        </section>

        <section className="mt-8">
          <h3 className="font-bold uppercase text-cyan-600 dark:text-cyan-400 mb-4">Professional Experience</h3>

          <div className="mb-6">
            <div className="flex justify-between">
              <h4 className="font-semibold text-foreground">Freelance Data Analyst</h4>
              <span className="text-muted-foreground">Jan 2026 – Present</span>
            </div>
            <p className="text-cyan-600 dark:text-cyan-300 text-sm font-medium">Business Intelligence & Analytics • Remote</p>
            <ul className="list-disc pl-5 mt-2 text-sm space-y-1 text-muted-foreground dark:text-slate-300">
              <li>Analyze business datasets using SQL, Python, Pandas and BigQuery.</li>
              <li>Create Power BI dashboards with executive KPI reporting.</li>
              <li>Automate reporting workflows and data preparation.</li>
              <li>Build end-to-end analytics portfolio projects using real-world datasets.</li>
            </ul>
          </div>

          <div className="mb-6">
            <div className="flex justify-between">
              <h4 className="font-semibold text-foreground">Freelance Full Stack Developer</h4>
              <span className="text-muted-foreground">Jun 2025 – Jan 2026</span>
            </div>
            <p className="text-cyan-600 dark:text-cyan-300 text-sm font-medium">SM Timbers & Klariti Learning</p>
            <ul className="list-disc pl-5 mt-2 text-sm space-y-1 text-muted-foreground dark:text-slate-300">
              <li>Built manufacturing and LMS applications.</li>
              <li>Designed databases and REST APIs.</li>
              <li>Automated business workflows.</li>
              <li>Worked directly with stakeholders to deliver business solutions.</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between">
              <h4 className="font-semibold text-foreground">Full Stack Developer</h4>
              <span className="text-muted-foreground">Jun 2024 – Jun 2025</span>
            </div>
            <p className="text-cyan-600 dark:text-cyan-300 text-sm font-medium">CDIX Innovation Pvt Ltd</p>
            <ul className="list-disc pl-5 mt-2 text-sm space-y-1 text-muted-foreground dark:text-slate-300">
              <li>Developed web applications using React.js, Next.js, Node.js and MongoDB.</li>
              <li>Built reusable components and REST APIs.</li>
              <li>Collaborated with business teams to deliver production applications.</li>
            </ul>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="font-bold uppercase text-cyan-600 dark:text-cyan-400 mb-3">Education</h3>

          <div className="flex justify-between text-muted-foreground dark:text-slate-300">
            <div>
              <h4 className="font-semibold text-foreground">B.E. Mechatronics Engineering</h4>
              <p className="text-sm">Kumaraguru College of Technology</p>
            </div>

            <div className="text-right">
              <p>2020 – 2024</p>
              <p className="text-sm">CGPA: 7.01</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="font-bold uppercase text-cyan-600 dark:text-cyan-400 mb-3">Technical Skills</h3>

          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground dark:text-slate-300">
            <div><strong className="text-foreground">Languages:</strong> SQL, Python, JavaScript, TypeScript</div>
            <div><strong className="text-foreground">Data:</strong> Pandas, NumPy, BigQuery, Power BI</div>
            <div><strong className="text-foreground">Databases:</strong> MySQL, PostgreSQL, MongoDB</div>
            <div><strong className="text-foreground">Frontend:</strong> React, Next.js, Tailwind CSS</div>
            <div><strong className="text-foreground">Backend:</strong> Node.js, Express.js, REST APIs</div>
            <div><strong className="text-foreground">Tools:</strong> Git, GitHub, Excel, VS Code</div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="font-bold uppercase text-cyan-600 dark:text-cyan-400 mb-3">Highlighted Projects</h3>

          <ul className="list-disc pl-5 text-sm space-y-2 text-muted-foreground dark:text-slate-300">
            <li>Retail Sales Analytics Dashboard (SQL + Power BI)</li>
            <li>Customer Segmentation using Python & Pandas</li>
            <li>Executive KPI Dashboard in Power BI</li>
            <li>BigQuery Business Intelligence Analytics</li>
            <li>Manufacturing Business Management System</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
