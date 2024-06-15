const { runQuery } = require("../utils/connection");
var mysql = require("mysql");
const { onlyUnique } = require("../utils/helpers");

exports.identify = async (req, res, next) => {
  if (!req.body.email && !req.body.phoneNumber) {
    return res.status(400).json({
      message: "Either email or password is Required",
    });
  }
  //Finding Primary Contact related to payload data
  let primaryData = await runQuery(
    `
        WITH RECURSIVE parentsData AS (
            SELECT id, phoneNumber, email, linkedId, linkPrecedence FROM Contacts WHERE email = ? OR phoneNumber = ?
            UNION ALL
            SELECT c.id, c.phoneNumber, c.email, c.linkedId, c.linkPrecedence FROM parentsData p INNER JOIN Contacts c 
            WHERE c.id=p.linkedId
        )
        SELECT * FROM parentsData WHERE linkPrecedence="primary" GROUP By id
`,
    [req.body.email, req.body.phoneNumber]
  );

  //If Primary Contact Doesn't exists then create a Primary Contact with Payload Data
  if (req.body.email && req.body.phoneNumber && !primaryData.length) {
    const result = await runQuery(
      `
        INSERT INTO Contacts(phoneNumber,email,linkPrecedence) 
        VALUES(?,?,?)
    `,
      [req.body.phoneNumber, req.body.email, "primary"]
    );
    primaryData = await runQuery(
      `
        SELECT * FROM Contacts Where id = ?
    `,
      result.insertId
    );
  }

  const primary = primaryData[0];

  //Finding if Payload data contains some new contact
  const findResult = await runQuery(
    `
        SELECT * FROM Contacts where email = ? and phoneNumber = ?
    `,
    [req.body.email, req.body.phoneNumber]
  );
  if (req.body.email && req.body.phoneNumber && !findResult.length) {
    await runQuery(
      `
    INSERT INTO Contacts(email,phoneNumber,linkedId,linkPrecedence) VALUES(?,?,?,?)
`,
      [req.body.email, req.body.phoneNumber, primary.id, "secondary"]
    );
  }

  //If more than one primary contact exists than make other as secondary
  if (primaryData.length > 1) {
    const queries = primaryData.slice(1).reduce(function (query, curr) {
      return (
        query +
        mysql.format(
          `UPDATE Contacts SET linkPrecedence="secondary",linkedId=${primary.id} WHERE id = ?`,
          [curr.id]
        )
      );
    }, "");
    await runQuery(queries);
  }

  //Finding all secondary contacts
  const secondaryData = await runQuery(
    `
        WITH RECURSIVE secondarydata AS (
            SELECT id, phoneNumber, email, linkedId, linkPrecedence FROM Contacts WHERE id = ?
            UNION ALL
            SELECT c.id, c.phoneNumber, c.email, c.linkedId, c.linkPrecedence FROM secondarydata p INNER JOIN Contacts c 
            WHERE c.linkedId=p.id
        )
        SELECT * FROM secondarydata WHERE linkPrecedence="secondary"
`,
    [primary.id]
  );

  
  //Returning response
  return res.status(200).json({
    contact: {
      primaryContactId: primary.id,
      emails: onlyUnique(
        secondaryData
          .map(function (sc) {
            return sc.email;
          })
          .concat([primary.email])
      ),
      phoneNumbers: onlyUnique(
        secondaryData
          .map(function (sc) {
            return sc.phoneNumber;
          })
          .concat([primary.phoneNumber])
      ),
      secondaryContactIds: secondaryData.map(function (sc) {
        return sc.id;
      }),
    },
  });
};
