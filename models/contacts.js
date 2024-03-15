const fs = require("fs/promises");
const { json } = require("express");
const path = require("path");
const shortid = require("shortid");
const mongoose = require('mongoose');



const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: String,
  phone: String,
  favorite: {
    type: Boolean,
    default: false,
  },
});


const Contact = mongoose.model('Contact', contactSchema);

// Conexión a la base de datos de MongoDB Atlas
mongoose.connect('mongodb+srv://mafediazca:IgD2aL8VDUwl9SHZ@cluster0.rnweazk.mongodb.net/Cluster0' , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Database connection successful'))
.catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});

// Funciones de consulta

// Obtener todos los contactos
const contactsPath = path.join(__dirname, "contacts.json");
const listContacts = async (req, res) => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);

    return contacts;
  } catch {
    console.error("Error getting contact  ", error);
    throw error;
  }
};

// Obtener un contacto por ID
const getContactById = async (contactId) => {
  try {
    // Decodificar la URL para manejar caracteres especiales
    contactId = decodeURIComponent(contactId);

    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const contactById = contacts.find((contact) => contact.id === contactId);

    return contactById;
  } catch {
    console.error("Error getting contact by ID: ", error);
    throw error;
  }
};

// Agregar un nuevo contacto
const addContact = async (body) => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);

    const newContact = {
      id: shortid.generate(),
      name: body.name,
      email: body.email,
      phone: body.phone,
    };

    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    console.log("The data was successfully added");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// Actualizar un contacto
const updateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);

    const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (contactIndex === -1) {
      console.log("Contact not found");
      return null;
    }

    const updatedContact = { ...contacts[contactIndex], ...body };
    contacts[contactIndex] = updatedContact;

    await fs.writeFile(contactsPath, JSON.stringify(contacts));

    console.log("Contact successfully updated", { id: contactId });
    return updatedContact;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Eliminar un contacto
const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const removedContact = contacts.find((contact) => contact.id === contactId);

    if (!removedContact) {
      console.log("Contact not found");
      return null;
    }

    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );

    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts));
    // console.log("Contact successfully removed", { id: contactId });

    return removedContact;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
