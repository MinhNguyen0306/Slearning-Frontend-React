import { useNavigate } from "react-router-dom";
import LogoImage from "../assets/Logo.svg";

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-x-2 cursor-pointer" onClick={() => navigate("/")}>
      <img src={LogoImage} alt="Logo" className="w-full object-contain"/>
      <h1 className="font-extrabold text-lg tracking-wider">SLearning</h1>
    </div>
  )
}

export default Logo
