/** Practice exercises — imported by build-software-developer-sql.mjs */
export const exercises = [
  {
    id: "01-select-star",
    level: "Level 1",
    title: "SELECT all columns",
    concept: "SELECT returns rows from a table. * means all columns.",
    diagram: "select-flow",
    task: "Return every column from the Customers table.",
    starter: "SELECT ",
    solution:
      "SELECT * FROM Customers;",
    hint: "Use SELECT * FROM Customers;",
  },
  {
    id: "02-select-columns",
    level: "Level 1",
    title: "SELECT specific columns",
    concept: "List only the columns you need — clearer and faster.",
    diagram: "select-flow",
    task: "Show CustomerName, City, and Country for all customers.",
    starter: "SELECT CustomerName, ",
    solution:
      "SELECT CustomerName, City, Country FROM Customers;",
    hint: "SELECT column1, column2 FROM Customers;",
  },
  {
    id: "03-where",
    level: "Level 2",
    title: "WHERE filter",
    concept: "WHERE filters rows before they are returned.",
    diagram: "where-filter",
    task: "List ContactName and City for customers in Germany.",
    starter: "SELECT ContactName, City FROM Customers\nWHERE ",
    solution:
      "SELECT ContactName, City FROM Customers WHERE Country = 'Germany';",
  },
  {
    id: "04-like",
    level: "Level 2",
    title: "LIKE pattern",
    concept: "% matches any characters; use for partial name search.",
    diagram: "where-filter",
    task: "Find customers whose name contains the word Market (any case in name).",
    starter: "SELECT CustomerName FROM Customers WHERE CustomerName LIKE ",
    solution:
      "SELECT CustomerName FROM Customers WHERE CustomerName LIKE '%Market%';",
  },
  {
    id: "05-order-limit",
    level: "Level 3",
    title: "ORDER BY and LIMIT",
    concept: "ORDER BY sorts; LIMIT keeps first N rows (SQLite).",
    diagram: "select-flow",
    task: "Show CustomerName sorted A→Z; return only 5 rows.",
    starter: "SELECT CustomerName FROM Customers\nORDER BY CustomerName\n",
    solution:
      "SELECT CustomerName FROM Customers ORDER BY CustomerName LIMIT 5;",
  },
  {
    id: "06-distinct",
    level: "Level 4",
    title: "DISTINCT",
    concept: "DISTINCT removes duplicate values in the result.",
    diagram: "distinct",
    task: "List each Country once, sorted alphabetically.",
    starter: "SELECT DISTINCT ",
    solution: "SELECT DISTINCT Country FROM Customers ORDER BY Country;",
  },
  {
    id: "07-count",
    level: "Level 5",
    title: "COUNT aggregate",
    concept: "Aggregates collapse many rows into one summary value.",
    diagram: "aggregate",
    task: "How many customers are in the database?",
    starter: "SELECT COUNT(",
    solution: "SELECT COUNT(*) AS TotalCustomers FROM Customers;",
  },
  {
    id: "08-group-by",
    level: "Level 6",
    title: "GROUP BY order count",
    concept: "GROUP BY buckets rows; COUNT(*) per bucket.",
    diagram: "group-by",
    task: "For each CustomerID, show how many orders they placed. Sort by count descending.",
    starter: "SELECT CustomerID, COUNT(*) AS OrderCount\nFROM Orders\n",
    solution:
      "SELECT CustomerID, COUNT(*) AS OrderCount FROM Orders GROUP BY CustomerID ORDER BY OrderCount DESC;",
  },
  {
    id: "09-having",
    level: "Level 6",
    title: "HAVING",
    concept: "HAVING filters groups (after GROUP BY). WHERE filters rows.",
    diagram: "group-by",
    task: "Customer IDs that have more than 2 orders.",
    starter: "SELECT CustomerID, COUNT(*) AS Cnt FROM Orders\nGROUP BY CustomerID\n",
    solution:
      "SELECT CustomerID, COUNT(*) AS Cnt FROM Orders GROUP BY CustomerID HAVING COUNT(*) > 2;",
  },
  {
    id: "10-inner-join",
    level: "Level 7",
    title: "INNER JOIN",
    concept: "Returns only rows that match in both tables.",
    diagram: "join-inner",
    task: "Show CustomerName, OrderID, OrderDate for all orders (customer name + order info).",
    starter: "SELECT c.CustomerName, o.OrderID, o.OrderDate\nFROM Customers c\n",
    solution: `SELECT c.CustomerName, o.OrderID, o.OrderDate
FROM Customers c
INNER JOIN Orders o ON c.CustomerID = o.CustomerID
ORDER BY o.OrderDate;`,
  },
  {
    id: "11-left-join",
    level: "Level 8",
    title: "LEFT JOIN — no orders",
    concept: "LEFT JOIN keeps all customers; NULL order if none.",
    diagram: "join-left",
    task: "Customers who have zero orders (hint: OrderID IS NULL).",
    starter: "SELECT c.CustomerName\nFROM Customers c\nLEFT JOIN Orders o ON ",
    solution: `SELECT c.CustomerID, c.CustomerName
FROM Customers c
LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
WHERE o.OrderID IS NULL;`,
  },
  {
    id: "12-date-filter",
    level: "Level 13",
    title: "Filter by date",
    concept: "Compare ISO dates as strings or dates in SQLite.",
    diagram: "where-filter",
    task: "All orders in year 1998 (OrderDate >= 1998-01-01 and before 1999).",
    starter: "SELECT OrderID, OrderDate FROM Orders WHERE ",
    solution: `SELECT OrderID, CustomerID, OrderDate
FROM Orders
WHERE OrderDate >= '1998-01-01' AND OrderDate < '1999-01-01'
ORDER BY OrderDate;`,
  },
  {
    id: "13-case",
    level: "Level 12",
    title: "CASE expression",
    concept: "CASE creates conditional labels in the result.",
    diagram: "select-flow",
    task: "CustomerName, Country, and Region: 'Europe' for Germany/Sweden/Austria/Ireland, else 'Other'.",
    starter: "SELECT CustomerName, Country,\n  CASE ",
    solution: `SELECT CustomerName, Country,
  CASE
    WHEN Country IN ('Germany','Sweden','Austria','Ireland') THEN 'Europe'
    ELSE 'Other'
  END AS Region
FROM Customers;`,
  },
  {
    id: "14-subquery",
    level: "Level 10",
    title: "IN subquery",
    concept: "Subquery returns a list for IN (...).",
    diagram: "schema",
    task: "Customer names that have at least one order.",
    starter: "SELECT CustomerName FROM Customers WHERE CustomerID IN (",
    solution: `SELECT CustomerName FROM Customers
WHERE CustomerID IN (SELECT DISTINCT CustomerID FROM Orders);`,
  },
  {
    id: "15-cte",
    level: "Level 17",
    title: "CTE (WITH)",
    concept: "Named subquery for readable multi-step SQL.",
    diagram: "group-by",
    task: "Customer names with 3+ orders using a WITH OrderCounts AS (...) CTE.",
    starter: "WITH OrderCounts AS (\n  SELECT CustomerID, COUNT(*) AS Cnt\n  FROM Orders\n  GROUP BY CustomerID\n)\n",
    solution: `WITH OrderCounts AS (
  SELECT CustomerID, COUNT(*) AS Cnt FROM Orders GROUP BY CustomerID
)
SELECT c.CustomerName, oc.Cnt
FROM Customers c
JOIN OrderCounts oc ON c.CustomerID = oc.CustomerID
WHERE oc.Cnt >= 3
ORDER BY oc.Cnt DESC;`,
  },
  {
    id: "16-window",
    level: "Level 16",
    title: "ROW_NUMBER window",
    concept: "Window functions compute per-partition without collapsing rows.",
    diagram: "group-by",
    task: "Each order with ROW_NUMBER() per customer ordered by OrderDate.",
    starter: "SELECT OrderID, CustomerID, OrderDate,\n  ROW_NUMBER() OVER (",
    solution: `SELECT OrderID, CustomerID, OrderDate,
  ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY OrderDate) AS OrderSeq
FROM Orders;`,
  },

  // ── 15 most-asked interview coding questions ──
  {
    id: "int-01",
    level: "Interview",
    title: "Top 3 customers by order count",
    concept: "Classic ‘top N’ — GROUP BY + ORDER BY + LIMIT (or RANK in advanced interviews).",
    diagram: "group-by",
    task: "Return CustomerName and order count for the **top 3** customers with the most orders.",
    starter: "SELECT c.CustomerName, COUNT(*) AS OrderCount\nFROM Customers c\nJOIN Orders o ON ",
    solution: `SELECT c.CustomerName, COUNT(*) AS OrderCount
FROM Customers c
JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.CustomerName
ORDER BY OrderCount DESC
LIMIT 3;`,
    hint: "JOIN → GROUP BY customer → ORDER BY count DESC → LIMIT 3",
  },
  {
    id: "int-02",
    level: "Interview",
    title: "Customer with most orders",
    concept: "Often asked as ‘highest salary’ — here: max order count.",
    diagram: "aggregate",
    task: "Single row: customer name who placed the **maximum** number of orders.",
    starter: "SELECT c.CustomerName, COUNT(*) AS Cnt\nFROM Customers c\nJOIN Orders o ON c.CustomerID = o.CustomerID\nGROUP BY c.CustomerID, c.CustomerName\n",
    solution: `SELECT c.CustomerName, COUNT(*) AS Cnt
FROM Customers c
JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.CustomerName
ORDER BY Cnt DESC
LIMIT 1;`,
  },
  {
    id: "int-03",
    level: "Interview",
    title: "Customers with zero orders",
    concept: "Very common: LEFT JOIN + WHERE right side IS NULL.",
    diagram: "join-left",
    task: "List CustomerID and CustomerName for customers who **never** ordered.",
    starter: "SELECT c.CustomerID, c.CustomerName\nFROM Customers c\nLEFT JOIN Orders o ON ",
    solution: `SELECT c.CustomerID, c.CustomerName
FROM Customers c
LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
WHERE o.OrderID IS NULL;`,
  },
  {
    id: "int-04",
    level: "Interview",
    title: "Order count per country",
    concept: "JOIN parent attributes to child facts, then GROUP BY.",
    diagram: "join-inner",
    task: "Show **Country** and total **number of orders** from customers in that country (only countries with orders).",
    starter: "SELECT c.Country, COUNT(o.OrderID) AS TotalOrders\nFROM Customers c\n",
    solution: `SELECT c.Country, COUNT(o.OrderID) AS TotalOrders
FROM Customers c
JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.Country
ORDER BY TotalOrders DESC;`,
  },
  {
    id: "int-05",
    level: "Interview",
    title: "Employee with most orders handled",
    concept: "GROUP BY a foreign key column (EmployeeID).",
    diagram: "group-by",
    task: "Which **EmployeeID** processed the most orders? Return EmployeeID and order count.",
    starter: "SELECT EmployeeID, COUNT(*) AS Cnt FROM Orders\n",
    solution: `SELECT EmployeeID, COUNT(*) AS Cnt
FROM Orders
GROUP BY EmployeeID
ORDER BY Cnt DESC
LIMIT 1;`,
  },
  {
    id: "int-06",
    level: "Interview",
    title: "Second-highest order volume customer",
    concept: "‘2nd highest salary’ pattern: ORDER BY + LIMIT 1 OFFSET 1, or subquery.",
    diagram: "group-by",
    task: "Customer name with the **second-highest** number of orders (not the top one).",
    starter: "SELECT c.CustomerName, COUNT(*) AS Cnt\nFROM Customers c\nJOIN Orders o ON c.CustomerID = o.CustomerID\nGROUP BY c.CustomerID, c.CustomerName\nORDER BY Cnt DESC\n",
    solution: `SELECT c.CustomerName, COUNT(*) AS Cnt
FROM Customers c
JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.CustomerName
ORDER BY Cnt DESC
LIMIT 1 OFFSET 1;`,
    hint: "SQLite: LIMIT 1 OFFSET 1 after sorting by count DESC",
  },
  {
    id: "int-07",
    level: "Interview",
    title: "Latest order date per customer",
    concept: "MAX(OrderDate) with GROUP BY — classic reporting question.",
    diagram: "aggregate",
    task: "Each CustomerName with their **most recent** OrderDate (customers who have ordered).",
    starter: "SELECT c.CustomerName, MAX(o.OrderDate) AS LastOrder\nFROM Customers c\nJOIN Orders o ON ",
    solution: `SELECT c.CustomerName, MAX(o.OrderDate) AS LastOrder
FROM Customers c
JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.CustomerName
ORDER BY LastOrder DESC;`,
  },
  {
    id: "int-08",
    level: "Interview",
    title: "EXISTS vs IN",
    concept: "Interviewers ask difference — EXISTS often performs well for ‘has related rows’.",
    diagram: "schema",
    task: "Customer names that **have at least one order**, using `EXISTS` (not IN).",
    starter: "SELECT CustomerName FROM Customers c\nWHERE EXISTS (",
    solution: `SELECT CustomerName
FROM Customers c
WHERE EXISTS (
  SELECT 1 FROM Orders o WHERE o.CustomerID = c.CustomerID
);`,
  },
  {
    id: "int-09",
    level: "Interview",
    title: "Orders in year 1997 only",
    concept: "Date range filter on a hot column.",
    diagram: "where-filter",
    task: "Count how many orders were placed in **1997** (single number).",
    starter: "SELECT COUNT(*) FROM Orders WHERE ",
    solution: `SELECT COUNT(*) AS OrdersIn1997
FROM Orders
WHERE OrderDate >= '1997-01-01' AND OrderDate < '1998-01-01';`,
  },
  {
    id: "int-10",
    level: "Interview",
    title: "NULL handling (PostalCode)",
    concept: "IS NULL / COALESCE — data quality interviews.",
    diagram: "where-filter",
    task: "List CustomerName and City where **PostalCode IS NULL**.",
    starter: "SELECT CustomerName, City FROM Customers WHERE ",
    solution: `SELECT CustomerName, City
FROM Customers
WHERE PostalCode IS NULL;`,
  },
  {
    id: "int-11",
    level: "Interview",
    title: "Germany OR USA customers",
    concept: "OR + IN are interchangeable; know both.",
    diagram: "where-filter",
    task: "CustomerName and Country where country is **Germany or USA**.",
    starter: "SELECT CustomerName, Country FROM Customers WHERE ",
    solution: `SELECT CustomerName, Country
FROM Customers
WHERE Country IN ('Germany', 'USA');`,
  },
  {
    id: "int-12",
    level: "Interview",
    title: "HAVING average orders per group",
    concept: "Countries whose customers average > X orders — advanced HAVING.",
    diagram: "group-by",
    task: "Countries where the **average** orders per customer (who ordered) is **greater than 2**.",
    starter: "SELECT c.Country, AVG(o.cnt) AS AvgOrders\nFROM (\n  SELECT CustomerID, COUNT(*) AS cnt FROM Orders GROUP BY CustomerID\n) o\nJOIN Customers c ON ",
    solution: `SELECT c.Country, AVG(order_counts.cnt) AS AvgOrders
FROM (
  SELECT CustomerID, COUNT(*) AS cnt FROM Orders GROUP BY CustomerID
) order_counts
JOIN Customers c ON order_counts.CustomerID = c.CustomerID
GROUP BY c.Country
HAVING AVG(order_counts.cnt) > 2;`,
  },
  {
    id: "int-13",
    level: "Interview",
    title: "Orders per month (1998)",
    concept: "GROUP BY month — strftime in SQLite; DATE_TRUNC in PostgreSQL.",
    diagram: "group-by",
    task: "In **1998**, count orders **per month** (show month label and count).",
    starter: "SELECT strftime('%Y-%m', OrderDate) AS Month, COUNT(*) AS Cnt\nFROM Orders\nWHERE ",
    solution: `SELECT strftime('%Y-%m', OrderDate) AS Month, COUNT(*) AS Cnt
FROM Orders
WHERE OrderDate >= '1998-01-01' AND OrderDate < '1999-01-01'
GROUP BY strftime('%Y-%m', OrderDate)
ORDER BY Month;`,
  },
  {
    id: "int-14",
    level: "Interview",
    title: "Self-comparison: customers with 5+ orders",
    concept: "Filtering groups — ties to SDET data validation (heavy users).",
    diagram: "group-by",
    task: "CustomerName for customers with **5 or more** orders.",
    starter: "SELECT c.CustomerName, COUNT(*) AS Cnt\nFROM Customers c\nJOIN Orders o ON c.CustomerID = o.CustomerID\nGROUP BY c.CustomerID, c.CustomerName\nHAVING ",
    solution: `SELECT c.CustomerName, COUNT(*) AS Cnt
FROM Customers c
JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.CustomerName
HAVING COUNT(*) >= 5;`,
  },
  {
    id: "int-15",
    level: "Interview",
    title: "Percentage share by employee",
    concept: "Window SUM() OVER () for % of total — frequent analytics question.",
    diagram: "group-by",
    task: "For each EmployeeID: order count and **percentage** of all orders (round to 1 decimal).",
    starter: "SELECT EmployeeID, COUNT(*) AS Cnt,\n  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS Pct\nFROM Orders\n",
    solution: `SELECT EmployeeID,
  COUNT(*) AS Cnt,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS Pct
FROM Orders
GROUP BY EmployeeID
ORDER BY Cnt DESC;`,
    hint: "SUM(COUNT(*)) OVER () = grand total in SQLite with GROUP BY",
  },
];

export const diagramHtml = {
  schema: `
    <div class="viz schema-viz">
      <div class="entity customers">
        <strong>Customers</strong>
        <small>PK: CustomerID</small>
        <ul><li>CustomerName</li><li>City</li><li>Country …</li></ul>
      </div>
      <div class="rel">1 ──&lt; <em>many</em></div>
      <div class="entity orders">
        <strong>Orders</strong>
        <small>PK: OrderID · FK: CustomerID</small>
        <ul><li>OrderDate</li><li>EmployeeID …</li></ul>
      </div>
    </div>`,
  "select-flow": `
    <div class="viz pipeline">
      <div class="step">Table</div><span>→</span>
      <div class="step active">SELECT cols</div><span>→</span>
      <div class="step">WHERE (optional)</div><span>→</span>
      <div class="step">ORDER BY (optional)</div><span>→</span>
      <div class="step result">Result set</div>
    </div>`,
  "where-filter": `
    <div class="viz filter-viz">
      <div class="rows all"><span>Row</span><span>Row</span><span>Row</span><span>Row</span><span>Row</span></div>
      <p class="viz-label">All rows in table</p>
      <div class="arrow-down">WHERE Country = 'Germany'</div>
      <div class="rows filtered"><span class="keep">Row</span><span class="keep">Row</span></div>
      <p class="viz-label">Only matching rows returned</p>
    </div>`,
  distinct: `
    <div class="viz distinct-viz">
      <p>Germany, UK, Germany, Sweden → <strong>DISTINCT</strong> → Germany, UK, Sweden</p>
    </div>`,
  aggregate: `
    <div class="viz aggregate-viz">
      <div class="many">10 customer rows</div>
      <div class="arrow-down">COUNT(*)</div>
      <div class="one">1 row → 10</div>
    </div>`,
  "group-by": `
    <div class="viz group-viz">
      <div class="buckets">
        <div class="bucket"><em>Customer 1</em><br>■■■■■ 5 orders</div>
        <div class="bucket"><em>Customer 20</em><br>■■■■■■ 6 orders</div>
        <div class="bucket"><em>Customer 5</em><br>■■ 2 orders</div>
      </div>
      <p class="viz-label">GROUP BY CustomerID → one summary row per group</p>
    </div>`,
  "join-inner": `
    <div class="viz join-viz">
      <svg viewBox="0 0 320 120" width="100%" height="120" aria-label="Inner join">
        <circle cx="110" cy="60" r="50" fill="rgba(31,111,235,0.25)" stroke="#1f6feb" stroke-width="2"/>
        <circle cx="210" cy="60" r="50" fill="rgba(137,87,229,0.25)" stroke="#8957e5" stroke-width="2"/>
        <text x="75" y="65" font-size="12" fill="#333">Customers</text>
        <text x="175" y="65" font-size="12" fill="#333">Orders</text>
        <ellipse cx="160" cy="60" rx="28" ry="42" fill="rgba(35,134,54,0.45)" stroke="#238636"/>
        <text x="148" y="64" font-size="11" fill="#fff">match</text>
      </svg>
      <p class="viz-label">INNER JOIN = only rows that exist on <strong>both</strong> sides</p>
    </div>`,
  "join-left": `
    <div class="viz join-viz">
      <svg viewBox="0 0 320 120" width="100%" height="120" aria-label="Left join">
        <circle cx="110" cy="60" r="50" fill="rgba(31,111,235,0.35)" stroke="#1f6feb" stroke-width="2"/>
        <circle cx="210" cy="60" r="50" fill="rgba(137,87,229,0.15)" stroke="#8957e5" stroke-width="2"/>
        <text x="75" y="65" font-size="12" fill="#333">Customers</text>
        <text x="175" y="65" font-size="12" fill="#333">Orders</text>
        <path d="M 60 60 A 50 50 0 0 1 160 60 L 160 18 A 50 50 0 0 0 60 18 Z" fill="rgba(35,134,54,0.35)" stroke="#238636"/>
        <text x="95" y="64" font-size="10" fill="#333">all + matches</text>
      </svg>
      <p class="viz-label">LEFT JOIN = all customers + order cols (NULL if no order)</p>
    </div>`,
  "pk-fk": `
    <div class="viz schema-viz">
      <div class="entity customers">
        <strong>Customers</strong>
        <small>PK: CustomerID</small>
      </div>
      <div class="rel">PK ────&gt; FK</div>
      <div class="entity orders">
        <strong>Orders</strong>
        <small>FK: CustomerID → Customers</small>
      </div>
      <p class="viz-label" style="width:100%;text-align:center;">Referential integrity — no order for missing customer</p>
    </div>`,
  acid: `
    <div class="viz acid-viz" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:0.5rem;text-align:center;font-size:0.8rem;">
      <div style="background:#ddf4ff;padding:0.5rem;border-radius:8px;"><strong>A</strong>tomicity<br><small>All or nothing</small></div>
      <div style="background:#ddf4ff;padding:0.5rem;border-radius:8px;"><strong>C</strong>onsistency<br><small>Valid rules</small></div>
      <div style="background:#ddf4ff;padding:0.5rem;border-radius:8px;"><strong>I</strong>solation<br><small>No clash</small></div>
      <div style="background:#ddf4ff;padding:0.5rem;border-radius:8px;"><strong>D</strong>urability<br><small>Survives crash</small></div>
    </div>`,
};

/** Heading id in SQL Learn → diagram key (injected next to that section). */
export const learnLevelDiagrams = {
  schema: "schema",
  "level-1-basic-select": "select-flow",
  "level-2-where-filtering": "where-filter",
  "level-3-order-by-limit": "select-flow",
  "level-4-distinct": "distinct",
  "level-5-aggregates-single-result": "aggregate",
  "level-6-group-by-and-having": "group-by",
  "level-7-inner-join": "join-inner",
  "level-8-left-join-customers-with-zero-orders": "join-left",
};