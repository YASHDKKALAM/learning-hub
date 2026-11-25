-- Customers & Orders (subset for practice — extend with full export if needed)
-- SQLite-compatible

CREATE TABLE IF NOT EXISTS Customers (
    CustomerID    INTEGER PRIMARY KEY,
    CustomerName  TEXT NOT NULL,
    ContactName   TEXT,
    Address       TEXT,
    City          TEXT,
    PostalCode    TEXT,
    Country       TEXT
);

CREATE TABLE IF NOT EXISTS Orders (
    OrderID      INTEGER PRIMARY KEY,
    CustomerID   INTEGER NOT NULL,
    EmployeeID   INTEGER,
    OrderDate    TEXT,
    ShipperID    INTEGER,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

INSERT INTO Customers VALUES
(1,'Alfreds Futterkiste','Maria Anders','Obere Str. 57','Berlin','12209','Germany'),
(2,'Ana Trujillo Emparedados y helados','Ana Trujillo','Avda. de la Constitución 2222','México D.F.','05021','Mexico'),
(4,'Around the Horn','Thomas Hardy','120 Hanover Sq.','London','WA1 1DP','UK'),
(5,'Berglunds snabbköp','Christina Berglund','Berguvsvägen 8','Luleå','S-958 22','Sweden'),
(10,'Bottom-Dollar Marketse','Elizabeth Lincoln','23 Tsawassen Blvd.','Tsawassen','T2F 8M4','Canada'),
(20,'Ernst Handel','Roland Mendel','Kirchgasse 6','Graz','8010','Austria'),
(24,'Folk och fä HB','Maria Larsson','Åkergatan 24','Bräcke','S-844 67','Sweden'),
(32,'Great Lakes Food Market','Howard Snyder','2732 Baker Blvd.','Eugene','97403','USA'),
(37,'Hungry Owl All-Night Grocers','Patricia McKenna','8 Johnstown Road','Cork',NULL,'Ireland'),
(45,'Let''s Stop N Shop','Jaime Yorres','87 Polk St. Suite 5','San Francisco','94117','USA');

INSERT INTO Orders VALUES
(10643,1,6,'1997-08-25',1),
(10692,1,4,'1997-10-03',2),
(10702,1,4,'1997-10-13',1),
(10835,1,1,'1998-01-15',3),
(10952,1,1,'1998-03-16',1),
(10308,2,7,'1996-09-18',3),
(10625,2,3,'1997-08-08',1),
(10355,4,6,'1996-11-15',1),
(10453,4,1,'1997-02-21',2),
(10278,5,8,'1996-08-12',2),
(10654,5,5,'1997-09-02',1),
(10258,20,1,'1996-07-17',1),
(10351,20,1,'1996-11-11',1),
(10402,20,8,'1997-01-02',2),
(10795,20,8,'1997-12-24',2),
(11072,20,4,'1998-05-05',2),
(10264,24,6,'1996-07-24',3),
(10880,24,7,'1998-02-10',1),
(11050,24,8,'1998-04-27',2);