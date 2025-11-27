import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { defineRouteConfig } from '../config'
import { Heading } from '../../components/ui/heading'
import { Button } from '../../components/ui/button'
import { sdk } from '../../lib/sdk'

type Brand = { id: string; name: string }
type BrandsResponse = { brands: Brand[]; count: number; limit: number; offset: number }

const limit = 15

const BrandsPage = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const offset = useMemo(() => pageIndex * limit, [pageIndex])

  const { data, isLoading } = useQuery<BrandsResponse>({
    queryKey: ['brands', limit, offset],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) }).toString()
      const res = await sdk.client.fetch(`/admin/brands?${params}`)
      return res.data as BrandsResponse
    },
  })

  const total = data?.count || 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="divide-y p-0">
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center p-4">
        <Heading>Brands</Heading>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={2} className="text-center p-6">
                    Loading...
                  </td>
                </tr>
              )}
              {!isLoading && (data?.brands || []).map((b) => (
                <tr key={b.id}>
                  <td className="font-mono text-sm">{b.id}</td>
                  <td>{b.name}</td>
                </tr>
              ))}
              {!isLoading && (data?.brands || []).length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center p-6 text-base-content/70">
                    No brands found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-base-content/70">
            Page {pageIndex + 1} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button size="small" variant="secondary" onClick={() => setPageIndex((p) => Math.max(0, p - 1))} disabled={pageIndex === 0}>
              Prev
            </Button>
            <Button
              size="small"
              onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
              disabled={pageIndex >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({ label: 'Brands', icon: 'TagSolid', path: '/brands' })

export default BrandsPage
