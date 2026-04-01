import { ToastContainer } from 'react-toastify'
import './App.css'
import { AuthProvider } from './hooks/auth/context'
import Login from './views/login'

function App() {

    return (
        <AuthProvider>
            <ToastContainer />
            <Login />
        </AuthProvider>
    )
}

export default App
