import './SpecularButton.css'
export default function SpecularButton({ children, onClick, ariaExpanded }) { return <button className="specular-button" type="button" onClick={onClick} aria-expanded={ariaExpanded}><span className="specular-button__shine" aria-hidden="true" /><span>{children}</span></button> }
