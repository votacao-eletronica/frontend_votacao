import { NavLink, Outlet, useLocation } from 'react-router'
import { Users, Flag, Lightbulb, Clock, SignOut, House, ClockCounterClockwise, Buildings } from 'phosphor-react'
import { useAuth } from '../../hooks/auth/context'

export function Layout() {
    const { logout, user } = useAuth()
    const isCouncilMember = user?.roles.some(role => role.name === 'vereador') ?? false
    const isAdmin = user?.roles.some(role => role.name === 'admin') ?? false
    const location = useLocation()
    const isVotingRoom = location.pathname.startsWith('/council/sessions/')

    if (isVotingRoom) {
        return <Outlet />
    }
    return (
        <div className="flex h-screen bg-gray-50">
            <div className="w-64 bg-white shadow-lg">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center h-16 bg-blue-600">
                        <h1 className="text-white text-xl font-bold">Votação Eletrônica</h1>
                    </div>
                    <nav className="flex-1 px-4 py-6">
                        <ul className="space-y-2">
                            {isCouncilMember && (
                            <>
                            <li>
                                <NavLink end to="/council" className={({ isActive }) => `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                                    <House className="mr-3 h-5 w-5" />
                                    Sessões abertas
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/council/history" className={({ isActive }) => `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                                    <ClockCounterClockwise className="mr-3 h-5 w-5" /> Histórico de sessões
                                </NavLink>
                            </li>
                            </>
                            )}
                            {!isCouncilMember && (<>
                            {isAdmin && <li><NavLink to="/chamber" className={({ isActive }) => `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}><Buildings className="mr-3 h-5 w-5" />Dados da Câmara</NavLink></li>}
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
                            <li>
                                <NavLink
                                    to="/proposals"
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                            isActive
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <Lightbulb className="mr-3 h-5 w-5" />
                                    Propostas
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/sessions"
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                            isActive
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <Clock className="mr-3 h-5 w-5" />
                                    Sessões
                                </NavLink>
                            </li>
                            </>)}
                        </ul>
                    </nav>
                    <div className="px-4 py-4 border-t border-gray-200">
                        <button
                            onClick={logout}
                            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-900 transition-colors"
                        >
                            <SignOut className="mr-2 h-5 w-5" />
                            Sair
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    )
}
