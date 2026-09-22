import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <div>
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
