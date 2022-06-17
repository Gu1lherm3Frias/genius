export default function Pad({color, onClick, flash}) {
    return (
        <div 
            onClick={onClick} 
            className={`pad ${color} ${flash ? "flash" : ""}`}>
        </div>
    )
}