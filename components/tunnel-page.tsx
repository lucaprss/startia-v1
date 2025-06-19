"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ShieldCheck, Rocket, CheckCircle, Star, ArrowRight, Gift, Users, Award, Clock } from "lucide-react"

const iconMap = {
  Sparkles,
  ShieldCheck,
  Rocket,
  CheckCircle,
  Star,
  Gift,
  Users,
  Award,
  Clock,
}

interface TunnelPageProps {
  data: {
    title: string
    tagline: string
    image_url: string
    color: string
    story: string
    benefits: Array<{
      title: string
      description: string
      icon: keyof typeof iconMap
    }>
    description: string
    offer: {
      title: string
      original_price: string
      current_price: string
      cta: string
    }
    bonus: Array<{
      title: string
      description: string
      value: string
    }>
    testimonials: Array<{
      name: string
      text: string
      result: string
    }>
    bio: {
      name: string
      title: string
      description: string
      achievements: string[]
    }
    guarantee: {
      title: string
      description: string
    }
    faq: Array<{
      question: string
      answer: string
    }>
  }
}

export default function TunnelPage({ data }: TunnelPageProps) {
  const primaryColor = data.color

  return (
    <div className="min-h-screen bg-black text-white">
      <style jsx>{`
        :root {
          --primary-color: ${primaryColor};
        }
        .glow {
          text-shadow: 0 0 20px ${primaryColor}40;
        }
        .glow-box {
          box-shadow: 0 0 30px ${primaryColor}20;
        }
        .primary-bg {
          background-color: ${primaryColor};
        }
        .primary-text {
          color: ${primaryColor};
        }
        .primary-border {
          border-color: ${primaryColor};
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-gray-400 text-lg mb-4">{data.tagline}</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight glow">
            {data.title.split(" ").map((word, index) => {
              // Highlight key words with primary color
              const keyWords = ["GRATUIT", "EXCLUSIF", "PREMIUM", "PRO", "EXPERT", "MASTER", "SECRETS", "MÉTHODE"]
              const isKeyWord = keyWords.some((key) => word.toUpperCase().includes(key))
              return (
                <span key={index} className={isKeyWord ? "primary-text" : ""}>
                  {word}{" "}
                </span>
              )
            })}
          </h1>

          {/* Hero Image */}
          <div className="mb-8">
            <img
              src={data.image_url || "/placeholder.svg"}
              alt={`Une image représentant ${data.title} dans un style minimaliste et moderne, fond noir, éclairage doux, parfaitement centrée`}
              className="max-w-full w-full max-w-2xl mx-auto rounded-2xl shadow-2xl glow-box"
              style={{ maxWidth: "600px" }}
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement
                target.src = `https://source.unsplash.com/800x450/?business-work&${encodeURIComponent(data.title)}`
              }}
            />
          </div>

          <Button
            size="lg"
            className="primary-bg hover:opacity-90 text-black font-bold px-8 py-4 rounded-2xl text-lg shadow-lg"
          >
            {data.offer.cta}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {data.benefits.map((benefit, index) => {
              const IconComponent = iconMap[benefit.icon] || CheckCircle
              return (
                <div key={index} className="text-center">
                  <div className="primary-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg prose-invert max-w-none">
            {data.story.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-gray-300 text-lg leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center glow">Ce que vous allez découvrir</h2>
          <div className="prose prose-lg prose-invert max-w-none">
            {data.description.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-gray-300 text-lg leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-gray-800 border-2 primary-border glow-box">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4 text-white">{data.offer.title}</h2>
              <div className="mb-6">
                <span className="text-2xl text-gray-400 line-through mr-4">{data.offer.original_price}</span>
                <span className="text-4xl font-bold primary-text">{data.offer.current_price}</span>
              </div>
              <Button
                size="lg"
                className="primary-bg hover:opacity-90 text-black font-bold px-12 py-4 rounded-2xl text-xl w-full"
              >
                {data.offer.cta}
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bonus Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center glow">Bonus Exclusifs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.bonus.map((bonus, index) => (
              <Card key={index} className="bg-gray-800 border primary-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Gift className="h-8 w-8 primary-text flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-white">{bonus.title}</h3>
                      <p className="text-gray-400 mb-2">{bonus.description}</p>
                      <span className="primary-text font-bold">{bonus.value}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center glow">Ce qu'en disent nos clients</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {data.testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 primary-text fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="primary-text text-sm">{testimonial.result}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 glow">Qui suis-je ?</h2>
          <div className="mb-8">
            <img
              src="https://em-content.zobj.net/thumbs/120/apple/354/woman_1f469.png"
              alt={data.bio.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 primary-border object-cover"
            />
            <h3 className="text-2xl font-bold">{data.bio.name}</h3>
            <p className="primary-text text-lg">{data.bio.title}</p>
          </div>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">{data.bio.description}</p>
          <div className="grid md:grid-cols-3 gap-4">
            {data.bio.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 primary-text" />
                <span className="text-sm">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <ShieldCheck className="h-16 w-16 primary-text mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 glow">{data.guarantee.title}</h2>
          <p className="text-gray-300 text-lg">{data.guarantee.description}</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center glow">Questions Fréquentes</h2>
          <div className="space-y-6">
            {data.faq.map((item, index) => (
              <Card key={index} className="bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 primary-text">{item.question}</h3>
                  <p className="text-gray-300">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 glow">Prêt à commencer ?</h2>
          <Button size="lg" className="primary-bg hover:opacity-90 text-black font-bold px-12 py-6 rounded-2xl text-xl">
            {data.offer.cta}
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </section>
    </div>
  )
}
