import 'antd/dist/reset.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Items from './pages/Items';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import Bills from './pages/Bills';
import Cashiers from './pages/Cashiers';
import Orders from './pages/Orders';

function App() {

  return (
    <div className="App">

      <BrowserRouter>

        <Routes>

          <Route path='/home' element={ <ProtectedRoute><IsAdmin><Homepage /></IsAdmin></ProtectedRoute>} />
          <Route path='/Items' element={<ProtectedRoute><IsAdmin> <Items /> </IsAdmin></ProtectedRoute>} />
          <Route path='/cart' element={<ProtectedRoute> <CartPage /> </ProtectedRoute>} />
          <Route path='/bills' element={<ProtectedRoute> <Bills /> </ProtectedRoute>} />
          <Route path='/orders' element={<ProtectedRoute> <Orders />  </ProtectedRoute>} />
          <Route path='/cashiers' element={<ProtectedRoute><IsAdmin> <Cashiers /></IsAdmin> </ProtectedRoute>} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Login />} />


        </Routes>

      </BrowserRouter>






    </div>
  );
}

export default App;


export function ProtectedRoute({children}){

  if(localStorage.getItem('pos-user'))
  {
    return children
  }
  else{
    return <Navigate to='/login' />
  }

}

export function IsAdmin({children}){

  if(JSON.parse(localStorage.getItem('pos-user')).isAdmin === true)
  {
    return children
  }
  else{
        return <Navigate to='/orders' />
      }
}