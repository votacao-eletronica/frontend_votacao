import { NavLink, Outlet } from 'react-router'
import { Users, Flag } from 'phosphor-react'

export function Layout() {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center h-16 bg-blue-600">
                        <h1 className="text-white text-xl font-bold">Votação Eletrônica</h1>
                    </div>
                    <nav className="flex-1 px-4 py-6">
                        <ul className="space-y-2">
                            <li>
                                <NavLink
                                    to="/users"
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                            isActive
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <Users className="mr-3 h-5 w-5" />
                                    Usuários
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/parties"
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                            isActive
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <Flag className="mr-3 h-5 w-5" />
                                    Partidos Políticos
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    )
}