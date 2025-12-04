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
} from "lucide-react";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

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
  <section className="py-24 px-4 bg-muted/30">
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

// Handles CTA section on bottom of page
const CTASection = () => (
  <section className="py-24 px-4">
    <div className="max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-fuchsia-600 via-pink-600 to-cyan-600 p-12 md:p-16 text-center">
        {/* Shows patterned overlay for CTA area */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Automate Your Growth?
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-10">
            Joins thousands of creators who are saving hours every week with
            intelligent Instagram automation.
          </p>
          <SignedOut>
            <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
              <Button
                size="lg"
                className="px-10 py-6 text-lg bg-white text-fuchsia-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="px-10 py-6 text-lg bg-white text-fuchsia-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
          </SignedIn>
          <p className="mt-6 text-sm text-white/60">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </div>
  </section>
);

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
      <CTASection />
    </div>
  );
}
