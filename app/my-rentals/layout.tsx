import Sidebar from '../components/Sidebar'

export default function RentalsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  )
} 