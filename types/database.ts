export interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string;
  button_url: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type ProductUpdate = Partial<Omit<Product, 'id' | 'created_at'>>;

export type AdminUserUpdate = {
  email?: string;
  password_hash?: string;
  created_at?: string;
};

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: ProductInsert & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: ProductUpdate;
      };
      admin_users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: AdminUserUpdate;
      };
    };
  };
}
