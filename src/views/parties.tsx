import { useState } from 'react'
import { useParties } from '../hooks/parties/useParties'
import { PoliticalPartyTable } from '../components/parties/PoliticalPartyTable'
import { CreatePartyModal } from '../components/parties/CreatePartyModal'
import { Button } from '../components/form/button'
import { Pagination } from '../components/ui/Pagination'

export function Parties() {
    const { parties, loading, error, refetch, pagination, setPage } = useParties()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    return (
        <div className="h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Partidos Políticos</h1>
                    <Button
                        text="Criar Partido"
                        variant="primary"
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                    />
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                        <p className="text-sm font-medium">Erro ao carregar partidos políticos: {error}</p>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow">
                    <PoliticalPartyTable parties={parties} loading={loading} />
                    <Pagination meta={pagination} loading={loading} onPageChange={setPage} />
                </div>
            </div>

            <CreatePartyModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={refetch}
            />
        </div>
    )
}
