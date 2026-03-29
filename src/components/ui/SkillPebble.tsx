interface SkillPebbleProps {
  skill: string
}

export default function SkillPebble({ skill }: SkillPebbleProps) {
  return <span className="skill-pebble">{skill}</span>
}
