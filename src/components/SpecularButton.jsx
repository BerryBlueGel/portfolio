import './SpecularButton.css'
export default function SpecularButton({ children, onClick, ariaExpanded, ariaControls, href }) {
  const Tag = href ? 'a' : 'button'
  const props = href ? { href } : { type: 'button', onClick, 'aria-expanded': ariaExpanded, 'aria-controls': ariaControls }
  return <Tag className="specular-button" {...props}><span className="specular-button__shine" aria-hidden="true" /><span>{children}</span></Tag>
}
