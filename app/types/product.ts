export interface Product {
  id: number;
  name: {
    UrunAdiTR: string;
    UrunAdiEN: string;
  };
  stockCode: string;
  brand: string;
  categories: {
    id: number;
    name: {
      KategoriAdiTR: string;
      KategoriAdiEN: string;
    };
    seo_link: string;
  }[];
  images: string[];
  generalFeatures: {
    OzelliklerTR: string;
    OzelliklerEN: string;
  };
  technicalSpecs: {
    BilgiTR: string;
    BilgiEN: string;
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
}