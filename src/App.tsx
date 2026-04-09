import { ToastContainer } from 'react-toastify'
import './App.css'
import { AuthProvider } from './hooks/auth/context'
import { RouterProvider } from 'react-router'
import { router } from './routes'

function App() {

    return (
        <AuthProvider>
            <ToastContainer />
            <RouterProvider router={router} />
        </AuthProvider>
    )
}

export default App
