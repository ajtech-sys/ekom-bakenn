import { RefObject } from 'react'
import { ArrowDownTray } from '../ui/arrow-down-tray'
import { useTranslation } from 'react-i18next'

type CategoryImageUploadProps = {
  fileInputRef: RefObject<HTMLInputElement>
  isUploading: boolean
  onFileSelect: (files: FileList | null) => void
}

export const CategoryImageUpload = ({ fileInputRef, isUploading, onFileSelect }: CategoryImageUploadProps) => {
  const { t } = useTranslation('common')
  return (
    <div className="bg-base-100 overflow-auto border-b border-base-300 px-6 py-4 lg:border-b-0 lg:border-l">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-1">
              <label className="font-semibold text-sm">{t('media.label')}</label>
              <p className="text-sm text-base-content/60">{t('media.optional')}</p>
            </div>
            <span className="text-sm text-base-content/70">{t('media.helper')}</span>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/svg+xml"
              onChange={(e) => onFileSelect(e.target.files)}
              hidden
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-base-200 border-base-300 transition-opacity group flex w-full flex-col items-center gap-y-2 rounded-lg border border-dashed p-8 hover:border-primary focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!isUploading) {
                  onFileSelect(e.dataTransfer.files)
                }
              }}
            >
              <div className="text-base-content/70 group-disabled:text-base-content/40 flex items-center gap-x-2">
                <ArrowDownTray />
                <p className="text-base">{isUploading ? t('upload.uploading') : t('upload.button')}</p>
              </div>
              <p className="text-sm text-base-content/60 group-disabled:text-base-content/40">{t('upload.hint')}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
