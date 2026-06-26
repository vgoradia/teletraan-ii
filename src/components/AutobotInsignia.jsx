import autobotLogo from '../assets/transformers-autobot.svg'

export default function AutobotInsignia({ size = 48 }) {
  return (
    <img
      src={autobotLogo}
      width={size}
      height={size}
      alt="Autobot insignia"
      className="autobot-insignia"
    />
  )
}