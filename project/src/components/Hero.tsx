import React from 'react';
import { FileUp, Brain, ArrowRight } from 'lucide-react';
import { APP_NAME } from '../utils/constants';

const Hero: React.FC = () => {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-teal-600">
                Automate
              </span>{" "}
              Your Requirement Engineering
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform unstructured inputs into standardized, prioritized requirements with 
              our AI-powered platform. Save time, reduce errors, and focus on building what matters.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg flex items-center justify-center">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center">
                Watch Demo
              </button>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <div className="flex -space-x-2 mr-3">
                <img src="https://images.pexels.com/photos/7129713/pexels-photo-7129713.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://images.pexels.com/photos/8088460/pexels-photo-8088460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
              </div>
              <span>Trusted by 1000+ teams worldwide</span>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative bg-gradient-to-br from-blue-50 to-teal-50 p-1 rounded-xl shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-white opacity-50 rounded-xl"></div>
              <div className="relative bg-white rounded-lg p-6 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex items-center text-primary-700">
                      <Brain className="h-6 w-6 mr-2" />
                      <span className="font-bold">{APP_NAME}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Processing...</div>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center mb-6">
                    <div className="w-full">
                      <div className="flex items-center mb-2">
                        <FileUp className="h-5 w-5 text-primary-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Upload documents</span>
                      </div>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center bg-gray-50">
                        <p className="text-sm text-gray-500">Drag & drop files here or click to browse</p>
                        <p className="text-xs text-gray-400 mt-1">Supports PDF, Word, Excel, and more</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-4/5 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-primary-600 h-2.5 rounded-full w-2/3 animate-[pulse_2s_ease-in-out_infinite]"></div>
                    </div>
                    <span className="ml-3 text-sm text-gray-500">67%</span>
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

export default Hero;