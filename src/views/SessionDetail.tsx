import { useNavigate, useParams } from 'react-router'
import { useSession } from '../hooks/sessions/useSession'
import { Button } from '../components/form/button'

export function SessionDetail() {
    const { id } = useParams<{ id: string }>()
    const sessionId = id ? parseInt(id) : undefined
    const navigate = useNavigate()
    const { closingSession, deletingSession, error, handleCloseSession, handleDeleteSession, handleOpenSession, loading, openingSession, session} = useSession(sessionId)

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Carregando detalhes da sessão...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                <p className="text-sm font-medium">Erro: {error}</p>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Sessão não encontrada</p>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    return (
        <div className="h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{session.title}</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalhes da Sessão</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Data</p>
                            <p className="text-lg text-gray-900">{formatDate(session.date)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            <p className="text-lg text-gray-900">{session.status}</p>
                        </div>
                        <div className="md:col-span-2">
                            <div className="flex gap-4">
                                {session.status.toLowerCase() === 'agendada' && (
                                    <Button
                                        text={openingSession ? 'Abrindo...' : 'Abrir Sessão'}
                                        isLoading={openingSession}
                                        onClick={handleOpenSession}
                                        variant="primary"
                                    />
                                )}
                                {session.status.toLowerCase() === 'aberta' && (
                                    <>
                                        <Button
                                            text="Painel de votação"
                                            onClick={() => window.open(`/sessions/${session.id}/presentation`, '_blank')}
                                            variant="primary"
                                        />
                                        <Button
                                            text={closingSession ? 'Finalizando...' : 'Finalizar Sessão'}
                                            isLoading={closingSession}
                                            onClick={handleCloseSession}
                                            variant="primary"
                                        />
                                    </>
                                )}
                                {session.status.toLowerCase() === 'fechada' && (
                                    <Button text="Ver histórico" onClick={() => navigate(`/sessions/${session.id}/history`)} variant="primary" />
                                )}
                                <Button
                                    text={deletingSession ? 'Excluindo...' : 'Excluir Sessão'}
                                    isLoading={deletingSession}
                                    disabled={deletingSession || !session.closed_at || !session.canceled_at || !session.opened_at}
                                    onClick={() => {
                                        if (window.confirm('Tem certeza que deseja excluir esta sessão? Esta ação não pode ser desfeita.')) {
                                            handleDeleteSession()
                                        }
                                    }}
                                    variant="danger"
                                />
                            </div>
                        </div>
                        {session.opened_at && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Aberto em</p>
                                <p className="text-lg text-gray-900">{formatDate(session.opened_at)}</p>
                            </div>
                        )}
                        {session.closed_at && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Fechado em</p>
                                <p className="text-lg text-gray-900">{formatDate(session.closed_at)}</p>
                            </div>
                        )}
                        {session.canceled_at && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Cancelado em</p>
                                <p className="text-lg text-gray-900">{formatDate(session.canceled_at)}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Propostas</h2>
                    {session.propositions && session.propositions.length > 0 ? (
                        <div className="space-y-4">
                            {session.propositions.map((proposal) => (
                                <div key={proposal.id} className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-900">{proposal.title}</h3>
                                    <p className="text-sm text-gray-600 mt-2">{proposal.description}</p>
                                    <div className="mt-2 text-sm text-gray-500">
                                        Status: {proposal.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Nenhuma proposta encontrada para esta sessão.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
