import React from 'react';
import { ArrowRight } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-r from-primary-600 to-teal-600 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="md:flex-1 mb-8 md:mb-0 md:pr-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Requirements Process?
              </h2>
              <p className="text-primary-50 text-lg max-w-2xl">
                Join the innovative teams using our AI-powered platform to save time, reduce errors, and create better requirements. Start your free trial today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-end">
              <button className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-md flex items-center justify-center">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="px-6 py-3 bg-transparent border border-white text-white rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all flex items-center justify-center">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;