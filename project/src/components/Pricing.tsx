import React from 'react';
import { Check } from 'lucide-react';
import { PRICING_PLANS } from '../utils/constants';

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that's right for your team. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan, index) => (
            <div 
              key={index}
              className={`rounded-xl overflow-hidden transition-all duration-300 ${
                plan.highlighted 
                  ? 'bg-white border-2 border-primary-500 shadow-xl scale-105 z-10' 
                  : 'bg-white border border-gray-200 shadow-md hover:shadow-lg'
              }`}
            >
              {plan.highlighted && (
                <div className="bg-primary-500 text-white text-center py-2 font-medium text-sm">
                  MOST POPULAR
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.name !== "Enterprise" && <span className="text-gray-600">/month</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center mr-3">
                        <Check className="h-4 w-4 text-primary-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.highlighted
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'border border-primary-600 text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Need a custom solution? <a href="#" className="text-primary-600 font-semibold hover:underline">Contact our sales team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;