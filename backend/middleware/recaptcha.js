const axios = require('axios');

/**
 * Middleware para validar reCAPTCHA v2
 */
const verifyRecaptcha = async (req, res, next) => {
    try {
        const { 'g-recaptcha-response': recaptchaToken } = req.body;
        
        console.log('reCAPTCHA token received:', recaptchaToken ? 'Yes' : 'No');
        
        // Verificar si se proporcionó el token de reCAPTCHA
        if (!recaptchaToken) {
            return res.status(400).json({
                success: false,
                message: 'Por favor, completa la verificación de reCAPTCHA',
                field: 'recaptcha'
            });
        }

        // Configurar la solicitud de verificación a Google
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            console.error('RECAPTCHA_SECRET_KEY no está configurada');
            return res.status(500).json({
                success: false,
                message: 'Error de configuración del servidor',
                field: 'general'
            });
        }

        const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';
        
        const params = new URLSearchParams();
        params.append('secret', secretKey);
        params.append('response', recaptchaToken);
        params.append('remoteip', req.ip || req.connection.remoteAddress);

        console.log('Verificando reCAPTCHA con Google...');

        // Hacer la solicitud a Google para verificar el reCAPTCHA
        const response = await axios.post(verificationURL, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { success, 'error-codes': errorCodes } = response.data;
        
        console.log('reCAPTCHA verification result:', { success, errorCodes });

        if (!success) {
            let errorMessage = 'Verificación de reCAPTCHA fallida. Por favor, inténtalo de nuevo.';
            
            // Proporcionar mensajes más específicos según el error
            if (errorCodes && errorCodes.includes('timeout-or-duplicate')) {
                errorMessage = 'El reCAPTCHA ha expirado. Por favor, complétalo nuevamente.';
            } else if (errorCodes && errorCodes.includes('invalid-input-response')) {
                errorMessage = 'Respuesta de reCAPTCHA inválida. Por favor, inténtalo de nuevo.';
            }
            
            return res.status(400).json({
                success: false,
                message: errorMessage,
                field: 'recaptcha',
                errors: errorCodes
            });
        }

        // Si llegamos hasta aquí, la verificación fue exitosa
        console.log('reCAPTCHA verification successful');
        next();

    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al verificar reCAPTCHA',
            field: 'recaptcha'
        });
    }
};

module.exports = {
    verifyRecaptcha
};