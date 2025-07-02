import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import {
  Upload,
  BarChart3,
  MessageSquare,
  Zap,
  CheckCircle,
  TrendingUp,
  Database,
  Brain,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: MessageSquare,
      title: "Ask Questions in Plain English",
      description:
        'Just type "What\'s the average sales?" or "Show trends over time" and get instant answers',
    },
    {
      icon: Brain,
      title: "AI-Powered Understanding",
      description:
        "Our AI understands your questions and automatically creates the right visualizations",
    },
    {
      icon: BarChart3,
      title: "Smart Auto-Visualizations",
      description:
        "Charts and graphs are generated automatically based on your questions",
    },
    {
      icon: Upload,
      title: "Easy Data Upload",
      description:
        "Simply drag and drop your CSV files to get started instantly",
    },
    {
      icon: Zap,
      title: "Instant Insights",
      description:
        "Get immediate answers without learning complex query languages or code",
    },
    {
      icon: TrendingUp,
      title: "Interactive Exploration",
      description:
        "Follow up with related questions to dive deeper into your data",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Your Data",
      description: "Drag and drop your CSV files to get started with analysis",
      icon: Database,
    },
    {
      number: "02",
      title: "Ask Questions",
      description:
        "Type your questions in natural language - no technical knowledge needed",
      icon: MessageSquare,
    },
    {
      number: "03",
      title: "Get Instant Insights",
      description:
        "Receive immediate answers with beautiful charts and actionable insights",
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-8 bg-brand-100 text-brand-800 hover:bg-brand-200">
              ✨ AI-Powered Data Analysis Platform
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 animate-fade-in">
              <span className="block">Natural Language-Driven</span>
              <span className="block bg-gradient-to-r from-brand-600 to-insight-600 bg-clip-text text-transparent">
                Data Analysis
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 animate-slide-up">
              Upload your data, ask questions in plain English, and get
              actionable insights instantly. No coding required, just pure data
              intelligence.
            </p>

            {/* Demo Query Examples */}
            <div className="mb-12 animate-slide-up">
              <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-brand-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Try asking:
                  </span>
                </div>
                <div className="space-y-2 text-left">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-brand-600">•</span>
                    <span className="italic">
                      "What's the average sales by region?"
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-brand-600">•</span>
                    <span className="italic">
                      "Show revenue trends over time"
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-brand-600">•</span>
                    <span className="italic">
                      "Compare product performance"
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up">
              <Link to="/analysis">
                <Button
                  size="lg"
                  className="bg-brand-gradient hover:opacity-90 text-white shadow-xl px-8 py-4 text-lg"
                >
                  Start Analyzing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-brand-300 text-brand-700 hover:bg-brand-50 px-8 py-4 text-lg"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-insight-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get from raw data to actionable insights in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="h-full border-2 border-gray-100 hover:border-brand-200 transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-brand-600 mb-2">
                        {step.number}
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-base">
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>

                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-brand-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-br from-brand-50 to-insight-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to unlock the potential of your data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-brand-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Data?
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already making data-driven decisions
            with Project Insight.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/analysis">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-brand-700 hover:bg-gray-50 px-8 py-4 text-lg shadow-lg"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-6 mt-8 text-brand-200">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Free to get started</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Project Insight</span>
            </div>
            <p className="text-gray-400">
              Empowering everyone to make data-driven decisions
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
