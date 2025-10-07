const mercadopago = require('mercadopago');
require('dotenv').config();

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const createPreference = async (req, res) => {
  try {
    const items = req.body.items;

    const preference = {
      items: items.map(p => ({
        title: p.title,
        quantity: p.quantity,
        currency_id: 'COP',
        unit_price: p.unit_price
      })),
      back_urls: {
        success: 'http://localhost:3000/success',
        failure: 'http://localhost:3000/failure',
        pending: 'http://localhost:3000/pending'
      },
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error('Error al crear la preferencia:', error);
    res.status(500).json({ error: 'Error al crear la preferencia' });
  }
};


module.exports= createPreference