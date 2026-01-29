import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Zap,
  Clock,
  BarChart3,
  Shield,
  ArrowRight,
  Sparkles,
  Instagram,
  Bot,
  Target,
  CheckIcon,
} from "lucide-react";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

// Main landing page component
export default function LandingPage() {
  return (
    // Uses grid pattern background according to brand style
    <div
      className="min-h-screen overflow-hidden relative
        bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)]
        dark:bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)]
        bg-size-[60px_60px]"
    >
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Pricing />
    </div>
  );
}

// Shows the badge used in the hero section
const HeroBadge = () => (
  <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 animate-fade-in">
    <Sparkles className="size-4" />
    <span>Instagram Automation Made Simple</span>
  </div>
);

// Displays call to action buttons with proper auth guards
const CTAActions = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-300">
      <SignedOut>
        <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
          <Button
            size="lg"
            className="group px-8 py-6 text-base bg-linear-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 transition-all duration-300"
          >
            Start Free
            <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <Link href="/dashboard">
          <Button
            size="lg"
            className="group px-8 py-6 text-base bg-linear-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 transition-all duration-300"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </SignedIn>
      <Link href="#how-it-works">
        <Button variant="outline" size="lg" className="px-8 py-6 text-base">
          See How It Works
        </Button>
      </Link>
    </div>
  );
};

// Displays social proof below hero CTA
const SocialProof = () => (
  <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in animation-delay-500">
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="size-8 rounded-full bg-linear-to-br from-fuchsia-400 to-pink-400 border-2 border-background"
          />
        ))}
      </div>
      <span>1,000+ creators</span>
    </div>
    <div className="flex items-center gap-2">
      <Zap className="size-4 text-yellow-500" />
      <span>500K+ automations triggered</span>
    </div>
  </div>
);

// Handles the hero section
const HeroSection = () => (
  // Wraps hero and decorative backgrounds
  <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
    {/* Background gradients & blurs for effect */}
    <div className="absolute inset-0 bg-linear-to-br from-fuchsia-500/5 via-transparent to-cyan-500/5 dark:from-fuchsia-500/10 dark:to-cyan-500/10 pointer-events-none" />
    <div className="absolute top-20 left-10 w-72 h-72 bg-linear-to-r from-fuchsia-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-linear-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000 pointer-events-none" />
    <div className="absolute inset-0 mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
    <div className="relative z-10 max-w-5xl mx-auto text-center">
      <HeroBadge />
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in animation-delay-100">
        <span className="bg-linear-to-r from-fuchsia-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
          Automate
        </span>{" "}
        Your Instagram
        <br />
        <span className="text-foreground">Engagement</span>
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in animation-delay-200">
        Responds to comments instantly, sends automated DMs, and grows your
        audience while you sleep. Built for creators and businesses.
      </p>
      <CTAActions />
      <SocialProof />
    </div>
  </section>
);

// Represents data and rendering for each feature
const features = [
  {
    icon: MessageCircle,
    title: "Auto-Reply to Comments",
    description:
      "Instantly responds to specific keywords or phrases in your post comments",
    gradient: "from-fuchsia-500 to-pink-500",
  },
  {
    icon: Bot,
    title: "Automated DMs",
    description:
      "Sends personalized direct messages based on user interactions",
    gradient: "from-pink-500 to-orange-500",
  },
  {
    icon: Target,
    title: "Keyword Triggers",
    description:
      "Sets up custom triggers using exact matches or regex patterns",
    gradient: "from-orange-500 to-yellow-500",
  },
  {
    icon: Clock,
    title: "24/7 Engagement",
    description:
      "Never misses a comment—your automation works around the clock",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Tracks automation performance and engagement metrics",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description:
      "Builds with Instagram's official API—100% safe for your account",
    gradient: "from-indigo-500 to-fuchsia-500",
  },
];

// Displays a single feature card
const FeatureCard = ({ icon: Icon, title, description, gradient }: any) => (
  <div className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-border hover:shadow-xl hover:shadow-fuchsia-500/5 transition-all duration-300">
    <div
      className={`inline-flex p-3 rounded-xl bg-linear-to-br ${gradient} mb-4`}
    >
      <Icon className="size-6 text-white" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

// Handles feature grid section
const FeaturesSection = () => (
  <section className="py-24 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Everything You Need to{" "}
          <span className="bg-linear-to-r from-fuchsia-600 to-cyan-500 bg-clip-text text-transparent">
            Scale
          </span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Powerful automation features designed for Instagram creators and
          businesses
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <FeatureCard key={i} {...feature} />
        ))}
      </div>
    </div>
  </section>
);

// Stepper data for "How It Works"
const howItWorksSteps = [
  {
    step: "01",
    title: "Connect Instagram",
    description:
      "Links your Instagram Business or Creator account securely via OAuth",
    icon: Instagram,
  },
  {
    step: "02",
    title: "Create Automation",
    description:
      "Selects a post and sets up keyword triggers with custom responses",
    icon: Zap,
  },
  {
    step: "03",
    title: "Watch It Work",
    description:
      "Sits back as your automations engage with your audience automatically",
    icon: Sparkles,
  },
];

// Shows single step card
const StepCard = ({
  step,
  title,
  description,
  icon: Icon,
  showConnector,
}: {
  step: string;
  title: string;
  description: string;
  icon: any;
  showConnector: boolean;
}) => (
  <div className="relative">
    {showConnector && (
      <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-linear-to-r from-fuchsia-500/50 to-transparent" />
    )}
    <div className="text-center">
      <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-linear-to-br from-fuchsia-500/10 to-cyan-500/10 border border-fuchsia-500/20 mb-6">
        <Icon className="size-8 text-fuchsia-500" />
      </div>
      <div className="text-sm font-bold text-fuchsia-500 mb-2">STEP {step}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

// Handles the how-it-works stepper
const HowItWorksSection = () => (
  <section className="py-24 px-4" id="how-it-works">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Get Started in{" "}
          <span className="bg-linear-to-r from-cyan-500 to-fuchsia-500 bg-clip-text text-transparent">
            3 Simple Steps
          </span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Sets up your first automation in under 5 minutes
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {howItWorksSteps.map((item, index) => (
          <StepCard
            key={item.step}
            {...item}
            showConnector={index < howItWorksSteps.length - 1}
          />
        ))}
      </div>
    </div>
  </section>
);

const tiers = [
  {
    name: 'Hobby',
    id: 'tier-hobby',
    href: '#',
    priceMonthly: '$29',
    description: "The perfect plan if you're just getting started with our product.",
    features: ['25 products', 'Up to 10,000 subscribers', 'Advanced analytics', '24-hour support response time'],
    featured: false,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '#',
    priceMonthly: '$99',
    description: 'Dedicated support and infrastructure for your company.',
    features: [
      'Unlimited products',
      'Unlimited subscribers',
      'Advanced analytics',
      'Dedicated support representative',
      'Marketing automations',
      'Custom integrations',
    ],
    featured: true,
  },
]

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const Pricing = () => {
  return (
    <div className="relative isolate  px-6 py-24 sm:py-32 lg:px-8 bg-linear-to-br">
      <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="mx-auto aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
        />
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base/7 font-semibold text-fuchsia-500">Pricing</h2>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-6xl">
          Choose the right plan for you
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
        Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer
        loyalty, and driving sales.
      </p>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? 'relative bg-linear-to-br from-fuchsia-600 via-pink-600 to-cyan-600' : 'bg-foreground/2.5 sm:mx-8 lg:mx-0',
              tier.featured
                ? ''
                : tierIdx === 0
                  ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                  : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
              'rounded-3xl p-8 ring-1 ring-white/10 sm:p-10',
            )}
          >
            <h3
              id={tier.id}
              className={classNames(tier.featured ? 'text-white-400' : 'text-foreground', 'text-base/7 font-semibold')}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? 'text-white' : 'text-foreground',
                  'text-5xl font-semibold tracking-tight',
                )}
              >
                {tier.priceMonthly}
              </span>
              <span className={classNames(tier.featured ? 'text-white' : 'text-gray-400', 'text-base')}>/month</span>
            </p>
            <p className={classNames(tier.featured ? 'text-white' : 'text-foreground', 'mt-6 text-base/7')}>
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? 'text-white' : 'text-foreground',
                'mt-8 space-y-3 text-sm/6 sm:mt-10',
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={classNames(tier.featured ? 'text-foreground-400' : 'text-foreground', 'h-6 w-5 flex-none')}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              // href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? 'bg-white text-fuchsia-600 hover:opacity-70 focus-visible:outline-indigo-500'
                  : 'bg-foreground/10 text-foreground inset-ring inset-ring-white/5 hover:bg-white/20 focus-visible:outline-white/75',
                'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10',
              )}
            >
              Get started today
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
