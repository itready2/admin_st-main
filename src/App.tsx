import { Navigate, Outlet, RouterProvider, ScrollRestoration, createBrowserRouter } from "react-router-dom";
import { ReactNode, Suspense, lazy } from "react";
import Navigation from "./components/Nevigation/Navigation";
import { useAuth } from "./context/AuthContext";

//* ใช้ lazy import ในการลดการทำงานให้ไม่หนัก
const Home = lazy(() => import('./page/Home'));

const Contact = lazy(() => import('./page/Contact/View'));
const ContactDetail = lazy(() => import('./page/Contact/Detail'))

const Promotion = lazy(() => import('./page/Promotion/View'))
const PromotionDetial = lazy(() => import('./page/Promotion/Detial'))
const CreatePromotion = lazy(() => import('./page/Promotion/Create'))
const UpdatePromotion = lazy(() => import('./page/Promotion/Update'))

const Health = lazy(() => import('./page/Health/View'))
const HealthDetial = lazy(() => import('./page/Health/Detial'))
const CreateHealth = lazy(() => import('./page/Health/Create'))
const UpdateHealth = lazy(() => import('./page/Health/Upadate'))

const News = lazy(() => import('./page/News/View'))
const NewsDetial = lazy(() => import('./page/News/Detial'))
const CreateNews = lazy(() => import('./page/News/Create'))
//Todo: updatenew

const Banner = lazy(() => import('./page/Banner/View'))
const CreateBanner = lazy(() => import('./page/Banner/Create'))
const UpdateBanner = lazy(() => import('./page/Banner/Update'))

const Doctor = lazy(() => import('./page/Doctor/View'))
const ViewDoctor = lazy(() => import('./page/Doctor/Detial'))
const CreateDoctor = lazy(() => import('./page/Doctor/Create'))
const UpdateDoctor = lazy(() => import('./page/Doctor/Update'))

const PageView = lazy(() => import('./page/Service_Page/View'))
const PageUpdate = lazy(() => import('./page/Service_Page/Edit'))

const Gallery = lazy(() => import('./page/gallery/Gallery'))
const UpdateNews = lazy(() => import('./page/News/Upadate'))

const Login = lazy(() => import('./page/auth/Login'));

export interface ProtectRouteProps {
  children: ReactNode;
}

function App() {

  const { isLoggedin } = useAuth();

  const ProtectRoute: React.FC<ProtectRouteProps> = ({ children }) => {
    return isLoggedin ? children : <Navigate to='/login' />;
  }

  const IfLoggedIn: React.FC<ProtectRouteProps> = ({ children }) => {
    return isLoggedin ? <Navigate to='/' /> : <>{children}</>;
  };

  //TODO : Protect route
  const Layout = () => {
    return (
      <ProtectRoute >
        <Navigation />
        <Suspense>
          <ScrollRestoration />
          <Outlet />
        </Suspense>
      </ProtectRoute>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "/promotion",
          element: <Promotion />,
        },
        {
          path: "/promotion/:slug",
          element: <PromotionDetial />,
        },
        {
          path: "/create/promotion",
          element: <CreatePromotion />,
        },
        {
          path: "/update/promotion/:slug",
          element: <UpdatePromotion />,
        },
        {
          path: "/news",
          element: <News />,
        },
        {
          path: "/news/:slug",
          element: <NewsDetial />,
        },
        {
          path: "/create/news",
          element: <CreateNews />,
        },
        {
          path: "/update/news/:slug",
          element: <UpdateNews />,
        },

        {
          path: "/health-info",
          element: <Health />,
        },
        {
          path: "/health-info/:slug",
          element: <HealthDetial />,
        },
        {
          path: "/create/health-info",
          element: <CreateHealth />,
        },
        {
          path: "/update/health-info/:slug",
          element: <UpdateHealth />,
        },
        {
          path: "/banner",
          element: <Banner />,
        },
        {
          path: "/create/banner",
          element: <CreateBanner />,
        },
        {
          path: "/update/banner/:slug",
          element: <UpdateBanner />,
        },
        {
          path: "/doctor",
          element: <Doctor />,
        },
        {
          path: "/doctor/:slug",
          element: <ViewDoctor />,
        },
        {
          path: "/create/doctor",
          element: <CreateDoctor />,
        },
        {
          path: "/update/doctor/:slug",
          element: <UpdateDoctor />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/gallery",
          element: <Gallery />,
        },
        {
          path: "/contact/:slug",
          element: <ContactDetail />,
        },
        {
          path: "/page/:slug",
          element: <PageView />,
        },
        {
          path: "/update/page/:slug",
          element: <PageUpdate />,
        },
      ],
    },
    {
      path: "/login",
      element: <IfLoggedIn><Login /></IfLoggedIn>
    }
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
