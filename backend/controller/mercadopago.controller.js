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
          success: "https://jesska-app.onrender.com/success",
          failure: "https://jesska-app.onrender.com/failure",
          pending: "https://jesska-app.onrender.com/pending",
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
