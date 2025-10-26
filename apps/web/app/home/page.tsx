"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const steps = useMemo(() => [
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
  ], []);

  const testimonials = useMemo(() => [
    {
      quote: "Properly has completely changed how I handle maintenance requests. I used to get calls at all hours — now the AI takes care of everything, and I only get notified once it's booked. It saves me hours every week and keeps tenants happier.",
      author: "Michael R.",
      role: "Independent Property Owner, 6 Units",
      icon: "👑",
      stars: 5
    },
    {
      quote: "Since partnering with Properly, I've been getting steady, verified work orders from local landlords without all the back-and-forth. The AI system makes scheduling and payments seamless — it's like having a 24/7 dispatcher.",
      author: "Sandra L.",
      role: "Licensed Plumber, STL Home Services",
      icon: "🧰",
      stars: 5
    },
    {
      quote: "I reported a broken heater late at night, and Properly's AI had a technician booked within minutes. The next morning, it was fixed. No waiting, no miscommunication — just fast help when I needed it.",
      author: "Aisha P.",
      role: "Tenant, Maplewood Apartments",
      icon: "🏠",
      stars: 5
    },
    {
      quote: "Properly fits right into our workflow. Our AI assistant now triages calls, classifies urgency, and books the right vendors automatically. Our response times dropped from hours to minutes.",
      author: "Ravi S.",
      role: "Operations Lead, Skyline Property Group",
      icon: "💬",
      stars: 5
    }
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [steps.length]);

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
  }, [currentStep, steps]);

  // Auto-scroll testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(timer);
  }, [testimonials.length]);

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
      <section
        className="text-white py-20"
        style={{
          backgroundImage: "url('./background.png')",
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Properly - Your AI Property Manager
            </h1>
            <p className="text-xl mb-8 text-blue-200">
              The AI Agent that handles tenant calls, triages issues, and books repairs automatically.
              <br />
              <span className="font-semibold">Fewer interruptions for owners, faster fixes for tenants.</span>
            </p>
            <div className="flex justify-center">
              <Link
                href="/"
                className="bg-white text-blue-600 px-6 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
              >
                Start Managing Properly
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                THE CHALLENGE
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                The Property Management Problem
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Traditional property management creates friction for everyone involved
              </p>
            </div>

            {/* Problem Cards with VS Divider */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Property Owners Card */}
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-red-500 hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-3xl">🏘️</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Property Owners</h3>
                        <p className="text-sm text-gray-500">Overwhelmed & Stressed</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-xs">✕</span>
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium">Lose time and sleep juggling tenant calls</p>
                          <p className="text-sm text-gray-500">Calls at all hours disrupting personal time</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-xs">✕</span>
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium">Expensive call centers drain budgets</p>
                          <p className="text-sm text-gray-500">$500-2000/month for basic answering services</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-xs">✕</span>
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium">Constant interruptions disrupt daily life</p>
                          <p className="text-sm text-gray-500">No separation between work and personal time</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-xs">✕</span>
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium">Manual vendor coordination is time-consuming</p>
                          <p className="text-sm text-gray-500">Hours spent calling vendors and scheduling repairs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tenants Card */}
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-orange-500 hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-3xl">👤</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Tenants</h3>
                        <p className="text-sm text-gray-500">Frustrated & Waiting</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-600 text-xs">✕</span>
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium">Need fast support for urgent repairs</p>
                          <p className="text-sm text-gray-500">Emergencies can&apos;t wait for business hours</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-600 text-xs">✕</span>
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium">Wait hours for callbacks</p>
                          <p className="text-sm text-gray-500">Left wondering if anyone received their message</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-600 text-xs">✕</span>
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium">Unclear when repairs will be scheduled</p>
                          <p className="text-sm text-gray-500">No transparency in the repair process</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-600 text-xs">✕</span>
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium">Poor communication about service status</p>
                          <p className="text-sm text-gray-500">Playing phone tag with landlords and vendors</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Impact Statement */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-red-50 via-orange-50 to-red-50 border border-red-200 rounded-xl p-6 max-w-3xl mx-auto">
                <p className="text-lg font-semibold text-gray-800">
                  <span className="text-red-600">Result:</span> Delayed repairs, unhappy tenants, stressed owners, and wasted time & money
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-block bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                THE SOLUTION
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our AI Property Manager Solution
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A complete end-to-end workflow that handles everything from the initial call to final confirmation
              </p>
            </div>

            {/* Workflow Loop */}
            <div className="bg-gradient-to-br from-white to-blue-50 p-8 md:p-12 rounded-2xl shadow-2xl mb-16 border border-blue-100">
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-800">
                The Complete Automation Loop
              </h3>
              <p className="text-center text-gray-600 mb-12 text-lg">
                Call → Classify → Confirm → Complete
              </p>

              <div className="grid md:grid-cols-4 gap-8 relative">
                {/* Connecting arrows - hidden on mobile */}
                <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] via-green-500 via-purple-500 to-orange-500 opacity-30" style={{ width: 'calc(100% - 8rem)', left: '4rem' }}></div>

                <div className="text-center relative group">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#6366F1] to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-white font-bold text-2xl">📞</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300 min-h-[140px]">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#6366F1] text-white text-xs font-bold px-3 py-1 rounded-full">
                      STEP 1
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg mt-2">Tenant Calls</h4>
                    <p className="text-sm text-gray-600">One number available 24/7 for any maintenance issue</p>
                  </div>
                </div>

                <div className="text-center relative group">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-white font-bold text-2xl">🤖</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300 min-h-[140px]">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      STEP 2
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg mt-2">AI Classifies</h4>
                    <p className="text-sm text-gray-600">Smart triage identifies urgency and problem type</p>
                  </div>
                </div>

                <div className="text-center relative group">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-white font-bold text-2xl">🔧</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300 min-h-[140px]">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      STEP 3
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg mt-2">Auto-Books</h4>
                    <p className="text-sm text-gray-600">Finds and schedules approved vendors instantly</p>
                  </div>
                </div>

                <div className="text-center relative group">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-white font-bold text-2xl">✅</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300 min-h-[140px]">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      STEP 4
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg mt-2">Confirms</h4>
                    <p className="text-sm text-gray-600">Tenant receives appointment details via SMS</p>
                  </div>
                </div>
              </div>

              {/* Time Savings Indicator */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-full px-6 py-3">
                  <span className="text-2xl mr-3">⚡</span>
                  <span className="font-bold text-gray-800 text-lg">Average completion time: <span className="text-green-600">Under 5 minutes</span></span>
                </div>
              </div>
            </div>

            {/* Key Differentiators */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                    <span className="text-green-600 text-3xl font-bold">✓</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3 text-xl">End-to-End Solution</h4>
                  <p className="text-gray-600 leading-relaxed">Not just message taking — we actually book repairs and close the loop</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                    <span className="text-blue-600 text-3xl font-bold">$</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3 text-xl">Affordable for Indies</h4>
                  <p className="text-gray-600 leading-relaxed">Built for independent owners with 1-50 units and simple, transparent pricing</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-purple-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                    <span className="text-purple-600 text-3xl font-bold">⚡</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3 text-xl">Voice-First AI</h4>
                  <p className="text-gray-600 leading-relaxed">Natural conversation that understands context, not just basic logging</p>
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
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentStep ? 'bg-[#6366F1] scale-125' : 'bg-gray-300'
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
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                TESTIMONIALS
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Trusted by Property Managers, Vendors, and Tenants
              </h2>
              <p className="text-xl text-gray-600">
                See what our users are saying about Properly
              </p>
            </div>

            <div className="relative px-12 md:px-16">
              {/* Main Testimonial Card */}
              <div className="bg-gradient-to-br from-white to-blue-50 p-10 md:p-12 rounded-3xl shadow-2xl border border-blue-100 transition-all duration-500 ease-in-out">
                <div className="text-center">
           



                  {/* Quote */}
                  <div className="mb-8">
      
                    <p className="text-xl md:text-2xl text-gray-700 leading-relaxed italic font-medium">
                      {testimonials[currentTestimonial].quote}
                    </p>
                  </div>

                  {/* Author */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="font-bold text-gray-900 text-lg mb-1">
                      {testimonials[currentTestimonial].author}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {testimonials[currentTestimonial].role}
                    </div>
                    {/* Stars */}
                    <div className="flex justify-center mt-2">
                      {[...Array(testimonials[currentTestimonial].stars)].map((_, index) => (
                        <svg
                          key={index}
                          className="w-7 h-7 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevTestimonial}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white hover:bg-[#6366F1] text-gray-600 hover:text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
                aria-label="Previous testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white hover:bg-[#6366F1] text-gray-600 hover:text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
                aria-label="Next testimonial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Indicator Dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`transition-all duration-300 rounded-full ${index === currentTestimonial
                      ? 'w-12 h-3 bg-[#6366F1]'
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
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
              Join property owners who&apos;ve already eliminated the hassle of tenant calls
            </p>
            <div className="flex justify-center">
              <Link
                href="/"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Access Dashboard
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
              Properly - Streamlining property management for owners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}