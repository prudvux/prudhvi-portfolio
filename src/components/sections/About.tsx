import { useRevealOnScroll } from '../../hooks/useIntersectionObserver'
import SkillPebble from '../ui/SkillPebble'
import { skills } from '../../data/skills'

function Block({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>({
    threshold: 0.18,
    rootMargin: '0px 0px -40px 0px',
  })
  return (
    <div
      ref={ref}
      className={`about-block${isVisible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function About() {
  const { ref: heroRef, isVisible: heroVisible } = useRevealOnScroll<HTMLDivElement>({
    threshold: 0.1,
  })

  return (
    <section className="about-cove" id="about">

      {/* ── Hero hook ── */}
      <div
        ref={heroRef}
        className={`about-hero${heroVisible ? ' visible' : ''}`}
      >
        <p className="about-eyebrow">The Cove</p>
        <p className="about-hook-sub">Not a job title. A perspective.</p>
        <h1 className="about-hook">I design calm<br />in complex systems.</h1>
      </div>

      {/* ── Narrative blocks ── */}
      <div className="about-narrative">

        <Block delay={0}>
          <span className="about-block-label">Who I Am</span>
          <p className="about-block-body">
            A UX designer with an engineering mindset, working at the intersection
            of product, systems, and emerging AI.<br />
            I care about clarity, not noise.
          </p>
        </Block>

        <Block delay={80}>
          <span className="about-block-label">What I Do</span>
          <p className="about-block-body">
            I simplify complex workflows, align teams, and design experiences that
            scale — from early ideas to enterprise systems.
          </p>
        </Block>

        <Block delay={160}>
          <span className="about-block-label">Right Now</span>
          <p className="about-block-body about-block-body--alive">
            Currently leading UX for healthcare systems at scale, while exploring
            how AI can reshape the design process itself.
          </p>
        </Block>

        <Block delay={240}>
          <span className="about-block-label">How I Think</span>
          <blockquote className="about-philosophy">
            I believe good design feels invisible.<br />
            It removes friction, builds trust, and lets people focus on what matters.
          </blockquote>
        </Block>

        <Block delay={320}>
          <span className="about-block-label">Beyond Work</span>
          <p className="about-block-body about-block-body--soft">
            I&apos;ve always been drawn to systems —<br />
            whether in code, products, or even nature.
          </p>
        </Block>

        {/* Skills */}
        <Block delay={400}>
          <span className="about-block-label">Capabilities</span>
          <div className="about-skills">
            {skills.map(skill => (
              <SkillPebble key={skill} skill={skill} />
            ))}
          </div>
        </Block>

      </div>

      {/* ── Closing line ── */}
      <div className="about-closing">
        <p className="about-closing-line">
          Beneath every interface, there&apos;s a story.
        </p>
        <p className="about-closing-sub">
          I design to make it feel effortless.
        </p>
      </div>

    </section>
  )
}
