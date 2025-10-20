export type Download = {
  id: number
  name: string
  url: string
  version?: string
  type?: string
  date?: string | null
}

export type DownloadCategory = {
  name: string
  items: Download[]
}

export type Product = {
  categories: {
    id: number
    parent_id: number | null
    name: {
      KategoriAdiTR: string
      KategoriAdiEN: string
    }
    seo_link: string
  }[]
  id: number
  name: {
    UrunAdiTR: string
    UrunAdiEN: string
  }
  seo_link: string
  stockCode: string
  brand: string
  images: string[]
  generalFeatures: {
    OzelliklerTR: string
    OzelliklerEN: string
  }
  technicalSpecs: {
    BilgiTR: string
    BilgiEN: string
  }
  applications: {
    UygulamalarTr: string
    UygulamalarEn: string
  }
  downloads: DownloadCategory[]
  similarProducts: {
    id: number
    name: {
      UrunAdiTR: string
      UrunAdiEN: string
    }
    image: string
    seo_link: string
  }[]
  isNew: boolean
  isActive: boolean
  createdAt: string | null
  modifiedAt: string | null
}
