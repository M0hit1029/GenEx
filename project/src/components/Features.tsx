import React from 'react';
import { FEATURES } from '../utils/constants';
import * as LucideIcons from 'lucide-react';

const Features: React.FC = () => {
  // Helper function to dynamically render Lucide icons
  const renderIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-6 w-6 text-primary-600" /> : null;
  };

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful AI-Driven Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform transforms the requirement gathering process with advanced AI technology, 
            streamlining your workflow and improving document quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                {renderIcon(feature.icon)}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary-600 to-teal-600 rounded-xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Streamline Your Requirements Process
              </h3>
              <p className="text-primary-50 mb-6">
                Our AI-powered solution reduces requirement gathering time by up to 70% while 
                improving quality and consistency across your documentation.
              </p>
              <ul className="space-y-3 text-white">
                <li className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                    <LucideIcons.Check className="h-4 w-4 text-white" />
                  </div>
                  <span>Save 20+ hours per project on documentation</span>
                </li>
                <li className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                    <LucideIcons.Check className="h-4 w-4 text-white" />
                  </div>
                  <span>Reduce requirement errors by up to 45%</span>
                </li>
                <li className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                    <LucideIcons.Check className="h-4 w-4 text-white" />
                  </div>
                  <span>Ensure compliance with industry standards</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex items-center justify-center bg-primary-700 p-8">
              <div className="max-w-sm">
                <img 
                  src="https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Team collaboration" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;