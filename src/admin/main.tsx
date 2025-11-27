import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tailwind.css'
import './i18n'
import { CategoryImageGallery } from './components/category-media/category-image-gallery'
import { CategoryImageUpload } from './components/category-media/category-image-upload'
import { CategoryMediaModal } from './components/category-media/category-media-modal'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { CategoryImage, UploadedFile } from './types'

const existingImages: CategoryImage[] = [
  { id: '1', url: 'https://picsum.photos/400/300?1', type: 'cover' },
  { id: '2', url: 'https://picsum.photos/400/300?2', type: 'detail' },
]

const uploadedFiles: UploadedFile[] = [
  { id: 'u1', url: 'https://picsum.photos/400/300?3' },
  { id: 'u2', url: 'https://picsum.photos/400/300?4' },
]

function App() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  return (
    <div className="container mx-auto p-6">
      <CategoryImageGallery
        existingImages={existingImages}
        uploadedFiles={uploadedFiles}
        currentThumbnailId={'1'}
        selectedImageIds={new Set(['2'])}
        imagesToDelete={new Set()}
        onToggleSelect={(id, up) => console.log('toggle', { id, uploaded: up })}
      />
      <div className="mt-8">
        <CategoryImageUpload
          fileInputRef={fileInputRef}
          isUploading={uploading}
          onFileSelect={(files) => {
            setUploading(true)
            console.log('selected files', files)
            setTimeout(() => setUploading(false), 500)
          }}
        />
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
const qc = new QueryClient()
root.render(
  <QueryClientProvider client={qc}>
    <App />
    <div className="mt-8">
      <CategoryMediaModal categoryId="cat_123" existingImages={existingImages} />
    </div>
  </QueryClientProvider>
)
