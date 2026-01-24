import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <header>
        {/* Header/Navbar aquí */}
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        {/* Footer aquí */}
      </footer>
    </div>
  );
};

export default MainLayout;
