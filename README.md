# eCatalog - Ingredient Supplier Showcase

A public tool for ingredient suppliers to showcase their products. This Next.js application allows suppliers to upload and manage their product catalog through a clean, interactive interface.

## Features

- Load product data from Supabase (gold copy of the catalog)
- Upload a CSV file to update the catalog
- View products in a searchable, filterable interactive table
- Edit product information in the session (client-side only)
- Reset to the gold copy at any time
- Export the current view as a styled PDF
- No authentication required - public access

## Technology Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Static typing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Supabase](https://supabase.io/) - Backend data source
- [PapaParse](https://www.papaparse.com/) - CSV parsing
- [React Data Grid](https://adazzle.github.io/react-data-grid/) - Interactive data table
- [jsPDF](https://github.com/MrRio/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/) - PDF export

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ectalog.git
   cd ectalog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy the `.env.example` file to `.env.local`
   - Update the Supabase credentials with your own

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project can be easily deployed to Vercel:

```bash
npm install -g vercel
vercel
```

## Database Schema

The application expects a `products` table in Supabase with the following schema:

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  supplier TEXT,
  price DECIMAL(10,2),
  unit TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## CSV Format

When uploading a CSV file, ensure it has the following columns:

- `id` (optional, will be generated if not provided)
- `name` (required)
- `description`
- `category`
- `supplier`
- `price`
- `unit`
- `available` (true/false)

## License

MIT