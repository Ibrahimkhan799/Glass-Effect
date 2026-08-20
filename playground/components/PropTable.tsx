export function PropTable({
  columns = ["Prop", "Type", "Default", "Description"],
  rows,
}: {
  columns?: string[];
  rows: string[][];
}) {
  return (
    <div className="prop-table-wrap">
      <table className="prop-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) => (
                <td key={`${row[0]}-${index}`}>
                  {index < row.length - 1 ? <code>{cell}</code> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
