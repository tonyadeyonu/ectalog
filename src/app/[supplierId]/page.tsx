import SupplierClientPage from './client-page';

export default async function SupplierPage({ params }: { params: Promise<{ supplierId: string }> }) {
  const { supplierId } = await params;
  
  return <SupplierClientPage supplierId={supplierId} />;
}