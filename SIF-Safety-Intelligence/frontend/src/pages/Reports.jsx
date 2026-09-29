import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import ReportFilters from '../components/reports/ReportFilters'
import ReportTable from '../components/reports/ReportTable'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import { useReports } from '../hooks/useReports'

export default function Reports() {
  const [filters, setFilters] = useState({})
  const { reports, loading, error, refetch } = useReports(filters)

  return (
    <div>
      <PageHeader title="Reports" subtitle="Full repository of submitted safety reports" />
      <ReportFilters filters={filters} onChange={setFilters} />
      {loading ? <Loader /> : error ? <ErrorMessage message={error} onRetry={refetch} /> : <ReportTable reports={reports} />}
    </div>
  )
}
