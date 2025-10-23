import { Link, useNavigate } from "react-router-dom";
import { pageData } from "./pageData";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
  const navigate = useNavigate();
  const navRef = useRef(null);
  const [hoverColor, setHoverColor] = useState("rgb(97, 218, 251)");
  const [borderColor, setBorderColor] = useState("rgba(255, 255, 255, 0.18)");

  function handleLogout() {
    sessionStorage.removeItem("User");
    navigate("/");
  }

  useEffect(() => {
    const navbar = navRef.current;
    if (!navbar) return;

    function handleMouseMove(e) {
      const rect = navbar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate hue based on position
      const hue = Math.floor((x / rect.width) * 360);
      const accentColor = `hsl(${hue}, 80%, 65%)`;
      
      // Update hover color
      setHoverColor(accentColor);
      
      // Update border color with transparency
      setBorderColor(`hsla(${hue}, 80%, 65%, 0.3)`);
      
      // Update gradient position
      navbar.style.setProperty('--mouse-x', `${x}px`);
      navbar.style.setProperty('--mouse-y', `${y}px`);
    }

    function handleMouseLeave() {
      setBorderColor("rgba(255, 255, 255, 0.18)");
      navbar.style.setProperty('--mouse-x', '50%');
      navbar.style.setProperty('--mouse-y', '50%');
    }

    navbar.addEventListener('mousemove', handleMouseMove);
    navbar.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      navbar.removeEventListener('mousemove', handleMouseMove);
      navbar.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={navRef}
      className="navbar fixed top-4 left-1/2 transform -translate-x-1/2 z-50
                 rounded-xl px-6 py-3 flex gap-6 items-center shadow-xl
                 transition-all duration-300"
      style={{
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        background: `radial-gradient(
          circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
          rgba(255, 255, 255, 0.2) 0%,
          transparent 120px
        ), rgba(255, 255, 255, 0.05)`,
        border: `2px solid ${borderColor}`,
        boxShadow: `0 0 30px rgba(227, 228, 237, 0.37)`,
        '--mouse-x': '50%',
        '--mouse-y': '50%'
      }}
    >
      {pageData.map((page) => (
        <Link key={page.path} to={page.path} className="navItem">
          <button 
            className="font-medium transition-all duration-300 hover:scale-110"
            style={{
              color: 'rgb(240, 240, 240)',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = hoverColor;
              e.target.style.textShadow = `0 0 8px ${hoverColor}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'rgb(240, 240, 240)';
              e.target.style.textShadow = '0 1px 2px rgba(0,0,0,0.2)';
            }}
          >
            {page.name}
          </button>
        </Link>
      ))}

      <button
        onClick={handleLogout}
        className="ml-auto font-medium transition-all duration-300 hover:scale-110"
        style={{
          color: 'rgb(255, 100, 100)',
          textShadow: '0 1px 2px rgba(0,0,0,0.2)'
        }}
        onMouseEnter={(e) => {
          e.target.style.color = 'rgb(255, 200, 200)';
          e.target.style.textShadow = '0 0 8px rgba(255,100,100,0.5)';
        }}
        onMouseLeave={(e) => {
          e.target.style.color = 'rgb(255, 100, 100)';
          e.target.style.textShadow = '0 1px 2px rgba(0,0,0,0.2)';
        }}
      >
        Log out
      </button>
    </div>
  );
}