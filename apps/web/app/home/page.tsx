"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const steps = [
    {
      title: "Tenant Call",
      content: "Hello, my air conditioning isn't working. It's been really hot and I can't get it to turn on.",
      highlightedWords: ["air conditioning", "isn't working", "hot", "turn on"],
      icon: "📞",
      color: "bg-red-50 border-red-200",
      textColor: "text-red-800",
      keyActions: ["AC issue detected", "Comfort concern"]
    },
    {
      title: "AI Analysis",
      content: "I understand you're having AC issues. Let me help you troubleshoot this. Can you check if the thermostat is set to cool mode?",
      highlightedWords: ["AC issues", "troubleshoot", "thermostat", "cool mode"],
      icon: "🤖",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-800",
      keyActions: ["Immediate response", "Troubleshooting guidance"]
    },
    {
      title: "Problem Classification",
      content: "Issue classified as: HVAC - Air conditioning not functioning. Priority: Medium. Category: Climate control.",
      highlightedWords: ["HVAC", "Air conditioning", "not functioning", "Medium priority", "Climate control"],
      icon: "🔍",
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-800",
      keyActions: ["Priority: MEDIUM", "Category: HVAC", "Status: ACTIVE"]
    },
    {
      title: "Vendor Search",
      content: "Searching approved vendor network... Found 2 licensed HVAC technicians in your area. Checking availability for tomorrow...",
      highlightedWords: ["approved vendor network", "2 licensed HVAC technicians", "availability", "tomorrow"],
      icon: "🔧",
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-800",
      keyActions: ["Network search", "License verification", "Availability check"]
    },
    {
      title: "Appointment Booking",
      content: "✅ Booked with Cool Air Solutions for tomorrow at 10:00 AM. Technician: Sarah Johnson. License: #HV-78901. SMS confirmation sent to tenant.",
      highlightedWords: ["Booked", "Cool Air Solutions", "10:00 AM", "Sarah Johnson", "License: #HV-78901", "SMS confirmation"],
      icon: "📅",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-800",
      keyActions: ["Appointment confirmed", "Technician assigned", "SMS sent"]
    }
  ];

  const testimonials = [
    {
      quote: "Properly has completely changed how I handle maintenance requests. I used to get calls at all hours — now the AI takes care of everything, and I only get notified once it’s booked. It saves me hours every week and keeps tenants happier.",
      author: "Michael R.",
      role: "Independent Property Owner, 6 Units",
      icon: "👑"
    },
    {
      quote: "Since partnering with Properly, I’ve been getting steady, verified work orders from local landlords without all the back-and-forth. The AI system makes scheduling and payments seamless — it’s like having a 24/7 dispatcher.",
      author: "Sandra L.",
      role: "Licensed Plumber, STL Home Services",
      icon: "🧰"
    },
    {
      quote: "I reported a broken heater late at night, and Properly’s AI had a technician booked within minutes. The next morning, it was fixed. No waiting, no miscommunication — just fast help when I needed it.",
      author: "Aisha P.",
      role: "Tenant, Maplewood Apartments",
      icon: "🏠"
    },
    {
      quote: "Properly fits right into our workflow. Our AI assistant now triages calls, classifies urgency, and books the right vendors automatically. Our response times dropped from hours to minutes.",
      author: "Ravi S.",
      role: "Operations Lead, Skyline Property Group",
      icon: "💬"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  // Typing effect for text
  useEffect(() => {
    setIsTyping(true);
    setDisplayedText("");
    const text = steps[currentStep].content;
    let index = 0;
    
    const typingTimer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typingTimer);
      }
    }, 50);

    return () => clearInterval(typingTimer);
  }, [currentStep]);

  const nextTestimonial = () => {
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header showDashboardLink={true} />
      
      {/* Hero Section */}
      <section className="bg-[#6366F1] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Properly - Your AI Property Manager
            </h1>
            <p className="text-xl mb-8 text-blue-200">
              The voice-first AI that handles tenant calls, triages issues, and books repairs automatically.
              <br />
              <span className="font-semibold">Fewer interruptions for owners, faster fixes for tenants.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Dashboard
              </Link>
              <Link 
                href="/conversation"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                See AI in Action
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              The Property Management Problem
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                <h3 className="text-xl font-semibold text-red-800 mb-4">Property Owners</h3>
                <ul className="text-red-700 space-y-2">
                  <li>• Lose time and sleep juggling tenant calls</li>
                  <li>• Expensive call centers drain budgets</li>
                  <li>• Constant interruptions disrupt daily life</li>
                  <li>• Manual vendor coordination is time-consuming</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                <h3 className="text-xl font-semibold text-orange-800 mb-4">Tenants</h3>
                <ul className="text-orange-700 space-y-2">
                  <li>• Need fast support for urgent repairs</li>
                  <li>• Wait hours for callbacks</li>
                  <li>• Unclear when repairs will be scheduled</li>
                  <li>• Poor communication about service status</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Our AI Property Manager Solution
            </h2>
            
            {/* Workflow Loop */}
            <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
              <h3 className="text-2xl font-semibold text-center mb-8 text-gray-800">
                The Complete Loop: Call → Classify → Vendor Confirmation → Text Back Tenant
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#6366F1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Call</h4>
                  <p className="text-sm text-gray-600">Tenant calls one number anytime</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Classify</h4>
                  <p className="text-sm text-gray-600">AI triages and addresses the issue</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Confirm</h4>
                  <p className="text-sm text-gray-600">Books approved vendors automatically</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">4</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Text Back</h4>
                  <p className="text-sm text-gray-600">Tenant gets appointment confirmation</p>
                </div>
              </div>
            </div>

            {/* Key Differentiators */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">End-to-End Solution</h4>
                  <p className="text-sm text-gray-600">Not just message taking - we actually book repairs</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 text-xl">$</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Affordable for Indies</h4>
                  <p className="text-sm text-gray-600">Targeting 1-50 unit owners with simple pricing</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 text-xl">⚡</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Voice-First AI</h4>
                  <p className="text-sm text-gray-600">Natural conversation, not just logging</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Demo Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              See Our AI in Action
            </h2>
            
            {/* Interactive Demo Display */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-8">
              {/* Demo Header */}
              <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">AI Property Manager Demo</div>
                  <div className="text-xs text-gray-300">Live Processing</div>
                </div>
                <div className="w-8 h-8 bg-[#6366F1] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">AI</span>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-8">
                <div className={`p-6 rounded-lg border-2 transition-all duration-500 ${steps[currentStep].color}`}>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-4xl">{steps[currentStep].icon}</div>
                    <div>
                      <h3 className={`text-xl font-semibold ${steps[currentStep].textColor}`}>
                        {steps[currentStep].title}
                      </h3>
                      <div className="text-sm text-gray-500">
                        Auto-cycling through AI process
                      </div>
                    </div>
                  </div>
                  
                  {/* Content with typing effect */}
                  <div className={`text-lg ${steps[currentStep].textColor} mb-4 min-h-[3rem]`}>
                    <span>
                      {displayedText}
                      {isTyping && <span className="animate-pulse">|</span>}
                    </span>
                  </div>

                  {/* Key Actions - only show when typing is complete */}
                  {!isTyping && (
                    <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700 mb-2">AI Actions:</div>
                      <div className="flex flex-wrap gap-2">
                        {steps[currentStep].keyActions.map((action, index) => (
                          <span 
                            key={index} 
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Continuous Loop Indicator */}
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-medium">AI Processing Continuously...</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center space-x-2 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep ? 'bg-[#6366F1] scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl">⚡</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Instant Response</h4>
                <p className="text-sm text-gray-600">AI responds immediately to tenant calls</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Smart Classification</h4>
                <p className="text-sm text-gray-600">Automatically identifies urgency and problem type</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-xl">📅</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Auto-Booking</h4>
                <p className="text-sm text-gray-600">Books appointments with approved vendors automatically</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              Trusted by Property Managers, Vendors, and Tenants
            </h2>
            <div className="relative">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">{testimonials[currentTestimonial].icon}</div>
                <p className="text-xl text-gray-700 mb-6">
                  "{testimonials[currentTestimonial].quote}"
                </p>
                <div className="font-semibold text-gray-900">
                  {testimonials[currentTestimonial].author}
                </div>
                <div className="text-sm text-gray-500">
                  {testimonials[currentTestimonial].role}
                </div>
              </div>
              <button
                onClick={prevTestimonial}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-12 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-12 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Why Choose Our AI Property Manager?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">24/7 Availability</h4>
                    <p className="text-gray-600 text-sm">Tenants can call anytime, day or night</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Intelligent Triage</h4>
                    <p className="text-gray-600 text-sm">AI understands urgency and routes appropriately</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Automatic Booking</h4>
                    <p className="text-gray-600 text-sm">Finds and books the first available slot</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Instant Communication</h4>
                    <p className="text-gray-600 text-sm">Tenants get immediate SMS confirmations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Cost Effective</h4>
                    <p className="text-gray-600 text-sm">No expensive call centers or staff</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Peace of Mind</h4>
                    <p className="text-gray-600 text-sm">Property owners sleep better with fewer interruptions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#6366F1] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your Property Management?
            </h2>
            <p className="text-xl mb-8 text-blue-200">
              Join property owners who've already eliminated the hassle of tenant calls
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Access Dashboard
              </Link>
              <Link 
                href="/conversation"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                See AI in Action
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-300">
              © 2024 AI Property Manager. Streamlining property management for independent owners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}