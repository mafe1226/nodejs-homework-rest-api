const fs = require("fs/promises");
const { json } = require("express");
const path = require("path");
const shortid = require("shortid");
const mongoose = require('mongoose');

// Esquema del modelo de la colección contacts
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

// Modelo de Mongoose para la colección de contactos
const Contact = mongoose.model('Contact', contactSchema);

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Database connection successful');
})
.catch((error) => {
  console.error('Database connection error:', error);
  process.exit(1);
});

// Función para actualizar el estado del contacto
async function updateStatusContact(contactId, body) {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, { favorite: body.favorite }, { new: true });
    return updatedContact;
  } catch (error) {
    console.error('Error updating contact status:', error);
    throw error;
  }
}

// Exporta las operaciones CRUD sobre contactos
module.exports = {
  listContacts: async () => {
    try {
      const contacts = await Contact.find();
      return contacts;
    } catch (error) {
      console.error('Error listing contacts:', error);
      throw error;
    }
  },
  getContactById: async (contactId) => {
    try {
      const contact = await Contact.findById(contactId);
      return contact;
    } catch (error) {
      console.error('Error getting contact by ID:', error);
      throw error;
    }
  },
  addContact: async (contactData) => {
    try {
      const newContact = await Contact.create(contactData);
      return newContact;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  },
  removeContact: async (contactId) => {
    try {
      const removedContact = await Contact.findByIdAndRemove(contactId);
      return removedContact;
    } catch (error) {
      console.error('Error removing contact:', error);
      throw error;
    }
  },
  updateContact: async (contactId, contactData) => {
    try {
      const updatedContact = await Contact.findByIdAndUpdate(contactId, contactData, { new: true });
      return updatedContact;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },
  updateStatusContact: updateStatusContact,
};