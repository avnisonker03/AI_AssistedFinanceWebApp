// import React, { useState } from 'react';
// import Navbar from './components/HomePageComponents/Navbar';
// import Footer from './components/HomePageComponents/Footer';
// import { Outlet } from 'react-router-dom';
// import Drawer from './components/Drawer/Drawer';

// export default function App() {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(true);

//   const toggleDrawer = () => {
//     setIsDrawerOpen(!isDrawerOpen);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900">
//       <Navbar onMenuClick={toggleDrawer} />
      
//       <div className="flex">
//         {/* Drawer */}
//         <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
//         {/* Main Content */}
//         <main className={`flex-1 transition-all duration-300 ${
//           isDrawerOpen ? 'ml-64' : 'ml-0'
//         }`}>
//           <div className="container mx-auto p-6">
//             <Outlet />
//           </div>
//         </main>
//       </div>
      
//       <Footer />
//     </div>
//   );
// }

import React, { useState } from 'react';
import Navbar from './components/HomePageComponents/Navbar';
import Footer from './components/HomePageComponents/Footer';
import { Outlet } from 'react-router-dom';
import Drawer from './components/Drawer/Drawer';

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Fixed Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isDrawerOpen ? 'ml-64' : 'ml-0'
      }`}>
        {/* Navbar */}
        <div className="sticky top-0 z-10">
          <Navbar onMenuClick={toggleDrawer} />
        </div>

        {/* Main Content Area with Auto Scroll */}
        <main className="flex-1 overflow-auto bg-gray-900 p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}