import React, { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { defineRouteConfig } from "../config"
import { Heading } from "../../components/ui/heading"
import { Button } from "../../components/ui/button"
import { CommandBar } from "../../components/ui/command-bar"
import { toast } from "../../utils/toast"
import { sdk } from "../../lib/sdk"

type Review = {
  id: string
  title?: string
  content: string
  rating: number
  product_id: string
  customer_id?: string
  status: "pending" | "approved" | "rejected"
  created_at: Date
  updated_at: Date
  product?: { title?: string }
}

function StatusPill({ status }: { status: Review["status"] }) {
  const color = status === "approved" ? "badge-success" : status === "rejected" ? "badge-error" : "badge-neutral"
  return <span className={`badge ${color}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
}

const limit = 15

const ReviewsPage = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const offset = useMemo(() => pageIndex * limit, [pageIndex])
  const { data, isLoading, refetch } = useQuery<{ reviews: Review[]; count: number; limit: number; offset: number }>({
    queryKey: ["reviews", offset, limit],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset), order: "-created_at" }).toString()
      const res = await sdk.client.fetch(`/admin/reviews?${params}`)
      return res.data
    },
  })

  const total = data?.count || 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  const countSelected = Object.values(selected).filter(Boolean).length
  const toggleRow = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }))
  const approveSelected = async () => {
    const ids = Object.keys(selected).filter((k) => selected[k])
    try {
      await sdk.client.fetch(`/admin/reviews/status`, { method: "POST", body: { ids, status: "approved" } })
      toast.success("Reviews approved")
      setSelected({})
      refetch()
    } catch {
      toast.error("Failed to approve reviews")
    }
  }
  const rejectSelected = async () => {
    const ids = Object.keys(selected).filter((k) => selected[k])
    try {
      await sdk.client.fetch(`/admin/reviews/status`, { method: "POST", body: { ids, status: "rejected" } })
      toast.success("Reviews rejected")
      setSelected({})
      refetch()
    } catch {
      toast.error("Failed to reject reviews")
    }
  }

  return (
    <div className="p-4">
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <Heading>Reviews</Heading>
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Title</th>
              <th>Rating</th>
              <th>Content</th>
              <th>Status</th>
              <th>Product</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="text-center p-6">Loading...</td>
              </tr>
            )}
            {!isLoading && (data?.reviews || []).map((r) => (
              <tr key={r.id}>
                <td>
                  <input type="checkbox" className="checkbox" checked={!!selected[r.id]} onChange={() => toggleRow(r.id)} />
                </td>
                <td className="font-mono text-sm">{r.id}</td>
                <td>{r.title}</td>
                <td>{r.rating}</td>
                <td className="max-w-[360px] truncate" title={r.content}>{r.content}</td>
                <td><StatusPill status={r.status} /></td>
                <td>{r.product?.title}</td>
              </tr>
            ))}
            {!isLoading && (data?.reviews || []).length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-6 text-base-content/70">No reviews found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-base-content/70">Page {pageIndex + 1} of {totalPages}</div>
        <div className="flex gap-2">
          <Button size="small" variant="secondary" onClick={() => setPageIndex((p) => Math.max(0, p - 1))} disabled={pageIndex === 0}>Prev</Button>
          <Button size="small" onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))} disabled={pageIndex >= totalPages - 1}>Next</Button>
        </div>
      </div>

      <CommandBar open={countSelected > 0}>
        <CommandBar.Bar>
          <CommandBar.Value>{countSelected} selected</CommandBar.Value>
          <CommandBar.Seperator />
          <CommandBar.Command action={approveSelected} label="Approve" />
          <CommandBar.Seperator />
          <CommandBar.Command action={rejectSelected} label="Reject" />
        </CommandBar.Bar>
      </CommandBar>
    </div>
  )
}

export const config = defineRouteConfig({ label: "Reviews", icon: "ChatBubbleLeftRight", path: "/reviews" })

export default ReviewsPage
