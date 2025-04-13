import { CheckCircle, Clock, BarChart, Users } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <CheckCircle className="w-10 h-10 text-blue-600" />,
      title: "Quality Assurance",
      description: "We ensure every project meets the highest standards of quality and performance.",
    },
    {
      icon: <Clock className="w-10 h-10 text-blue-600" />,
      title: "On-Time Delivery",
      description: "Our proven methodologies ensure projects are delivered on schedule.",
    },
    {
      icon: <BarChart className="w-10 h-10 text-blue-600" />,
      title: "Performance Tracking",
      description: "Real-time analytics and reporting for complete project visibility.",
    },
    {
      icon: <Users className="w-10 h-10 text-blue-600" />,
      title: "Expert Teams",
      description: "Skilled professionals with extensive experience in project management.",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our comprehensive approach to project delivery ensures success at every stage of the process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
