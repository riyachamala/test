import {
  faHome,
  faUsers,
  faComments,
  faUpload,
  faBriefcase,
  faArchive,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";

// Define an interface for the props of the NavItem component
interface NavItemProps {
  icon: any;
  link: string;
  label: string;
  isActive: boolean;
}

// Define a functional component named NavItem
const NavItem: React.FC<NavItemProps> = ({ icon, link, label, isActive }) => {
  return (
    <li className={`nav-item ${isActive ? 'active' : ''}`}>
      <Link to={link}>
        <FontAwesomeIcon icon={icon} />
        <span className="nav-label">{label}</span>
      </Link>
    </li>
  );
};

// Define a functional component named Header
const Header: React.FC = () => {
  const location = useLocation();

  // Define navigation items
  const navItems = [
    { icon: faHome, link: "/dashboard", label: "Dashboard" },
    { icon: faUsers, link: "/candidates", label: "Candidates" },
    { icon: faComments, link: "/chatbot", label: "Chatbot" },
    { icon: faUpload, link: "/upload", label: "Upload" },
    { icon: faBriefcase, link: "/jobs", label: "Jobs" },
    { icon: faArchive, link: "/archive", label: "Archive" },
    { icon: faSignInAlt, link: "/login", label: "Login" },
  ];

  return (
    <div className="header">
      <h1>Recruitment System</h1>
      <ul className="nav-list">
        {navItems.map((item, index) => (
          <NavItem 
            key={index} 
            icon={item.icon} 
            link={item.link} 
            label={item.label}
            isActive={location.pathname === item.link}
          />
        ))}
      </ul>
    </div>
  );
};

export default Header;