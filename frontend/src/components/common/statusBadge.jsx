export default function StatusBadge({ status }) {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      rejected: 'bg-red-100 text-red-800',
      accepted: 'bg-green-100 text-green-800'
    }
  
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }