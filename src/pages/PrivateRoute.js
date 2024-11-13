import { Navigate, Outlet } from "react-router-dom";


// const checklog = window.sessionStorage.getItem("logStatus");        // session스토리지에서 logStatus값을 들고옴
const checklog = window.localStorage.getItem("logState");        // session스토리지에서 logStatus값을 들고옴

var isLogin = false;
if(checklog == 'Y'){
    isLogin = true;
}else{
    isLogin = false;
}

const PrivateRoute = () => {
    return isLogin ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;