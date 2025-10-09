// controller.orden.js
const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN, 
});

const nuevaOrden = async (req, res) => {
    console.log("Datos recibidos en el backend:", req.body);
  try {
    const items  = req.body.items;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No se recibieron productos.' });
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items,
        back_urls: {
          success: "http://localhost:3000/success",
          failure: "http://localhost:3000/failure",
          pending: "http://localhost:3000/pending",
        },
        auto_return: "approved",
      },
    });

    // Devolver la URL al frontend
    return res.json({ init_point: result.init_point });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: 'Error al crear la preferencia.' });
  }
};

module.exports = nuevaOrden;
