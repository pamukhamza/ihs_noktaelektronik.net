export interface Product {
  id: number;
  name: string;
  stockCode: string;
  brand: string;
  images: string[];
  generalFeatures: string[];
  technicalSpecs: never[];
  applications: string[];
  downloads: { name: string; url: string; }[];
  similarProducts: {
    id: number;
    name: string;
    image: string;
  }[];
  isNew: boolean;
  isActive: boolean;
  createdAt: Date | null;
  modifiedAt: Date | null;
}