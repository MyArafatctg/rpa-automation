const tableHeaders: string[] = [
  "SL",
  "P.Name",
  "@Rate",
  "T.P.",
  "Succeed",
  "Failed",
  "Cost",
  "T.Cons(S)",
  "T.Save(S)",
];
const TableHeader = () => {
  return (
    <thead className="text-xs uppercase text-gray-500 bg-gray-50 border-b border-gray-200">
      <tr>
        {tableHeaders.map((header, index) => (
          <th
            key={header}
            scope="col"
            className={`py-3 px-3 font-semibold ${
              index === 1 ? "text-left" : "text-center"
            }`}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
