import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-title">
        Movie Gallery
      </Link>
    </header>
  );
}

export default Header;