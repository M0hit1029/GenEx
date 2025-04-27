import React from 'react';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/Toaster';
import { DownloadCloud, FileText, FileType2 } from 'lucide-react';
import { useProject } from '../../context/projectContext';

const getMoSCoWLabel = (m: string) => {
  switch (m) {
    case 'M': return 'Must';
    case 'S': return 'Should';
    case 'C': return 'Could';
    case 'W': return 'Won’t';
    default: return '-';
  }
};

const ExportCenter = () => {
  // Access the requirements from the project context
  const { requirementsList } = useProject();

  // Flatten the requirements from all documents
  const allRequirements = requirementsList.flatMap(doc => doc.requirements);

  const exportToJira = () => {
    const jiraFormatted = allRequirements.map((req, index) => ({
      summary: req.feature,
      description: req.description,
      issueType: req.type === 'F' ? 'Story' : 'Task',
      priority: `P${req.priority}`,
      moscow: getMoSCoWLabel(req.moscow),
      source: req.question || '',
      notes: req.description || '',
      status: 'To Do',
    }));

    const blob = new Blob([JSON.stringify(jiraFormatted, null, 2)], { type: 'application/json' });
    saveAs(blob, 'requirements-jira.json');

    toast({
      title: 'Jira Exported',
      message: 'Requirements exported as Jira-compatible JSON.',
      type: 'success',
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Requirements Export', 14, 20);
    let y = 30;

    allRequirements.forEach((req, i) => {
      doc.text(`${i + 1}. ${req.feature} [REQ-${i + 1}]`, 14, y); y += 6;
      doc.text(`   Type: ${req.type} | Priority: P${req.priority} | MoSCoW: ${getMoSCoWLabel(req.moscow)}`, 14, y); y += 6;
      doc.text(`   Description: ${req.description}`, 14, y); y += 10;
      if (y > 280) { doc.addPage(); y = 20; }
    });

    doc.save('requirements.pdf');
    toast({ title: 'PDF Exported', message: 'Requirements exported as PDF.', type: 'success' });
  };

  const exportToDocx = async () => {
    const content = allRequirements.map((req, i) => ([
      new Paragraph({
        children: [
          new TextRun({
            text: `${i + 1}. ${req.feature} [REQ-${i + 1}]`,
            bold: true,
            size: 28,
          }),
        ],
      }),
      new Paragraph(`Type: ${req.type} | Priority: P${req.priority} | MoSCoW: ${getMoSCoWLabel(req.moscow)}`),
      new Paragraph(`Description: ${req.description}`),
      new Paragraph(`Source: ${req.question || 'N/A'}`),
      new Paragraph(`Notes: ${req.description || 'N/A'}`),
      new Paragraph(" "), // spacer
    ])).flat();
  
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: content,
        },
      ],
    });
  
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'requirements.docx');
  
    toast({
      title: 'DOCX Exported',
      message: 'Requirements exported as Word document.',
      type: 'success',
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 px-4 py-12">
      <div className="w-full max-w-2xl bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          Export Center
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Select a format to export your project’s requirements.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button onClick={exportToJira} className="w-full" variant="outline" leftIcon={<DownloadCloud size={18} />} >
            Export to Jira
          </Button>
          <Button onClick={exportToPDF} className="w-full" variant="outline" leftIcon={<FileText size={18} />} >
            Export as PDF
          </Button>
          <Button onClick={exportToDocx} className="w-full" variant="outline" leftIcon={<FileType2 size={18} />} >
            Export as DOCX
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExportCenter;