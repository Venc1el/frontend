import { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './users/components/login/login';
import Dashboard from './users/components/main/dashboard';
import DashboardAdmin from './admin/components/mainContent/dashboardAdmin';
import UserContent from './admin/components/users/userContent';
import HeaderAdmin from './admin/components/home/headerAdmin';
import NotFoundPage from './404pages/404';
import CryptoJS from 'crypto-js';
import AduanContent from './admin/components/complaint/admin/aduanContent';
import Cookies from 'js-cookie';
import ComplaintForm from './admin/components/complaint/complaintForm';
import DetailComplaint from './admin/components/complaint/detailComplaint';
import ComplaintResponse from './admin/components/complaint/admin/responseForm';
import UmkmContent from './admin/components/umkm/umkmContent';
import UmkmForm from './admin/components/umkm/umkmForm';
import UpdatePosts from './admin/components/umkm/updatePosts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UcomplaintContent from './admin/components/complaint/Ucomplaint';
import fetchUserInfo from './server/getUserId';
import UmkmDetails from './admin/components/umkm/umkmDetails';
import DashboardSyscon from './admin/components/mainContent/dashboardSyscon';
import DetailsUmkm from './users/components/umkm/detailsPublicUmkm';
import UserUmkm from './users/components/umkm/umkmPublic';
import Header from './users/components/header/header';

function App() {
  // Constants
  const secretKey = 'your-secret-key';
  const cookie = Cookies.get('token');
  const storedEncryptedLevel = localStorage.getItem('encryptedUserLevel');

  // States
  const [userId, setUserId] = useState(null);
  const [userLevel, setUserLevel] = useState('');
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);

  // Ref for session ending notification
  const sessionEndNotificationRef = useRef(null);
  
  
  useEffect(() => {
    if (storedEncryptedLevel) {
      // Fetch user info and decrypt user level
      const fetchData = async () => {
        const userResponse = await fetchUserInfo();
        if (userResponse !== null) {
          setUserId(userResponse);
        }
  
        if (storedEncryptedLevel) {
          const decryptedLevel = CryptoJS.AES.decrypt(storedEncryptedLevel, secretKey).toString(CryptoJS.enc.Utf8);
          setUserLevel(decryptedLevel);
        }
  
        setAuthCheckCompleted(true);
      };
  
      fetchData();
    } else {
      // If there's no token, set auth check as completed with no user info
      setAuthCheckCompleted(true);
    }
  }, [storedEncryptedLevel]);
  

  useEffect(() => {
    if (storedEncryptedLevel) {
      let sessionTimeout;
  
      // Set the session duration to 8 hours (28800000 milliseconds)
      const sessionDuration = 28800000; // 8 hours in milliseconds
  
      // Calculate the time when the session should end
      const sessionEndTime = Date.now() + sessionDuration;
  
      // Calculate the time when the toast notification should appear (30 minutes before the session ends)
      const toastNotificationTime = sessionEndTime - 1800000; // 30 minutes before session end
  
      const handleSessionTimeout = () => {
        clearTimeout(sessionTimeout);
        Cookies.remove('token');
        localStorage.removeItem('encryptedUserLevel');
        window.location.href = '/login';
      };
  
      sessionTimeout = setTimeout(() => {
        sessionEndNotificationRef.current = toast.warning(
          'Your session is ending in 10 minutes. Please save your work.',
          {
            position: 'top-right',
            autoClose: false,
          }
        );
        setTimeout(() => {
          handleSessionTimeout();
        }, 4000);
      }, toastNotificationTime - Date.now());

  
      // Clean up event listeners and timers when the component unmounts
      return () => {
        clearTimeout(sessionTimeout);
        if (sessionEndNotificationRef.current) {
          toast.dismiss(sessionEndNotificationRef.current);
        }
      };
    }
  }, [storedEncryptedLevel]);

  if (!authCheckCompleted) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {userLevel === 'Admin' && storedEncryptedLevel ? (
          <>
            <Route path="/syscon" element={<><HeaderAdmin /><DashboardAdmin /></>} />
            <Route path="/syscon/user" element={<><HeaderAdmin /><UserContent /></>} />
            <Route path="/syscon/aduan" element={<><HeaderAdmin /><AduanContent /></>} />
            <Route path="/syscon/aduan/form-aduan" element={<><HeaderAdmin /><ComplaintForm /></>} />
            <Route path="/syscon/aduan/detail/:id" element={<><HeaderAdmin /><DetailComplaint /></>} />
            <Route path="/syscon/aduan/:id/respond" element={<><HeaderAdmin /><ComplaintResponse /></>} />
            <Route path="/syscon/umkm" element={<><HeaderAdmin /><UmkmContent /></>} />
            <Route path="/syscon/umkm/umkm-form" element={<><HeaderAdmin /><UmkmForm /></>} />
            <Route path="/syscon/umkm/update/:id" element={<><HeaderAdmin /><UpdatePosts /></>} />
            <Route path="/syscon/umkm/umkm-details/:id" element={<><HeaderAdmin /><UmkmDetails /></>} />
          </>
        ) : userLevel !== 'Admin' && storedEncryptedLevel ? (
          <>
            <Route path="/syscon" element={<><HeaderAdmin /><DashboardSyscon /></>} />
            <Route path="/syscon/aduan" element={<><HeaderAdmin /><UcomplaintContent userId={userId} /></>} />
            <Route path="/syscon/aduan/form-aduan" element={<><HeaderAdmin /><ComplaintForm /></>} />
            <Route path="/syscon/aduan/detail/:id" element={<><HeaderAdmin /><DetailComplaint /></>} />
            <Route path="/syscon/umkm" element={<><HeaderAdmin /><UmkmContent /></>} />
            <Route path="/syscon/umkm/umkm-form" element={<><HeaderAdmin /><UmkmForm /></>} />
            <Route path="/syscon/umkm/umkm-details/:id" element={<><HeaderAdmin /><UmkmDetails /></>} />
          </>
        ) : (
          <Route path="*" element={<NotFoundPage />} />
        )}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/umkm" element={<><Header /><UserUmkm /></>} />
        <Route path="/umkm/details/:postId" element={<><Header /><DetailsUmkm /></>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
