import React from 'react';
import { FileUp, Brain, FileOutput, RefreshCw } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <FileUp className="h-8 w-8 text-primary-600" />,
      title: "Upload & Input",
      description: "Upload documents or provide text inputs. The system accepts various formats including meeting minutes, emails, Word, Excel, PDFs, and web pages.",
      color: "from-blue-50 to-indigo-50"
    },
    {
      icon: <Brain className="h-8 w-8 text-teal-600" />,
      title: "AI Analysis",
      description: "Our AI engine analyzes the content, extracting functional and non-functional requirements while applying domain knowledge and standards.",
      color: "from-teal-50 to-emerald-50"
    },
    {
      icon: <RefreshCw className="h-8 w-8 text-amber-600" />,
      title: "Clarification",
      description: "The system asks smart questions to fill gaps and clarify ambiguities, learning from your responses to improve future analyses.",
      color: "from-amber-50 to-yellow-50"
    },
    {
      icon: <FileOutput className="h-8 w-8 text-primary-600" />,
      title: "Standardized Output",
      description: "Receive standardized requirement documents in Word format and user stories in Excel sheets ready for Jira integration.",
      color: "from-blue-50 to-indigo-50"
    }
  ];

  return (
    <section id="how-it-works" className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered system transforms your inputs into structured, standardized requirements 
            in just four simple steps.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center"
              >
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-md`}>
                  {step.icon}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">See the transformation in action</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Input: Meeting Notes</h4>
                  <div className="text-gray-600 space-y-2">
                    <p>
                      Meeting with client on 5/15. They need a system to track inventory across multiple warehouses.
                      Should be able to generate reports. Users need different permission levels.
                      Mobile access is important. Deadline is Q4.
                    </p>
                  </div>
                </div>
                
                <div className="bg-primary-50 rounded-lg p-6 border border-primary-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Output: Structured Requirements</h4>
                  <div className="text-gray-600 space-y-3">
                    <div>
                      <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-medium mb-1">FR-01 (Must Have)</span>
                      <p className="text-sm">The system shall provide inventory tracking capabilities across multiple warehouse locations.</p>
                    </div>
                    <div>
                      <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-medium mb-1">FR-02 (Should Have)</span>
                      <p className="text-sm">The system shall enable users to generate inventory reports with customizable parameters.</p>
                    </div>
                    <div>
                      <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-medium mb-1">FR-03 (Must Have)</span>
                      <p className="text-sm">The system shall implement role-based access control with configurable permission levels.</p>
                    </div>
                    <div>
                      <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-medium mb-1">FR-04 (Should Have)</span>
                      <p className="text-sm">The system shall provide a mobile-responsive interface for warehouse staff.</p>
                    </div>
                    <div>
                      <span className="inline-block px-2 py-1 bg-teal-100 text-teal-800 rounded text-xs font-medium mb-1">NFR-01 (Must Have)</span>
                      <p className="text-sm">The system shall be fully implemented and operational by Q4 2023.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;