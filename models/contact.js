const createContactsTable = `
CREATE TABLE IF NOT EXISTS Contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phoneNumber VARCHAR(255),
  email VARCHAR(255),
  linkedId INT,
  linkPrecedence VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
)
`;

module.exports = {
  createContactsTable
};