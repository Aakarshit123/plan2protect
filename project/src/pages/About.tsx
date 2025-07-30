import React from 'react';
import { Shield, Users, Lightbulb, Globe } from 'lucide-react';

export default function About() {
  const team: Array<{
    name: string;
    role: string;
    description: string;
    image: string;
  }> = [];

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Every decision we make prioritizes the safety and well-being of homeowners and their families.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI technology to solve complex safety challenges in residential buildings.'
    },
    {
      icon: Users,
      title: 'Accessibility',
      description: 'Making professional-grade safety assessments accessible to everyone, regardless of technical expertise.'
    },
    {
      icon: Globe,
      title: 'Impact',
      description: 'Building a safer world by empowering individuals with the knowledge to protect their homes.'
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About Plan2Protect
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to make homes safer through accessible AI-powered risk assessment technology.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  Plan2Protect was born during <strong>The Creator Program by Vimal Daga Sir</strong>, 
                  where we recognized a critical gap in accessible home safety assessment tools.
                </p>
                <p>
                  Traditional building assessments require expensive professional consultations that many 
                  homeowners can't afford. We believe everyone deserves to know if their home is safe.
                </p>
                <p>
                  By combining advanced AI, computer vision, and years of building safety expertise, 
                  we've created a platform that democratizes professional-grade safety analysis.
                </p>
                <p>
                  Today, Plan2Protect helps thousands of homeowners, property buyers, landlords, 
                  architects, and civil engineers make informed decisions about residential building safety.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8">
              <div className="text-center mb-8">
                <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <blockquote className="text-lg text-gray-700 text-center italic">
                "To empower every homeowner with AI-driven insights that protect what matters most – 
                their family, their investment, and their peace of mind."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center">
                  <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A diverse group of experts passionate about home safety and AI innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.length === 0 ? (
              <div className="text-center text-gray-500 py-12">No team information available at this time.</div>
            ) : (
              team.map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recognition Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Built During The Creator Program</h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <p className="text-lg text-gray-700 mb-6">
              Plan2Protect was developed as part of <strong>The Creator Program by Vimal Daga Sir</strong>, 
              an intensive program focused on building innovative technology solutions that solve real-world problems.
            </p>
            <p className="text-gray-600">
              Under the mentorship of industry experts, we transformed the vision of accessible home safety 
              into a comprehensive AI-powered platform that serves thousands of users today.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Our Vision for the Future</h2>
          <p className="text-xl text-blue-100 mb-8">
            We envision a world where every home is a safe home, where advanced technology makes 
            professional safety expertise accessible to everyone, and where families can live with 
            confidence knowing their homes protect them.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Global Expansion</h3>
              <p className="text-blue-100 text-sm">
                Bringing Plan2Protect to homeowners worldwide with localized building codes and regulations.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Advanced AI</h3>
              <p className="text-blue-100 text-sm">
                Continuously improving our AI models with new data and emerging safety technologies.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">IoT Integration</h3>
              <p className="text-blue-100 text-sm">
                Connecting with smart home devices for real-time monitoring and predictive maintenance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}