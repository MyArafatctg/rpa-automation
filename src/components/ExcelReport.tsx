interface Props {
  data: RowsData[];
}

export interface RowsData {
  DELIVERY_DETAILS_ID: number;
  DELIVERY_ID: number;
  ARTICLE_NUMBER: string;
  DISTRIBUTION_PACK_MODE: string;
  ARTICLE_DELIVERIES_QUANTITY: number;
  NO_OF_ASSORTMENTS: number;
  VAR_SIZECODE?: string;
  VAR_QUANTITY?: number;
  PACK_SIZECODE?: string;
  PACK_ASSORTMENT_QTY?: number;
  PACK_SOLID_QTY?: number;
}

const Report = ({ data }: Props) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-teal-600 mb-4">
        Delivery Report
      </h2>
      <div className="overflow-x-auto shadow rounded-2xl border border-gray-200">
        <table className="min-w-full text-sm text-gray-600">
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="px-4 py-2 font-semibold text-left">
                DELIVERY_DETAILS_ID
              </th>
              <th className="px-4 py-2 font-semibold text-left">DELIVERY_ID</th>
              <th className="px-4 py-2 font-semibold text-left">
                ARTICLE_NUMBER
              </th>
              <th className="px-4 py-2 font-semibold text-left">
                DISTRIBUTION_PACK_MODE
              </th>
              <th className="px-4 py-2 font-semibold text-left">
                ARTICLE_DELIVERIES_QUANTITY
              </th>
              <th className="px-4 py-2 font-semibold text-left">
                NO_OF_ASSORTMENTS
              </th>
              <th className="px-4 py-2 font-semibold text-left">
                VAR_SIZECODE
              </th>
              <th className="px-4 py-2 font-semibold text-left">
                VAR_QUANTITY
              </th>
              <th className="px-4 py-2 font-semibold text-left">
                PACK_SIZECODE
              </th>
              <th className="px-4 py-2 font-semibold text-left">
                PACK_ASSORTMENT_QTY
              </th>
              <th className="px-4 py-2 font-semibold text-left">
                PACK_SOLID_QTY
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              return (
                <tr className="border-b hover:bg-gray-100 transition">
                  <th>{row.DELIVERY_DETAILS_ID}</th>
                  <th>{row.DELIVERY_ID}</th>
                  <th>{row.ARTICLE_NUMBER}</th>
                  <th>{row.DISTRIBUTION_PACK_MODE}</th>
                  <th>{row.ARTICLE_DELIVERIES_QUANTITY}</th>
                  <th>{row.NO_OF_ASSORTMENTS}</th>
                  <th>{row.VAR_SIZECODE}</th>
                  <th>{row.VAR_QUANTITY}</th>
                  <th>{row.PACK_SIZECODE}</th>
                  <th>{row.PACK_ASSORTMENT_QTY}</th>
                  <th>{row.PACK_SOLID_QTY}</th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
