import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import AuthLayout from "../Layouts/AuthLayout";
import DashboardLayout from "../Layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoutes from "./AdminRoutes";
import RiderRoute from "./RiderRoute";
import ErrorPage from "../Components/State/ErrorPage";
import NotFound from "../Components/State/NotFound";
import PageLoader from "../Components/State/PageLoader";
import { serviceCentersLoader } from "./serviceCentersLoader";

// Home is the landing page and loads on first paint regardless, so it stays
// a regular import. Everything else is lazy-loaded per route.
import Home from "../Pages/Home/Home/Home";

const Coverage = lazy(() => import("../Pages/Coverage/Coverage"));
const AboutUs = lazy(() => import("../Pages/AboutUs/AboutUs"));
const Login = lazy(() => import("../Pages/Auth/Login/Login"));
const Register = lazy(() => import("../Pages/Auth/Register/Register"));
const Rider = lazy(() => import("../Pages/Rider/Rider"));
const SendParcel = lazy(() => import("../Pages/SendParcel/SendParcel"));
const ParcelTrack = lazy(() => import("../Pages/ParcelTrack/ParcelTrack"));

const DashboardHome = lazy(() => import("../Pages/Dashboard/DashboardHome/DashboardHome"));
const MyParcels = lazy(() => import("../Pages/Dashboard/MyParcels/MyParcels"));
const Payment = lazy(() => import("../Pages/Dashboard/Payment/Payment"));
const PaymentSuccess = lazy(() => import("../Pages/Dashboard/Payment/PaymentSuccess"));
const PaymentCancelled = lazy(() => import("../Pages/Dashboard/Payment/PaymentCancelled"));
const PaymentHistory = lazy(() => import("../Pages/Dashboard/Payment/PaymentHistory/PaymentHistory"));
const ApproveRiders = lazy(() => import("../Pages/Dashboard/ApproveRiders/ApproveRiders"));
const AssignRiders = lazy(() => import("../Pages/Dashboard/AssignRiders/AssignRiders"));
const UsersManagement = lazy(() => import("../Pages/Dashboard/UsersManagement/UsersManagement"));
const AssignedDeliveries = lazy(() => import("../Pages/AssignedDeliveries/AssignedDeliveries"));
const CompletedDeliveries = lazy(() => import("../Pages/Dashboard/CompletedDeliveries/CompletedDeliveries"));

// Wraps a lazy element with the shared page-level loading fallback.
const withSuspense = (element) => (
    <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: 'rider',
                element: <PrivateRoute>{withSuspense(<Rider />)}</PrivateRoute>,
                loader: serviceCentersLoader
            },
            {
                path: 'sendparcel',
                element: <PrivateRoute>{withSuspense(<SendParcel />)}</PrivateRoute>,
                loader: serviceCentersLoader
            },
            {
                path: '/coverage',
                element: withSuspense(<Coverage />),
                loader: serviceCentersLoader
            },
            {
                path: 'parcel-track/:trackingId',
                element: withSuspense(<ParcelTrack />)
            },
            {
                path: '/aboutus',
                element: withSuspense(<AboutUs />)
            },
            {
                path: '*',
                Component: NotFound
            },
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/login',
                element: withSuspense(<Login />)
            },
            {
                path: '/register',
                element: withSuspense(<Register />)
            }
        ]
    },
    {
        path: 'dashboard',
        element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: withSuspense(<DashboardHome />),
            },
            {
                path: 'my-parcels',
                element: withSuspense(<MyParcels />),
            },
            {
                path: 'payment/:parcelId',
                element: withSuspense(<Payment />),
            },
            {
                path: 'payment-history',
                element: withSuspense(<PaymentHistory />),
            },
            {
                path: 'payment-success',
                element: withSuspense(<PaymentSuccess />),
            },
            {
                path: 'payment-cancelled',
                element: withSuspense(<PaymentCancelled />),
            },

            // Rider only routes
            {
                path: 'assigned-deliveries',
                element: <RiderRoute>{withSuspense(<AssignedDeliveries />)}</RiderRoute>
            },
            {
                path: 'completed-deliveries',
                element: <RiderRoute>{withSuspense(<CompletedDeliveries />)}</RiderRoute>
            },

            // Admin only routes
            {
                path: 'approve-riders',
                element: <AdminRoutes>{withSuspense(<ApproveRiders />)}</AdminRoutes>
            },
            {
                path: 'assign-riders',
                element: <AdminRoutes>{withSuspense(<AssignRiders />)}</AdminRoutes>
            },
            {
                path: 'users-management',
                element: <AdminRoutes>{withSuspense(<UsersManagement />)}</AdminRoutes>
            },
            {
                path: '*',
                Component: NotFound
            },
        ]
    },
    {
        path: '*',
        Component: NotFound
    },
]);