import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-title">
        Movie Gallery
      </Link>
      <nav>
        <Link to="/favorites" className="nav-link">
          My Favorites
        </Link>
      </nav>
    </header>
  );
}

export default Header;