import { Plus } from 'phosphor-react'
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
        <div className="listing-page">
            <div className="listing-container">
                <div className="listing-heading">
                    <div><p className="page-eyebrow">Gestão legislativa</p><h1 className="page-title">Partidos Políticos</h1><p className="page-description">Organize os partidos e suas representações na Câmara.</p></div>
                    <Button
                        icon={<Plus size={18} weight="bold" />}
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

                <div className="data-card">
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
