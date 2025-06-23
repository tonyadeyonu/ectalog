import SupplierClientPage from './client-page';

export default async function SupplierPage({ params }: { params: { supplierId: string } }) {
  // In Next.js 13+ App Router, params are already resolved and don't need to be awaited
  // But we need to mark the component as async to satisfy the error
  const { supplierId } = params;
  
  return <SupplierClientPage supplierId={supplierId} />;
}