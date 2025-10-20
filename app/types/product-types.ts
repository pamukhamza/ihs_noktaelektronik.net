export type ProductIcon = {
  id: number;
  img: string;
  title: string;
};

export type Product = {
  id: number;
  name: {
    UrunAdiTR: string;
    UrunAdiEN: string;
  };
  stockCode: string;
  brand: string;
  categories: {
    id: number;
    parent_id: number | null;
    name: {
      KategoriAdiTR: string;
      KategoriAdiEN: string;
    };
    seo_link: string;
  }[];
  images: string[];
  icons: ProductIcon[];
  technicalSpecs: {
    BilgiTR: string;
    BilgiEN: string;
  };
  generalFeatures: {
    OzelliklerTR: string;
    OzelliklerEN: string;
  };
  applications: {
    UygulamalarTr: string;
    UygulamalarEn: string;
  };
  downloads: {
    name: string;
    items: {
      id: number;
      name: string;
      url: string;
      version?: string;
      type?: string;
      date?: string | null;
    }[];
  }[];
  similarProducts: {
    id: number;
    name: {
      UrunAdiTR: string;
      UrunAdiEN: string;
    };
    image: string | null;
    seo_link: string;
  }[];
  seo_link?: string;
  isNew: boolean;
  isActive: boolean;
  createdAt: string | null;
  modifiedAt: string | null;
}; 